"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { applyCaseEvents, createSceneRenderer } from "../case";
import { FIRST_CONTACT_MISSION } from "../content/first-contact";
import type {
  CaseState,
  EditorDecoration,
  EditorDiagnostic,
  EvidenceEvent,
  EvidenceStore,
  ExperienceVariant,
  MissionActor,
  MissionSnapshot,
  MissionStage,
  MotionPreference,
  PersistedMissionSession,
  RunRequest,
  RunResult,
  RuntimeMode,
  RuntimeStatus,
  SourceChange,
  TaskResult,
} from "../contracts";
import {
  EXECUTION_LIMITS,
  initialCaseState,
} from "../contracts";
import { GuidedEditor } from "../editor";
import { createEvidenceStore, createMemoryEvidenceStore } from "../evidence";
import {
  RUNTIME_CANCELLATION_FIXTURE_SOURCE,
  RUNTIME_CANCELLATION_FIXTURE_TASK_ID,
  createPyodideExecutionRuntime,
  createScriptedExecutionRuntime,
} from "../execution";
import { createMissionActor } from "../mission";
import { createMissionEvaluator } from "../truth";
import { CaseScene } from "../shell/CaseScene";
import { DirectCompletion, PausedMission } from "../shell/EndStates";
import { MissionFrame } from "../shell/MissionFrame";
import {
  FeedbackPacket,
  PredictionPanel,
  RewardPanel,
  TracePanel,
} from "../shell/MissionPanels";
import { OperationsCenter } from "../shell/OperationsCenter";
import styles from "../shell/shell.module.css";

interface FirstContactExperienceProps {
  readonly variant: ExperienceVariant;
}

interface RouteConfiguration {
  readonly runtimeMode: RuntimeMode;
  readonly measurement: boolean;
}

interface Resources {
  readonly actor: MissionActor;
  readonly runtime: ReturnType<typeof createPyodideExecutionRuntime>;
  store: EvidenceStore;
}

const RESULT_STAGES = new Set<MissionStage>([
  "first-result",
  "personalize-result",
  "error-feedback",
  "repair-result",
  "field-result",
]);

const RUNNABLE_STAGES = new Set<MissionStage>([
  "first-run",
  "first-result",
  "personalize",
  "personalize-result",
  "create-error",
  "error-feedback",
  "repair",
  "repair-result",
  "field-test",
  "field-result",
]);

export function FirstContactExperience({ variant }: FirstContactExperienceProps) {
  const search = useSyncExternalStore(subscribeToLocation, readLocationSearch, () => null);
  const configuration = useMemo(() => routeConfiguration(search), [search]);

  if (!configuration) {
    return (
      <main className={styles.loadingShell} aria-busy="true">
        <p className={styles.eyebrow}>Mission Shell Spike</p>
        <h1>Preparing the controlled First Contact route…</h1>
      </main>
    );
  }

  return (
    <ConfiguredFirstContactExperience
      key={`${variant}:${configuration.runtimeMode}:${String(configuration.measurement)}`}
      variant={variant}
      configuration={configuration}
    />
  );
}

function ConfiguredFirstContactExperience({
  variant,
  configuration,
}: FirstContactExperienceProps & { readonly configuration: RouteConfiguration }) {
  const [snapshot, setSnapshot] = useState<MissionSnapshot | null>(null);
  const [caseState, setCaseState] = useState<CaseState>(() => initialCaseState());
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null);
  const [displayExecution, setDisplayExecution] = useState<RunResult>();
  const [hydrated, setHydrated] = useState(false);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [missionOpen, setMissionOpen] = useState(variant === "direct");
  const [reviewMode, setReviewMode] = useState(false);
  const [prediction, setPrediction] = useState<MissionSnapshot["prediction"]>();
  const [liveAnnouncement, setLiveAnnouncement] = useState(
    "Preparing the controlled mission shell.",
  );
  const [persistenceMode, setPersistenceMode] = useState<"indexed-db" | "memory">(
    "indexed-db",
  );
  const [motionPreference, setMotionPreference] = useState<MotionPreference>("full");
  const resourcesRef = useRef<Resources | null>(null);
  const hydratedRef = useRef(false);
  const caseStateRef = useRef(caseState);
  const runSequenceRef = useRef(0);

  const evaluator = useMemo(() => createMissionEvaluator(), []);
  const sceneRenderer = useMemo(() => createSceneRenderer(), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionPreference(media.matches ? "reduced" : "full");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [missionOpen, snapshot?.completed]);

  useEffect(() => {
    let active = true;
    const actor = createMissionActor(FIRST_CONTACT_MISSION, configuration.runtimeMode);
    const runtime =
      configuration.runtimeMode === "pyodide"
        ? createPyodideExecutionRuntime()
        : createScriptedExecutionRuntime({ delayMs: 45, initializeDelayMs: 20 });
    const resources: Resources = {
      actor,
      runtime,
      store: createEvidenceStore({
        databaseName: `sophia-mission-shell-${variant}-${configuration.runtimeMode}`,
      }),
    };
    resourcesRef.current = resources;

    const unsubscribeActor = actor.subscribe((nextSnapshot) => {
      if (!active) return;
      setSnapshot(nextSnapshot);
      setLiveAnnouncement(nextSnapshot.statusMessage);
      if (hydratedRef.current) {
        void saveSession(
          resources.store,
          nextSnapshot,
          caseStateRef.current,
          variant,
          configuration.runtimeMode,
        );
      }
    });
    const unsubscribeRuntime = runtime.subscribe((nextStatus) => {
      if (active) setRuntimeStatus(nextStatus);
    });

    actor.start();
    queueMicrotask(() => {
      if (!active) return;
      setSnapshot(actor.getSnapshot());
      setRuntimeStatus(runtime.getStatus());
    });

    const boot = async () => {
      let loaded;
      try {
        loaded = await resources.store.load();
      } catch {
        if (!active) return;
        resources.store.close();
        resources.store = createMemoryEvidenceStore();
        setPersistenceMode("memory");
        loaded = await resources.store.load();
      }
      if (!active) return;

      const session = loaded.session;
      if (
        session?.variant === variant &&
        session.missionId === FIRST_CONTACT_MISSION.id &&
        session.missionVersion === FIRST_CONTACT_MISSION.version
      ) {
        const restored = restoreSnapshot(session, configuration.runtimeMode);
        caseStateRef.current = session.caseState;
        setCaseState(session.caseState);
        actor.send({ type: "RESTORE", snapshot: restored });
        setHasSavedSession(hasMeaningfulSession(session));
        if (variant === "operations") {
          setMissionOpen(session.stage !== "complete");
        }
      }

      hydratedRef.current = true;
      setHydrated(true);
      await saveSession(
        resources.store,
        actor.getSnapshot(),
        caseStateRef.current,
        variant,
        configuration.runtimeMode,
      );
    };

    void boot();
    void runtime.initialize().catch(() => undefined);

    return () => {
      active = false;
      hydratedRef.current = false;
      unsubscribeActor();
      unsubscribeRuntime();
      actor.stop();
      runtime.dispose();
      resources.store.close();
      if (resourcesRef.current === resources) resourcesRef.current = null;
    };
  }, [configuration.runtimeMode, variant]);

  const updateCaseState = useCallback((next: CaseState) => {
    caseStateRef.current = next;
    setCaseState(next);
  }, []);

  const send = useCallback((event: Parameters<MissionActor["send"]>[0]) => {
    resourcesRef.current?.actor.send(event);
  }, []);

  const handleSourceChange = useCallback((change: SourceChange) => {
    if (change.origin !== "learner") return;
    const resources = resourcesRef.current;
    if (!resources) return;

    resources.actor.send({
      type: "SOURCE_CHANGED",
      source: change.source,
      sourceRevision: change.sourceRevision,
    });
    if (resources.runtime.getStatus().phase === "running") {
      void resources.runtime.cancel("superseded").catch(() => undefined);
    }
  }, []);

  const handleRun = useCallback(async () => {
    const resources = resourcesRef.current;
    if (!resources) return;
    const beforeRun = resources.actor.getSnapshot();
    if (!beforeRun.activeTaskId || !RUNNABLE_STAGES.has(beforeRun.stage)) return;

    const requestId = `run-${Date.now()}-${++runSequenceRef.current}`;
    const taskId =
      configuration.measurement &&
      beforeRun.source.trim() === RUNTIME_CANCELLATION_FIXTURE_SOURCE
        ? RUNTIME_CANCELLATION_FIXTURE_TASK_ID
        : beforeRun.activeTaskId;
    const request: RunRequest = {
      requestId,
      missionId: FIRST_CONTACT_MISSION.id,
      missionVersion: FIRST_CONTACT_MISSION.version,
      taskId,
      source: beforeRun.source,
      sourceRevision: beforeRun.sourceRevision,
      runtimeMode: configuration.runtimeMode,
      timeoutMs: EXECUTION_LIMITS.defaultTimeoutMs,
      maxOutputBytes: EXECUTION_LIMITS.maxOutputBytes,
    };

    resources.actor.send({ type: "RUN_REQUESTED", requestId });
    const result = await resources.runtime.run(request);
    const current = resources.actor.getSnapshot();
    if (result.sourceRevision !== current.sourceRevision) {
      setLiveAnnouncement(
        "An older run result was ignored because the source has a newer revision.",
      );
      return;
    }

    setDisplayExecution(result);
    resources.actor.send({ type: "RUN_RESOLVED", result });
    const accepted = resources.actor.getSnapshot();
    if (accepted.lastExecution?.requestId !== result.requestId) return;

    const outcome = evaluator.evaluate(
      FIRST_CONTACT_MISSION,
      beforeRun.activeTaskId,
      result,
    );
    const nextCaseState = applyCaseEvents(caseStateRef.current, outcome.caseEvents);
    updateCaseState(nextCaseState);
    resources.actor.send({ type: "TASK_EVALUATED", taskResult: outcome.taskResult });

    const event = evidenceEvent(
      outcome.taskResult,
      beforeRun.activeTaskId,
      result.sourceRevision,
      configuration.runtimeMode,
    );
    await resources.store.append(event).catch(() => undefined);
    await saveSession(
      resources.store,
      resources.actor.getSnapshot(),
      nextCaseState,
      variant,
      configuration.runtimeMode,
    ).catch(() => undefined);
  }, [configuration.measurement, configuration.runtimeMode, evaluator, updateCaseState, variant]);

  const handleCancel = useCallback(() => {
    const runtime = resourcesRef.current?.runtime;
    if (!runtime) return;
    void runtime.cancel("learner").catch(() => undefined);
  }, []);

  const handleStop = useCallback(() => {
    const resources = resourcesRef.current;
    if (!resources) return;
    if (resources.runtime.getStatus().phase === "running") {
      void resources.runtime.cancel("learner").catch(() => undefined);
    }
    resources.actor.send({ type: "PAUSE" });
  }, []);

  const handleReset = useCallback(async () => {
    const resources = resourcesRef.current;
    if (!resources) return;
    const confirmed = window.confirm(
      "Reset this local spike? This removes the saved Mission session and synthetic evidence on this device.",
    );
    if (!confirmed) return;

    await resources.store.reset();
    const resetCase = initialCaseState();
    updateCaseState(resetCase);
    resources.actor.send({ type: "RESET" });
    setDisplayExecution(undefined);
    setPrediction(undefined);
    setHasSavedSession(false);
    setReviewMode(false);
    setMissionOpen(variant === "direct");
    setLiveAnnouncement("Local Mission state and synthetic evidence were reset.");
    void resources.runtime.reset().catch(() => undefined);
  }, [updateCaseState, variant]);

  const handleExport = useCallback(async () => {
    const store = resourcesRef.current?.store;
    if (!store) return;
    const exported = await store.export();
    const blob = new Blob([`${JSON.stringify(exported, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `first-contact-evidence-${variant}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setLiveAnnouncement("Synthetic local evidence export downloaded.");
  }, [variant]);

  if (!hydrated || !snapshot || !runtimeStatus) {
    return (
      <main className={styles.loadingShell} aria-busy="true">
        <p className={styles.eyebrow}>Mission Shell Spike</p>
        <h1>Restoring local First Contact state…</h1>
      </main>
    );
  }

  if (variant === "operations" && !missionOpen) {
    return (
      <OperationsCenter
        caseState={caseState}
        completed={snapshot.completed}
        hasSavedSession={hasSavedSession}
        runtimeMode={configuration.runtimeMode}
        onEnterMission={() => {
          setReviewMode(snapshot.completed);
          setMissionOpen(true);
        }}
      />
    );
  }

  if (snapshot.stage === "paused" || snapshot.stage === "stopped") {
    return (
      <PausedMission
        onResume={() => send({ type: "RESUME" })}
        onReset={() => void handleReset()}
      />
    );
  }

  if (snapshot.completed && !reviewMode) {
    if (variant === "operations") {
      return (
        <OperationsCenter
          caseState={caseState}
          completed
          hasSavedSession
          runtimeMode={configuration.runtimeMode}
          onEnterMission={() => setReviewMode(true)}
        />
      );
    }
    return (
      <DirectCompletion
        runtimeMode={configuration.runtimeMode}
        onReview={() => setReviewMode(true)}
      />
    );
  }

  const projection = sceneRenderer.project(caseState, { motionPreference });
  const running = runtimeStatus.phase === "running";
  const sourceEditable = isSourceEditable(snapshot);
  const readOnly = !sourceEditable;
  const diagnostics = diagnosticsFor(snapshot.source, displayExecution);
  const decorations = decorationsFor(snapshot, displayExecution);
  const task = activeTask(snapshot);

  const editor = (
    <section className={styles.editorCard} aria-labelledby="source-code-heading">
      <header className={styles.editorHeader}>
        <div>
          <p className={styles.panelKicker}>Python source · revision {snapshot.sourceRevision}</p>
          <h2 id="source-code-heading">{task?.title ?? "Investigation Console source"}</h2>
        </div>
        <div className={styles.editorActions}>
          {snapshot.stage === "briefing" ? (
            <button className={styles.primaryButton} type="button" onClick={() => send({ type: "BEGIN" })}>
              Begin Mission
            </button>
          ) : running ? (
            <button className={styles.secondaryButton} type="button" onClick={handleCancel}>
              Cancel run
            </button>
          ) : RUNNABLE_STAGES.has(snapshot.stage) ? (
            <button className={styles.primaryButton} type="button" onClick={() => void handleRun()}>
              Run
            </button>
          ) : null}
        </div>
      </header>
      <div data-testid="source-editor" className={styles.editorSurface}>
        <GuidedEditor
          source={snapshot.source}
          sourceRevision={snapshot.sourceRevision}
          sourceOrigin="mission"
          readOnly={readOnly}
          diagnostics={diagnostics}
          decorations={decorations}
          instructions={editorInstructions(snapshot.stage, persistenceMode, sourceEditable)}
          onSourceChange={handleSourceChange}
        />
      </div>
      {configuration.measurement ? (
        <p className={styles.measurementNote}>
          Measurement fixture enabled. The bounded non-terminating specimen is accepted only on this route.
        </p>
      ) : null}
    </section>
  );

  const coach = (
    <MissionCoach
      snapshot={snapshot}
      prediction={prediction}
      taskPrompt={task?.prompt}
      runtimeMode={configuration.runtimeMode}
      onContinue={() => {
        send({ type: "CONTINUE" });
        if (snapshot.stage === "reward" && variant === "operations") {
          setReviewMode(false);
          setMissionOpen(false);
        }
      }}
      onPredictionChange={setPrediction}
      onPredictionSubmit={() => {
        if (prediction) send({ type: "PREDICTION_SUBMITTED", prediction });
      }}
      onTraceAdvance={() =>
        send(snapshot.traceStep < 2 ? { type: "TRACE_ADVANCED" } : { type: "CONTINUE" })
      }
      onRewardStop={() => send({ type: "CHOOSE_STOP" })}
    />
  );

  return (
    <MissionFrame
      variant={variant}
      definition={FIRST_CONTACT_MISSION}
      snapshot={snapshot}
      runtimeStatus={runtimeStatus}
      liveAnnouncement={liveAnnouncement}
      editor={editor}
      scene={
        <CaseScene
          projection={projection}
          execution={displayExecution}
          running={running}
          runtimeLabel={runtimeStatus.runtimeMode === "pyodide" ? "Real Python worker" : "Scripted test route"}
        />
      }
      coach={coach}
      onStop={handleStop}
      onReset={() => void handleReset()}
      onExport={() => void handleExport()}
    />
  );
}

interface CoachOptions {
  readonly snapshot: MissionSnapshot;
  readonly prediction: MissionSnapshot["prediction"];
  readonly taskPrompt: string | undefined;
  readonly runtimeMode: RuntimeMode;
  readonly onContinue: () => void;
  readonly onPredictionChange: (value: NonNullable<MissionSnapshot["prediction"]>) => void;
  readonly onPredictionSubmit: () => void;
  readonly onTraceAdvance: () => void;
  readonly onRewardStop: () => void;
}

function MissionCoach(options: CoachOptions): ReactNode {
  const { snapshot } = options;
  switch (snapshot.stage) {
    case "briefing":
      return (
        <div className={styles.briefingPanel}>
          <p>
            A badge signal is present, but it is not yet evidence. Run one tiny Python instruction to
            bring the Investigation Console online and observe exactly what changed.
          </p>
          <ul>
            <li>Source code is the instruction you can edit.</li>
            <li>Console output is the result Python produces.</li>
            <li>Errors stay calm, local, and recoverable.</li>
          </ul>
        </div>
      );
    case "prediction":
      return (
        <PredictionPanel
          value={options.prediction}
          onChange={options.onPredictionChange}
          onSubmit={options.onPredictionSubmit}
        />
      );
    case "trace":
      return <TracePanel step={snapshot.traceStep} onAdvance={options.onTraceAdvance} />;
    case "debrief":
      return (
        <div className={styles.debriefPanel}>
          <p>
            Your source told Python what to do; Python produced console output; a verified result
            changed the Case. The unmatched quote was a specific clue, not a failure identity.
          </p>
          <button className={styles.primaryButton} type="button" onClick={options.onContinue}>
            Continue
          </button>
        </div>
      );
    case "reward":
      return (
        <RewardPanel
          runtimeMode={options.runtimeMode}
          onContinue={options.onContinue}
          onStop={options.onRewardStop}
        />
      );
    case "complete":
      return (
        <div className={styles.resultSummary}>
          <p>Mission evidence is complete. Review is available; no next Mission starts automatically.</p>
        </div>
      );
    default:
      return (
        <div className={styles.coachStack}>
          {options.taskPrompt ? <p>{options.taskPrompt}</p> : null}
          {snapshot.lastTaskResult ? (
            <>
              <p className={styles.evidenceBadge}>
                Evidence level: {snapshot.lastTaskResult.evidenceLevel}
              </p>
              <FeedbackPacket result={snapshot.lastTaskResult} />
            </>
          ) : null}
          {RESULT_STAGES.has(snapshot.stage) && snapshot.canContinue ? (
            <button className={styles.primaryButton} type="button" onClick={options.onContinue}>
              Continue
            </button>
          ) : (
            <p className={styles.runPrompt}>
              {RESULT_STAGES.has(snapshot.stage)
                ? "Revise the source or run this step again; your current source is preserved."
                : "Use Run when your source matches the objective."}
            </p>
          )}
        </div>
      );
  }
}

function subscribeToLocation(listener: () => void): () => void {
  window.addEventListener("popstate", listener);
  return () => window.removeEventListener("popstate", listener);
}

function readLocationSearch(): string {
  return window.location.search;
}

function routeConfiguration(search: string | null): RouteConfiguration | null {
  if (search === null) return null;
  const parameters = new URLSearchParams(search);
  return {
    runtimeMode: parameters.get("runtime") === "scripted" ? "scripted" : "pyodide",
    measurement: parameters.get("measurement") === "1",
  };
}

function activeTask(snapshot: MissionSnapshot) {
  return FIRST_CONTACT_MISSION.tasks.find((task) => task.id === snapshot.activeTaskId);
}

function isEditableStage(stage: MissionStage): boolean {
  return RUNNABLE_STAGES.has(stage);
}

function isSourceEditable(snapshot: MissionSnapshot): boolean {
  return isEditableStage(snapshot.stage) || (RESULT_STAGES.has(snapshot.stage) && !snapshot.canContinue);
}

function editorInstructions(
  stage: MissionStage,
  persistence: "indexed-db" | "memory",
  sourceEditable: boolean,
): string {
  const persistenceText =
    persistence === "indexed-db"
      ? "Source is saved locally on this device."
      : "IndexedDB was unavailable, so this tab uses temporary memory storage.";
  if (stage === "field-test") {
    return `Fresh Field Test: create the requested output without a solution hint. ${persistenceText}`;
  }
  if (!sourceEditable) {
    return `This source is read-only during the current reasoning step. ${persistenceText}`;
  }
  return `Edit Python here. Tab moves to the next control; use Run to execute deliberately. ${persistenceText}`;
}

function diagnosticsFor(
  source: string,
  execution: RunResult | undefined,
): readonly EditorDiagnostic[] {
  if (!execution?.error) return [];
  const from = Math.max(0, Math.min(source.length - 1, source.lastIndexOf('"')));
  return [
    {
      id: `${execution.requestId}:diagnostic`,
      range: { from, to: Math.min(source.length, from + 1) },
      severity: "error",
      message: execution.error.learnerMessage,
    },
  ];
}

function decorationsFor(
  snapshot: MissionSnapshot,
  execution: RunResult | undefined,
): readonly EditorDecoration[] {
  if (execution?.error) {
    return [
      {
        id: `${execution.requestId}:clue`,
        range: { from: 0, to: snapshot.source.length },
        kind: "error-clue",
        label: "Python clue",
      },
    ];
  }
  if (snapshot.stage === "trace" && snapshot.traceStep > 0) {
    const firstLineEnd = snapshot.source.indexOf("\n");
    const from = snapshot.traceStep === 1 ? 0 : Math.max(0, firstLineEnd + 1);
    const to = snapshot.traceStep === 1 && firstLineEnd >= 0 ? firstLineEnd : snapshot.source.length;
    return [
      {
        id: `trace-${snapshot.traceStep}`,
        range: { from, to },
        kind: "active-line",
        label: `Trace step ${snapshot.traceStep}`,
      },
    ];
  }
  return [];
}

function evidenceEvent(
  taskResult: TaskResult,
  taskId: string,
  sourceRevision: number,
  runtimeMode: RuntimeMode,
): EvidenceEvent {
  const supportLevel: EvidenceEvent["supportLevel"] =
    taskId === "field-test" ? "none" : taskId === "first-run" ? "full" : "guided";
  return {
    id: `evidence-v1:${FIRST_CONTACT_MISSION.id}:${taskId}:${sourceRevision}`,
    type: "evidence_recorded",
    occurredAt: new Date().toISOString(),
    missionId: FIRST_CONTACT_MISSION.id,
    missionVersion: FIRST_CONTACT_MISSION.version,
    taskResult,
    runtimeMode,
    supportLevel,
    privacy: "local-synthetic",
  };
}

async function saveSession(
  store: EvidenceStore,
  snapshot: MissionSnapshot,
  caseState: CaseState,
  variant: ExperienceVariant,
  runtimeMode: RuntimeMode,
): Promise<void> {
  const effectiveStage =
    snapshot.stage === "paused" || snapshot.stage === "stopped"
      ? snapshot.resumeStage ?? "briefing"
      : snapshot.stage;
  const session: PersistedMissionSession = {
    schemaVersion: 1,
    missionId: FIRST_CONTACT_MISSION.id,
    missionVersion: FIRST_CONTACT_MISSION.version,
    variant,
    stage: effectiveStage,
    source: snapshot.source,
    sourceRevision: snapshot.sourceRevision,
    runtimeMode,
    caseState,
    updatedAt: new Date().toISOString(),
  };
  await store.saveSession(session);
}

function restoreSnapshot(
  session: PersistedMissionSession,
  runtimeMode: RuntimeMode,
): MissionSnapshot {
  const stage = session.stage === "paused" || session.stage === "stopped" ? "briefing" : session.stage;
  const activeTaskId = taskIdForStage(stage);
  return {
    missionId: FIRST_CONTACT_MISSION.id,
    missionVersion: FIRST_CONTACT_MISSION.version,
    stage,
    source: session.source,
    sourceRevision: session.sourceRevision,
    runtimeMode,
    traceStep: 0,
    statusMessage: "Saved local Mission state restored. Your exact source revision is preserved.",
    canContinue: stage === "debrief" || stage === "reward",
    canStop: stage !== "complete",
    completed: stage === "complete",
    ...(activeTaskId ? { activeTaskId } : {}),
  };
}

function taskIdForStage(stage: MissionStage): string | undefined {
  const editingStage = resultToEditingStage(stage);
  return FIRST_CONTACT_MISSION.tasks.find((task) => task.stage === editingStage)?.id;
}

function resultToEditingStage(stage: MissionStage): MissionStage {
  const resultMap: Partial<Record<MissionStage, MissionStage>> = {
    "first-result": "first-run",
    "personalize-result": "personalize",
    "error-feedback": "create-error",
    "repair-result": "repair",
    "field-result": "field-test",
  };
  return resultMap[stage] ?? stage;
}

function hasMeaningfulSession(session: PersistedMissionSession): boolean {
  return (
    session.stage !== "briefing" ||
    session.source !== FIRST_CONTACT_MISSION.starterSource ||
    session.sourceRevision > 0 ||
    session.caseState.timeline.length > 0
  );
}
