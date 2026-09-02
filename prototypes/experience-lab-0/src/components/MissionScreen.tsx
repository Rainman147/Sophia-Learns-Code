import { getFirstActionSeconds, getStageNumber } from "../experience/machine";
import {
  FIELD_TEST_OUTPUT,
  FIRST_CONTACT,
} from "../experience/mission";
import type {
  ExperienceAction,
  ExperienceState,
  MissionStage,
  PredictionChoice,
} from "../experience/model";
import { CaseResult } from "./CaseResult";
import { FeedbackPacket } from "./FeedbackPacket";
import { InvestigationConsole } from "./InvestigationConsole";

const STAGE_LABELS: Record<MissionStage, string> = {
  "first-run": "First run",
  personalize: "Personalize",
  "personalize-result": "Changed result",
  prediction: "Predict",
  trace: "Inspect",
  "intentional-error": "Create clue",
  repair: "Repair",
  "repair-result": "Restored result",
  "field-test": "Field Test",
  debrief: "Debrief",
};

interface MissionScreenProps {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="button button--primary"
      onClick={onClick}
      disabled={disabled}
      data-primary-action
    >
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

function StageInteraction({ state, dispatch }: MissionScreenProps) {
  const run = () => dispatch({ type: "RUN_SOURCE", now: Date.now() });

  switch (state.stage) {
    case "first-run":
      return (
        <section className="encounter-card" aria-labelledby="encounter-title">
          <p className="encounter-index">Encounter 01 · Establish contact</p>
          <h3 id="encounter-title">Bring the channel online</h3>
          <p>
            One line is waiting in the source area. Run it, then notice what stays
            in the editor and what appears in Console output.
          </p>
          <div className="encounter-action">
            <PrimaryButton onClick={run}>Run message</PrimaryButton>
            <p className="keyboard-note">Keyboard: Tab to Run, then Enter.</p>
          </div>
        </section>
      );
    case "personalize":
      return (
        <section className="encounter-card" aria-labelledby="encounter-title">
          <p className="encounter-index">Encounter 02 · Change the signal</p>
          <h3 id="encounter-title">Make the response yours</h3>
          <p>
            Replace only the words between the quotation marks. Any short, safe
            message is welcome. Then observe the changed result.
          </p>
          {state.feedback && <FeedbackPacket packet={state.feedback} />}
          <div className="encounter-action">
            <PrimaryButton onClick={run}>Run changed message</PrimaryButton>
          </div>
        </section>
      );
    case "personalize-result":
      return (
        <section className="encounter-card encounter-card--success" aria-labelledby="encounter-title">
          <p className="encounter-index">Causal response · Source to result</p>
          <h3 id="encounter-title">Your edit changed the Console</h3>
          <p>
            The source remained in the Investigation Console. The value inside
            <code> print(…)</code> became the output and updated the Case signal.
          </p>
          <div className="causal-equation" aria-label="Source action caused output and case response">
            <span>source edit</span><span aria-hidden="true">→</span>
            <span>console output</span><span aria-hidden="true">→</span>
            <span>case response</span>
          </div>
          <div className="encounter-action">
            <PrimaryButton onClick={() => dispatch({ type: "CONTINUE_STAGE" })}>
              Continue to prediction
            </PrimaryButton>
          </div>
        </section>
      );
    case "prediction":
      return (
        <section className="encounter-card" aria-labelledby="encounter-title">
          <p className="encounter-index">Encounter 03 · Predict before reveal</p>
          <h3 id="encounter-title">What will two lines produce?</h3>
          <p>
            Choose what you expect. “Not sure yet” is useful evidence and never a
            penalty.
          </p>
          <fieldset className="prediction-options">
            <legend className="sr-only">Choose the expected console output</legend>
            {(
              [
                ["two-console-first", "Two lines · Console online appears first"],
                ["two-case-first", "Two lines · Case ready appears first"],
                ["one-line", "One output line"],
                ["not-sure", "Not sure yet"],
              ] as [PredictionChoice, string][]
            ).map(([value, label]) => (
              <label className="prediction-option" key={value}>
                <input
                  type="radio"
                  name="prediction"
                  value={value}
                  checked={state.prediction === value}
                  onChange={() =>
                    dispatch({ type: "SELECT_PREDICTION", choice: value })
                  }
                />
                <span className="prediction-option__marker" aria-hidden="true" />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          <div className="encounter-action">
            <PrimaryButton
              onClick={() => dispatch({ type: "SUBMIT_PREDICTION" })}
              disabled={!state.prediction}
            >
              Lock prediction
            </PrimaryButton>
          </div>
        </section>
      );
    case "trace": {
      const buttonLabel =
        state.traceStep === 0
          ? "Inspect line 1"
          : state.traceStep === 1
            ? "Inspect line 2"
            : "Continue to the clue";
      return (
        <section className="encounter-card mind-card" aria-labelledby="encounter-title">
          <div className="mind-card__heading">
            <div>
              <p className="encounter-index">Computer’s Mind · Text-equivalent trace</p>
              <h3 id="encounter-title">Inspect the execution sequence</h3>
            </div>
            <span className="status-chip">Step {state.traceStep} / 2</span>
          </div>
          <ol className="trace-list">
            <li className={state.traceStep >= 1 ? "is-complete" : "is-current"}>
              <span>1</span>
              <p><strong>Line 1</strong> sends “Console online” to output.</p>
            </li>
            <li className={state.traceStep >= 2 ? "is-complete" : state.traceStep === 1 ? "is-current" : ""}>
              <span>2</span>
              <p><strong>Line 2</strong> adds “Case ready” beneath it.</p>
            </li>
          </ol>
          <p className="trace-summary" aria-live="polite">
            {state.traceStep === 0
              ? "No line inspected yet."
              : state.traceStep === 1
                ? "One source line has produced one output line."
                : "Two source lines produced two output lines in top-to-bottom order."}
          </p>
          <div className="encounter-action">
            <PrimaryButton onClick={() => dispatch({ type: "ADVANCE_TRACE" })}>
              {buttonLabel}
            </PrimaryButton>
          </div>
        </section>
      );
    }
    case "intentional-error":
      return (
        <section className="encounter-card" aria-labelledby="encounter-title">
          <p className="encounter-index">Encounter 04 · Controlled breakage</p>
          <h3 id="encounter-title">Create one clue on purpose</h3>
          <p>
            Remove the final quotation mark immediately after <code>ready</code>.
            Leave the parenthesis in place, then run the clue.
          </p>
          {state.feedback && <FeedbackPacket packet={state.feedback} />}
          <div className="encounter-action">
            <PrimaryButton onClick={run}>Run the clue</PrimaryButton>
          </div>
        </section>
      );
    case "repair":
      return (
        <section className="encounter-card" aria-labelledby="encounter-title">
          <p className="encounter-index">Encounter 05 · Repair</p>
          <h3 id="encounter-title">Restore the message boundary</h3>
          {state.feedback && <FeedbackPacket packet={state.feedback} />}
          <div className="encounter-action">
            <PrimaryButton onClick={run}>Run repaired line</PrimaryButton>
          </div>
        </section>
      );
    case "repair-result":
      return (
        <section className="encounter-card encounter-card--success" aria-labelledby="encounter-title">
          <p className="encounter-index">Recovery verified · No progress lost</p>
          <h3 id="encounter-title">The channel is calm and online again</h3>
          <p>
            <strong>Case ready</strong> appeared because the text once again had a
            beginning and an ending quotation mark. Your repair produced the
            recovery event.
          </p>
          <div className="encounter-action">
            <PrimaryButton onClick={() => dispatch({ type: "CONTINUE_STAGE" })}>
              Begin Field Test
            </PrimaryButton>
          </div>
        </section>
      );
    case "field-test":
      return (
        <section className="encounter-card field-test-card" aria-labelledby="encounter-title">
          <div className="field-test-card__heading">
            <div>
              <p className="encounter-index">Encounter 06 · Reduced support</p>
              <h3 id="encounter-title">Fresh Field Test</h3>
            </div>
            <span className="support-chip">No solution reveal</span>
          </div>
          <p>
            Write one line that sends the exact message <strong>{FIELD_TEST_OUTPUT}</strong> to
            Console output. These are new surface details; the pattern is the same.
          </p>
          {state.feedback && <FeedbackPacket packet={state.feedback} />}
          <div className="encounter-action">
            <PrimaryButton onClick={run}>Submit Field Test</PrimaryButton>
          </div>
        </section>
      );
    case "debrief":
      return null;
  }
}

function Debrief({ state, dispatch }: MissionScreenProps) {
  const firstActionSeconds = getFirstActionSeconds(state);
  return (
    <main className="debrief-screen content-shell" data-screen="debrief">
      <header className="debrief-hero">
        <p className="eyebrow">Case 001 · Mission debrief</p>
        <h1 data-screen-heading tabIndex={-1}>First Contact complete</h1>
        <p className="debrief-hero__lead">
          The Investigation Console is online. This is honest introductory
          evidence—not a mastery claim.
        </p>
      </header>
      <div className="debrief-grid">
        <section className="evidence-card" aria-labelledby="evidence-title">
          <p className="eyebrow">Capability evidence</p>
          <h2 id="evidence-title">First execution · Introduced</h2>
          <ul className="evidence-list">
            {state.evidence.map((item) => (
              <li key={item}><span aria-hidden="true">✓</span>{item}</li>
            ))}
          </ul>
          <p className="evidence-limit">
            Not yet shown: delayed retrieval, far transfer, or independent Python
            work outside this scripted prototype.
          </p>
        </section>
        <section className="reward-card" aria-labelledby="reward-title">
          <div className="reward-mark" aria-hidden="true">⌁</div>
          <p className="eyebrow">Restrained reward</p>
          <h2 id="reward-title">Investigation Console online</h2>
          <p>
            You earned a visible Case capability: one verified message channel and
            a saved one-line artifact.
          </p>
          <span className="status-chip status-chip--verified">Tool available</span>
        </section>
      </div>
      <section className="causality-card" aria-labelledby="causality-title">
        <div>
          <p className="eyebrow">Why the Case changed</p>
          <h2 id="causality-title">Source action → semantic event → Case response</h2>
        </div>
        <ol>
          <li><span>1</span>Your fresh source produced the requested output.</li>
          <li><span>2</span>The prototype evaluator emitted <code>field_test_passed</code>.</li>
          <li><span>3</span>The Case state changed to “Evidence channel verified.”</li>
        </ol>
      </section>
      <aside className="observer-readout" aria-label="Local prototype observer readout">
        <strong>Local engineering readout</strong>
        <span>First code action: {firstActionSeconds ?? "—"}s</span>
        <span>Pre-run navigation steps: {state.metrics.navigationBeforeFirstRun}</span>
        <span>Meaningful actions: {state.metrics.meaningfulActions}</span>
        <small>Local-only instrumentation; not learner evidence.</small>
      </aside>
      <section className="choice-card" aria-labelledby="choice-title">
        <div>
          <p className="eyebrow">Natural boundary</p>
          <h2 id="choice-title">Continue or stop—your choice</h2>
          <p>No next Mission will autoplay.</p>
        </div>
        <div className="button-row">
          <button
            type="button"
            className="button button--quiet"
            onClick={() => dispatch({ type: "STOP" })}
          >
            Stop here
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={() => dispatch({ type: "CONTINUE_AFTER_MISSION" })}
            data-primary-action
          >
            {state.variant === "direct"
              ? "Continue to next-action panel"
              : "Continue to Operations Center"}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export function MissionScreen({ state, dispatch }: MissionScreenProps) {
  if (state.stage === "debrief") {
    return <Debrief state={state} dispatch={dispatch} />;
  }

  const readOnly = ["personalize-result", "prediction", "trace", "repair-result"].includes(
    state.stage,
  );
  const stageNumber = getStageNumber(state.stage);

  return (
    <main className="mission-screen content-shell" data-screen={state.stage}>
      <header className="mission-header">
        <div>
          <p className="eyebrow">Case 001 · The Midnight Badge</p>
          <h1 data-screen-heading tabIndex={-1}>Mission 001 · First Contact</h1>
          <p>{FIRST_CONTACT.objective}</p>
        </div>
        <div className="mission-progress" aria-label={`Mission progress: step ${stageNumber} of ${FIRST_CONTACT.stageOrder.length}`}>
          <span>{String(stageNumber).padStart(2, "0")}</span>
          <div>
            <strong>{STAGE_LABELS[state.stage]}</strong>
            <div className="progress-track" aria-hidden="true">
              <i style={{ width: `${(stageNumber / FIRST_CONTACT.stageOrder.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>
      <section className="case-question" aria-labelledby="case-question-title">
        <span aria-hidden="true">?</span>
        <div>
          <p className="eyebrow">Current Case question</p>
          <h2 id="case-question-title">{FIRST_CONTACT.caseQuestion}</h2>
        </div>
      </section>
      <div className="workspace-grid">
        <InvestigationConsole
          state={state}
          onSourceChange={(source) => dispatch({ type: "EDIT_SOURCE", source })}
          readOnly={readOnly}
        />
        <CaseResult state={state} />
        <StageInteraction state={state} dispatch={dispatch} />
      </div>
    </main>
  );
}
