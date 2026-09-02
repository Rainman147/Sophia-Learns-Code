import type { PyodideConfig, PyodideInterface } from "pyodide";

import { PYODIDE_RUNTIME_VERSION } from "./constants";
import {
  createOutputLimitError,
  createPolicyError,
  executionErrorText,
  normalizeExecutionError,
} from "./errors";
import { BoundedOutputCapture } from "./output";
import { validateRunRequest } from "./policy";
import type {
  RuntimeToWorkerMessage,
  WorkerFailureResult,
  WorkerRunResult,
  WorkerToRuntimeMessage,
} from "./protocol";
import { monotonicNow, nonNegativeDuration } from "./timing";

type PyodideBrowserModule = Readonly<{
  loadPyodide(options?: PyodideConfig): Promise<PyodideInterface>;
  version: string;
}>;

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

let initialization: Promise<PyodideInterface> | undefined;
let runtime: PyodideInterface | undefined;
let activeCapture: BoundedOutputCapture | undefined;
let activeRequestId: string | undefined;

function post(message: WorkerToRuntimeMessage): void {
  workerScope.postMessage(message);
}

function postFailure(stage: WorkerFailureResult["stage"], error: unknown): void {
  post({
    type: "failure",
    stage,
    message: executionErrorText(error),
  });
}

function sameOriginAssetBase(assetBasePath: string): URL {
  if (!assetBasePath.startsWith("/") || assetBasePath.startsWith("//")) {
    throw new Error("Pyodide assets must use a root-relative same-origin path.");
  }

  const assetBase = new URL(assetBasePath, workerScope.location.origin);
  if (assetBase.origin !== workerScope.location.origin) {
    throw new Error("Cross-origin Pyodide assets are not permitted.");
  }

  if (!assetBase.pathname.endsWith("/")) {
    assetBase.pathname = `${assetBase.pathname}/`;
  }

  assetBase.search = "";
  assetBase.hash = "";
  return assetBase;
}

async function loadRuntime(
  assetBasePath: string,
  expectedRuntimeVersion: string,
): Promise<PyodideInterface> {
  if (expectedRuntimeVersion !== PYODIDE_RUNTIME_VERSION) {
    throw new Error(
      `Worker expected Pyodide ${PYODIDE_RUNTIME_VERSION}, not ${expectedRuntimeVersion}.`,
    );
  }

  const startedAt = monotonicNow();
  const assetBase = sameOriginAssetBase(assetBasePath);
  const moduleUrl = new URL("pyodide.mjs", assetBase).href;
  const pyodideModule = (await import(
    /* webpackIgnore: true */
    /* @vite-ignore */
    moduleUrl
  )) as PyodideBrowserModule;

  if (pyodideModule.version !== expectedRuntimeVersion) {
    throw new Error(
      `Loaded Pyodide module ${pyodideModule.version}; expected ${expectedRuntimeVersion}.`,
    );
  }

  const isolatedJsGlobals = Object.freeze(Object.create(null) as Record<string, never>);
  const loadedRuntime = await pyodideModule.loadPyodide({
    indexURL: assetBase.href,
    lockFileURL: new URL("pyodide-lock.json", assetBase).href,
    packageBaseUrl: assetBase.href,
    stdLibURL: new URL("python_stdlib.zip", assetBase).href,
    packages: [],
    jsglobals: isolatedJsGlobals,
    stdin: () => null,
    stdout: (message) => {
      activeCapture?.appendStdout(`${message}\n`);
    },
    stderr: (message) => {
      activeCapture?.appendStderr(`${message}\n`);
    },
  });

  if (loadedRuntime.version !== expectedRuntimeVersion) {
    throw new Error(
      `Initialized Pyodide ${loadedRuntime.version}; expected ${expectedRuntimeVersion}.`,
    );
  }

  runtime = loadedRuntime;
  post({
    type: "ready",
    runtimeVersion: loadedRuntime.version,
    initializeMs: nonNegativeDuration(startedAt),
  });
  return loadedRuntime;
}

function rejectedWorkerResult(
  request: Parameters<typeof validateRunRequest>[0],
  message: string,
): WorkerRunResult {
  return {
    requestId: request.requestId,
    sourceRevision: request.sourceRevision,
    taskId: request.taskId,
    runtimeMode: request.runtimeMode,
    status: "rejected",
    stdout: "",
    stderr: "",
    error: createPolicyError(message),
    executeMs: 0,
    outputBytes: 0,
  };
}

async function execute(message: Extract<RuntimeToWorkerMessage, { type: "run" }>): Promise<void> {
  const { request } = message;
  const policy = validateRunRequest(request, "pyodide");
  if (!policy.accepted) {
    post({
      type: "result",
      result: {
        requestId: request.requestId,
        sourceRevision: request.sourceRevision,
        taskId: request.taskId,
        runtimeMode: request.runtimeMode,
        status: "rejected",
        stdout: "",
        stderr: "",
        error: policy.error,
        executeMs: 0,
        outputBytes: 0,
      },
    });
    return;
  }

  if (activeRequestId !== undefined) {
    post({
      type: "result",
      result: rejectedWorkerResult(
        request,
        `Request ${activeRequestId} is still running; the worker is single-flight.`,
      ),
    });
    return;
  }

  if (runtime === undefined) {
    postFailure("protocol", "Run arrived before Pyodide initialization completed.");
    return;
  }

  const startedAt = monotonicNow();
  const capture = new BoundedOutputCapture(request.maxOutputBytes);
  activeCapture = capture;
  activeRequestId = request.requestId;

  let result: WorkerRunResult;
  try {
    await runtime.runPythonAsync(request.source, { filename: "mission-first-contact.py" });

    if (capture.exceeded) {
      result = {
        requestId: request.requestId,
        sourceRevision: request.sourceRevision,
        taskId: request.taskId,
        runtimeMode: request.runtimeMode,
        status: "error",
        stdout: capture.stdout,
        stderr: capture.stderr,
        error: createOutputLimitError(request.maxOutputBytes),
        executeMs: nonNegativeDuration(startedAt),
        outputBytes: capture.outputBytes,
      };
    } else {
      result = {
        requestId: request.requestId,
        sourceRevision: request.sourceRevision,
        taskId: request.taskId,
        runtimeMode: request.runtimeMode,
        status: "success",
        stdout: capture.stdout,
        stderr: capture.stderr,
        executeMs: nonNegativeDuration(startedAt),
        outputBytes: capture.outputBytes,
      };
    }
  } catch (error: unknown) {
    const rawError = executionErrorText(error);
    if (capture.stderr.length === 0) {
      capture.appendStderr(rawError);
    }

    result = capture.exceeded
      ? {
          requestId: request.requestId,
          sourceRevision: request.sourceRevision,
          taskId: request.taskId,
          runtimeMode: request.runtimeMode,
          status: "error",
          stdout: capture.stdout,
          stderr: capture.stderr,
          error: createOutputLimitError(request.maxOutputBytes),
          executeMs: nonNegativeDuration(startedAt),
          outputBytes: capture.outputBytes,
        }
      : {
          requestId: request.requestId,
          sourceRevision: request.sourceRevision,
          taskId: request.taskId,
          runtimeMode: request.runtimeMode,
          status: "error",
          stdout: capture.stdout,
          stderr: capture.stderr,
          error: normalizeExecutionError(error),
          executeMs: nonNegativeDuration(startedAt),
          outputBytes: capture.outputBytes,
        };
  } finally {
    activeCapture = undefined;
    activeRequestId = undefined;
  }

  post({ type: "result", result });
}

workerScope.addEventListener("message", (event: MessageEvent<RuntimeToWorkerMessage>) => {
  const message = event.data;

  if (message.type === "initialize") {
    if (initialization !== undefined) {
      postFailure("protocol", "Worker received more than one initialize request.");
      return;
    }

    initialization = loadRuntime(message.assetBasePath, message.expectedRuntimeVersion);
    void initialization.catch((error: unknown) => {
      postFailure("initialize", error);
    });
    return;
  }

  if (message.type === "run") {
    void execute(message).catch((error: unknown) => {
      postFailure("protocol", error);
    });
    return;
  }

  postFailure("protocol", "Worker received an unknown message.");
});
