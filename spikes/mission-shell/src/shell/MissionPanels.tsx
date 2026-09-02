"use client";

import type { MissionDefinition, MissionSnapshot, RuntimeMode, TaskResult } from "../contracts";
import styles from "./shell.module.css";

export function MissionProgress({ definition, snapshot }: { readonly definition: MissionDefinition; readonly snapshot: MissionSnapshot }) {
  const current = Math.max(0, definition.stageOrder.indexOf(snapshot.stage));
  const percent = snapshot.completed ? 100 : Math.round((current / Math.max(1, definition.stageOrder.length - 1)) * 100);

  return (
    <div className={styles.progressWrap} aria-label={`Mission progress: ${percent}%`}>
      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <span>{percent}%</span>
    </div>
  );
}

export function FeedbackPacket({ result }: { readonly result: TaskResult }) {
  const fields = [
    ["Goal", result.goal],
    ["Observed", result.observed],
    ["Clue", result.clue],
    ["Next action", result.nextAction],
  ] as const;

  return (
    <section className={styles.feedbackPacket} aria-labelledby="feedback-heading" data-testid="feedback-packet">
      <header>
        <p className={styles.panelKicker}>Calm recovery</p>
        <h3 id="feedback-heading">Treat the error as evidence</h3>
      </header>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

interface PredictionPanelProps {
  readonly value: MissionSnapshot["prediction"];
  readonly onChange: (value: NonNullable<MissionSnapshot["prediction"]>) => void;
  readonly onSubmit: () => void;
}

export function PredictionPanel({ value, onChange, onSubmit }: PredictionPanelProps) {
  return (
    <form
      className={styles.choicePanel}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <fieldset>
        <legend>Predict the result before revealing it</legend>
        <label>
          <input
            type="radio"
            name="prediction"
            checked={value === "two-lines-console-first"}
            onChange={() => onChange("two-lines-console-first")}
          />
          Two lines, with “Console online” first
        </label>
        <label>
          <input
            type="radio"
            name="prediction"
            checked={value === "other"}
            onChange={() => onChange("other")}
          />
          A different result
        </label>
        <label>
          <input
            type="radio"
            name="prediction"
            checked={value === "not-sure"}
            onChange={() => onChange("not-sure")}
          />
          Not sure yet
        </label>
      </fieldset>
      <button className={styles.primaryButton} type="submit" disabled={!value}>
        Lock prediction
      </button>
    </form>
  );
}

export function TracePanel({ step, onAdvance }: { readonly step: 0 | 1 | 2; readonly onAdvance: () => void }) {
  const descriptions = [
    "Ready. No source line has executed and the console is empty.",
    "Step 1 of 2. Python reads line 1 and sends “Console online” to output.",
    "Step 2 of 2. Python reads line 2 and adds “Case ready” below the first line.",
  ] as const;

  return (
    <section className={styles.tracePanel} aria-labelledby="trace-heading">
      <div className={styles.traceHeader}>
        <div>
          <p className={styles.panelKicker}>Computer&apos;s Mind · preview</p>
          <h3 id="trace-heading">Two-line execution sequence</h3>
        </div>
        <span>Step {step} / 2</span>
      </div>
      <ol className={styles.traceCode}>
        <li className={step === 1 ? styles.activeTraceLine : undefined}>
          <code>print(&quot;Console online&quot;)</code>
          <span>{step >= 1 ? "Output line 1" : "Waiting"}</span>
        </li>
        <li className={step === 2 ? styles.activeTraceLine : undefined}>
          <code>print(&quot;Case ready&quot;)</code>
          <span>{step >= 2 ? "Output line 2" : "Waiting"}</span>
        </li>
      </ol>
      <p className={styles.traceDescription} aria-live="polite" aria-atomic="true">{descriptions[step]}</p>
      <button className={styles.primaryButton} type="button" onClick={onAdvance}>
        {step < 2 ? "Step forward" : "Continue to the controlled clue"}
      </button>
    </section>
  );
}

export function RewardPanel({
  runtimeMode,
  onContinue,
  onStop,
}: {
  readonly runtimeMode: RuntimeMode;
  readonly onContinue: () => void;
  readonly onStop: () => void;
}) {
  return (
    <section className={styles.rewardPanel} aria-labelledby="reward-heading" data-testid="reward-panel">
      <div className={styles.rewardGlyph} aria-hidden="true"><span>01</span></div>
      <div>
        <p className={styles.eyebrow}>Capability evidence recorded</p>
        <h3 id="reward-heading">First Python signal · Introduced</h3>
        <p>
          {runtimeMode === "pyodide" ? "You ran real Python" : "You exercised the deterministic scripted route"},
          distinguished source from output, repaired an unmatched quote, and passed a fresh Field Test.
        </p>
        <ul className={styles.evidenceList}>
          <li><span aria-hidden="true">✓</span> Verified execution result</li>
          <li><span aria-hidden="true">✓</span> Calm syntax recovery</li>
          <li><span aria-hidden="true">✓</span> Fresh reduced-support output</li>
        </ul>
        <p className={styles.rewardNote}>This is evidence of an introduced capability, not a claim of durable mastery.</p>
        <div className={styles.buttonRow}>
          <button className={styles.primaryButton} type="button" onClick={onContinue}>Continue</button>
          <button className={styles.secondaryButton} type="button" onClick={onStop}>Stop here</button>
        </div>
      </div>
    </section>
  );
}
