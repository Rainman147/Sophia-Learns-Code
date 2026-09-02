import { describe, expect, it } from "vitest";
import { createInitialState, experienceReducer } from "../src/experience/machine";
import {
  loadExperienceState,
  saveExperienceState,
  storageKey,
} from "../src/experience/persistence";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("reload and resume persistence", () => {
  it("recovers the exact supported state for the same variant", () => {
    const storage = new MemoryStorage();
    let state = createInitialState("direct", 1_000);
    state = experienceReducer(state, { type: "RUN_SOURCE", now: 2_000 });
    state = experienceReducer(state, {
      type: "EDIT_SOURCE",
      source: 'print("My own signal")',
    });
    saveExperienceState(storage, state);

    const restored = loadExperienceState(storage, "direct", 9_000);
    expect(restored).toMatchObject({
      restored: true,
      stage: "personalize",
      source: 'print("My own signal")',
      caseState: { console: "online", signal: "contact" },
    });
    expect(restored.metrics.openedAt).toBe(1_000);
  });

  it("fails safely to a clean entry state when saved data is corrupt", () => {
    const storage = new MemoryStorage();
    storage.setItem(storageKey("operations-center"), "{not-json");
    const restored = loadExperienceState(storage, "operations-center", 9_000);

    expect(restored.screen).toBe("hub-before");
    expect(restored.stage).toBe("first-run");
    expect(restored.restored).toBe(false);
  });
});
