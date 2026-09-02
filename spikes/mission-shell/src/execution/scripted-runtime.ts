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

import { SCRIPTED_RUNTIME_VERSION } from "./constants";
import {
  createOutputLimitError,
  createPolicyError,
  createUnmatchedQuoteError,
  createWorkerFailureError,
} from "./errors";
import { BoundedOutputCapture } from "./output";
import { validateRunRequest } from "./policy";
import { RuntimeStatusTracker, type RuntimeStatusObserver } from "./runtime-status";
import { delay, monotonicNow, nonNegativeDuration, waitWithAbort } from "./timing";

export type ScriptedExecutionDelay = number | ((request: Readonly<RunRequest>) => number);

export interface ScriptedExecutionRuntimeOptions {
  readonly delayMs?: ScriptedExecutionDelay;
  readonly initializeDelayMs?: number;
  readonly replacementDelayMs?: number;
  readonly statusObserver?: RuntimeStatusObserver;
}

interface ActiveScriptedRun {
  readonly request: RunRequest;
  readonly policy: Extract<ReturnType<typeof validateRunRequest>, { accepted: true }>;
  readonly generation: number;
  readonly calledAt: number;
  readonly dispatchedAt: number;
  readonly initializedThisRun: boolean;
  readonly initializeMs: number | undefined;
  readonly resolve: (result: RunResult) => void;
  completionHandle: ReturnType<typeof setTimeout> | undefined;
  timeoutHandle: ReturnType<typeof setTimeout>;
}

function configuredDelay(value: number | undefined, fallback: number): number {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || resolved < 0) {
    throw new RangeError("Scripted runtime delays must be finite non-negative numbers.");
  }
  return resolved;
}

function executionMetrics(
  generation: number,
  initializedThisRun: boolean,
  initializeMs: number | undefined,
  queueMs: number,
  executeMs: number,
  totalMs: number,
  outputBytes: number,
): ExecutionMetrics {
  return {
    runtimeVersion: SCRIPTED_RUNTIME_VERSION,
    workerGeneration: generation,
    initializedThisRun,
    ...(initializeMs === undefined ? {} : { initializeMs }),
    queueMs: Math.max(0, queueMs),
    executeMs: Math.max(0, executeMs),
    totalMs: Math.max(0, totalMs),
    outputBytes: Math.max(0, outputBytes),
  };
}

class ScriptedExecutionRuntime implements ExecutionRuntime {
  readonly #delay: ScriptedExecutionDelay;
  readonly #initializeDelayMs: number;
  readonly #replacementDelayMs: number;
  readonly #status: RuntimeStatusTracker;

  #activeRun: ActiveScriptedRun | undefined;
  #disposed = false;
  #generation = 0;
  #initializationPromise: Promise<number> | undefined;
  #ready = false;
  #recoveryPromise: Promise<RuntimeRecovery> | undefined;

  constructor(options: ScriptedExecutionRuntimeOptions) {
    this.#delay = options.delayMs ?? 0;
    this.#initializeDelayMs = configuredDelay(options.initializeDelayMs, 0);
    this.#replacementDelayMs = configuredDelay(
      options.replacementDelayMs,
      this.#initializeDelayMs,
    );
    this.#status = new RuntimeStatusTracker(
      {
        phase: "idle",
        runtimeMode: "scripted",
        runtimeVersion: SCRIPTED_RUNTIME_VERSION,
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
        this.#setStatus("failed", undefined, "Scripted runtime initialization failed.");
      }
    }
    return this.#status.get();
  }

  async run(request: RunRequest): Promise<RunResult> {
    const calledAt = monotonicNow();
    const policy = validateRunRequest(request, "scripted");
    if (!policy.accepted) {
      return this.#immediateResult(request, "rejected", calledAt, policy.error);
    }

    if (this.#disposed) {
      return this.#immediateResult(
        request,
        "rejected",
        calledAt,
        createWorkerFailureError("The scripted runtime has been disposed."),
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

    const initializedThisRun = !this.#ready;
    let initializeMs: number;
    try {
      initializeMs = await this.#ensureReady();
    } catch (error: unknown) {
      return this.#immediateResult(
        request,
        "error",
        calledAt,
        createWorkerFailureError(
          error instanceof Error ? error.message : "Scripted runtime initialization failed.",
        ),
      );
    }

    const activeAfterInitialization = this.#activeRun as ActiveScriptedRun | undefined;
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

    let runDelay: number;
    try {
      runDelay = configuredDelay(
        typeof this.#delay === "function" ? this.#delay(request) : this.#delay,
        0,
      );
    } catch (error: unknown) {
      return this.#immediateResult(
        request,
        "error",
        calledAt,
        createWorkerFailureError(
          error instanceof Error ? error.message : "Scripted delay configuration failed.",
        ),
      );
    }

    const dispatchedAt = monotonicNow();
    return new Promise<RunResult>((resolve) => {
      const active: ActiveScriptedRun = {
        request,
        policy,
        generation: this.#generation,
        calledAt,
        dispatchedAt,
        initializedThisRun,
        initializeMs: initializedThisRun ? initializeMs : undefined,
        resolve,
        completionHandle: undefined,
        timeoutHandle: setTimeout(() => undefined, 0),
      };
      active.timeoutHandle = setTimeout(() => {
        this.#handleTimeout(active);
      }, request.timeoutMs);
      this.#activeRun = active;
      this.#setStatus("running", request.requestId);

      if (policy.kind !== "cancellation-fixture") {
        active.completionHandle = setTimeout(() => {
          this.#complete(active);
        }, runDelay);
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
      throw new Error("Cannot reset a disposed scripted runtime.");
    }

    if (this.#recoveryPromise !== undefined) {
      try {
        await this.#recoveryPromise;
      } catch {
        // Reset makes one new deterministic replacement attempt.
      }
    }

    const active = this.#activeRun;
    if (active !== undefined) {
      return this.#terminateActiveAndReplace(active, "cancelled", "reset", "reset requested");
    }

    const terminatedGeneration = this.#generation;
    this.#ready = false;
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
      this.#clearActiveTimers(active);
      active.resolve(this.#terminatedResult(active, "cancelled"));
    }
    this.#ready = false;
    this.#setStatus("disposed", undefined, "Runtime disposed.");
    this.#status.clear();
  }

  async #ensureReady(): Promise<number> {
    if (this.#disposed) {
      throw new Error("The scripted runtime has been disposed.");
    }

    if (this.#recoveryPromise !== undefined) {
      const recovery = await this.#recoveryPromise;
      return recovery.replacementReadyMs;
    }

    if (this.#ready) {
      return 0;
    }

    if (this.#initializationPromise !== undefined) {
      return this.#initializationPromise;
    }

    const startedAt = monotonicNow();
    this.#generation += 1;
    this.#setStatus("initializing", undefined, "Preparing deterministic Python results.");
    const initialization = (async (): Promise<number> => {
      await delay(this.#initializeDelayMs);
      if (this.#disposed) {
        throw new Error("The scripted runtime was disposed during initialization.");
      }
      this.#ready = true;
      const elapsed = nonNegativeDuration(startedAt);
      this.#setStatus("ready", undefined, `Scripted worker ${this.#generation} is ready.`);
      return elapsed;
    })();
    this.#initializationPromise = initialization;
    void initialization.then(
      () => {
        if (this.#initializationPromise === initialization) {
          this.#initializationPromise = undefined;
        }
      },
      () => {
        if (this.#initializationPromise === initialization) {
          this.#initializationPromise = undefined;
        }
      },
    );
    return initialization;
  }

  #complete(active: ActiveScriptedRun): void {
    if (this.#activeRun !== active) {
      return;
    }

    this.#activeRun = undefined;
    this.#clearActiveTimers(active);
    const capture = new BoundedOutputCapture(active.request.maxOutputBytes);
    let error: NormalizedExecutionError | undefined;
    let status: RunResult["status"] = "success";

    if (active.policy.kind === "syntax-candidate") {
      const rawError =
        'SyntaxError: unterminated string literal (detected at line 1) in "mission-first-contact.py"';
      capture.appendStderr(rawError);
      status = "error";
      error = capture.exceeded
        ? createOutputLimitError(active.request.maxOutputBytes)
        : createUnmatchedQuoteError(rawError);
    } else if (active.policy.kind === "print-program") {
      capture.appendStdout(active.policy.scriptedStdout);
      if (capture.exceeded) {
        status = "error";
        error = createOutputLimitError(active.request.maxOutputBytes);
      }
    }

    const finishedAt = monotonicNow();
    const result: RunResult = {
      requestId: active.request.requestId,
      sourceRevision: active.request.sourceRevision,
      taskId: active.request.taskId,
      runtimeMode: active.request.runtimeMode,
      status,
      stdout: capture.stdout,
      stderr: capture.stderr,
      ...(error === undefined ? {} : { error }),
      metrics: executionMetrics(
        active.generation,
        active.initializedThisRun,
        active.initializeMs,
        nonNegativeDuration(active.calledAt, active.dispatchedAt),
        nonNegativeDuration(active.dispatchedAt, finishedAt),
        nonNegativeDuration(active.calledAt, finishedAt),
        capture.outputBytes,
      ),
    };
    this.#setStatus("ready", undefined, `Run ${active.request.requestId} finished.`);
    active.resolve(result);
  }

  #handleTimeout(active: ActiveScriptedRun): void {
    if (this.#activeRun !== active) {
      return;
    }
    void this.#terminateActiveAndReplace(active, "timeout", "timeout", "run timed out").catch(
      () => undefined,
    );
  }

  #terminateActiveAndReplace(
    active: ActiveScriptedRun,
    resultStatus: "cancelled" | "timeout",
    recoveryReason: RuntimeRecovery["reason"],
    detail: string,
  ): Promise<RuntimeRecovery> {
    if (this.#activeRun !== active) {
      return Promise.reject(new Error("The requested scripted run is no longer active."));
    }

    this.#activeRun = undefined;
    this.#clearActiveTimers(active);
    this.#ready = false;
    const recovery = this.#startRecovery(recoveryReason, active.generation, detail);
    active.resolve(this.#terminatedResult(active, resultStatus));
    return recovery;
  }

  #startRecovery(
    reason: RuntimeRecovery["reason"],
    terminatedGeneration: number,
    detail: string,
  ): Promise<RuntimeRecovery> {
    const startedAt = monotonicNow();
    this.#generation += 1;
    const replacementGeneration = this.#generation;
    this.#setStatus("recovering", undefined, detail);

    const recovery = (async (): Promise<RuntimeRecovery> => {
      await delay(this.#replacementDelayMs);
      if (this.#disposed) {
        throw new Error("The scripted runtime was disposed during replacement.");
      }
      this.#ready = true;
      const replacementReadyMs = nonNegativeDuration(startedAt);
      this.#setStatus(
        "ready",
        undefined,
        `Scripted replacement worker ${replacementGeneration} is ready.`,
      );
      return {
        reason,
        terminatedGeneration,
        replacementGeneration,
        replacementReadyMs,
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
            error instanceof Error ? error.message : "Scripted replacement failed.",
          );
        }
      },
    );
    return recovery;
  }

  #clearActiveTimers(active: ActiveScriptedRun): void {
    clearTimeout(active.timeoutHandle);
    if (active.completionHandle !== undefined) {
      clearTimeout(active.completionHandle);
    }
  }

  #terminatedResult(
    active: ActiveScriptedRun,
    status: "cancelled" | "timeout",
  ): RunResult {
    return {
      requestId: active.request.requestId,
      sourceRevision: active.request.sourceRevision,
      taskId: active.request.taskId,
      runtimeMode: active.request.runtimeMode,
      status,
      stdout: "",
      stderr: "",
      metrics: executionMetrics(
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
      metrics: executionMetrics(
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

  #setStatus(
    phase: RuntimeStatus["phase"],
    activeRequestId?: string,
    detail?: string,
  ): void {
    this.#status.set({
      phase,
      runtimeMode: "scripted",
      runtimeVersion: SCRIPTED_RUNTIME_VERSION,
      workerGeneration: this.#generation,
      ...(activeRequestId === undefined ? {} : { activeRequestId }),
      ...(detail === undefined ? {} : { detail }),
    });
  }
}

export function createScriptedExecutionRuntime(
  options: ScriptedExecutionRuntimeOptions = {},
): ExecutionRuntime {
  return new ScriptedExecutionRuntime(options);
}
