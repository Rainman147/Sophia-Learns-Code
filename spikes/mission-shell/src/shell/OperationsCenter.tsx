"use client";

import type { CaseState, RuntimeMode } from "../contracts";
import styles from "./shell.module.css";

interface OperationsCenterProps {
  readonly caseState: CaseState;
  readonly completed: boolean;
  readonly hasSavedSession: boolean;
  readonly runtimeMode: RuntimeMode;
  readonly onEnterMission: () => void;
}

export function OperationsCenter({
  caseState,
  completed,
  hasSavedSession,
  runtimeMode,
  onEnterMission,
}: OperationsCenterProps) {
  const primaryLabel = completed
    ? "Review completed Mission"
    : hasSavedSession
      ? "Resume First Contact"
      : "Begin First Contact";

  return (
    <main className={styles.operationsCenter} data-testid="operations-center" data-state={completed ? "after" : "before"}>
      <div className={styles.ambientGrid} aria-hidden="true" />
      <header className={styles.operationsHeader}>
        <div className={styles.identityLockup}>
          <SignalMark active={completed} />
          <div>
            <p className={styles.kicker}>Python Investigator</p>
            <h1>Operations Center</h1>
          </div>
        </div>
        <span className={styles.prototypePill}>Controlled prototype · Variant B</span>
      </header>

      <section className={styles.operationsHero} aria-labelledby="active-case-title">
        <div className={styles.caseInstrument} aria-hidden="true">
          <svg viewBox="0 0 320 320" role="img">
            <circle className={styles.instrumentOuter} cx="160" cy="160" r="132" />
            <circle className={styles.instrumentTrack} cx="160" cy="160" r="98" />
            <path className={styles.instrumentArc} d="M 92 228 A 96 96 0 1 1 228 228" />
            <path className={styles.instrumentCrosshair} d="M160 42v236M42 160h236" />
            <circle className={completed ? styles.instrumentCoreActive : styles.instrumentCore} cx="160" cy="160" r="34" />
            <circle className={styles.instrumentPing} cx="205" cy="112" r="7" />
          </svg>
          <span>{completed ? "Signal verified" : "One signal awaiting review"}</span>
        </div>

        <div className={styles.operationsCopy}>
          <p className={styles.eyebrow}>{completed ? "Case state changed" : "Active Case · 001"}</p>
          <h2 id="active-case-title">{caseState.caseTitle}</h2>
          <p className={styles.lede}>
            {completed
              ? runtimeMode === "pyodide"
                ? "Your verified Python result brought the Investigation Console online. The Case now has its first reproducible signal."
                : "The deterministic review result brought the Investigation Console online with synthetic Case state."
              : "A badge signal arrived after midnight. It is an anomaly—not a conclusion. Bring the Investigation Console online so the evidence can be examined."}
          </p>

          <div className={styles.recommendation}>
            <div>
              <span className={styles.recommendationLabel}>Recommended Mission</span>
              <strong>001 · First Contact</strong>
              <small>{completed ? "Capability evidence available" : "Reason: activate your first investigative tool"}</small>
            </div>
            <button className={styles.primaryButton} type="button" onClick={onEnterMission}>
              {primaryLabel}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className={styles.stationGrid} aria-label="Operations Center status">
        <article className={styles.stationCard}>
          <span className={styles.stationIndex}>01</span>
          <div>
            <p className={styles.cardLabel}>Available tool</p>
            <h3>{caseState.availableTool}</h3>
            <p>
              {completed
                ? runtimeMode === "pyodide"
                  ? "Online · verified by real execution"
                  : "Online · scripted review evidence"
                : "Ready for first activation"}
            </p>
          </div>
          <span className={completed ? styles.statusOnline : styles.statusReady}>
            {completed ? "Online" : "Ready"}
          </span>
        </article>

        <article className={styles.stationCard}>
          <span className={styles.stationIndex}>02</span>
          <div>
            <p className={styles.cardLabel}>Capability evidence</p>
            <h3>First Python signal</h3>
            <p>{completed ? "Introduced · evidence can be inspected" : "No verified evidence yet"}</p>
          </div>
          <span className={completed ? styles.statusOnline : styles.statusQuiet}>
            {completed ? "Recorded" : "Unseen"}
          </span>
        </article>

        <article className={`${styles.stationCard} ${styles.lockedStation}`}>
          <span className={styles.stationIndex}>03</span>
          <div>
            <p className={styles.cardLabel}>Locked possibility</p>
            <h3>{caseState.lockedPossibility}</h3>
            <p>{completed ? "Next: inspect how two lines execute" : "Requirement: activate the console"}</p>
          </div>
          <span className={styles.statusLocked}>Locked</span>
        </article>
      </section>

      <footer className={styles.operationsFooter}>
        <p>One active Case · one recommended Mission · no autoplay</p>
        <p>Local synthetic state only</p>
      </footer>
    </main>
  );
}

function SignalMark({ active }: { readonly active: boolean }) {
  return (
    <svg className={styles.signalMark} viewBox="0 0 48 48" role="img" aria-label="Python Investigator signal mark">
      <path d="M24 4 41 14v20L24 44 7 34V14Z" />
      <circle className={active ? styles.signalMarkCoreActive : styles.signalMarkCore} cx="24" cy="24" r="7" />
      <path d="M12 24h5m14 0h5M24 12v5m0 14v5" />
    </svg>
  );
}
