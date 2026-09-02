import type { RunRequest, RunResult } from "@/src/contracts";

export type WorkerInitializeRequest = Readonly<{
  type: "initialize";
  assetBasePath: string;
  expectedRuntimeVersion: string;
}>;

export type WorkerRunRequest = Readonly<{
  type: "run";
  request: RunRequest;
}>;

export type RuntimeToWorkerMessage = WorkerInitializeRequest | WorkerRunRequest;

export type WorkerReadyResult = Readonly<{
  type: "ready";
  runtimeVersion: string;
  initializeMs: number;
}>;

export type WorkerRunResult = Readonly<
  Omit<RunResult, "metrics"> & {
    executeMs: number;
    outputBytes: number;
  }
>;

export type WorkerExecutionResult = Readonly<{
  type: "result";
  result: WorkerRunResult;
}>;

export type WorkerFailureResult = Readonly<{
  type: "failure";
  stage: "initialize" | "protocol";
  message: string;
}>;

export type WorkerToRuntimeMessage = WorkerReadyResult | WorkerExecutionResult | WorkerFailureResult;
