import type { CaseEvent, CaseState, TaskResult } from "../contracts/case";
import type {
  EvidenceEvent,
  EvidenceExport,
  EvidenceSnapshot,
  PersistedMissionSession,
} from "../contracts/evidence";
import type { MissionStage } from "../contracts/mission";
import type {
  ExperienceVariant,
  IsoTimestamp,
  RuntimeMode,
} from "../contracts/shared";

export const EVIDENCE_SCHEMA_VERSION = 1 as const;

export type EvidenceClock = () => IsoTimestamp;

const TASK_RESULT_EVIDENCE_LEVELS = [
  "introduced",
  "guided",
  "independent",
] as const;
const TASK_RESULT_FEEDBACK_CODES = [
  "runtime-success",
  "unmatched-quote",
  "output-mismatch",
  "execution-incomplete",
] as const;
const CASE_CAPABILITY_STATUSES = [
  "unseen",
  "introduced",
  "guided",
  "independent",
] as const;
const MISSION_STAGES = [
  "briefing",
  "first-run",
  "first-result",
  "personalize",
  "personalize-result",
  "prediction",
  "trace",
  "create-error",
  "error-feedback",
  "repair",
  "repair-result",
  "field-test",
  "field-result",
  "debrief",
  "reward",
  "complete",
  "paused",
  "stopped",
] as const satisfies readonly MissionStage[];
const EXPERIENCE_VARIANTS = [
  "direct",
  "operations",
] as const satisfies readonly ExperienceVariant[];
const RUNTIME_MODES = [
  "scripted",
  "pyodide",
] as const satisfies readonly RuntimeMode[];
const SUPPORT_LEVELS = ["full", "guided", "none"] as const;

export class EvidenceDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvidenceDataError";
  }
}

export function emptyEvidenceSnapshot(): EvidenceSnapshot {
  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    events: [],
    session: null,
  };
}

export function cloneEvidenceEvent(value: unknown): EvidenceEvent {
  const record = requireRecord(value, "Evidence event");

  return {
    id: requireNonEmptyString(record, "id", "Evidence event"),
    type: requireLiteral(record, "type", "evidence_recorded", "Evidence event"),
    occurredAt: requireNonEmptyString(
      record,
      "occurredAt",
      "Evidence event",
    ),
    missionId: requireNonEmptyString(record, "missionId", "Evidence event"),
    missionVersion: requireNonEmptyString(
      record,
      "missionVersion",
      "Evidence event",
    ),
    taskResult: cloneTaskResult(record.taskResult),
    runtimeMode: requireEnum(
      record,
      "runtimeMode",
      RUNTIME_MODES,
      "Evidence event",
    ),
    supportLevel: requireEnum(
      record,
      "supportLevel",
      SUPPORT_LEVELS,
      "Evidence event",
    ),
    privacy: requireLiteral(
      record,
      "privacy",
      "local-synthetic",
      "Evidence event",
    ),
  };
}

export function clonePersistedMissionSession(
  value: unknown,
): PersistedMissionSession {
  const record = requireRecord(value, "Persisted mission session");
  requireLiteral(
    record,
    "schemaVersion",
    EVIDENCE_SCHEMA_VERSION,
    "Persisted mission session",
  );

  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    missionId: requireNonEmptyString(
      record,
      "missionId",
      "Persisted mission session",
    ),
    missionVersion: requireNonEmptyString(
      record,
      "missionVersion",
      "Persisted mission session",
    ),
    variant: requireEnum(
      record,
      "variant",
      EXPERIENCE_VARIANTS,
      "Persisted mission session",
    ),
    stage: requireEnum(
      record,
      "stage",
      MISSION_STAGES,
      "Persisted mission session",
    ),
    runtimeMode: requireEnum(
      record,
      "runtimeMode",
      RUNTIME_MODES,
      "Persisted mission session",
    ),
    caseState: cloneCaseState(record.caseState),
    source: requireString(record, "source", "Persisted mission session"),
    sourceRevision: requireSourceRevision(
      record,
      "sourceRevision",
      "Persisted mission session",
    ),
    updatedAt: requireNonEmptyString(
      record,
      "updatedAt",
      "Persisted mission session",
    ),
  };
}

export function cloneEvidenceSnapshot(value: unknown): EvidenceSnapshot {
  const record = requireRecord(value, "Evidence snapshot");
  requireLiteral(
    record,
    "schemaVersion",
    EVIDENCE_SCHEMA_VERSION,
    "Evidence snapshot",
  );

  if (!Array.isArray(record.events)) {
    throw new EvidenceDataError("Evidence snapshot.events must be an array.");
  }

  return {
    schemaVersion: EVIDENCE_SCHEMA_VERSION,
    events: record.events.map(cloneEvidenceEvent),
    session:
      record.session === null
        ? null
        : clonePersistedMissionSession(record.session),
  };
}

export function canonicalizeEvidenceEvents(
  values: readonly EvidenceEvent[],
): readonly EvidenceEvent[] {
  const firstById = new Map<string, EvidenceEvent>();

  for (const value of values) {
    const event = cloneEvidenceEvent(value);

    if (!firstById.has(event.id)) {
      firstById.set(event.id, event);
    }
  }

  return [...firstById.values()].sort(
    (left, right) =>
      left.occurredAt.localeCompare(right.occurredAt) ||
      left.id.localeCompare(right.id),
  );
}

export function createEvidenceExport(
  snapshot: EvidenceSnapshot,
  now: EvidenceClock,
): EvidenceExport {
  const exportedAt = now();

  if (typeof exportedAt !== "string" || exportedAt.length === 0) {
    throw new EvidenceDataError(
      "Evidence export clock must return a non-empty ISO timestamp string.",
    );
  }

  return {
    exportedAt,
    description: "Synthetic local mission-shell spike evidence",
    snapshot: cloneEvidenceSnapshot(snapshot),
  };
}

function cloneTaskResult(value: unknown): TaskResult {
  const record = requireRecord(value, "Task result");

  return {
    taskId: requireNonEmptyString(record, "taskId", "Task result"),
    passed: requireBoolean(record, "passed", "Task result"),
    evidenceLevel: requireEnum(
      record,
      "evidenceLevel",
      TASK_RESULT_EVIDENCE_LEVELS,
      "Task result",
    ),
    feedbackCode: requireEnum(
      record,
      "feedbackCode",
      TASK_RESULT_FEEDBACK_CODES,
      "Task result",
    ),
    goal: requireString(record, "goal", "Task result"),
    observed: requireString(record, "observed", "Task result"),
    clue: requireString(record, "clue", "Task result"),
    nextAction: requireString(record, "nextAction", "Task result"),
  };
}

function cloneCaseState(value: unknown): CaseState {
  const record = requireRecord(value, "Case state");

  if (!Array.isArray(record.timeline)) {
    throw new EvidenceDataError("Case state.timeline must be an array.");
  }

  return {
    caseId: requireNonEmptyString(record, "caseId", "Case state"),
    caseTitle: requireNonEmptyString(record, "caseTitle", "Case state"),
    consoleStatus: requireEnum(
      record,
      "consoleStatus",
      ["offline", "online"] as const,
      "Case state",
    ),
    consoleMessage: requireString(record, "consoleMessage", "Case state"),
    capabilityStatus: requireEnum(
      record,
      "capabilityStatus",
      CASE_CAPABILITY_STATUSES,
      "Case state",
    ),
    availableTool: requireLiteral(
      record,
      "availableTool",
      "Investigation Console",
      "Case state",
    ),
    lockedPossibility: requireLiteral(
      record,
      "lockedPossibility",
      "Computer's Mind",
      "Case state",
    ),
    timeline: record.timeline.map(cloneCaseEvent),
  };
}

function cloneCaseEvent(value: unknown): CaseEvent {
  const record = requireRecord(value, "Case event");

  return {
    id: requireNonEmptyString(record, "id", "Case event"),
    type: requireLiteral(record, "type", "console_activated", "Case event"),
    occurredAt: requireNonEmptyString(record, "occurredAt", "Case event"),
    missionId: requireNonEmptyString(record, "missionId", "Case event"),
    taskId: requireNonEmptyString(record, "taskId", "Case event"),
    sourceRevision: requireSourceRevision(
      record,
      "sourceRevision",
      "Case event",
    ),
    message: requireString(record, "message", "Case event"),
  };
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new EvidenceDataError(`${label} must be a plain record.`);
  }

  return value as Record<string, unknown>;
}

function requireString(
  record: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = record[key];

  if (typeof value !== "string") {
    throw new EvidenceDataError(`${label}.${key} must be a string.`);
  }

  return value;
}

function requireNonEmptyString(
  record: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = requireString(record, key, label);

  if (value.length === 0) {
    throw new EvidenceDataError(`${label}.${key} must not be empty.`);
  }

  return value;
}

function requireBoolean(
  record: Record<string, unknown>,
  key: string,
  label: string,
): boolean {
  const value = record[key];

  if (typeof value !== "boolean") {
    throw new EvidenceDataError(`${label}.${key} must be a boolean.`);
  }

  return value;
}

function requireSourceRevision(
  record: Record<string, unknown>,
  key: string,
  label: string,
): number {
  const value = record[key];

  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new EvidenceDataError(
      `${label}.${key} must be a non-negative safe integer.`,
    );
  }

  return value as number;
}

function requireLiteral<const Value extends string | number>(
  record: Record<string, unknown>,
  key: string,
  expected: Value,
  label: string,
): Value {
  if (record[key] !== expected) {
    throw new EvidenceDataError(
      `${label}.${key} must equal ${JSON.stringify(expected)}.`,
    );
  }

  return expected;
}

function requireEnum<const Values extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  values: Values,
  label: string,
): Values[number] {
  const value = requireString(record, key, label);

  if (!(values as readonly string[]).includes(value)) {
    throw new EvidenceDataError(
      `${label}.${key} must be one of ${values.join(", ")}.`,
    );
  }

  return value as Values[number];
}
