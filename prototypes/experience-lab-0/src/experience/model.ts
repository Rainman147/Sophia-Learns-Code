export type Variant = "direct" | "operations-center";

export type ExperienceScreen =
  | "hub-before"
  | "mission"
  | "direct-complete"
  | "hub-after"
  | "paused";

export type MissionStage =
  | "first-run"
  | "personalize"
  | "personalize-result"
  | "prediction"
  | "trace"
  | "intentional-error"
  | "repair"
  | "repair-result"
  | "field-test"
  | "debrief";

export type PredictionChoice =
  | "two-console-first"
  | "two-case-first"
  | "one-line"
  | "not-sure";

export type CaseEventName =
  | "mission_opened"
  | "investigation_console_online"
  | "message_personalized"
  | "prediction_recorded"
  | "execution_sequence_inspected"
  | "unmatched_quote_observed"
  | "quotation_repaired"
  | "field_test_passed"
  | "mission_completed";

export interface CaseEventRecord {
  id: number;
  name: CaseEventName;
  label: string;
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
}

export interface CaseState {
  console: "offline" | "online" | "calibrated";
  signal: "unresolved" | "contact" | "verified";
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
  variant: Variant;
  screen: ExperienceScreen;
  resumeScreen?: Exclude<ExperienceScreen, "paused">;
  stage: MissionStage;
  source: string;
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
  | { type: "CONTINUE_STAGE" }
  | { type: "CONTINUE_AFTER_MISSION" }
  | { type: "REVIEW_DEBRIEF" }
  | { type: "STOP" }
  | { type: "RESUME" }
  | { type: "RESET"; now: number };

export interface VariantShell {
  variant: Variant;
  label: string;
  shortLabel: string;
  route: string;
  entry: "mission" | "hub-before";
  exit: "direct-complete" | "hub-after";
}
