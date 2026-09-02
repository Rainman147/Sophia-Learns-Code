import type {
  CaseEvent,
  EvidenceEvent,
  ExecutionMetrics,
  NormalizedExecutionError,
  PersistedMissionSession,
  RunRequest,
  RunResult,
  TaskResult,
} from "../../src/contracts";
import { initialCaseState } from "../../src/contracts";

const DEFAULT_METRICS = {
  runtimeVersion: "scripted-test-v1",
  workerGeneration: 1,
  initializedThisRun: false,
  queueMs: 0,
  executeMs: 2,
  totalMs: 2,
  outputBytes: 15,
} as const satisfies ExecutionMetrics;

export function runRequest(overrides: Partial<RunRequest> = {}): RunRequest {
  return {
    requestId: "request-1",
    missionId: "phase-0.first-contact",
    missionVersion: "spike-1",
    taskId: "first-run",
    runtimeMode: "scripted",
    source: 'print("Hello, Sophia!")',
    sourceRevision: 1,
    timeoutMs: 4_000,
    maxOutputBytes: 16_384,
    ...overrides,
  };
}
export function successfulRun(overrides: Partial<RunResult> = {}): RunResult {
  return {
    requestId: "request-1",
    sourceRevision: 1,
    taskId: "first-run",
    runtimeMode: "scripted",
    status: "success",
    stdout: "Hello, Sophia!\n",
    stderr: "",
    metrics: DEFAULT_METRICS,
    ...overrides,
  };
}

export function unmatchedQuoteRun(overrides: Partial<RunResult> = {}): RunResult {
  const error = {
    category: "syntax",
    code: "unmatched-quote",
    message: "SyntaxError: unterminated string literal",
    learnerMessage: "Python found an opening quotation mark without a matching closing quotation mark.",
    line: 1,
    column: 7,
    exceptionType: "SyntaxError",
  } as const satisfies NormalizedExecutionError;

  return {
    requestId: "request-error",
    sourceRevision: 2,
    taskId: "create-the-clue",
    runtimeMode: "scripted",
    status: "error",
    stdout: "",
    stderr: "SyntaxError: unterminated string literal",
    error,
    metrics: { ...DEFAULT_METRICS, outputBytes: 0 },
    ...overrides,
  };
}

export function introducedTaskResult(overrides: Partial<TaskResult> = {}): TaskResult {
  return {
    taskId: "first-run",
    passed: true,
    evidenceLevel: "introduced",
    feedbackCode: "runtime-success",
    goal: "Run the starter program.",
    observed: "Execution succeeded with stdout.",
    clue: "The expected output appeared.",
    nextAction: "Continue.",
    ...overrides,
  };
}

export function consoleActivatedEvent(overrides: Partial<CaseEvent> = {}): CaseEvent {
  return {
    id: "case-event-v1:console_activated:phase-0.first-contact:spike-1:first-run",
    type: "console_activated",
    occurredAt: "2026-09-01T12:00:00.000Z",
    missionId: "phase-0.first-contact",
    taskId: "first-run",
    sourceRevision: 1,
    message: "Investigation Console online. First verified Python result received.",
    ...overrides,
  };
}

export function evidenceEvent(overrides: Partial<EvidenceEvent> = {}): EvidenceEvent {
  return {
    id: "evidence-v1:first-run:1",
    type: "evidence_recorded",
    occurredAt: "2026-09-01T12:00:00.000Z",
    missionId: "phase-0.first-contact",
    missionVersion: "spike-1",
    taskResult: introducedTaskResult(),
    runtimeMode: "scripted",
    supportLevel: "full",
    privacy: "local-synthetic",
    ...overrides,
  };
}

export function persistedSession(
  overrides: Partial<PersistedMissionSession> = {},
): PersistedMissionSession {
  return {
    schemaVersion: 1,
    missionId: "phase-0.first-contact",
    missionVersion: "spike-1",
    variant: "direct",
    stage: "personalize",
    runtimeMode: "scripted",
    source: 'print("My signal")',
    sourceRevision: 3,
    caseState: initialCaseState(),
    updatedAt: "2026-09-01T12:00:00.000Z",
    ...overrides,
  };
}
