"use client";

import type { NormalizedExecutionError, RunResult, SceneProjection } from "../contracts";
import styles from "./shell.module.css";

interface CaseSceneProps {
  readonly projection: SceneProjection;
  readonly execution: RunResult | undefined;
  readonly running: boolean;
  readonly runtimeLabel: string;
}

export function CaseScene({ projection, execution, running, runtimeLabel }: CaseSceneProps) {
  return (
    <section className={styles.scenePanel} aria-labelledby="scene-heading" data-testid="case-scene" data-state={projection.state}>
      <header className={styles.panelHeader}>
        <div>
          <p className={styles.panelKicker}>Live Case Result</p>
          <h2 id="scene-heading">Investigation signal</h2>
        </div>
        <span className={projection.state === "online" ? styles.statusOnline : styles.statusQuiet}>
          {projection.state === "online" ? "Online" : "Awaiting Python"}
        </span>
      </header>

      <div className={styles.sceneVisual} aria-hidden="true">
        <svg viewBox="0 0 560 220">
          <defs>
            <linearGradient id="signal-path" x1="0" x2="1">
              <stop offset="0" stopColor="#7de6d5" stopOpacity="0.18" />
              <stop offset="0.52" stopColor="#7de6d5" />
              <stop offset="1" stopColor="#f2c879" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <rect className={styles.sceneNode} x="24" y="58" width="166" height="104" rx="14" />
          <text className={styles.sceneLabel} x="46" y="91">SOURCE</text>
          <text className={styles.sceneCode} x="46" y="126">print(&quot;…&quot;)</text>
          <path className={projection.state === "online" ? styles.scenePathActive : styles.scenePath} d="M198 110H359" />
          <circle className={projection.state === "online" ? styles.scenePacketActive : styles.scenePacket} cx="278" cy="110" r="8" />
          <rect className={projection.state === "online" ? styles.sceneNodeActive : styles.sceneNode} x="368" y="58" width="166" height="104" rx="14" />
          <text className={styles.sceneLabel} x="390" y="91">CASE SIGNAL</text>
          <text className={styles.sceneCode} x="390" y="126">{projection.state === "online" ? "VERIFIED" : "WAITING"}</text>
        </svg>
      </div>

      <div className={styles.sceneNarrative}>
        <p className={styles.eyebrow}>{projection.eyebrow}</p>
        <h3>{projection.heading}</h3>
        <p>{projection.detail}</p>
        <p className={styles.textEquivalent}>
          <span>Text equivalent</span>
          {projection.textEquivalent}
        </p>
      </div>

      <div className={styles.consoleBlock}>
        <div className={styles.consoleHeader}>
          <span>Investigation Console output</span>
          <span>{running ? "Executing…" : runtimeLabel}</span>
        </div>
        <pre
          aria-label="Investigation Console output"
          data-testid="console-output"
          data-execution-status={execution?.status ?? "none"}
          data-source-revision={execution?.sourceRevision ?? ""}
          data-request-id={execution?.requestId ?? ""}
          data-initialize-ms={execution?.metrics.initializeMs ?? ""}
          data-execute-ms={execution?.metrics.executeMs ?? ""}
          data-total-ms={execution?.metrics.totalMs ?? ""}
          data-worker-generation={execution?.metrics.workerGeneration ?? ""}
        >
          {running ? "Python is evaluating this revision…" : execution?.stdout || "No output yet."}
        </pre>
        {execution?.error ? <ExecutionError error={execution.error} /> : null}
      </div>
    </section>
  );
}

function ExecutionError({ error }: { readonly error: NormalizedExecutionError }) {
  return (
    <div className={styles.inlineError} role="group" aria-labelledby="execution-clue-title">
      <span aria-hidden="true">!</span>
      <div>
        <strong id="execution-clue-title">Python returned a clue</strong>
        <p>{error.learnerMessage}</p>
        {error.line ? <small>Line {error.line}{error.column ? `, column ${error.column}` : ""}</small> : null}
      </div>
    </div>
  );
}
