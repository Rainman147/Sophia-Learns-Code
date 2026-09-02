import { evaluatePrototypeSource } from "./evaluator";
import {
  CLUE_SOURCE,
  FIELD_TEST_FEEDBACK,
  FIELD_TEST_OUTPUT,
  MISSION_BEATS,
  STARTER_SOURCE,
  TWO_LINE_SOURCE,
  UNMATCHED_QUOTE_FEEDBACK,
  VARIANT_GEOMETRIES,
} from "./mission";
import type {
  CaseEventName,
  CaseEventRecord,
  CausalityLevel,
  EntryVariant,
  ExperienceAction,
  ExperienceScreen,
  ExperienceState,
  MissionBeat,
} from "./model";

const EVENT_LABELS: Record<CaseEventName, string> = {
  mission_opened: "First Contact opened",
  case_folder_opened: "The First Contact file opened",
  message_personalized: "The new message was recorded",
  prediction_recorded: "The prediction was recorded",
  execution_sequence_inspected: "Both lines were traced in order",
  unmatched_quote_observed: "The unmatched quotation mark was found",
  quotation_repaired: "The message boundary was repaired",
  field_test_passed: "The fresh Field Test was completed",
  investigation_console_online: "The Investigation Console came online",
  operations_center_online: "The Operations Center came online",
  mission_completed: "First Contact was completed",
};

function addEvent(
  state: ExperienceState,
  name: CaseEventName,
): CaseEventRecord[] {
  if (state.events.some((event) => event.name === name)) return state.events;
  return [
    ...state.events,
    {
      id: state.events.length + 1,
      name,
      learnerLabel: EVENT_LABELS[name],
    },
  ];
}

function addEvents(state: ExperienceState, names: CaseEventName[]) {
  return names.reduce(
    (events, name) => addEvent({ ...state, events }, name),
    state.events,
  );
}

function addEvidence(state: ExperienceState, evidence: string) {
  return state.evidence.includes(evidence)
    ? state.evidence
    : [...state.evidence, evidence];
}

function countMeaningfulAction(state: ExperienceState) {
  return {
    ...state.metrics,
    meaningfulActions: state.metrics.meaningfulActions + 1,
  };
}

function initialScreen(variant: EntryVariant): ExperienceScreen {
  return VARIANT_GEOMETRIES[variant].entry;
}

export function createInitialState(
  variant: EntryVariant,
  causality: CausalityLevel = "c",
  now = Date.now(),
): ExperienceState {
  const screen = initialScreen(variant);
  const missionIsOpen = screen === "mission";
  return {
    version: 1,
    variant,
    causality,
    screen,
    beat: "activate",
    phase: "activate-ready",
    source: STARTER_SOURCE,
    sourceRevision: 0,
    execution: { status: "idle", output: [] },
    traceStep: 0,
    caseState: {
      folder: "sealed",
      folderNote: "unread",
      console: "offline",
      operationsCenter: variant === "hub-first" ? "available" : "not-revealed",
      headline: "First Contact file sealed",
      detail:
        "The 00:43 badge record is waiting inside. The unusual time is a question, not a conclusion.",
    },
    events: missionIsOpen
      ? [
          {
            id: 1,
            name: "mission_opened",
            learnerLabel: EVENT_LABELS.mission_opened,
          },
        ]
      : [],
    evidence: [],
    announcement: missionIsOpen
      ? "First Contact is ready. Run the waiting message."
      : variant === "hub-first"
        ? "Operations Center ready. First Contact is the recommended Mission."
        : "A sealed Case file is waiting. First Contact can begin now.",
    restored: false,
    metrics: {
      openedAt: now,
      navigationBeforeFirstRun: 0,
      meaningfulActions: 0,
    },
  };
}

function startBeat(
  state: ExperienceState,
  beat: MissionBeat,
  source: string,
  announcement: string,
): ExperienceState {
  return {
    ...state,
    beat,
    phase:
      beat === "predict"
        ? "predict-choice"
        : beat === "investigate"
          ? "investigate-create"
          : beat === "prove"
            ? "prove-ready"
            : state.phase,
    source,
    sourceRevision: state.sourceRevision + 1,
    execution: { status: "idle", output: [] },
    feedback: undefined,
    announcement,
  };
}

function completionScreen(variant: EntryVariant): ExperienceScreen {
  return VARIANT_GEOMETRIES[variant].completion;
}

function runSource(state: ExperienceState, now: number): ExperienceState {
  const result = evaluatePrototypeSource(state.source, state.sourceRevision);
  const metrics = {
    ...countMeaningfulAction(state),
    firstCodeActionAt: state.metrics.firstCodeActionAt ?? now,
  };

  if (state.phase === "activate-ready") {
    if (result.status === "success" && result.output[0] === "Hello, Sophia!") {
      return {
        ...state,
        beat: "experiment",
        phase: "experiment-edit",
        execution: result,
        caseState: {
          ...state.caseState,
          folder: "open",
          folderNote: "message-recorded",
          console: "online",
          headline: "First Contact file opened",
          detail:
            "Python printed the waiting message. The source stayed in the editor, and the result opened the Case file.",
        },
        events: addEvent(state, "case_folder_opened"),
        evidence: addEvidence(
          state,
          "Ran the first instruction and distinguished source from output",
        ),
        feedback: undefined,
        announcement:
          "Hello, Sophia! appeared in output. The First Contact file is now open.",
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
        nextAction: "Restore the starter line if needed, then run it.",
      },
      announcement: "The first message did not run yet. A useful clue is available.",
      metrics,
    };
  }

  if (state.phase === "experiment-edit") {
    const personalized =
      result.status === "success" &&
      result.output.length === 1 &&
      result.output[0].trim().length > 0 &&
      result.output[0] !== "Hello, Sophia!";

    if (personalized) {
      return {
        ...state,
        phase: "experiment-result",
        execution: result,
        feedback: undefined,
        caseState: {
          ...state.caseState,
          folderNote: "message-recorded",
          headline: "Your message reached the file",
          detail:
            "The words you changed became the new output. The open Case file recorded that result.",
        },
        events: addEvent(state, "message_personalized"),
        evidence: addEvidence(
          state,
          "Changed the source and observed a changed result",
        ),
        announcement: `Your changed message appeared: ${result.output[0]}.`,
        metrics,
      };
    }

    return {
      ...state,
      execution: result,
      feedback: {
        kind: "guidance",
        goal: "Change the message and make the output respond differently.",
        observed:
          result.status === "success"
            ? "The original greeting is still unchanged."
            : result.message ?? "No changed output appeared.",
        clue: "The editable message sits between the matching quotation marks.",
        nextAction: "Choose your own short message, then run the changed line.",
      },
      announcement: "The message has not changed yet. A useful clue is available.",
      metrics,
    };
  }

  if (state.phase === "investigate-create") {
    if (result.errorCode === "unmatched-quote") {
      return {
        ...state,
        phase: "investigate-repair",
        execution: result,
        feedback: UNMATCHED_QUOTE_FEEDBACK,
        events: addEvent(state, "unmatched_quote_observed"),
        evidence: addEvidence(
          state,
          "Created and identified an unmatched quotation mark",
        ),
        announcement:
          "Python stopped at an unmatched quotation mark. The goal, observation, clue, and next action are available.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: {
        kind: "guidance",
        goal: "Create one unmatched quotation mark on purpose.",
        observed:
          result.status === "success"
            ? "The message still has a matching pair of quotation marks."
            : result.message ?? "A different issue appeared.",
        clue: "Remove only the quotation mark immediately after ready.",
        nextAction: "Make that one change, then run the clue.",
      },
      announcement: "The intended punctuation clue has not appeared yet.",
      metrics,
    };
  }

  if (state.phase === "investigate-repair") {
    if (result.status === "success" && result.output.join("\n") === "Case folder ready") {
      return {
        ...state,
        phase: "investigate-result",
        execution: result,
        feedback: undefined,
        caseState: {
          ...state.caseState,
          folderNote: "repair-recorded",
          headline: "Message repaired",
          detail:
            "The matching quotation mark restored the message. No Case progress was lost.",
        },
        events: addEvent(state, "quotation_repaired"),
        evidence: addEvidence(state, "Repaired the unmatched quotation mark"),
        announcement:
          "Repair verified. Case folder ready appeared in output and the Case file recorded the recovery.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: UNMATCHED_QUOTE_FEEDBACK,
      announcement: "The line still needs repair. The same calm clue remains available.",
      metrics,
    };
  }

  if (state.phase === "prove-ready") {
    if (
      result.status === "success" &&
      result.output.length === 1 &&
      result.output[0] === FIELD_TEST_OUTPUT
    ) {
      const eventNames: CaseEventName[] = [
        "field_test_passed",
        "investigation_console_online",
        "operations_center_online",
        "mission_completed",
      ];
      return {
        ...state,
        screen: completionScreen(state.variant),
        phase: "complete",
        execution: result,
        feedback: undefined,
        caseState: {
          ...state.caseState,
          console: "verified",
          operationsCenter: "online",
          headline: "Investigation Console online",
          detail:
            "Your fresh program printed the requested message. The Case can now carry the next investigation fact.",
        },
        events: addEvents(state, eventNames),
        evidence: addEvidence(
          state,
          "Completed a fresh reduced-support Field Test",
        ),
        announcement:
          state.variant === "earned-hub"
            ? "Field Test complete. Your success brought the Operations Center online."
            : state.variant === "hub-first"
              ? "Field Test complete. The changed Operations Center is ready."
              : "Field Test complete. Your capability evidence is ready.",
        metrics,
      };
    }
    return {
      ...state,
      execution: result,
      feedback: FIELD_TEST_FEEDBACK,
      announcement: "The Field Test is not complete yet. A reduced-support clue is available.",
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
      if (state.screen !== "hub-before" && state.screen !== "cold-open") return state;
      return {
        ...state,
        screen: "mission",
        events: addEvent(state, "mission_opened"),
        announcement: "First Contact opened. Run the waiting message.",
        metrics: {
          ...countMeaningfulAction(state),
          navigationBeforeFirstRun: state.metrics.navigationBeforeFirstRun + 1,
        },
      };

    case "EDIT_SOURCE":
      return {
        ...state,
        source: action.source,
        sourceRevision: state.sourceRevision + 1,
        feedback: undefined,
      };

    case "RUN_SOURCE":
      return runSource(state, action.now);

    case "SELECT_PREDICTION":
      if (state.phase !== "predict-choice") return state;
      return { ...state, prediction: action.choice };

    case "SUBMIT_PREDICTION":
      if (state.phase !== "predict-choice" || !state.prediction) return state;
      return {
        ...state,
        phase: "predict-trace",
        traceStep: 0,
        execution: { status: "idle", output: [] },
        events: addEvent(state, "prediction_recorded"),
        evidence: addEvidence(state, "Committed to a two-line prediction"),
        announcement:
          state.prediction === "two-console-first"
            ? "Prediction recorded. Trace both lines to check it."
            : "Prediction recorded without penalty. Trace both lines to inspect what happens.",
        metrics: countMeaningfulAction(state),
      };

    case "ADVANCE_TRACE":
      if (state.phase !== "predict-trace") return state;
      if (state.traceStep === 0) {
        return {
          ...state,
          traceStep: 1,
          execution: {
            status: "success",
            output: ["Console online"],
            sourceRevision: state.sourceRevision,
          },
          announcement: "Line one printed Console online.",
          metrics: countMeaningfulAction(state),
        };
      }
      if (state.traceStep === 1) {
        return {
          ...state,
          traceStep: 2,
          execution: {
            status: "success",
            output: ["Console online", "Case folder ready"],
            sourceRevision: state.sourceRevision,
          },
          events: addEvent(state, "execution_sequence_inspected"),
          evidence: addEvidence(state, "Traced two lines in top-to-bottom order"),
          announcement: "Line two printed Case folder ready beneath the first line.",
          metrics: countMeaningfulAction(state),
        };
      }
      return state;

    case "CONTINUE_BEAT":
      if (state.phase === "experiment-result") {
        return startBeat(
          state,
          "predict",
          TWO_LINE_SOURCE,
          "Experiment complete. Predict what the two lines will print.",
        );
      }
      if (state.phase === "predict-trace" && state.traceStep === 2) {
        return startBeat(
          state,
          "investigate",
          CLUE_SOURCE,
          "Prediction checked. Create one quotation-mark clue and repair it.",
        );
      }
      if (state.phase === "investigate-result") {
        return startBeat(
          state,
          "prove",
          "",
          "Repair complete. A fresh reduced-support Field Test is ready.",
        );
      }
      return state;

    case "SET_CAUSALITY":
      return {
        ...state,
        causality: action.level,
        announcement: `Reviewer comparison changed to causality level ${action.level.toUpperCase()}.`,
      };

    case "REVIEW_MISSION":
      if (!isMissionComplete(state)) return state;
      return {
        ...state,
        screen: "mission",
        beat: "prove",
        phase: "complete",
        announcement: "Completed Mission evidence reopened for review.",
      };

    case "RETURN_TO_OUTCOME":
      if (!isMissionComplete(state)) return state;
      return {
        ...state,
        screen: completionScreen(state.variant),
        announcement: "Mission outcome restored.",
      };

    case "STOP":
      if (state.screen === "paused") return state;
      return {
        ...state,
        resumeScreen: state.screen,
        screen: "paused",
        announcement: "Stopped at a natural boundary. Your work is saved on this device.",
      };

    case "RESUME":
      return {
        ...state,
        screen: state.resumeScreen ?? initialScreen(state.variant),
        resumeScreen: undefined,
        announcement: "Saved work restored.",
      };

    case "RESET":
      return createInitialState(state.variant, state.causality, action.now);

    default:
      return state;
  }
}

export function isMissionComplete(state: ExperienceState) {
  return state.events.some((event) => event.name === "mission_completed");
}

export function getBeatNumber(beat: MissionBeat) {
  return MISSION_BEATS.findIndex((item) => item.id === beat) + 1;
}

export function getFirstActionSeconds(state: ExperienceState) {
  if (!state.metrics.firstCodeActionAt) return undefined;
  return Math.max(
    0,
    Math.round((state.metrics.firstCodeActionAt - state.metrics.openedAt) / 1000),
  );
}

export function hasAvailableLearnerAction(state: ExperienceState) {
  if (state.screen === "paused") return true;
  if (state.screen !== "mission") return true;
  if (state.phase === "predict-choice") return Boolean(state.prediction);
  return true;
}
