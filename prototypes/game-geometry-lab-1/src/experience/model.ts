export type EntryVariant = "direct" | "hub-first" | "earned-hub";

export type CausalityLevel = "a" | "b" | "c";

export type ExperienceScreen =
  | "cold-open"
  | "hub-before"
  | "mission"
  | "direct-complete"
  | "hub-after"
  | "earned-hub"
  | "paused";

export type MissionBeat =
  | "activate"
  | "experiment"
  | "predict"
  | "investigate"
  | "prove";

export type MissionPhase =
  | "activate-ready"
  | "experiment-edit"
  | "experiment-result"
  | "predict-choice"
  | "predict-trace"
  | "investigate-create"
  | "investigate-repair"
  | "investigate-result"
  | "prove-ready"
  | "complete";

export type PredictionChoice =
  | "two-console-first"
  | "two-case-first"
  | "one-line"
  | "not-sure";

export type CaseEventName =
  | "mission_opened"
  | "case_folder_opened"
  | "message_personalized"
  | "prediction_recorded"
  | "execution_sequence_inspected"
  | "unmatched_quote_observed"
  | "quotation_repaired"
  | "field_test_passed"
  | "investigation_console_online"
  | "operations_center_online"
  | "mission_completed";

export interface CaseEventRecord {
  id: number;
  name: CaseEventName;
  learnerLabel: string;
}

export interface FeedbackPacket {
  kind: "calm-error" | "guidance";
  goal: string;
  observed: string;
  clue: string;
  nextAction: string;
}

export interface PrototypeExecution {
  status: "idle" | "success" | "error";
  output: string[];
  errorCode?: "unmatched-quote" | "unsupported-source" | "empty-source";
  message?: string;
  sourceRevision?: number;
}

export interface CaseState {
  folder: "sealed" | "open";
  folderNote: "unread" | "message-recorded" | "repair-recorded";
  console: "offline" | "online" | "verified";
  operationsCenter: "not-revealed" | "available" | "online";
  headline: string;
  detail: string;
}

export interface ObservationMetrics {
  openedAt: number;
  firstCodeActionAt?: number;
  navigationBeforeFirstRun: number;
  meaningfulActions: number;
}

export interface ExperienceState {
  version: 1;
  variant: EntryVariant;
  causality: CausalityLevel;
  screen: ExperienceScreen;
  resumeScreen?: Exclude<ExperienceScreen, "paused">;
  beat: MissionBeat;
  phase: MissionPhase;
  source: string;
  sourceRevision: number;
  execution: PrototypeExecution;
  prediction?: PredictionChoice;
  traceStep: 0 | 1 | 2;
  feedback?: FeedbackPacket;
  caseState: CaseState;
  events: CaseEventRecord[];
  evidence: string[];
  announcement: string;
  restored: boolean;
  metrics: ObservationMetrics;
}

export type ExperienceAction =
  | { type: "ENTER_MISSION" }
  | { type: "EDIT_SOURCE"; source: string }
  | { type: "RUN_SOURCE"; now: number }
  | { type: "SELECT_PREDICTION"; choice: PredictionChoice }
  | { type: "SUBMIT_PREDICTION" }
  | { type: "ADVANCE_TRACE" }
  | { type: "CONTINUE_BEAT" }
  | { type: "SET_CAUSALITY"; level: CausalityLevel }
  | { type: "REVIEW_MISSION" }
  | { type: "RETURN_TO_OUTCOME" }
  | { type: "STOP" }
  | { type: "RESUME" }
  | { type: "RESET"; now: number };

export interface VariantGeometry {
  variant: EntryVariant;
  label: string;
  shortLabel: string;
  route: string;
  entry: "mission" | "hub-before" | "cold-open";
  completion: "direct-complete" | "hub-after" | "earned-hub";
}
