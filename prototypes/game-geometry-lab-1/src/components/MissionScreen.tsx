import { FIELD_TEST_OUTPUT, FIRST_CONTACT } from "../experience/mission";
import type {
  ExperienceAction,
  ExperienceState,
  PredictionChoice,
} from "../experience/model";
import { CausalityView } from "./CausalityView";
import { CodeSurface } from "./CodeSurface";
import { FeedbackPacket } from "./FeedbackPacket";
import { MissionRhythm } from "./MissionRhythm";

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
      {children} <span aria-hidden="true">→</span>
    </button>
  );
}

const PREDICTION_LABELS: Record<PredictionChoice, string> = {
  "two-console-first": "Two lines · Console online appears first",
  "two-case-first": "Two lines · Case folder ready appears first",
  "one-line": "One output line",
  "not-sure": "Not sure yet",
};

function BeatInteraction({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  const run = () => dispatch({ type: "RUN_SOURCE", now: Date.now() });

  if (state.phase === "complete") {
    return (
      <section className="encounter-sheet encounter-sheet--complete" aria-labelledby="beat-heading">
        <p className="beat-count">Beat 5 of 5 · Prove</p>
        <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Field Test complete</h2>
        <p>
          Your fresh line printed the requested message. The Investigation Console
          is online, and the Mission outcome is ready.
        </p>
        <PrimaryButton onClick={() => dispatch({ type: "RETURN_TO_OUTCOME" })}>
          Return to Mission outcome
        </PrimaryButton>
      </section>
    );
  }

  if (state.beat === "activate") {
    return (
      <section className="encounter-sheet" aria-labelledby="beat-heading">
        <p className="beat-count">Beat 1 of 5 · Activate</p>
        <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Run the waiting message</h2>
        <p>
          The line on the left is source: an instruction you give Python. Run it,
          then find the separate output that Python produces.
        </p>
        {state.feedback && <FeedbackPacket packet={state.feedback} />}
        <div className="encounter-actions">
          <PrimaryButton onClick={run}>Run first message</PrimaryButton>
          <small>Keyboard: Tab to the button, then press Enter.</small>
        </div>
      </section>
    );
  }

  if (state.beat === "experiment") {
    if (state.phase === "experiment-result") {
      return (
        <section className="encounter-sheet encounter-sheet--result" aria-labelledby="beat-heading">
          <p className="beat-count">Beat 2 of 5 · Experiment</p>
          <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Your change reached the Case</h2>
          <p>
            You changed the words inside <code>print(...)</code>. Python printed
            those new words, and the open First Contact file recorded the result.
          </p>
          <PrimaryButton onClick={() => dispatch({ type: "CONTINUE_BEAT" })}>
            Continue to Predict
          </PrimaryButton>
        </section>
      );
    }
    return (
      <section className="encounter-sheet" aria-labelledby="beat-heading">
        <p className="beat-count">Beat 2 of 5 · Experiment</p>
        <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Make the message yours</h2>
        <p>
          Replace only the words between the quotation marks. Keep the rest of the
          instruction, then run it again and compare the consequence.
        </p>
        {state.feedback && <FeedbackPacket packet={state.feedback} />}
        <PrimaryButton onClick={run}>Run changed message</PrimaryButton>
      </section>
    );
  }

  if (state.beat === "predict") {
    if (state.phase === "predict-choice") {
      return (
        <section className="encounter-sheet" aria-labelledby="beat-heading">
          <p className="beat-count">Beat 3 of 5 · Predict</p>
          <h2 id="beat-heading" data-beat-heading tabIndex={-1}>What will the two lines print?</h2>
          <p>Commit to an expectation before tracing. “Not sure yet” is useful evidence, not a penalty.</p>
          <fieldset className="prediction-options">
            <legend>Choose the expected output</legend>
            {(Object.keys(PREDICTION_LABELS) as PredictionChoice[]).map((choice) => (
              <label key={choice}>
                <input
                  type="radio"
                  name="prediction"
                  value={choice}
                  checked={state.prediction === choice}
                  onChange={() => dispatch({ type: "SELECT_PREDICTION", choice })}
                />
                <span aria-hidden="true" />
                {PREDICTION_LABELS[choice]}
              </label>
            ))}
          </fieldset>
          <PrimaryButton
            onClick={() => dispatch({ type: "SUBMIT_PREDICTION" })}
            disabled={!state.prediction}
          >
            Lock prediction and trace
          </PrimaryButton>
        </section>
      );
    }

    return (
      <section className="encounter-sheet" aria-labelledby="beat-heading">
        <p className="beat-count">Beat 3 of 5 · Predict</p>
        <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Trace the same encounter</h2>
        <p className="prediction-record">
          Your prediction: <strong>{state.prediction ? PREDICTION_LABELS[state.prediction] : "—"}</strong>
        </p>
        <ol className="trace-sequence">
          <li data-state={state.traceStep >= 1 ? "complete" : "current"}>
            <span>1</span><p><strong>Line 1</strong> prints “Console online”.</p>
          </li>
          <li data-state={state.traceStep >= 2 ? "complete" : state.traceStep === 1 ? "current" : "waiting"}>
            <span>2</span><p><strong>Line 2</strong> prints “Case folder ready” beneath it.</p>
          </li>
        </ol>
        <p className="trace-summary" aria-live="polite">
          {state.traceStep === 0
            ? "No line traced yet."
            : state.traceStep === 1
              ? "One source line produced one output line."
              : "Two source lines produced two output lines in top-to-bottom order."}
        </p>
        {state.traceStep < 2 ? (
          <PrimaryButton onClick={() => dispatch({ type: "ADVANCE_TRACE" })}>
            {state.traceStep === 0 ? "Trace line 1" : "Trace line 2"}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => dispatch({ type: "CONTINUE_BEAT" })}>
            Continue to Investigate
          </PrimaryButton>
        )}
      </section>
    );
  }

  if (state.beat === "investigate") {
    if (state.phase === "investigate-result") {
      return (
        <section className="encounter-sheet encounter-sheet--result" aria-labelledby="beat-heading">
          <p className="beat-count">Beat 4 of 5 · Investigate</p>
          <h2 id="beat-heading" data-beat-heading tabIndex={-1}>The message boundary is repaired</h2>
          <p>
            The matching quotation mark gave the text a clear beginning and end.
            Python printed “Case folder ready,” and your earlier progress stayed intact.
          </p>
          <PrimaryButton onClick={() => dispatch({ type: "CONTINUE_BEAT" })}>
            Begin the Field Test
          </PrimaryButton>
        </section>
      );
    }

    if (state.phase === "investigate-repair") {
      return (
        <section className="encounter-sheet" aria-labelledby="beat-heading">
          <p className="beat-count">Beat 4 of 5 · Investigate</p>
          <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Repair the clue you created</h2>
          {state.feedback && <FeedbackPacket packet={state.feedback} />}
          <PrimaryButton onClick={run}>Run repaired line</PrimaryButton>
        </section>
      );
    }

    return (
      <section className="encounter-sheet" aria-labelledby="beat-heading">
        <p className="beat-count">Beat 4 of 5 · Investigate</p>
        <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Create one punctuation clue</h2>
        <p>
          Remove the quotation mark immediately after <code>ready</code>. Leave the
          closing parenthesis in place, then run the line and inspect where Python stops.
        </p>
        {state.feedback && <FeedbackPacket packet={state.feedback} />}
        <PrimaryButton onClick={run}>Run the clue</PrimaryButton>
      </section>
    );
  }

  return (
    <section className="encounter-sheet field-test-sheet" aria-labelledby="beat-heading">
      <div className="field-test-heading">
        <div>
          <p className="beat-count">Beat 5 of 5 · Prove</p>
          <h2 id="beat-heading" data-beat-heading tabIndex={-1}>Fresh Field Test</h2>
        </div>
        <span>Reduced support</span>
      </div>
      <p>
        Write one line that prints the exact message <strong>{FIELD_TEST_OUTPUT}</strong>.
        The words are new; the pattern is the same. No solution will appear before you try.
      </p>
      {state.feedback && <FeedbackPacket packet={state.feedback} />}
      <PrimaryButton onClick={run}>Submit Field Test</PrimaryButton>
    </section>
  );
}

export function MissionScreen({
  state,
  dispatch,
  reducedMotion,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
  reducedMotion: boolean;
}) {
  const readOnly =
    state.phase === "experiment-result" ||
    state.phase === "predict-choice" ||
    state.phase === "predict-trace" ||
    state.phase === "investigate-result" ||
    state.phase === "complete";

  return (
    <main className="mission-screen learner-shell" data-screen={`mission-${state.beat}`}>
      <header className="mission-heading">
        <div>
          <p>Case 001 · {FIRST_CONTACT.caseTitle}</p>
          <h1 data-screen-heading tabIndex={-1}>Mission 001 · First Contact</h1>
          <p>{FIRST_CONTACT.objective}</p>
        </div>
        <button type="button" className="stop-button" onClick={() => dispatch({ type: "STOP" })}>
          Stop and save
        </button>
      </header>

      <aside className="case-thread" aria-labelledby="case-question-heading">
        <span aria-hidden="true">00:43</span>
        <div>
          <h2 id="case-question-heading">Current Case question</h2>
          <p>{FIRST_CONTACT.caseQuestion}</p>
        </div>
        <small>An unusual time is not proof of wrongdoing.</small>
      </aside>

      <MissionRhythm beat={state.beat} />

      <section className="workspace-scene" aria-label="First Contact working scene">
        <div className="workspace-surfaces">
          <CodeSurface
            state={state}
            onSourceChange={(source) => dispatch({ type: "EDIT_SOURCE", source })}
            readOnly={readOnly}
          />
          <CausalityView state={state} reducedMotion={reducedMotion} />
        </div>
        <BeatInteraction state={state} dispatch={dispatch} />
      </section>
    </main>
  );
}
