import { describe, expect, it } from "vitest";
import {
  createInitialState,
  hasAvailableLearnerAction,
  isMissionComplete,
} from "../src/experience/machine";
import { BROKEN_SOURCE, CLUE_SOURCE, FIELD_TEST_OUTPUT } from "../src/experience/mission";
import type { EntryVariant } from "../src/experience/model";
import { apply, completeMission, reachInvestigate } from "./journey";

const variants: EntryVariant[] = ["direct", "hub-first", "earned-hub"];

describe.each(variants)("%s Mission flow", (variant) => {
  it("completes the five-beat happy, error, repair, and Field Test path", () => {
    const state = completeMission(variant);
    expect(state.beat).toBe("prove");
    expect(state.phase).toBe("complete");
    expect(state.execution.output).toEqual([FIELD_TEST_OUTPUT]);
    expect(state.caseState).toMatchObject({
      folder: "open",
      console: "verified",
      operationsCenter: "online",
      headline: "Investigation Console online",
    });
    expect(state.evidence).toHaveLength(7);
    expect(isMissionComplete(state)).toBe(true);
    expect(hasAvailableLearnerAction(state)).toBe(true);
  });

  it("creates and personally repairs the unmatched quotation mark", () => {
    let state = reachInvestigate(variant);
    state = apply(state, { type: "EDIT_SOURCE", source: BROKEN_SOURCE });
    state = apply(state, { type: "RUN_SOURCE", now: 4_000 });
    expect(state.phase).toBe("investigate-repair");
    expect(state.execution.errorCode).toBe("unmatched-quote");
    expect(state.feedback).toMatchObject({
      goal: "Run one complete text value through print.",
      nextAction: "Add the missing quotation mark after ready, then run the line again.",
    });

    state = apply(state, { type: "EDIT_SOURCE", source: CLUE_SOURCE });
    state = apply(state, { type: "RUN_SOURCE", now: 5_000 });
    expect(state.phase).toBe("investigate-result");
    expect(state.execution.output).toEqual(["Case folder ready"]);
    expect(state.events.at(-1)?.name).toBe("quotation_repaired");
  });
});

describe("entry and completion gates", () => {
  it("reveals the earned Operations Center only after Field Test success", () => {
    let state = createInitialState("earned-hub", "c", 1_000);
    expect(state.screen).toBe("cold-open");
    expect(state.caseState.operationsCenter).toBe("not-revealed");
    expect(state.events.some((event) => event.name === "operations_center_online")).toBe(false);

    state = completeMission("earned-hub");
    expect(state.screen).toBe("earned-hub");
    expect(state.caseState.operationsCenter).toBe("online");
    expect(state.events.some((event) => event.name === "operations_center_online")).toBe(true);
  });

  it("does not start or implement Mission 002 after any completion", () => {
    for (const variant of variants) {
      const state = completeMission(variant);
      expect(state.beat).toBe("prove");
      expect(state.phase).toBe("complete");
      expect(state.events.some((event) => event.name === "mission_completed")).toBe(true);
      expect(state.events).toHaveLength(11);
    }
  });
});

describe("pause, resume, reset, and no-dead-end behavior", () => {
  it("stops and resumes the exact route boundary", () => {
    let state = completeMission("hub-first");
    expect(state.screen).toBe("hub-after");
    state = apply(state, { type: "STOP" });
    expect(state).toMatchObject({ screen: "paused", resumeScreen: "hub-after" });
    state = apply(state, { type: "RESUME" });
    expect(state.screen).toBe("hub-after");
    expect(isMissionComplete(state)).toBe(true);
  });

  it("resets every route to its own entry and keeps causality selection", () => {
    const expected = {
      direct: "mission",
      "hub-first": "hub-before",
      "earned-hub": "cold-open",
    } as const;
    for (const variant of variants) {
      const state = apply(completeMission(variant, "b"), { type: "RESET", now: 9_000 });
      expect(state.screen).toBe(expected[variant]);
      expect(state.causality).toBe("b");
      expect(state.evidence).toEqual([]);
      expect(hasAvailableLearnerAction(state)).toBe(true);
    }
  });
});
