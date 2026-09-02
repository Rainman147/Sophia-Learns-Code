import {
  BROKEN_SOURCE,
  createInitialState,
  experienceReducer,
} from "../src/experience/machine";
import { CLUE_SOURCE, FIELD_TEST_OUTPUT } from "../src/experience/mission";
import type {
  ExperienceAction,
  ExperienceState,
  Variant,
} from "../src/experience/model";

export function apply(state: ExperienceState, action: ExperienceAction) {
  return experienceReducer(state, action);
}

export function reachIntentionalError(variant: Variant) {
  let state = createInitialState(variant, 1_000);
  if (variant === "operations-center") {
    state = apply(state, { type: "ENTER_MISSION" });
  }
  state = apply(state, { type: "RUN_SOURCE", now: 2_000 });
  state = apply(state, {
    type: "EDIT_SOURCE",
    source: 'print("Signal received")',
  });
  state = apply(state, { type: "RUN_SOURCE", now: 3_000 });
  state = apply(state, { type: "CONTINUE_STAGE" });
  state = apply(state, {
    type: "SELECT_PREDICTION",
    choice: "two-console-first",
  });
  state = apply(state, { type: "SUBMIT_PREDICTION" });
  state = apply(state, { type: "ADVANCE_TRACE" });
  state = apply(state, { type: "ADVANCE_TRACE" });
  state = apply(state, { type: "ADVANCE_TRACE" });
  return state;
}

export function completeMission(variant: Variant) {
  let state = reachIntentionalError(variant);
  state = apply(state, { type: "EDIT_SOURCE", source: BROKEN_SOURCE });
  state = apply(state, { type: "RUN_SOURCE", now: 4_000 });
  state = apply(state, { type: "EDIT_SOURCE", source: CLUE_SOURCE });
  state = apply(state, { type: "RUN_SOURCE", now: 5_000 });
  state = apply(state, { type: "CONTINUE_STAGE" });
  state = apply(state, {
    type: "EDIT_SOURCE",
    source: `print("${FIELD_TEST_OUTPUT}")`,
  });
  state = apply(state, { type: "RUN_SOURCE", now: 6_000 });
  return state;
}
