import { evaluatePrototypeSource } from "./evaluator";
import {
  BROKEN_SOURCE,
  CLUE_SOURCE,
  FIELD_TEST_FEEDBACK,
  FIELD_TEST_OUTPUT,
  FIRST_CONTACT,
  STARTER_SOURCE,
  TWO_LINE_SOURCE,
  UNMATCHED_QUOTE_FEEDBACK,
  VARIANT_SHELLS,
} from "./mission";
import type {
  CaseEventName,
  CaseEventRecord,
  ExperienceAction,
  ExperienceState,
  MissionStage,
  Variant,
} from "./model";

const EVENT_LABELS: Record<CaseEventName, string> = {
  mission_opened: "Mission channel opened",
  investigation_console_online: "Investigation Console online",
  message_personalized: "Console response changed from source",
  prediction_recorded: "Execution prediction recorded",
  execution_sequence_inspected: "Two-line sequence inspected",
  unmatched_quote_observed: "Unmatched quotation mark isolated",
  quotation_repaired: "Message channel restored",
  field_test_passed: "Fresh Field Test verified",
  mission_completed: "First Contact evidence sealed",
};

function addEvent(
  state: ExperienceState,
  name: CaseEventName,
): CaseEventRecord[] {
  if (state.events.some((event) => event.name === name)) {
    return state.events;
  }
  return [
    ...state.events,
    { id: state.events.length + 1, name, label: EVENT_LABELS[name] },
  ];
}

function countMeaningfulAction(state: ExperienceState) {
  return {
    ...state.metrics,
    meaningfulActions: state.metrics.meaningfulActions + 1,
  };
}

export function createInitialState(
  variant: Variant,
  now = Date.now(),
): ExperienceState {
  const shell = VARIANT_SHELLS[variant];
  return {
    version: 1,
    variant,
    screen: shell.entry === "mission" ? "mission" : "hub-before",
    stage: "first-run",
    source: STARTER_SOURCE,
    execution: { status: "idle", output: [] },
    traceStep: 0,
    caseState: {
      console: "offline",
      signal: "unresolved",
      headline: "Midnight signal unresolved",
      detail:
        "A synthetic badge event arrived at an unusual time. It is a question, not a conclusion.",
    },
    events:
      shell.entry === "mission"
        ? [{ id: 1, name: "mission_opened", label: EVENT_LABELS.mission_opened }]
        : [],
    evidence: [],
    announcement:
      shell.entry === "mission"
        ? "First Contact is ready. The Investigation Console is waiting for its first run."
        : "Operations Center ready. One Case and one recommended Mission are available.",
    restored: false,
    metrics: {
      openedAt: now,
      navigationBeforeFirstRun: 0,
      meaningfulActions: 0,
    },
  };
}

function startStage(
  state: ExperienceState,
  stage: MissionStage,
  source: string,
  announcement: string,
): ExperienceState {
  return {
    ...state,
    stage,
    source,
    execution: { status: "idle", output: [] },
    feedback: undefined,
    announcement,
  };
}

function runSource(state: ExperienceState, now: number): ExperienceState {
  const result = evaluatePrototypeSource(state.source);
  const metrics = {
    ...countMeaningfulAction(state),
    firstCodeActionAt: state.metrics.firstCodeActionAt ?? now,
  };

  if (state.stage === "first-run") {
    if (result.status === "success" && result.output[0] === "Hello, Sophia!") {
      return {
        ...state,
        stage: "personalize",
        execution: result,
        caseState: {
          console: "online",
          signal: "contact",
          headline: "Console contact established",
          detail:
            "The source produced a message, and the Case now has a visible communication channel.",
        },
        events: addEvent(state, "investigation_console_online"),
        evidence: [...state.evidence, "Ran the starter message"],
        feedback: undefined,
        announcement:
          "Console online. Hello, Sophia! appeared in Console output, while the source stayed in the editor.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: {
        kind: "guidance",
        goal: "Run the waiting starter message exactly once.",
        observed: result.message ?? "The starter message did not appear.",
        clue: "The complete line is already waiting in the source area.",
        nextAction: "Restore the starter line if needed, then Run message.",
      },
      announcement: "The starter message did not run yet. A calm feedback packet is available.",
      metrics,
    };
  }

  if (state.stage === "personalize") {
    const personalized =
      result.status === "success" &&
      result.output.length === 1 &&
      result.output[0].trim().length > 0 &&
      result.output[0] !== "Hello, Sophia!";
    if (personalized) {
      return {
        ...state,
        stage: "personalize-result",
        execution: result,
        feedback: undefined,
        events: addEvent(state, "message_personalized"),
        evidence: [...state.evidence, "Changed the source and observed changed output"],
        announcement: `Personalized output received: ${result.output[0]}. The changed result is visible before the next encounter.`,
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: {
        kind: "guidance",
        goal: "Change only the message and make the Console respond differently.",
        observed:
          result.status === "success"
            ? "The original greeting is still unchanged."
            : result.message ?? "No personalized output appeared.",
        clue: "The editable message sits between the matching quotation marks.",
        nextAction: "Choose your own short message, then Run changed message.",
      },
      announcement: "The message has not changed yet. A feedback packet is available.",
      metrics,
    };
  }

  if (state.stage === "intentional-error") {
    if (result.errorCode === "unmatched-quote") {
      return {
        ...state,
        stage: "repair",
        execution: result,
        feedback: UNMATCHED_QUOTE_FEEDBACK,
        events: addEvent(state, "unmatched_quote_observed"),
        evidence: [...state.evidence, "Inspected an unmatched quotation mark"],
        announcement:
          "Unmatched quotation mark observed. Goal, Observed, Clue, and Next Action feedback is available.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: {
        kind: "guidance",
        goal: "Create one specific punctuation clue on purpose.",
        observed:
          result.status === "success"
            ? "The line still has a matching pair of quotation marks."
            : result.message ?? "A different issue appeared.",
        clue: "Remove only the quotation mark immediately after the word ready.",
        nextAction: "Make that one change, then Run the clue again.",
      },
      announcement: "The intended unmatched quotation mark has not appeared yet.",
      metrics,
    };
  }

  if (state.stage === "repair") {
    if (result.status === "success" && result.output.join("\n") === "Case ready") {
      return {
        ...state,
        stage: "repair-result",
        execution: result,
        feedback: undefined,
        caseState: {
          ...state.caseState,
          headline: "Message channel restored",
          detail:
            "The repaired source produced the intended Case-ready message without changing the evidence claim.",
        },
        events: addEvent(state, "quotation_repaired"),
        evidence: [...state.evidence, "Repaired the unmatched quotation mark"],
        announcement:
          "Repair verified. Case ready appeared in Console output and the message channel is restored.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: UNMATCHED_QUOTE_FEEDBACK,
      announcement: "The line still needs repair. The calm feedback packet remains available.",
      metrics,
    };
  }

  if (state.stage === "field-test") {
    if (
      result.status === "success" &&
      result.output.length === 1 &&
      result.output[0] === FIELD_TEST_OUTPUT
    ) {
      return {
        ...state,
        stage: "debrief",
        execution: result,
        feedback: undefined,
        caseState: {
          console: "calibrated",
          signal: "verified",
          headline: "Evidence channel verified",
          detail:
            "A fresh one-line program produced the requested message. The Case changed because the scripted evaluator emitted a semantic success event.",
        },
        events: addEvent(
          { ...state, events: addEvent(state, "field_test_passed") },
          "mission_completed",
        ),
        evidence: [
          ...state.evidence,
          "Passed a fresh reduced-support Field Test",
        ],
        announcement:
          "Field Test verified. The capability evidence and restrained reward are ready for review.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: FIELD_TEST_FEEDBACK,
      announcement: "The Field Test is not verified yet. A reduced-support clue is available.",
      metrics,
    };
  }

  return state;
}

export function experienceReducer(
  state: ExperienceState,
  action: ExperienceAction,
): ExperienceState {
  switch (action.type) {
    case "ENTER_MISSION":
      if (state.screen !== "hub-before") return state;
      return {
        ...state,
        screen: "mission",
        events: addEvent(state, "mission_opened"),
        announcement:
          "First Contact opened. The Investigation Console is waiting for its first run.",
        metrics: {
          ...countMeaningfulAction(state),
          navigationBeforeFirstRun: state.metrics.navigationBeforeFirstRun + 1,
        },
      };
    case "EDIT_SOURCE":
      return { ...state, source: action.source, feedback: undefined };
    case "RUN_SOURCE":
      return runSource(state, action.now);
    case "SELECT_PREDICTION":
      return { ...state, prediction: action.choice };
    case "SUBMIT_PREDICTION":
      if (state.stage !== "prediction" || !state.prediction) return state;
      return {
        ...state,
        stage: "trace",
        traceStep: 0,
        execution: { status: "idle", output: [] },
        events: addEvent(state, "prediction_recorded"),
        evidence: [...state.evidence, "Committed to an execution prediction"],
        announcement:
          state.prediction === "two-console-first"
            ? "Prediction recorded. Inspect the two-line execution sequence."
            : "Prediction recorded without penalty. Inspect what the two lines actually do.",
        metrics: countMeaningfulAction(state),
      };
    case "ADVANCE_TRACE":
      if (state.stage !== "trace") return state;
      if (state.traceStep === 0) {
        return {
          ...state,
          traceStep: 1,
          execution: { status: "success", output: ["Console online"] },
          announcement:
            "Step 1 of 2. Line one sent Console online to the output.",
          metrics: countMeaningfulAction(state),
        };
      }
      if (state.traceStep === 1) {
        return {
          ...state,
          traceStep: 2,
          execution: {
            status: "success",
            output: ["Console online", "Case ready"],
          },
          events: addEvent(state, "execution_sequence_inspected"),
          evidence: [...state.evidence, "Inspected top-to-bottom execution"],
          announcement:
            "Step 2 of 2. Line two added Case ready beneath the first output line.",
          metrics: countMeaningfulAction(state),
        };
      }
      return {
        ...startStage(
          state,
          "intentional-error",
          CLUE_SOURCE,
          "Execution order inspected. Create one intentional quotation-mark clue next.",
        ),
        metrics: countMeaningfulAction(state),
      };
    case "CONTINUE_STAGE":
      if (state.stage === "personalize-result") {
        return startStage(
          state,
          "prediction",
          TWO_LINE_SOURCE,
          "Changed output inspected. The two-line prediction is ready.",
        );
      }
      if (state.stage === "repair-result") {
        return startStage(
          state,
          "field-test",
          "",
          "Repair inspected. A fresh reduced-support Field Test is ready.",
        );
      }
      return state;
    case "CONTINUE_AFTER_MISSION":
      if (state.stage !== "debrief") return state;
      return {
        ...state,
        screen: VARIANT_SHELLS[state.variant].exit,
        announcement:
          state.variant === "direct"
            ? "Compact capability and next-action panel opened."
            : "Returned to the Operations Center. The Case and available tool have changed.",
        metrics: countMeaningfulAction(state),
      };
    case "REVIEW_DEBRIEF":
      return {
        ...state,
        screen: "mission",
        stage: "debrief",
        announcement: "Mission evidence reopened for review.",
      };
    case "STOP":
      if (state.screen === "paused") return state;
      return {
        ...state,
        resumeScreen: state.screen,
        screen: "paused",
        announcement:
          "Stopped at a natural boundary. Prototype state is saved on this device.",
      };
    case "RESUME":
      return {
        ...state,
        screen: state.resumeScreen ?? "mission",
        resumeScreen: undefined,
        announcement: "Saved prototype state restored.",
      };
    case "RESET":
      return createInitialState(state.variant, action.now);
    default:
      return state;
  }
}

export function isMissionComplete(state: ExperienceState) {
  return state.events.some((event) => event.name === "mission_completed");
}

export function getStageNumber(stage: MissionStage) {
  return FIRST_CONTACT.stageOrder.indexOf(stage) + 1;
}

export function getFirstActionSeconds(state: ExperienceState) {
  if (!state.metrics.firstCodeActionAt) return undefined;
  return Math.max(
    0,
    Math.round((state.metrics.firstCodeActionAt - state.metrics.openedAt) / 1000),
  );
}

export { BROKEN_SOURCE };
