import type { MissionDefinition } from "./mission";
import type { RunResult } from "./execution";
import type { IsoTimestamp, MotionPreference, SourceRevision } from "./shared";

export interface TaskResult {
  readonly taskId: string;
  readonly passed: boolean;
  readonly evidenceLevel: "introduced" | "guided" | "independent";
  readonly feedbackCode: "runtime-success" | "unmatched-quote" | "output-mismatch" | "execution-incomplete";
  readonly goal: string;
  readonly observed: string;
  readonly clue: string;
  readonly nextAction: string;
}

export type CaseEvent = {
  readonly id: string;
  readonly type: "console_activated";
  readonly occurredAt: IsoTimestamp;
  readonly missionId: string;
  readonly taskId: string;
  readonly sourceRevision: SourceRevision;
  readonly message: string;
};

export interface CaseState {
  readonly caseId: string;
  readonly caseTitle: string;
  readonly consoleStatus: "offline" | "online";
  readonly consoleMessage: string;
  readonly capabilityStatus: "unseen" | "introduced" | "guided" | "independent";
  readonly availableTool: "Investigation Console";
  readonly lockedPossibility: "Computer's Mind";
  readonly timeline: readonly CaseEvent[];
}

export interface EvaluationOutcome {
  readonly taskResult: TaskResult;
  readonly caseEvents: readonly CaseEvent[];
}

export interface MissionEvaluator {
  evaluate(definition: MissionDefinition, taskId: string, result: RunResult): EvaluationOutcome;
}

export interface SceneProjection {
  readonly state: "offline" | "online";
  readonly eyebrow: string;
  readonly heading: string;
  readonly detail: string;
  readonly textEquivalent: string;
  readonly changedLabel: string;
  readonly motionCue: "none" | "console-activation";
}

export interface SceneRenderer {
  project(caseState: CaseState, options: { readonly motionPreference: MotionPreference }): SceneProjection;
}

export function initialCaseState(): CaseState {
  return {
    caseId: "case-001-midnight-badge",
    caseTitle: "The Midnight Badge",
    consoleStatus: "offline",
    consoleMessage: "Awaiting first verified Python result.",
    capabilityStatus: "unseen",
    availableTool: "Investigation Console",
    lockedPossibility: "Computer's Mind",
    timeline: [],
  };
}
