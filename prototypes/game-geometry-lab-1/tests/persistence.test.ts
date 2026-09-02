import { describe, expect, it } from "vitest";
import { createInitialState, experienceReducer } from "../src/experience/machine";
import {
  loadExperienceState,
  saveExperienceState,
  storageKey,
} from "../src/experience/persistence";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("versioned route persistence", () => {
  it("restores progress for the same route while honoring the requested reviewer level", () => {
    const storage = new MemoryStorage();
    let state = createInitialState("direct", "a", 1_000);
    state = experienceReducer(state, { type: "RUN_SOURCE", now: 2_000 });
    state = experienceReducer(state, { type: "EDIT_SOURCE", source: 'print("My signal")' });
    saveExperienceState(storage, state);

    const restored = loadExperienceState(storage, "direct", "c", 9_000);
    expect(restored).toMatchObject({
      restored: true,
      beat: "experiment",
      phase: "experiment-edit",
      source: 'print("My signal")',
      causality: "c",
      caseState: { folder: "open", console: "online" },
    });
    expect(restored.metrics.openedAt).toBe(1_000);
  });

  it("fails safely to the correct entry when stored data is corrupt", () => {
    const storage = new MemoryStorage();
    storage.setItem(storageKey("earned-hub"), "{not-json");
    const restored = loadExperienceState(storage, "earned-hub", "b", 9_000);
    expect(restored).toMatchObject({ screen: "cold-open", beat: "activate", causality: "b", restored: false });
  });
});
