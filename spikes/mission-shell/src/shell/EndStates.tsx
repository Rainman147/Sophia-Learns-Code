"use client";

import Link from "next/link";
import type { RuntimeMode } from "../contracts";
import styles from "./shell.module.css";

export function DirectCompletion({
  runtimeMode,
  onReview,
}: {
  readonly runtimeMode: RuntimeMode;
  readonly onReview: () => void;
}) {
  return (
    <main className={styles.endState} data-testid="direct-completion">
      <div className={styles.endSignal} aria-hidden="true"><span>✓</span></div>
      <p className={styles.eyebrow}>Mission complete · clean boundary</p>
      <h1>The Investigation Console is online.</h1>
      <p className={styles.endLede}>
        {runtimeMode === "pyodide"
          ? "You used real Python to create a verified Case signal."
          : "You completed the deterministic scripted review path with a synthetic Case signal."}{" "}
        The next possibility is visible, but nothing starts automatically.
      </p>
      <section className={styles.endEvidence} aria-label="Capability evidence summary">
        <div><span>Capability</span><strong>First Python signal</strong></div>
        <div><span>Evidence</span><strong>Introduced</strong></div>
        <div><span>Case change</span><strong>Console online</strong></div>
      </section>
      <div className={styles.buttonRow}>
        <button className={styles.primaryButton} type="button" onClick={onReview}>Review Mission</button>
        <Link className={styles.secondaryLink} href="/">Stop and return later</Link>
      </div>
      <p className={styles.endFootnote}>Progress remains on this device. No account, analytics, or cloud sync is active.</p>
    </main>
  );
}

export function PausedMission({ onResume, onReset }: { readonly onResume: () => void; readonly onReset: () => void }) {
  return (
    <main className={styles.pausedState} data-testid="paused-state">
      <p className={styles.eyebrow}>Mission paused safely</p>
      <h1>Your source code is preserved.</h1>
      <p>Resume when you are ready, or deliberately reset the local experiment.</p>
      <div className={styles.buttonRow}>
        <button className={styles.primaryButton} type="button" onClick={onResume}>Resume Mission</button>
        <button className={styles.secondaryButton} type="button" onClick={onReset}>Reset experiment</button>
        <Link className={styles.secondaryLink} href="/">Leave comparison</Link>
      </div>
    </main>
  );
}
