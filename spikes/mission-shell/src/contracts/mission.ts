import type { TaskResult } from "./case";
import type { RunResult } from "./execution";
import type { RevisionedSource, RuntimeMode, SourceRevision, Unsubscribe } from "./shared";

export type MissionStage =
  | "briefing"
  | "first-run"
  | "first-result"
  | "personalize"
  | "personalize-result"
  | "prediction"
  | "trace"
  | "create-error"
  | "error-feedback"
  | "repair"
  | "repair-result"
  | "field-test"
  | "field-result"
  | "debrief"
  | "reward"
  | "complete"
  | "paused"
  | "stopped";

export type MissionTaskKind = "run" | "personalize" | "predict" | "trace" | "break" | "repair" | "field-test";

export interface MissionTaskDefinition {
  readonly id: string;
  readonly kind: MissionTaskKind;
  readonly stage: MissionStage;
  readonly title: string;
  readonly prompt: string;
  readonly source: string;
  readonly runtime: "none" | "both";
  readonly expectedStdout?: string;
  readonly expectedErrorCode?: "unmatched-quote";
  readonly allowNotSure?: boolean;
}

export interface MissionDefinition {
  readonly id: string;
  readonly version: string;
  readonly caseId: string;
  readonly title: string;
  readonly subtitle: string;
  readonly objective: string;
  readonly primaryCapability: string;
  readonly starterSource: string;
  readonly tasks: readonly MissionTaskDefinition[];
  readonly stageOrder: readonly MissionStage[];
}

export interface MissionSnapshot extends RevisionedSource {
  readonly missionId: string;
  readonly missionVersion: string;
  readonly stage: MissionStage;
  readonly activeTaskId?: string;
  readonly runtimeMode: RuntimeMode;
  readonly prediction?: "two-lines-console-first" | "not-sure" | "other";
  readonly traceStep: 0 | 1 | 2;
  readonly lastExecution?: RunResult;
  readonly lastTaskResult?: TaskResult;
  readonly statusMessage: string;
  readonly canContinue: boolean;
  readonly canStop: boolean;
  readonly completed: boolean;
  readonly resumeStage?: Exclude<MissionStage, "paused">;
}

export type MissionEvent =
  | { readonly type: "BEGIN" }
  | { readonly type: "CONTINUE" }
  | { readonly type: "SOURCE_CHANGED"; readonly source: string; readonly sourceRevision: SourceRevision }
  | { readonly type: "RUN_REQUESTED"; readonly requestId: string }
  | { readonly type: "RUN_RESOLVED"; readonly result: RunResult }
  | { readonly type: "PREDICTION_SUBMITTED"; readonly prediction: MissionSnapshot["prediction"] }
  | { readonly type: "TRACE_ADVANCED" }
  | { readonly type: "TASK_EVALUATED"; readonly taskResult: TaskResult }
  | { readonly type: "CHOOSE_CONTINUE" }
  | { readonly type: "CHOOSE_STOP" }
  | { readonly type: "PAUSE" }
  | { readonly type: "RESUME" }
  | { readonly type: "RESTORE"; readonly snapshot: MissionSnapshot }
  | { readonly type: "RESET" };

export interface MissionActor {
  start(): void;
  stop(): void;
  send(event: MissionEvent): void;
  getSnapshot(): MissionSnapshot;
  subscribe(listener: (snapshot: MissionSnapshot) => void): Unsubscribe;
}
