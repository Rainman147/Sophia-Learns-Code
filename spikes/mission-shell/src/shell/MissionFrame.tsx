"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ExperienceVariant, MissionDefinition, MissionSnapshot, RuntimeStatus } from "../contracts";
import { MissionProgress } from "./MissionPanels";
import styles from "./shell.module.css";

interface MissionFrameProps {
  readonly variant: ExperienceVariant;
  readonly definition: MissionDefinition;
  readonly snapshot: MissionSnapshot;
  readonly runtimeStatus: RuntimeStatus;
  readonly liveAnnouncement: string;
  readonly editor: ReactNode;
  readonly scene: ReactNode;
  readonly coach: ReactNode;
  readonly onStop: () => void;
  readonly onReset: () => void;
  readonly onExport: () => void;
}

export function MissionFrame({
  variant,
  definition,
  snapshot,
  runtimeStatus,
  liveAnnouncement,
  editor,
  scene,
  coach,
  onStop,
  onReset,
  onExport,
}: MissionFrameProps) {
  return (
    <main
      className={styles.missionPage}
      data-testid="mission-shell"
      data-variant={variant}
      data-stage={snapshot.stage}
      data-runtime-mode={snapshot.runtimeMode}
      data-source-revision={snapshot.sourceRevision}
    >
      <header className={styles.missionTopBar}>
        <Link className={styles.compactIdentity} href="/" aria-label="Return to controlled comparison index">
          <span aria-hidden="true">S</span>
          <span>
            <small>Python Investigator</small>
            <strong>Mission Shell Spike</strong>
          </span>
        </Link>
        <nav className={styles.variantNav} aria-label="Switch controlled variant">
          <Link aria-current={variant === "direct" ? "page" : undefined} href="/direct/">A · Direct</Link>
          <Link aria-current={variant === "operations" ? "page" : undefined} href="/operations/">B · Operations</Link>
        </nav>
        <div className={styles.utilityActions}>
          <span
            className={runtimeStatus.phase === "failed" ? styles.runtimeFailed : styles.runtimeStatus}
            data-testid="runtime-status"
            data-runtime-mode={runtimeStatus.runtimeMode}
            data-runtime-phase={runtimeStatus.phase}
            data-worker-generation={runtimeStatus.workerGeneration}
            data-runtime-detail={runtimeStatus.detail ?? ""}
          >
            <span aria-hidden="true" />
            {runtimeStatus.runtimeMode === "pyodide" ? "Real Pyodide" : "Scripted route"} · {runtimeStatus.phase}
          </span>
          <button className={styles.ghostButton} type="button" onClick={onExport}>Export</button>
          <button className={styles.ghostButton} type="button" onClick={onReset}>Reset</button>
          <button className={styles.ghostButton} type="button" onClick={onStop}>Stop</button>
        </div>
      </header>

      <section className={styles.missionContext} aria-labelledby="mission-title">
        <div>
          <p className={styles.eyebrow}>Case 001 · The Midnight Badge</p>
          <h1 id="mission-title">Mission 001 · {definition.title}</h1>
          <p>
            {definition.subtitle}.{" "}
            {runtimeStatus.runtimeMode === "pyodide"
              ? definition.primaryCapability
              : "Exercise the deterministic review specimen and distinguish source code from console output."}
          </p>
        </div>
        <MissionProgress definition={definition} snapshot={snapshot} />
      </section>

      <section className={styles.workspaceGrid} aria-label="First Contact workspace">
        <div className={styles.editorRegion}>{editor}</div>
        <div className={styles.sceneRegion}>{scene}</div>
      </section>

      <section className={styles.coachDock} aria-labelledby="current-objective-heading">
        <div className={styles.coachIdentity}>
          <span aria-hidden="true">01</span>
          <div>
            <p className={styles.panelKicker}>Current objective</p>
            <h2 id="current-objective-heading">{stageTitle(snapshot.stage)}</h2>
          </div>
        </div>
        <div className={styles.coachContent}>{coach}</div>
      </section>

      <div className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true" data-testid="mission-live-status">
        {liveAnnouncement}
      </div>
    </main>
  );
}

function stageTitle(stage: MissionSnapshot["stage"]): string {
  const labels: Readonly<Record<MissionSnapshot["stage"], string>> = {
    briefing: "Understand the Case question",
    "first-run": "Send the first Python signal",
    "first-result": "Inspect what changed",
    personalize: "Make the output yours",
    "personalize-result": "Compare source and result",
    prediction: "Predict the two-line sequence",
    trace: "Inspect execution order",
    "create-error": "Read an intentional syntax clue",
    "error-feedback": "Use calm recovery evidence",
    repair: "Repair the unmatched quote",
    "repair-result": "Confirm the repaired signal",
    "field-test": "Complete a fresh Field Test",
    "field-result": "Inspect independent evidence",
    debrief: "Explain what Python caused",
    reward: "Review capability evidence",
    complete: "Choose the next action",
    paused: "Mission paused safely",
    stopped: "Mission stopped at a clean boundary",
  };
  return labels[stage];
}
