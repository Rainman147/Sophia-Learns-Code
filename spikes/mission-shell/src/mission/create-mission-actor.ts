import { assign, createActor as createXStateActor, setup } from "xstate";

import type {
  MissionActor,
  MissionDefinition,
  MissionEvent,
  MissionSnapshot,
  MissionStage,
  MissionTaskDefinition,
} from "../contracts/mission";
import { isCurrentExecutionResult } from "../contracts/execution";
import { nextSourceRevision } from "../contracts/shared";
import type { RunResult } from "../contracts/execution";
import type { RuntimeMode } from "../contracts/shared";
import type { TaskResult } from "../contracts/case";

const FLOW_STAGES = [
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
] as const satisfies readonly MissionStage[];

const ALL_STAGES = new Set<MissionStage>([
  ...FLOW_STAGES,
  "paused",
  "stopped",
]);

type ResumeStage = Exclude<MissionStage, "paused">;
type RememberAction =
  | "rememberBriefing"
  | "rememberFirstRun"
  | "rememberFirstResult"
  | "rememberPersonalize"
  | "rememberPersonalizeResult"
  | "rememberPrediction"
  | "rememberTrace"
  | "rememberCreateError"
  | "rememberErrorFeedback"
  | "rememberRepair"
  | "rememberRepairResult"
  | "rememberFieldTest"
  | "rememberFieldResult"
  | "rememberDebrief"
  | "rememberReward";

interface MissionMachineInput {
  readonly definition: MissionDefinition;
  readonly runtimeMode: RuntimeMode;
}

interface MissionMachineContext {
  readonly definition: MissionDefinition;
  readonly initialRuntimeMode: RuntimeMode;
  readonly source: string;
  readonly sourceRevision: number;
  readonly runtimeMode: RuntimeMode;
  readonly activeTaskId: string | undefined;
  readonly prediction: MissionSnapshot["prediction"];
  readonly traceStep: 0 | 1 | 2;
  readonly lastExecution: RunResult | undefined;
  readonly lastTaskResult: TaskResult | undefined;
  readonly statusMessage: string;
  readonly canContinue: boolean;
  readonly canStop: boolean;
  readonly activeRequestId: string | undefined;
  readonly resumeStage: ResumeStage | undefined;
  readonly resumeStatusMessage: string;
  readonly resumeCanContinue: boolean;
  readonly resumeCanStop: boolean;
  readonly routingStage: MissionStage | undefined;
}

function taskAtStage(
  definition: MissionDefinition,
  stage: MissionTaskDefinition["stage"],
): MissionTaskDefinition {
  const task = definition.tasks.find((candidate) => candidate.stage === stage);
  if (!task) {
    throw new Error(`Mission ${definition.id} is missing a task for stage ${stage}.`);
  }
  return task;
}

function assertFirstContactFlow(definition: MissionDefinition): void {
  for (const stage of FLOW_STAGES) {
    if (!definition.stageOrder.includes(stage)) {
      throw new Error(`Mission ${definition.id} does not include required stage ${stage}.`);
    }
  }

  for (const stage of [
    "first-run",
    "personalize",
    "prediction",
    "trace",
    "create-error",
    "repair",
    "field-test",
  ] as const) {
    taskAtStage(definition, stage);
  }
}

function initialContext(input: MissionMachineInput): MissionMachineContext {
  return {
    definition: input.definition,
    initialRuntimeMode: input.runtimeMode,
    source: input.definition.starterSource,
    sourceRevision: 0,
    runtimeMode: input.runtimeMode,
    activeTaskId: undefined,
    prediction: undefined,
    traceStep: 0,
    lastExecution: undefined,
    lastTaskResult: undefined,
    statusMessage: "Review the mission briefing, then begin when you are ready.",
    canContinue: false,
    canStop: true,
    activeRequestId: undefined,
    resumeStage: undefined,
    resumeStatusMessage: "Review the mission briefing, then begin when you are ready.",
    resumeCanContinue: false,
    resumeCanStop: true,
    routingStage: undefined,
  };
}

function taskEntry(
  context: MissionMachineContext,
  stage: MissionTaskDefinition["stage"],
  statusMessage: string,
  replaceSource: boolean,
): Partial<MissionMachineContext> {
  const task = taskAtStage(context.definition, stage);
  return {
    activeTaskId: task.id,
    activeRequestId: undefined,
    canContinue: false,
    canStop: true,
    lastExecution: undefined,
    lastTaskResult: undefined,
    statusMessage,
    ...(replaceSource
      ? {
          source: task.source,
          sourceRevision: nextSourceRevision(context.sourceRevision),
        }
      : {}),
  };
}

function resultStatus(result: RunResult): string {
  switch (result.status) {
    case "success":
      return "Run complete. Review the result before continuing.";
    case "error":
      return "Python returned a clue. Your source is still here for inspection and repair.";
    case "timeout":
      return "The run reached its time limit. Your source is safe and ready to try again.";
    case "cancelled":
      return "The run was cancelled. Your source is safe and ready to try again.";
    case "rejected":
      return "The runtime rejected this run. Your source is unchanged.";
  }
}

function isRestorableSnapshot(
  context: MissionMachineContext,
  event: Extract<MissionEvent, { readonly type: "RESTORE" }>,
): boolean {
  const { snapshot } = event;
  return (
    snapshot.missionId === context.definition.id &&
    snapshot.missionVersion === context.definition.version &&
    ALL_STAGES.has(snapshot.stage) &&
    Number.isSafeInteger(snapshot.sourceRevision) &&
    snapshot.sourceRevision >= 0 &&
    (snapshot.traceStep === 0 || snapshot.traceStep === 1 || snapshot.traceStep === 2)
  );
}

const missionMachineSetup = setup({
  types: {
    context: {} as MissionMachineContext,
    events: {} as MissionEvent,
    input: {} as MissionMachineInput,
  },
  guards: {
    acceptsExecutionResult: ({ context, event }) =>
      event.type === "RUN_RESOLVED" &&
      context.activeRequestId === event.result.requestId &&
      isCurrentExecutionResult(event.result, context.sourceRevision),
    acceptsTaskEvaluation: ({ context, event }) =>
      event.type === "TASK_EVALUATED" && event.taskResult.taskId === context.activeTaskId,
    hasPassingTaskResult: ({ context }) => context.lastTaskResult?.passed === true,
    hasNewSourceRevision: ({ context, event }) =>
      event.type === "SOURCE_CHANGED" &&
      Number.isSafeInteger(event.sourceRevision) &&
      event.sourceRevision > context.sourceRevision,
    hasPrediction: ({ event }) =>
      event.type === "PREDICTION_SUBMITTED" && event.prediction !== undefined,
    isFirstTraceStep: ({ context }) => context.traceStep === 0,
    isSecondTraceStep: ({ context }) => context.traceStep === 1,
    isTraceComplete: ({ context }) => context.traceStep === 2,
    canRestore: ({ context, event }) =>
      event.type === "RESTORE" && isRestorableSnapshot(context, event),
  },
  actions: {
    beginMission: assign(({ context }) => ({
      ...taskEntry(
        context,
        "first-run",
        "Run the starter program and notice where its message appears.",
        false,
      ),
      prediction: undefined,
      traceStep: 0,
    })),
    enterPersonalize: assign(({ context }) =>
      taskEntry(
        context,
        "personalize",
        "Change the message between the quotation marks, then run it deliberately.",
        false,
      ),
    ),
    enterPrediction: assign(({ context }) =>
      taskEntry(
        context,
        "prediction",
        "Predict the two-line result. Not sure is a valid, honest choice.",
        true,
      ),
    ),
    enterTrace: assign(({ context }) =>
      taskEntry(
        context,
        "trace",
        "Advance twice to inspect each print instruction in order.",
        false,
      ),
    ),
    enterCreateError: assign(({ context }) =>
      taskEntry(
        context,
        "create-error",
        "Run the controlled broken example and inspect Python's clue calmly.",
        true,
      ),
    ),
    enterRepair: assign(({ context }) =>
      taskEntry(
        context,
        "repair",
        "Repair the unmatched quotation mark. The broken source remains in place.",
        false,
      ),
    ),
    enterFieldTest: assign(({ context }) =>
      taskEntry(
        context,
        "field-test",
        "Field Test: create the requested message from this fresh starting point.",
        true,
      ),
    ),
    enterDebrief: assign({
      activeRequestId: undefined,
      activeTaskId: undefined,
      canContinue: true,
      canStop: true,
      statusMessage: "Debrief ready. Continue to the reward or stop cleanly and return later.",
    }),
    enterReward: assign({
      activeTaskId: undefined,
      canContinue: true,
      canStop: true,
      statusMessage: "Capability evidence recorded. Continue when you are ready to complete the mission.",
    }),
    enterComplete: assign({
      activeRequestId: undefined,
      activeTaskId: undefined,
      canContinue: false,
      canStop: false,
      statusMessage: "Mission complete. Your Investigation Console is online.",
    }),
    recordSourceChange: assign(({ event }) => {
      if (event.type !== "SOURCE_CHANGED") {
        return {};
      }
      return {
        source: event.source,
        sourceRevision: event.sourceRevision,
        activeRequestId: undefined,
        canContinue: false,
        lastTaskResult: undefined,
        statusMessage: "Source updated. Run this revision when you are ready.",
      };
    }),
    rejectSourceChange: assign({
      statusMessage: "An older source revision was ignored to protect the current work.",
    }),
    beginRun: assign(({ event }) => {
      if (event.type !== "RUN_REQUESTED") {
        return {};
      }
      return {
        activeRequestId: event.requestId,
        canContinue: false,
        lastTaskResult: undefined,
        statusMessage: "Running this source revision…",
      };
    }),
    rejectRunRequest: assign({
      statusMessage: "Run is not available at this mission stage.",
    }),
    acceptExecutionResult: assign(({ event }) => {
      if (event.type !== "RUN_RESOLVED") {
        return {};
      }
      return {
        activeRequestId: undefined,
        lastExecution: event.result,
        lastTaskResult: undefined,
        canContinue: false,
        statusMessage: resultStatus(event.result),
      };
    }),
    rejectExecutionResult: assign({
      statusMessage:
        "An older run result was ignored because its request or source revision is no longer current.",
    }),
    recordTaskEvaluation: assign(({ event }) => {
      if (event.type !== "TASK_EVALUATED") {
        return {};
      }
      const { taskResult } = event;
      return {
        lastTaskResult: taskResult,
        canContinue: taskResult.passed,
        statusMessage: taskResult.passed
          ? `${taskResult.observed} ${taskResult.clue}`.trim()
          : `${taskResult.goal} ${taskResult.observed} ${taskResult.clue} Next: ${taskResult.nextAction}`.trim(),
      };
    }),
    rejectTaskEvaluation: assign({
      statusMessage: "A result for a different task was ignored to protect the active mission step.",
    }),
    recordPrediction: assign(({ event }) => {
      if (event.type !== "PREDICTION_SUBMITTED" || event.prediction === undefined) {
        return {};
      }
      return {
        prediction: event.prediction,
        statusMessage:
          event.prediction === "not-sure"
            ? "Not sure recorded. Trace the two instructions to build the answer."
            : "Prediction recorded. Trace the two instructions to compare it with execution order.",
      };
    }),
    rejectPrediction: assign({
      statusMessage: "Choose a prediction or Not sure before tracing the program.",
    }),
    advanceTrace: assign(({ context }) => ({
      traceStep: Math.min(2, context.traceStep + 1) as 1 | 2,
      canContinue: context.traceStep === 1,
      statusMessage:
        context.traceStep === 0
          ? "Trace step 1 of 2: the first print instruction produces the first line."
          : "Trace step 2 of 2: the second print instruction adds the second line.",
    })),
    traceAlreadyComplete: assign({
      statusMessage: "Both trace steps are complete. Continue with the controlled error.",
    }),
    rememberBriefing: assign(({ context }) => rememberStage(context, "briefing")),
    rememberFirstRun: assign(({ context }) => rememberStage(context, "first-run")),
    rememberFirstResult: assign(({ context }) => rememberStage(context, "first-result")),
    rememberPersonalize: assign(({ context }) => rememberStage(context, "personalize")),
    rememberPersonalizeResult: assign(({ context }) => rememberStage(context, "personalize-result")),
    rememberPrediction: assign(({ context }) => rememberStage(context, "prediction")),
    rememberTrace: assign(({ context }) => rememberStage(context, "trace")),
    rememberCreateError: assign(({ context }) => rememberStage(context, "create-error")),
    rememberErrorFeedback: assign(({ context }) => rememberStage(context, "error-feedback")),
    rememberRepair: assign(({ context }) => rememberStage(context, "repair")),
    rememberRepairResult: assign(({ context }) => rememberStage(context, "repair-result")),
    rememberFieldTest: assign(({ context }) => rememberStage(context, "field-test")),
    rememberFieldResult: assign(({ context }) => rememberStage(context, "field-result")),
    rememberDebrief: assign(({ context }) => rememberStage(context, "debrief")),
    rememberReward: assign(({ context }) => rememberStage(context, "reward")),
    markPaused: assign({
      activeRequestId: undefined,
      canContinue: true,
      canStop: true,
      statusMessage: "Mission paused. Your source and exact place are saved.",
    }),
    markStopped: assign({
      activeRequestId: undefined,
      canContinue: true,
      canStop: false,
      statusMessage: "Stopped cleanly. Continue to return to the same mission step.",
    }),
    resumeMission: assign(({ context }) => ({
      canContinue: context.resumeCanContinue,
      canStop: context.resumeCanStop,
      routingStage: context.resumeStage,
      statusMessage: context.resumeStatusMessage,
    })),
    applyRestore: assign(({ event }) => {
      if (event.type !== "RESTORE") {
        return {};
      }
      const { snapshot } = event;
      return {
        source: snapshot.source,
        sourceRevision: snapshot.sourceRevision,
        runtimeMode: snapshot.runtimeMode,
        activeTaskId: snapshot.activeTaskId,
        prediction: snapshot.prediction,
        traceStep: snapshot.traceStep,
        lastExecution: snapshot.lastExecution,
        lastTaskResult: snapshot.lastTaskResult,
        statusMessage: snapshot.statusMessage,
        canContinue: snapshot.canContinue,
        canStop: snapshot.canStop,
        activeRequestId: undefined,
        resumeStage: snapshot.resumeStage,
        resumeStatusMessage: snapshot.statusMessage,
        resumeCanContinue: snapshot.canContinue,
        resumeCanStop: snapshot.canStop,
        routingStage: snapshot.stage,
      };
    }),
    rejectRestore: assign({
      statusMessage: "Saved state did not match this mission version, so the current session was kept.",
    }),
    resetMission: assign(({ context }) => ({
      ...initialContext({
        definition: context.definition,
        runtimeMode: context.initialRuntimeMode,
      }),
      sourceRevision: nextSourceRevision(context.sourceRevision),
      statusMessage: "Mission reset to the authored First Contact briefing.",
    })),
  },
});

function rememberStage(
  context: MissionMachineContext,
  stage: ResumeStage,
): Partial<MissionMachineContext> {
  return {
    activeRequestId: undefined,
    resumeStage: stage,
    resumeStatusMessage: context.statusMessage,
    resumeCanContinue: context.canContinue,
    resumeCanStop: context.canStop,
  };
}

function pauseAndStopTransitions(rememberAction: RememberAction) {
  return {
    PAUSE: { target: "paused", actions: rememberAction },
    CHOOSE_STOP: { target: "stopped", actions: rememberAction },
  } as const;
}

function editableResultTransitions(
  editingStage: "first-run" | "personalize" | "create-error" | "repair" | "field-test",
) {
  return {
    SOURCE_CHANGED: {
      guard: "hasNewSourceRevision",
      target: editingStage,
      actions: "recordSourceChange",
    },
    RUN_REQUESTED: { target: editingStage, actions: "beginRun" },
    TASK_EVALUATED: [
      { guard: "acceptsTaskEvaluation", actions: "recordTaskEvaluation" },
      { actions: "rejectTaskEvaluation" },
    ],
  } as const;
}

function runTransitions(resultStage: "first-result" | "personalize-result" | "error-feedback" | "repair-result" | "field-result") {
  return {
    RUN_REQUESTED: { actions: "beginRun" },
    RUN_RESOLVED: [
      {
        guard: "acceptsExecutionResult",
        target: resultStage,
        actions: "acceptExecutionResult",
      },
      { actions: "rejectExecutionResult" },
    ],
  } as const;
}

function createMissionMachine() {
  return missionMachineSetup.createMachine({
    id: "first-contact-mission",
    initial: "briefing",
    context: ({ input }) => initialContext(input),
    on: {
      RESET: { target: ".briefing", actions: "resetMission" },
      RESTORE: [
        { guard: "canRestore", target: ".restoring", actions: "applyRestore" },
        { actions: "rejectRestore" },
      ],
      SOURCE_CHANGED: [
        { guard: "hasNewSourceRevision", actions: "recordSourceChange" },
        { actions: "rejectSourceChange" },
      ],
      RUN_REQUESTED: { actions: "rejectRunRequest" },
      RUN_RESOLVED: { actions: "rejectExecutionResult" },
      TASK_EVALUATED: { actions: "rejectTaskEvaluation" },
    },
    states: {
      briefing: {
        on: {
          BEGIN: { target: "first-run", actions: "beginMission" },
          ...pauseAndStopTransitions("rememberBriefing"),
        },
      },
      "first-run": {
        on: {
          ...runTransitions("first-result"),
          ...pauseAndStopTransitions("rememberFirstRun"),
        },
      },
      "first-result": {
        on: {
          ...editableResultTransitions("first-run"),
          CONTINUE: {
            guard: "hasPassingTaskResult",
            target: "personalize",
            actions: "enterPersonalize",
          },
          ...pauseAndStopTransitions("rememberFirstResult"),
        },
      },
      personalize: {
        on: {
          ...runTransitions("personalize-result"),
          ...pauseAndStopTransitions("rememberPersonalize"),
        },
      },
      "personalize-result": {
        on: {
          ...editableResultTransitions("personalize"),
          CONTINUE: {
            guard: "hasPassingTaskResult",
            target: "prediction",
            actions: "enterPrediction",
          },
          ...pauseAndStopTransitions("rememberPersonalizeResult"),
        },
      },
      prediction: {
        on: {
          PREDICTION_SUBMITTED: [
            {
              guard: "hasPrediction",
              target: "trace",
              actions: ["recordPrediction", "enterTrace"],
            },
            { actions: "rejectPrediction" },
          ],
          ...pauseAndStopTransitions("rememberPrediction"),
        },
      },
      trace: {
        on: {
          TRACE_ADVANCED: [
            { guard: "isFirstTraceStep", actions: "advanceTrace" },
            { guard: "isSecondTraceStep", actions: "advanceTrace" },
            { actions: "traceAlreadyComplete" },
          ],
          CONTINUE: {
            guard: "isTraceComplete",
            target: "create-error",
            actions: "enterCreateError",
          },
          ...pauseAndStopTransitions("rememberTrace"),
        },
      },
      "create-error": {
        on: {
          ...runTransitions("error-feedback"),
          ...pauseAndStopTransitions("rememberCreateError"),
        },
      },
      "error-feedback": {
        on: {
          ...editableResultTransitions("create-error"),
          CONTINUE: {
            guard: "hasPassingTaskResult",
            target: "repair",
            actions: "enterRepair",
          },
          ...pauseAndStopTransitions("rememberErrorFeedback"),
        },
      },
      repair: {
        on: {
          ...runTransitions("repair-result"),
          ...pauseAndStopTransitions("rememberRepair"),
        },
      },
      "repair-result": {
        on: {
          ...editableResultTransitions("repair"),
          CONTINUE: {
            guard: "hasPassingTaskResult",
            target: "field-test",
            actions: "enterFieldTest",
          },
          ...pauseAndStopTransitions("rememberRepairResult"),
        },
      },
      "field-test": {
        on: {
          ...runTransitions("field-result"),
          ...pauseAndStopTransitions("rememberFieldTest"),
        },
      },
      "field-result": {
        on: {
          ...editableResultTransitions("field-test"),
          CONTINUE: {
            guard: "hasPassingTaskResult",
            target: "debrief",
            actions: "enterDebrief",
          },
          ...pauseAndStopTransitions("rememberFieldResult"),
        },
      },
      debrief: {
        on: {
          CONTINUE: { target: "reward", actions: "enterReward" },
          CHOOSE_CONTINUE: { target: "reward", actions: "enterReward" },
          ...pauseAndStopTransitions("rememberDebrief"),
        },
      },
      reward: {
        on: {
          CONTINUE: { target: "complete", actions: "enterComplete" },
          CHOOSE_CONTINUE: { target: "complete", actions: "enterComplete" },
          ...pauseAndStopTransitions("rememberReward"),
        },
      },
      complete: {},
      paused: {
        entry: "markPaused",
        on: {
          RESUME: { target: "resuming", actions: "resumeMission" },
          CHOOSE_CONTINUE: { target: "resuming", actions: "resumeMission" },
          CHOOSE_STOP: { target: "stopped" },
        },
      },
      stopped: {
        entry: "markStopped",
        on: {
          RESUME: { target: "resuming", actions: "resumeMission" },
          CHOOSE_CONTINUE: { target: "resuming", actions: "resumeMission" },
        },
      },
      resuming: {
        always: routingTransitions("resumeStage"),
      },
      restoring: {
        always: routingTransitions("routingStage"),
      },
    },
  });
}

function routingTransitions(field: "resumeStage" | "routingStage") {
  const route = (stage: MissionStage, target: MissionStage) => ({
    guard: ({ context }: { context: MissionMachineContext }) => context[field] === stage,
    target,
  });

  return [
    ...FLOW_STAGES.map((stage) => route(stage, stage)),
    route("paused", "paused"),
    route("stopped", "stopped"),
    { target: "briefing" as const, actions: "resetMission" as const },
  ];
}

function stageFromStateValue(value: unknown, context: MissionMachineContext): MissionStage {
  if (typeof value === "string" && ALL_STAGES.has(value as MissionStage)) {
    return value as MissionStage;
  }
  if (context.routingStage && ALL_STAGES.has(context.routingStage)) {
    return context.routingStage;
  }
  if (context.resumeStage && ALL_STAGES.has(context.resumeStage)) {
    return context.resumeStage;
  }
  return "briefing";
}

function toMissionSnapshot(value: unknown, context: MissionMachineContext): MissionSnapshot {
  const stage = stageFromStateValue(value, context);
  return {
    missionId: context.definition.id,
    missionVersion: context.definition.version,
    stage,
    source: context.source,
    sourceRevision: context.sourceRevision,
    runtimeMode: context.runtimeMode,
    traceStep: context.traceStep,
    statusMessage: context.statusMessage,
    canContinue: context.canContinue,
    canStop: context.canStop,
    completed: stage === "complete",
    ...(context.activeTaskId ? { activeTaskId: context.activeTaskId } : {}),
    ...(context.prediction ? { prediction: context.prediction } : {}),
    ...(context.lastExecution ? { lastExecution: context.lastExecution } : {}),
    ...(context.lastTaskResult ? { lastTaskResult: context.lastTaskResult } : {}),
    ...(context.resumeStage ? { resumeStage: context.resumeStage } : {}),
  };
}

/**
 * Creates the First Contact mission actor behind the repository-owned contract.
 * XState remains entirely inside this implementation module.
 */
export function createMissionActor(
  definition: MissionDefinition,
  runtimeMode: RuntimeMode = "scripted",
): MissionActor {
  assertFirstContactFlow(definition);
  const actor = createXStateActor(createMissionMachine(), {
    input: { definition, runtimeMode },
  });

  return {
    start(): void {
      actor.start();
    },
    stop(): void {
      actor.stop();
    },
    send(event: MissionEvent): void {
      actor.send(event);
    },
    getSnapshot(): MissionSnapshot {
      const snapshot = actor.getSnapshot();
      return toMissionSnapshot(snapshot.value, snapshot.context);
    },
    subscribe(listener: (snapshot: MissionSnapshot) => void): () => void {
      const subscription = actor.subscribe((snapshot) => {
        listener(toMissionSnapshot(snapshot.value, snapshot.context));
      });
      return () => subscription.unsubscribe();
    },
  };
}
