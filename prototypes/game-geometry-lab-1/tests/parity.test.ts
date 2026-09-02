import { describe, expect, it } from "vitest";
import {
  CONTROL_VARIABLES,
  FIRST_CONTACT,
  getMissionDefinition,
  MISSION_BEATS,
  VARIANT_GEOMETRIES,
} from "../src/experience/mission";
import type { EntryVariant } from "../src/experience/model";
import { completeMission } from "./journey";

const variants: EntryVariant[] = ["direct", "hub-first", "earned-hub"];

describe("controlled route parity", () => {
  it("uses the same frozen Mission definition for all three routes", () => {
    for (const variant of variants) expect(getMissionDefinition(variant)).toBe(FIRST_CONTACT);
    expect(CONTROL_VARIABLES.content).toBe(FIRST_CONTACT);
    expect(CONTROL_VARIABLES.feedbackWording).toBe("Goal · Observed · Clue · Next action");
  });

  it("defines exactly five learner-facing Mission beats", () => {
    expect(MISSION_BEATS.map((beat) => beat.label)).toEqual([
      "Activate",
      "Experiment",
      "Predict",
      "Investigate",
      "Prove",
    ]);
    expect(MISSION_BEATS).toHaveLength(5);
  });

  it("limits route differences to entry and completion geometry", () => {
    expect(VARIANT_GEOMETRIES.direct).toMatchObject({ entry: "mission", completion: "direct-complete" });
    expect(VARIANT_GEOMETRIES["hub-first"]).toMatchObject({ entry: "hub-before", completion: "hub-after" });
    expect(VARIANT_GEOMETRIES["earned-hub"]).toMatchObject({ entry: "cold-open", completion: "earned-hub" });
  });

  it("produces equivalent Mission output, Case truth, events, and capability evidence", () => {
    const [direct, hubFirst, earnedHub] = variants.map((variant) => completeMission(variant));
    for (const result of [hubFirst, earnedHub]) {
      expect(result.source).toBe(direct.source);
      expect(result.execution).toEqual(direct.execution);
      expect(result.caseState).toEqual(direct.caseState);
      expect(result.evidence).toEqual(direct.evidence);
      expect(result.events.map(({ name, learnerLabel }) => ({ name, learnerLabel }))).toEqual(
        direct.events.map(({ name, learnerLabel }) => ({ name, learnerLabel })),
      );
    }
  });
});

describe("causality-level semantic parity", () => {
  it("keeps the same source, result, Case state, events, and evidence at A, B, and C", () => {
    const states = (["a", "b", "c"] as const).map((level) => completeMission("direct", level));
    const baseline = states[0];
    for (const state of states.slice(1)) {
      expect(state.source).toBe(baseline.source);
      expect(state.execution).toEqual(baseline.execution);
      expect(state.caseState).toEqual(baseline.caseState);
      expect(state.events).toEqual(baseline.events);
      expect(state.evidence).toEqual(baseline.evidence);
    }
  });
});
