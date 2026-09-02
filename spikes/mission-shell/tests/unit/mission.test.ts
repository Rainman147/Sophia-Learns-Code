import { describe, expect, it } from "vitest";
import type {
  MissionActor,
  MissionSnapshot,
  RunResult,
} from "../../src/contracts";
import { FIRST_CONTACT_MISSION } from "../../src/content/first-contact";
import { createMissionActor } from "../../src/mission";
import { createMissionEvaluator } from "../../src/truth";
import { successfulRun, unmatchedQuoteRun } from "./fixtures";

const evaluator = createMissionEvaluator({
  now: () => "2026-09-01T12:00:00.000Z",
});

function startedActor(): MissionActor {
  const actor = createMissionActor(FIRST_CONTACT_MISSION, "scripted");
  actor.start();
  return actor;
}

function evaluateActiveRun(
  actor: MissionActor,
  result: RunResult,
  requestId = result.requestId,
): MissionSnapshot {
  const before = actor.getSnapshot();
  if (!before.activeTaskId) throw new Error(`Stage ${before.stage} has no active task.`);
  const alignedResult: RunResult = {
    ...result,
    requestId,
    taskId: before.activeTaskId,
    sourceRevision: before.sourceRevision,
  };

  actor.send({ type: "RUN_REQUESTED", requestId });
  actor.send({ type: "RUN_RESOLVED", result: alignedResult });
  const outcome = evaluator.evaluate(
    FIRST_CONTACT_MISSION,
    before.activeTaskId,
    alignedResult,
  );
  actor.send({ type: "TASK_EVALUATED", taskResult: outcome.taskResult });
  return actor.getSnapshot();
}

function finishHappyPath(actor: MissionActor): readonly MissionSnapshot["stage"][] {
  const visited: MissionSnapshot["stage"][] = [actor.getSnapshot().stage];
  const record = () => visited.push(actor.getSnapshot().stage);

  actor.send({ type: "BEGIN" });
  record();
  evaluateActiveRun(actor, successfulRun());
  record();
  actor.send({ type: "CONTINUE" });
  record();

  actor.send({
    type: "SOURCE_CHANGED",
    source: 'print("Signal personalized")',
    sourceRevision: 1,
  });
  evaluateActiveRun(
    actor,
    successfulRun({
      requestId: "personalize-1",
      taskId: "personalize",
      sourceRevision: 1,
      stdout: "Signal personalized\n",
    }),
  );
  record();
  actor.send({ type: "CONTINUE" });
  record();

  actor.send({
    type: "PREDICTION_SUBMITTED",
    prediction: "two-lines-console-first",
  });
  record();
  actor.send({ type: "TRACE_ADVANCED" });
  expect(actor.getSnapshot()).toMatchObject({ stage: "trace", traceStep: 1 });
  actor.send({ type: "TRACE_ADVANCED" });
  expect(actor.getSnapshot()).toMatchObject({
    stage: "trace",
    traceStep: 2,
    canContinue: true,
  });
  actor.send({ type: "CONTINUE" });
  record();

  evaluateActiveRun(
    actor,
    unmatchedQuoteRun({
      requestId: "error-1",
      sourceRevision: actor.getSnapshot().sourceRevision,
    }),
  );
  record();
  actor.send({ type: "CONTINUE" });
  record();

  const repairRevision = actor.getSnapshot().sourceRevision + 1;
  actor.send({
    type: "SOURCE_CHANGED",
    source: 'print("Case ready")',
    sourceRevision: repairRevision,
  });
  evaluateActiveRun(
    actor,
    successfulRun({
      requestId: "repair-1",
      taskId: "repair-the-clue",
      sourceRevision: repairRevision,
      stdout: "Case ready\n",
    }),
  );
  record();
  actor.send({ type: "CONTINUE" });
  record();

  const fieldRevision = actor.getSnapshot().sourceRevision + 1;
  actor.send({
    type: "SOURCE_CHANGED",
    source: 'print("Investigation started")',
    sourceRevision: fieldRevision,
  });
  evaluateActiveRun(
    actor,
    successfulRun({
      requestId: "field-1",
      taskId: "field-test",
      sourceRevision: fieldRevision,
      stdout: "Investigation started\n",
    }),
  );
  record();
  actor.send({ type: "CONTINUE" });
  record();
  actor.send({ type: "CONTINUE" });
  record();
  actor.send({ type: "CONTINUE" });
  record();

  return visited;
}

describe("First Contact MissionActor", () => {
  it("traverses every authored flow stage and reaches complete without a dead end", () => {
    const actor = startedActor();
    const visited = finishHappyPath(actor);

    expect(visited).toEqual(FIRST_CONTACT_MISSION.stageOrder);
    expect(actor.getSnapshot()).toMatchObject({
      stage: "complete",
      completed: true,
      canContinue: false,
      canStop: false,
    });
    actor.stop();
  });

  it("does not advance a result stage until deterministic evaluation passes", () => {
    const actor = startedActor();
    actor.send({ type: "BEGIN" });
    const resultStage = evaluateActiveRun(
      actor,
      successfulRun({ stdout: "Wrong output\n" }),
    );

    expect(resultStage).toMatchObject({
      stage: "first-result",
      canContinue: false,
      lastTaskResult: {
        passed: false,
        feedbackCode: "output-mismatch",
      },
    });
    actor.send({ type: "CONTINUE" });
    expect(actor.getSnapshot().stage).toBe("first-result");
    actor.stop();
  });

  it("ignores an old result after a newer source revision supersedes its request", () => {
    const actor = startedActor();
    actor.send({ type: "BEGIN" });
    actor.send({ type: "RUN_REQUESTED", requestId: "old-request" });
    actor.send({
      type: "SOURCE_CHANGED",
      source: 'print("Current source")',
      sourceRevision: 1,
    });
    actor.send({
      type: "RUN_RESOLVED",
      result: successfulRun({
        requestId: "old-request",
        sourceRevision: 0,
        stdout: "STALE\n",
      }),
    });

    const protectedSnapshot = actor.getSnapshot();
    expect(protectedSnapshot.stage).toBe("first-run");
    expect(protectedSnapshot.source).toBe('print("Current source")');
    expect(protectedSnapshot.sourceRevision).toBe(1);
    expect(protectedSnapshot.lastExecution).toBeUndefined();
    expect(protectedSnapshot.statusMessage).toMatch(/older run result was ignored/i);
    actor.stop();
  });

  it("preserves broken source through error feedback and resets only on explicit reset", () => {
    const actor = startedActor();
    actor.send({ type: "BEGIN" });
    evaluateActiveRun(actor, successfulRun());
    actor.send({ type: "CONTINUE" });
    actor.send({
      type: "SOURCE_CHANGED",
      source: 'print("Personalized")',
      sourceRevision: 1,
    });
    evaluateActiveRun(
      actor,
      successfulRun({
        requestId: "personalize-2",
        taskId: "personalize",
        sourceRevision: 1,
        stdout: "Personalized\n",
      }),
    );
    actor.send({ type: "CONTINUE" });
    actor.send({ type: "PREDICTION_SUBMITTED", prediction: "not-sure" });
    actor.send({ type: "TRACE_ADVANCED" });
    actor.send({ type: "TRACE_ADVANCED" });
    expect(actor.getSnapshot()).toMatchObject({ stage: "trace", traceStep: 2 });
    actor.send({ type: "CONTINUE" });

    const brokenSource = actor.getSnapshot().source;
    evaluateActiveRun(
      actor,
      unmatchedQuoteRun({
        requestId: "error-2",
        sourceRevision: actor.getSnapshot().sourceRevision,
      }),
    );
    expect(actor.getSnapshot()).toMatchObject({
      stage: "error-feedback",
      source: brokenSource,
    });

    const revisionBeforeReset = actor.getSnapshot().sourceRevision;
    actor.send({ type: "RESET" });
    expect(actor.getSnapshot()).toMatchObject({
      stage: "briefing",
      source: FIRST_CONTACT_MISSION.starterSource,
      sourceRevision: revisionBeforeReset + 1,
      completed: false,
    });
    actor.stop();
  });

  it("pauses, stops, and resumes to the exact actionable stage", () => {
    const actor = startedActor();
    actor.send({ type: "BEGIN" });
    actor.send({
      type: "SOURCE_CHANGED",
      source: 'print("Still here")',
      sourceRevision: 1,
    });
    actor.send({ type: "PAUSE" });

    expect(actor.getSnapshot()).toMatchObject({
      stage: "paused",
      resumeStage: "first-run",
      source: 'print("Still here")',
    });
    actor.send({ type: "RESUME" });
    expect(actor.getSnapshot()).toMatchObject({
      stage: "first-run",
      source: 'print("Still here")',
    });

    actor.send({ type: "CHOOSE_STOP" });
    expect(actor.getSnapshot()).toMatchObject({
      stage: "stopped",
      resumeStage: "first-run",
    });
    actor.send({ type: "CHOOSE_CONTINUE" });
    expect(actor.getSnapshot().stage).toBe("first-run");
    actor.stop();
  });

  it("restores a compatible snapshot and rejects a different Mission version", () => {
    const source = startedActor();
    source.send({ type: "BEGIN" });
    source.send({
      type: "SOURCE_CHANGED",
      source: 'print("Saved source")',
      sourceRevision: 5,
    });
    const saved = source.getSnapshot();

    const restored = startedActor();
    restored.send({ type: "RESTORE", snapshot: saved });
    expect(restored.getSnapshot()).toMatchObject({
      stage: "first-run",
      source: 'print("Saved source")',
      sourceRevision: 5,
    });

    restored.send({
      type: "RESTORE",
      snapshot: { ...saved, missionVersion: "incompatible-version" },
    });
    expect(restored.getSnapshot()).toMatchObject({
      stage: "first-run",
      source: 'print("Saved source")',
      sourceRevision: 5,
    });
    expect(restored.getSnapshot().statusMessage).toMatch(/did not match this mission version/i);

    source.stop();
    restored.stop();
  });
});
