import { describe, expect, it } from "vitest";
import {
  BROKEN_SOURCE,
  isMissionComplete,
} from "../src/experience/machine";
import {
  CLUE_SOURCE,
  FIELD_TEST_OUTPUT,
} from "../src/experience/mission";
import type { Variant } from "../src/experience/model";
import { apply, completeMission, reachIntentionalError } from "./journey";

describe.each<Variant>(["direct", "operations-center"])(
  "%s shared Mission state transitions",
  (variant) => {
    it("completes the matched happy path and emits semantic Case events", () => {
      const state = completeMission(variant);

      expect(state.stage).toBe("debrief");
      expect(state.screen).toBe("mission");
      expect(state.caseState).toMatchObject({
        console: "calibrated",
        signal: "verified",
        headline: "Evidence channel verified",
      });
      expect(state.execution.output).toEqual([FIELD_TEST_OUTPUT]);
      expect(isMissionComplete(state)).toBe(true);
      expect(state.events.map((event) => event.name)).toEqual(
        expect.arrayContaining([
          "investigation_console_online",
          "message_personalized",
          "prediction_recorded",
          "execution_sequence_inspected",
          "unmatched_quote_observed",
          "quotation_repaired",
          "field_test_passed",
          "mission_completed",
        ]),
      );
      expect(state.evidence).toHaveLength(7);
    });

    it("handles the intentional unmatched-quote error and personal recovery", () => {
      let state = reachIntentionalError(variant);
      expect(state.stage).toBe("intentional-error");

      state = apply(state, { type: "EDIT_SOURCE", source: BROKEN_SOURCE });
      state = apply(state, { type: "RUN_SOURCE", now: 4_000 });

      expect(state.stage).toBe("repair");
      expect(state.execution.errorCode).toBe("unmatched-quote");
      expect(state.feedback).toEqual({
        kind: "calm-error",
        goal: "Run a complete text value through print.",
        observed:
          "The text began with a quotation mark, but the line ended before Python found its matching partner.",
        clue:
          "The opening quotation mark after the parenthesis has no closing match before the final parenthesis.",
        nextAction:
          "Add the missing quotation mark after ready, then run the line again.",
      });

      state = apply(state, { type: "EDIT_SOURCE", source: CLUE_SOURCE });
      state = apply(state, { type: "RUN_SOURCE", now: 5_000 });

      expect(state.stage).toBe("repair-result");
      expect(state.execution).toMatchObject({
        status: "success",
        output: ["Case ready"],
      });
      expect(state.events.at(-1)?.name).toBe("quotation_repaired");
    });

    it("exits through only the configured variant boundary", () => {
      let state = completeMission(variant);
      state = apply(state, { type: "CONTINUE_AFTER_MISSION" });
      expect(state.screen).toBe(
        variant === "direct" ? "direct-complete" : "hub-after",
      );
    });
  },
);

describe("stop, resume, and reset transitions", () => {
  it("stops cleanly and resumes the exact supported state", () => {
    let state = completeMission("direct");
    state = apply(state, { type: "STOP" });
    expect(state.screen).toBe("paused");
    expect(state.resumeScreen).toBe("mission");

    state = apply(state, { type: "RESUME" });
    expect(state.screen).toBe("mission");
    expect(state.stage).toBe("debrief");
    expect(isMissionComplete(state)).toBe(true);
  });

  it("deliberately resets each variant to its own entry boundary", () => {
    const direct = apply(completeMission("direct"), {
      type: "RESET",
      now: 9_000,
    });
    const hub = apply(completeMission("operations-center"), {
      type: "RESET",
      now: 9_000,
    });

    expect(direct).toMatchObject({
      screen: "mission",
      stage: "first-run",
      evidence: [],
    });
    expect(direct.events.map((event) => event.name)).toEqual(["mission_opened"]);
    expect(hub).toMatchObject({
      screen: "hub-before",
      stage: "first-run",
      events: [],
      evidence: [],
    });
  });
});
