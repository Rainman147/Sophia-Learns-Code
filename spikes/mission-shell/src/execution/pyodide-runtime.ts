import {
  type ExecutionMetrics,
  type ExecutionRuntime,
  type NormalizedExecutionError,
  type RunRequest,
  type RunResult,
  type RuntimeRecovery,
  type RuntimeStatus,
  type Unsubscribe,
} from "@/src/contracts";

import {
  PYODIDE_ASSET_BASE_PATH,
  PYODIDE_RUNTIME_VERSION,
  PYODIDE_WORKER_PATH,
} from "./constants";
import { createPolicyError, createWorkerFailureError } from "./errors";
import { utf8ByteLength } from "./output";
import { validateRunRequest } from "./policy";
import type {
  WorkerReadyResult,
  WorkerRunResult,
  WorkerToRuntimeMessage,
} from "./protocol";
import { RuntimeStatusTracker, type RuntimeStatusObserver } from "./runtime-status";
import { monotonicNow, nonNegativeDuration, waitWithAbort } from "./timing";

export interface PyodideExecutionRuntimeOptions {
  readonly assetBasePath?: string;
  readonly statusObserver?: RuntimeStatusObserver;
}

interface ReadyWorker {
  readonly runtimeVersion: string;
  readonly initializeMs: number;
}

interface WorkerHandle {
  readonly worker: Worker;
  readonly generation: number;
  readonly readyPromise: Promise<ReadyWorker>;
  readonly resolveReady: (ready: ReadyWorker) => void;
  readonly rejectReady: (error: Error) => void;
  ready: ReadyWorker | undefined;
  readinessSettled: boolean;
}

interface ActiveRun {
  readonly request: RunRequest;
  readonly generation: number;
  readonly calledAt: number;
  readonly dispatchedAt: number;
  readonly initializedThisRun: boolean;
  readonly initializeMs: number | undefined;
  readonly resolve: (result: RunResult) => void;
  timeoutHandle: ReturnType<typeof setTimeout>;
}

function normalizeAssetBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("?") || path.includes("#")) {
    throw new RangeError("Pyodide assetBasePath must be a root-relative same-origin path.");
  }

  return path.endsWith("/") ? path : `${path}/`;
}

function metrics(
  runtimeVersion: string,
  workerGeneration: number,
  initializedThisRun: boolean,
  initializeMs: number | undefined,
  queueMs: number,
  executeMs: number,
  totalMs: number,
  outputBytes: number,
): ExecutionMetrics {
  return {
    runtimeVersion,
    workerGeneration,
    initializedThisRun,
    ...(initializeMs === undefined ? {} : { initializeMs }),
    queueMs: Math.max(0, queueMs),
    executeMs: Math.max(0, executeMs),
    totalMs: Math.max(0, totalMs),
    outputBytes: Math.max(0, outputBytes),
  };
}

class PyodideExecutionRuntime implements ExecutionRuntime {
  readonly #assetBasePath: string;
  readonly #status: RuntimeStatusTracker;

  #activeRun: ActiveRun | undefined;
  #disposed = false;
  #generation = 0;
  #handle: WorkerHandle | undefined;
  #recoveryPromise: Promise<RuntimeRecovery> | undefined;
  #runtimeVersion = PYODIDE_RUNTIME_VERSION;

  constructor(options: PyodideExecutionRuntimeOptions) {
    this.#assetBasePath = normalizeAssetBasePath(
      options.assetBasePath ?? PYODIDE_ASSET_BASE_PATH,
    );
    this.#status = new RuntimeStatusTracker(
      {
        phase: "idle",
        runtimeMode: "pyodide",
        runtimeVersion: this.#runtimeVersion,
        workerGeneration: 0,
      },
      options.statusObserver,
    );
  }

  async initialize(signal?: AbortSignal): Promise<RuntimeStatus> {
    if (this.#disposed) {
      return this.#status.get();
    }

    try {
      await waitWithAbort(this.#ensureReady(), signal);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }

      if (!this.#disposed) {
        this.#setStatus("failed", undefined, "Pyodide worker initialization failed.");
      }
    }

    return this.#status.get();
  }

  async run(request: RunRequest): Promise<RunResult> {
    const calledAt = monotonicNow();
    const policy = validateRunRequest(request, "pyodide");
    if (!policy.accepted) {
      return this.#immediateResult(request, "rejected", calledAt, policy.error);
    }

    if (this.#disposed) {
      return this.#immediateResult(
        request,
        "rejected",
        calledAt,
        createWorkerFailureError("The Pyodide runtime has been disposed."),
      );
    }

    if (this.#activeRun !== undefined) {
      return this.#immediateResult(
        request,
        "rejected",
        calledAt,
        createPolicyError(
          `Request ${this.#activeRun.request.requestId} is still running; the runtime is single-flight.`,
        ),
      );
    }

    const initializedThisRun = this.#handle?.ready === undefined;
    let ready: ReadyWorker;
    try {
      ready = await this.#ensureReady();
    } catch (error: unknown) {
      return this.#immediateResult(
        request,
        "error",
        calledAt,
        createWorkerFailureError(
          error instanceof Error ? error.message : "Pyodide worker initialization failed.",
        ),
      );
    }

    if (this.#disposed) {
      return this.#immediateResult(
        request,
        "rejected",
        calledAt,
        createWorkerFailureError("The Pyodide runtime was disposed before execution."),
      );
    }

    const activeAfterInitialization = this.#activeRun as ActiveRun | undefined;
    if (activeAfterInitialization !== undefined) {
      return this.#immediateResult(
        request,
        "rejected",
        calledAt,
        createPolicyError(
          `Request ${activeAfterInitialization.request.requestId} started while this request was waiting.`,
        ),
      );
    }

    const handle = this.#handle;
    if (handle === undefined || handle.ready === undefined) {
      return this.#immediateResult(
        request,
        "error",
        calledAt,
        createWorkerFailureError("Pyodide worker became unavailable before dispatch."),
      );
    }

    const dispatchedAt = monotonicNow();
    return new Promise<RunResult>((resolve) => {
      const active: ActiveRun = {
        request,
        generation: handle.generation,
        calledAt,
        dispatchedAt,
        initializedThisRun,
        initializeMs: initializedThisRun ? ready.initializeMs : undefined,
        resolve,
        timeoutHandle: setTimeout(() => undefined, 0),
      };

      active.timeoutHandle = setTimeout(() => {
        this.#handleTimeout(active);
      }, request.timeoutMs);
      this.#activeRun = active;
      this.#setStatus("running", request.requestId);

      try {
        handle.worker.postMessage({ type: "run", request });
      } catch (error: unknown) {
        this.#handleWorkerFailure(
          handle,
          error instanceof Error ? error.message : "Worker dispatch failed.",
        );
      }
    });
  }

  async cancel(reason: "learner" | "superseded" = "learner"): Promise<RuntimeRecovery | null> {
    const active = this.#activeRun;
    if (active === undefined) {
      return null;
    }

    return this.#terminateActiveAndReplace(active, "cancelled", "cancelled", reason);
  }

  async reset(): Promise<RuntimeRecovery> {
    if (this.#disposed) {
      throw new Error("Cannot reset a disposed Pyodide runtime.");
    }

    if (this.#recoveryPromise !== undefined) {
      try {
        await this.#recoveryPromise;
      } catch {
        // Reset gets one fresh replacement attempt after a failed recovery.
      }
    }

    const active = this.#activeRun;
    if (active !== undefined) {
      return this.#terminateActiveAndReplace(active, "cancelled", "reset", "reset requested");
    }

    const terminatedGeneration = this.#handle?.generation ?? this.#generation;
    this.#terminateHandle(this.#handle, "Runtime reset replaced the worker.");
    return this.#startRecovery("reset", terminatedGeneration, "reset requested");
  }

  getStatus(): RuntimeStatus {
    return this.#status.get();
  }

  subscribe(listener: (status: RuntimeStatus) => void): Unsubscribe {
    return this.#status.subscribe(listener);
  }

  dispose(): void {
    if (this.#disposed) {
      return;
    }

    this.#disposed = true;
    const active = this.#activeRun;
    if (active !== undefined) {
      this.#activeRun = undefined;
      clearTimeout(active.timeoutHandle);
      active.resolve(this.#terminatedResult(active, "cancelled"));
    }

    this.#terminateHandle(this.#handle, "Runtime disposed.");
    this.#setStatus("disposed", undefined, "Runtime disposed.");
    this.#status.clear();
  }

  async #ensureReady(): Promise<ReadyWorker> {
    if (this.#disposed) {
      throw new Error("The Pyodide runtime has been disposed.");
    }

    if (this.#recoveryPromise !== undefined) {
      await this.#recoveryPromise;
    }

    if (this.#handle?.ready !== undefined) {
      return this.#handle.ready;
    }

    if (this.#handle !== undefined) {
      return this.#handle.readyPromise;
    }

    return this.#spawnWorker("initializing");
  }

  #spawnWorker(phase: "initializing" | "recovering"): Promise<ReadyWorker> {
    if (this.#disposed) {
      return Promise.reject(new Error("The Pyodide runtime has been disposed."));
    }

    if (typeof Worker === "undefined") {
      this.#setStatus("failed", undefined, "Module workers are unavailable in this environment.");
      return Promise.reject(new Error("Module Web Workers are unavailable in this environment."));
    }

    const workerUrl = new URL(PYODIDE_WORKER_PATH, window.location.origin);
    const worker = new Worker(workerUrl, {
      type: "module",
      name: "sophia-first-contact-pyodide",
    });
    const generation = this.#generation + 1;
    this.#generation = generation;

    let resolveReady!: (ready: ReadyWorker) => void;
    let rejectReady!: (error: Error) => void;
    const readyPromise = new Promise<ReadyWorker>((resolve, reject) => {
      resolveReady = resolve;
      rejectReady = reject;
    });
    void readyPromise.catch(() => undefined);

    const handle: WorkerHandle = {
      worker,
      generation,
      readyPromise,
      resolveReady,
      rejectReady,
      ready: undefined,
      readinessSettled: false,
    };
    this.#handle = handle;
    this.#setStatus(
      phase,
      undefined,
      phase === "recovering" ? "Loading a replacement Python worker." : "Loading Python.",
    );

    worker.addEventListener("message", (event: MessageEvent<WorkerToRuntimeMessage>) => {
      this.#handleWorkerMessage(handle, event.data);
    });
    worker.addEventListener("error", (event: ErrorEvent) => {
      event.preventDefault();
      this.#handleWorkerFailure(handle, event.message || "Module worker failed.");
    });
    worker.addEventListener("messageerror", () => {
      this.#handleWorkerFailure(handle, "Module worker returned an unreadable message.");
    });

    try {
      worker.postMessage({
        type: "initialize",
        assetBasePath: this.#assetBasePath,
        expectedRuntimeVersion: PYODIDE_RUNTIME_VERSION,
      });
    } catch (error: unknown) {
      this.#handleWorkerFailure(
        handle,
        error instanceof Error ? error.message : "Worker initialization dispatch failed.",
      );
    }

    return readyPromise;
  }

  #handleWorkerMessage(handle: WorkerHandle, message: WorkerToRuntimeMessage): void {
    if (this.#disposed || this.#handle !== handle) {
      return;
    }

    if (message.type === "ready") {
      this.#handleWorkerReady(handle, message);
      return;
    }

    if (message.type === "result") {
      this.#handleWorkerResult(handle, message.result);
      return;
    }

    this.#handleWorkerFailure(handle, message.message);
  }

  #handleWorkerReady(handle: WorkerHandle, message: WorkerReadyResult): void {
    if (
      handle.readinessSettled ||
      message.runtimeVersion !== PYODIDE_RUNTIME_VERSION ||
      !Number.isFinite(message.initializeMs) ||
      message.initializeMs < 0
    ) {
      this.#handleWorkerFailure(handle, "Worker returned invalid initialization metadata.");
      return;
    }

    const ready: ReadyWorker = {
      runtimeVersion: message.runtimeVersion,
      initializeMs: message.initializeMs,
    };
    handle.ready = ready;
    handle.readinessSettled = true;
    this.#runtimeVersion = message.runtimeVersion;
    handle.resolveReady(ready);
    this.#setStatus("ready", undefined, `Python worker ${handle.generation} is ready.`);
  }

  #handleWorkerResult(handle: WorkerHandle, workerResult: WorkerRunResult): void {
    const active = this.#activeRun;
    if (active === undefined || active.generation !== handle.generation) {
      return;
    }

    if (!this.#matches(active.request, workerResult)) {
      this.#handleWorkerFailure(handle, "Worker result identity did not match the active request.");
      return;
    }

    const actualOutputBytes = utf8ByteLength(workerResult.stdout) + utf8ByteLength(workerResult.stderr);
    if (
      !Number.isFinite(workerResult.executeMs) ||
      workerResult.executeMs < 0 ||
      workerResult.outputBytes !== actualOutputBytes ||
      workerResult.outputBytes > active.request.maxOutputBytes
    ) {
      this.#handleWorkerFailure(handle, "Worker result metrics failed validation.");
      return;
    }

    this.#activeRun = undefined;
    clearTimeout(active.timeoutHandle);
    const finishedAt = monotonicNow();
    const result: RunResult = {
      requestId: workerResult.requestId,
      sourceRevision: workerResult.sourceRevision,
      taskId: workerResult.taskId,
      runtimeMode: workerResult.runtimeMode,
      status: workerResult.status,
      stdout: workerResult.stdout,
      stderr: workerResult.stderr,
      ...(workerResult.error === undefined ? {} : { error: workerResult.error }),
      metrics: metrics(
        this.#runtimeVersion,
        active.generation,
        active.initializedThisRun,
        active.initializeMs,
        nonNegativeDuration(active.calledAt, active.dispatchedAt),
        workerResult.executeMs,
        nonNegativeDuration(active.calledAt, finishedAt),
        workerResult.outputBytes,
      ),
    };
    this.#setStatus("ready", undefined, `Run ${workerResult.requestId} finished.`);
    active.resolve(result);
  }

  #handleWorkerFailure(handle: WorkerHandle, message: string): void {
    if (this.#handle !== handle) {
      return;
    }

    const active = this.#activeRun;
    this.#terminateHandle(handle, message);

    if (active !== undefined && active.generation === handle.generation) {
      this.#activeRun = undefined;
      clearTimeout(active.timeoutHandle);
      const recovery = this.#startRecovery("worker-failure", handle.generation, message);
      active.resolve(
        this.#completedResult(active, "error", createWorkerFailureError(message), 0, 0),
      );
      void recovery.catch(() => undefined);
      return;
    }

    this.#setStatus("failed", undefined, message);
  }

  #handleTimeout(active: ActiveRun): void {
    if (this.#activeRun !== active) {
      return;
    }

    void this.#terminateActiveAndReplace(active, "timeout", "timeout", "run timed out").catch(
      () => undefined,
    );
  }

  #terminateActiveAndReplace(
    active: ActiveRun,
    resultStatus: "cancelled" | "timeout",
    recoveryReason: RuntimeRecovery["reason"],
    detail: string,
  ): Promise<RuntimeRecovery> {
    if (this.#activeRun !== active) {
      return Promise.reject(new Error("The requested run is no longer active."));
    }

    this.#activeRun = undefined;
    clearTimeout(active.timeoutHandle);
    this.#terminateHandle(this.#handle, detail);
    const recovery = this.#startRecovery(recoveryReason, active.generation, detail);
    active.resolve(this.#terminatedResult(active, resultStatus));
    return recovery;
  }

  #startRecovery(
    reason: RuntimeRecovery["reason"],
    terminatedGeneration: number,
    detail: string,
  ): Promise<RuntimeRecovery> {
    const replacementStartedAt = monotonicNow();
    this.#setStatus("recovering", undefined, detail);

    const recovery = (async (): Promise<RuntimeRecovery> => {
      await this.#spawnWorker("recovering");
      return {
        reason,
        terminatedGeneration,
        replacementGeneration: this.#handle?.generation ?? this.#generation,
        replacementReadyMs: nonNegativeDuration(replacementStartedAt),
      };
    })();
    this.#recoveryPromise = recovery;
    void recovery.then(
      () => {
        if (this.#recoveryPromise === recovery) {
          this.#recoveryPromise = undefined;
        }
      },
      (error: unknown) => {
        if (this.#recoveryPromise === recovery) {
          this.#recoveryPromise = undefined;
        }
        if (!this.#disposed) {
          this.#setStatus(
            "failed",
            undefined,
            error instanceof Error ? error.message : "Replacement worker failed.",
          );
        }
      },
    );

    return recovery;
  }

  #terminateHandle(handle: WorkerHandle | undefined, message: string): void {
    if (handle === undefined) {
      return;
    }

    handle.worker.terminate();
    if (!handle.readinessSettled) {
      handle.readinessSettled = true;
      handle.rejectReady(new Error(message));
    }
    if (this.#handle === handle) {
      this.#handle = undefined;
    }
  }

  #matches(request: RunRequest, result: WorkerRunResult): boolean {
    return (
      result.requestId === request.requestId &&
      result.sourceRevision === request.sourceRevision &&
      result.taskId === request.taskId &&
      result.runtimeMode === request.runtimeMode
    );
  }

  #immediateResult(
    request: RunRequest,
    status: "error" | "rejected",
    calledAt: number,
    error: NormalizedExecutionError,
  ): RunResult {
    return {
      requestId: request.requestId,
      sourceRevision: request.sourceRevision,
      taskId: request.taskId,
      runtimeMode: request.runtimeMode,
      status,
      stdout: "",
      stderr: "",
      error,
      metrics: metrics(
        this.#runtimeVersion,
        this.#generation,
        false,
        undefined,
        0,
        0,
        nonNegativeDuration(calledAt),
        0,
      ),
    };
  }

  #completedResult(
    active: ActiveRun,
    status: "error",
    error: NormalizedExecutionError,
    outputBytes: number,
    executeMs: number,
  ): RunResult {
    return {
      requestId: active.request.requestId,
      sourceRevision: active.request.sourceRevision,
      taskId: active.request.taskId,
      runtimeMode: active.request.runtimeMode,
      status,
      stdout: "",
      stderr: "",
      error,
      metrics: metrics(
        this.#runtimeVersion,
        active.generation,
        active.initializedThisRun,
        active.initializeMs,
        nonNegativeDuration(active.calledAt, active.dispatchedAt),
        executeMs,
        nonNegativeDuration(active.calledAt),
        outputBytes,
      ),
    };
  }

  #terminatedResult(active: ActiveRun, status: "cancelled" | "timeout"): RunResult {
    return {
      requestId: active.request.requestId,
      sourceRevision: active.request.sourceRevision,
      taskId: active.request.taskId,
      runtimeMode: active.request.runtimeMode,
      status,
      stdout: "",
      stderr: "",
      metrics: metrics(
        this.#runtimeVersion,
        active.generation,
        active.initializedThisRun,
        active.initializeMs,
        nonNegativeDuration(active.calledAt, active.dispatchedAt),
        nonNegativeDuration(active.dispatchedAt),
        nonNegativeDuration(active.calledAt),
        0,
      ),
    };
  }

  #setStatus(
    phase: RuntimeStatus["phase"],
    activeRequestId?: string,
    detail?: string,
  ): void {
    this.#status.set({
      phase,
      runtimeMode: "pyodide",
      runtimeVersion: this.#runtimeVersion,
      workerGeneration: this.#generation,
      ...(activeRequestId === undefined ? {} : { activeRequestId }),
      ...(detail === undefined ? {} : { detail }),
    });
  }
}

export function createPyodideExecutionRuntime(
  options: PyodideExecutionRuntimeOptions = {},
): ExecutionRuntime {
  return new PyodideExecutionRuntime(options);
}
