import { FIRST_CONTACT } from "../experience/mission";
import type { ExperienceAction, ExperienceState } from "../experience/model";

export function CompletionScreen({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  return (
    <main className="completion-screen learner-shell" data-screen="direct-complete">
      <header>
        <p>Mission boundary · Direct route</p>
        <h1 data-screen-heading tabIndex={-1}>First Contact is complete.</h1>
        <p>
          Your program printed the requested message. The Investigation Console
          is now online.
        </p>
      </header>
      <div className="completion-record">
        <section aria-labelledby="evidence-heading">
          <h2 id="evidence-heading">What you can do now</h2>
          <strong>{FIRST_CONTACT.capabilityEvidence}</strong>
          <ul>
            {state.evidence.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
          </ul>
          <p>
            More practice is still needed before this becomes durable or transferable evidence.
          </p>
        </section>
        <section aria-labelledby="reward-heading">
          <h2 id="reward-heading">What changed in the Case</h2>
          <p className="completion-reward">{FIRST_CONTACT.reward}</p>
          <p>The open Case file can carry the next investigation fact.</p>
        </section>
      </div>
      <section className="next-mission-preview" aria-labelledby="next-mission-heading">
        <div>
          <h2 id="next-mission-heading">Mission 002 · Identity Tag</h2>
          <p>Next, names and values could preserve investigator and Case facts.</p>
        </div>
        <span aria-label="Preview only; not available">Preview only · not built</span>
      </section>
      <div className="boundary-actions">
        <button type="button" className="button button--quiet" onClick={() => dispatch({ type: "REVIEW_MISSION" })}>
          Review Mission
        </button>
        <button type="button" className="button button--primary" onClick={() => dispatch({ type: "STOP" })} data-primary-action>
          Stop at this boundary <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  );
}
