import { describe, expect, it } from "vitest";
import { applyCaseEvents, createSceneRenderer } from "../../src/case";
import { FIRST_CONTACT_MISSION } from "../../src/content/first-contact";
import type {
  EvidenceEvent,
  PersistedMissionSession,
  RunRequest,
} from "../../src/contracts";
import { initialCaseState } from "../../src/contracts";
import { createMemoryEvidenceStore } from "../../src/evidence";
import { createScriptedExecutionRuntime } from "../../src/execution";
import { createMissionActor } from "../../src/mission";
import { createMissionEvaluator } from "../../src/truth";

describe("integrated stable seams", () => {
  it("turns one versioned execution into Mission truth, semantic Case state, scene, and local evidence", async () => {
    const occurredAt = "2026-09-01T12:00:00.000Z";
    const runtime = createScriptedExecutionRuntime();
    const actor = createMissionActor(FIRST_CONTACT_MISSION, "scripted");
    const evaluator = createMissionEvaluator({ now: () => occurredAt });
    const renderer = createSceneRenderer();
    const evidenceStore = createMemoryEvidenceStore({ now: () => occurredAt });

    actor.start();
    actor.send({ type: "BEGIN" });
    const runnable = actor.getSnapshot();
    if (!runnable.activeTaskId) throw new Error("First run task was not active.");

    const request = {
      requestId: "integrated-first-run",
      missionId: runnable.missionId,
      missionVersion: runnable.missionVersion,
      taskId: runnable.activeTaskId,
      runtimeMode: runnable.runtimeMode,
      source: runnable.source,
      sourceRevision: runnable.sourceRevision,
      timeoutMs: 4_000,
      maxOutputBytes: 16_384,
    } satisfies RunRequest;

    actor.send({ type: "RUN_REQUESTED", requestId: request.requestId });
    const execution = await runtime.run(request);
    actor.send({ type: "RUN_RESOLVED", result: execution });
    const outcome = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      request.taskId,
      execution,
    );
    actor.send({ type: "TASK_EVALUATED", taskResult: outcome.taskResult });

    const caseState = applyCaseEvents(initialCaseState(), outcome.caseEvents);
    const projection = renderer.project(caseState, { motionPreference: "reduced" });
    const mission = actor.getSnapshot();
    expect(mission).toMatchObject({
      stage: "first-result",
      source: request.source,
      sourceRevision: request.sourceRevision,
      canContinue: true,
      lastExecution: {
        requestId: request.requestId,
        stdout: "Hello, Sophia!\n",
      },
      lastTaskResult: { passed: true },
    });
    expect(caseState.consoleStatus).toBe("online");
    expect(projection).toMatchObject({
      state: "online",
      motionCue: "none",
    });
    expect(projection.textEquivalent).toMatch(/Console status: online/i);

    const evidence = {
      id: `evidence-v1:${request.taskId}:${request.sourceRevision}`,
      type: "evidence_recorded",
      occurredAt,
      missionId: request.missionId,
      missionVersion: request.missionVersion,
      taskResult: outcome.taskResult,
      runtimeMode: request.runtimeMode,
      supportLevel: "full",
      privacy: "local-synthetic",
    } satisfies EvidenceEvent;
    const session = {
      schemaVersion: 1,
      missionId: mission.missionId,
      missionVersion: mission.missionVersion,
      variant: "direct",
      stage: mission.stage,
      runtimeMode: mission.runtimeMode,
      source: mission.source,
      sourceRevision: mission.sourceRevision,
      caseState,
      updatedAt: occurredAt,
    } satisfies PersistedMissionSession;

    await evidenceStore.append(evidence);
    await evidenceStore.saveSession(session);
    expect(await evidenceStore.load()).toEqual({
      schemaVersion: 1,
      events: [evidence],
      session,
    });

    evidenceStore.close();
    runtime.dispose();
    actor.stop();
  });

  it("keeps a failed execution out of Case state and preserves the exact source for repair", async () => {
    const runtime = createScriptedExecutionRuntime();
    const actor = createMissionActor(FIRST_CONTACT_MISSION, "scripted");
    const evaluator = createMissionEvaluator();
    actor.start();
    actor.send({ type: "BEGIN" });

    const brokenSource = 'print("Hello, Sophia!)';
    actor.send({
      type: "SOURCE_CHANGED",
      source: brokenSource,
      sourceRevision: 1,
    });
    const snapshot = actor.getSnapshot();
    if (!snapshot.activeTaskId) throw new Error("First run task was not active.");
    const request = {
      requestId: "integrated-error",
      missionId: snapshot.missionId,
      missionVersion: snapshot.missionVersion,
      taskId: snapshot.activeTaskId,
      runtimeMode: snapshot.runtimeMode,
      source: snapshot.source,
      sourceRevision: snapshot.sourceRevision,
      timeoutMs: 4_000,
      maxOutputBytes: 16_384,
    } satisfies RunRequest;

    actor.send({ type: "RUN_REQUESTED", requestId: request.requestId });
    const execution = await runtime.run(request);
    actor.send({ type: "RUN_RESOLVED", result: execution });
    const outcome = evaluator.evaluate(FIRST_CONTACT_MISSION, request.taskId, execution);
    actor.send({ type: "TASK_EVALUATED", taskResult: outcome.taskResult });

    expect(execution.error?.code).toBe("unmatched-quote");
    expect(actor.getSnapshot()).toMatchObject({
      source: brokenSource,
      sourceRevision: 1,
      canContinue: false,
    });
    expect(outcome.caseEvents).toEqual([]);
    expect(applyCaseEvents(initialCaseState(), outcome.caseEvents)).toEqual(
      initialCaseState(),
    );

    runtime.dispose();
    actor.stop();
  });
});
