import { experienceReducer, createInitialState } from "../src/experience/machine";
import {
  BROKEN_SOURCE,
  CLUE_SOURCE,
  FIELD_TEST_OUTPUT,
} from "../src/experience/mission";
import type {
  CausalityLevel,
  EntryVariant,
  ExperienceAction,
  ExperienceState,
} from "../src/experience/model";

export function apply(state: ExperienceState, action: ExperienceAction) {
  return experienceReducer(state, action);
}

export function reachInvestigate(
  variant: EntryVariant,
  causality: CausalityLevel = "c",
) {
  let state = createInitialState(variant, causality, 1_000);
  if (state.screen !== "mission") state = apply(state, { type: "ENTER_MISSION" });
  state = apply(state, { type: "RUN_SOURCE", now: 2_000 });
  state = apply(state, { type: "EDIT_SOURCE", source: 'print("Signal received")' });
  state = apply(state, { type: "RUN_SOURCE", now: 3_000 });
  state = apply(state, { type: "CONTINUE_BEAT" });
  state = apply(state, { type: "SELECT_PREDICTION", choice: "two-console-first" });
  state = apply(state, { type: "SUBMIT_PREDICTION" });
  state = apply(state, { type: "ADVANCE_TRACE" });
  state = apply(state, { type: "ADVANCE_TRACE" });
  state = apply(state, { type: "CONTINUE_BEAT" });
  return state;
}

export function completeMission(
  variant: EntryVariant,
  causality: CausalityLevel = "c",
) {
  let state = reachInvestigate(variant, causality);
  state = apply(state, { type: "EDIT_SOURCE", source: BROKEN_SOURCE });
  state = apply(state, { type: "RUN_SOURCE", now: 4_000 });
  state = apply(state, { type: "EDIT_SOURCE", source: CLUE_SOURCE });
  state = apply(state, { type: "RUN_SOURCE", now: 5_000 });
  state = apply(state, { type: "CONTINUE_BEAT" });
  state = apply(state, {
    type: "EDIT_SOURCE",
    source: `print("${FIELD_TEST_OUTPUT}")`,
  });
  state = apply(state, { type: "RUN_SOURCE", now: 6_000 });
  return state;
}
