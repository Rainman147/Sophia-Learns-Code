import { describe, expect, it } from "vitest";
import { applyCaseEvents, createSceneRenderer } from "../../src/case";
import { FIRST_CONTACT_MISSION } from "../../src/content/first-contact";
import { initialCaseState } from "../../src/contracts";
import { createMissionEvaluator } from "../../src/truth";
import {
  consoleActivatedEvent,
  successfulRun,
  unmatchedQuoteRun,
} from "./fixtures";

describe("deterministic mission truth", () => {
  const occurredAt = "2026-09-01T12:00:00.000Z";
  const evaluator = createMissionEvaluator({ now: () => occurredAt });

  it("passes the exact first output and emits one semantic event", () => {
    const outcome = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      "first-run",
      successfulRun(),
    );

    expect(outcome.taskResult).toMatchObject({
      taskId: "first-run",
      passed: true,
      evidenceLevel: "introduced",
      feedbackCode: "runtime-success",
    });
    expect(outcome.caseEvents).toEqual([
      expect.objectContaining({
        type: "console_activated",
        occurredAt,
        sourceRevision: 1,
      }),
    ]);
  });

  it("passes the controlled unmatched-quote task without activating the Case", () => {
    const outcome = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      "create-the-clue",
      unmatchedQuoteRun(),
    );

    expect(outcome.taskResult).toMatchObject({
      passed: true,
      feedbackCode: "unmatched-quote",
      evidenceLevel: "guided",
    });
    expect(outcome.caseEvents).toEqual([]);
  });

  it("rejects output from a different task identity", () => {
    const outcome = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      "repair-the-clue",
      successfulRun({ taskId: "first-run", stdout: "Case ready\n" }),
    );

    expect(outcome.taskResult.passed).toBe(false);
    expect(outcome.taskResult.feedbackCode).toBe("execution-incomplete");
    expect(outcome.taskResult.clue).toMatch(/belongs to task first-run/i);
  });

  it("classifies the Field Test as independent only on exact output", () => {
    const passed = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      "field-test",
      successfulRun({
        taskId: "field-test",
        sourceRevision: 9,
        stdout: "Investigation started\n",
      }),
    );
    const failed = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      "field-test",
      successfulRun({
        taskId: "field-test",
        sourceRevision: 10,
        stdout: "Investigation started twice\n",
      }),
    );

    expect(passed.taskResult).toMatchObject({
      passed: true,
      evidenceLevel: "independent",
    });
    expect(failed.taskResult).toMatchObject({
      passed: false,
      feedbackCode: "output-mismatch",
    });
  });

  it("fails loudly when a task is not part of the Mission definition", () => {
    expect(() =>
      evaluator.evaluate(
        FIRST_CONTACT_MISSION,
        "not-authored",
        successfulRun({ taskId: "not-authored" }),
      ),
    ).toThrow(RangeError);
  });
});

describe("semantic Case state and accessible projection", () => {
  it("applies an event once and keeps duplicate delivery idempotent", () => {
    const initial = initialCaseState();
    const event = consoleActivatedEvent();
    const online = applyCaseEvents(initial, [event]);
    const duplicate = applyCaseEvents(online, [event]);

    expect(online).toMatchObject({
      consoleStatus: "online",
      capabilityStatus: "introduced",
      consoleMessage: event.message,
    });
    expect(online.timeline).toEqual([event]);
    expect(duplicate).toBe(online);
    expect(duplicate.timeline).toHaveLength(1);
  });

  it("projects full motion and reduced-motion text parity from the same Case state", () => {
    const state = applyCaseEvents(initialCaseState(), [consoleActivatedEvent()]);
    const renderer = createSceneRenderer();
    const full = renderer.project(state, { motionPreference: "full" });
    const reduced = renderer.project(state, { motionPreference: "reduced" });

    expect(full.state).toBe("online");
    expect(full.motionCue).toBe("console-activation");
    expect(reduced.motionCue).toBe("none");
    expect(full.textEquivalent).toContain("Investigation Console status: online");
    expect(reduced.textEquivalent).toBe(full.textEquivalent);
    expect(reduced.detail).toMatch(/without animation/i);
    expect(reduced.changedLabel).toMatch(/Changed:/);
  });
});
