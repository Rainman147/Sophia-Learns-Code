import type { RevisionedSource, RuntimeMode, SourceRevision, Unsubscribe } from "./shared";

export const EXECUTION_LIMITS = {
  maxOutputBytes: 16_384,
  defaultTimeoutMs: 4_000,
  maximumTimeoutMs: 8_000,
  maximumSourceBytes: 8_192,
} as const;

export type ExecutionStatus = "success" | "error" | "timeout" | "cancelled" | "rejected";
export type RuntimePhase = "idle" | "initializing" | "ready" | "running" | "recovering" | "failed" | "disposed";
export type ExecutionErrorCategory = "syntax" | "runtime" | "policy" | "internal";

export interface RunRequest extends RevisionedSource {
  readonly requestId: string;
  readonly missionId: string;
  readonly missionVersion: string;
  readonly taskId: string;
  readonly runtimeMode: RuntimeMode;
  readonly timeoutMs: number;
  readonly maxOutputBytes: number;
}

export interface NormalizedExecutionError {
  readonly category: ExecutionErrorCategory;
  readonly code:
    | "unmatched-quote"
    | "syntax-error"
    | "runtime-error"
    | "source-policy-rejected"
    | "output-limit"
    | "worker-failure";
  readonly message: string;
  readonly learnerMessage: string;
  readonly line?: number;
  readonly column?: number;
  readonly exceptionType?: string;
}

export interface ExecutionMetrics {
  readonly runtimeVersion: string;
  readonly workerGeneration: number;
  readonly initializedThisRun: boolean;
  readonly initializeMs?: number;
  readonly queueMs: number;
  readonly executeMs: number;
  readonly totalMs: number;
  readonly outputBytes: number;
}

export interface RunResult {
  readonly requestId: string;
  readonly sourceRevision: SourceRevision;
  readonly taskId: string;
  readonly runtimeMode: RuntimeMode;
  readonly status: ExecutionStatus;
  readonly stdout: string;
  readonly stderr: string;
  readonly error?: NormalizedExecutionError;
  readonly metrics: ExecutionMetrics;
}

export interface RuntimeStatus {
  readonly phase: RuntimePhase;
  readonly runtimeMode: RuntimeMode;
  readonly runtimeVersion: string;
  readonly workerGeneration: number;
  readonly activeRequestId?: string;
  readonly detail?: string;
}

export interface RuntimeRecovery {
  readonly reason: "cancelled" | "timeout" | "reset" | "worker-failure";
  readonly terminatedGeneration: number;
  readonly replacementGeneration: number;
  readonly replacementReadyMs: number;
}

export interface ExecutionRuntime {
  initialize(signal?: AbortSignal): Promise<RuntimeStatus>;
  run(request: RunRequest): Promise<RunResult>;
  cancel(reason?: "learner" | "superseded"): Promise<RuntimeRecovery | null>;
  reset(): Promise<RuntimeRecovery>;
  getStatus(): RuntimeStatus;
  subscribe(listener: (status: RuntimeStatus) => void): Unsubscribe;
  dispose(): void;
}

export function isCurrentExecutionResult(result: RunResult, currentRevision: SourceRevision): boolean {
  return result.sourceRevision === currentRevision;
}
