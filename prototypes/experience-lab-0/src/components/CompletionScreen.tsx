import { getFirstActionSeconds } from "../experience/machine";
import type { ExperienceAction, ExperienceState } from "../experience/model";

export function CompletionScreen({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  return (
    <main className="direct-completion content-shell" data-screen="direct-complete">
      <header className="completion-hero">
        <div className="completion-seal" aria-hidden="true">⌁</div>
        <p className="eyebrow">Direct Mission · Compact completion</p>
        <h1 data-screen-heading tabIndex={-1}>The Case has a verified channel.</h1>
        <p>
          Your fresh program produced the requested output. That emitted a semantic
          event and changed the Case without claiming the midnight event is solved.
        </p>
      </header>
      <div className="completion-grid">
        <section aria-labelledby="capability-title">
          <p className="eyebrow">Capability evidence</p>
          <h2 id="capability-title">First execution · Introduced</h2>
          <ul className="evidence-list">
            {state.evidence.map((item) => (
              <li key={item}><span aria-hidden="true">✓</span>{item}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="next-title">
          <p className="eyebrow">Next action</p>
          <h2 id="next-title">Identity Tag</h2>
          <p>
            Names and values could preserve investigator and Case facts next. That
            Mission is intentionally not built in this experiment.
          </p>
          <span className="status-chip">Preview only</span>
        </section>
      </div>
      <aside className="observer-readout" aria-label="Local prototype observer readout">
        <strong>Local engineering readout</strong>
        <span>First code action: {getFirstActionSeconds(state) ?? "—"}s</span>
        <span>Pre-run navigation steps: {state.metrics.navigationBeforeFirstRun}</span>
        <small>Local-only instrumentation; not learner evidence.</small>
      </aside>
      <div className="completion-footer">
        <button
          type="button"
          className="button button--quiet"
          onClick={() => dispatch({ type: "REVIEW_DEBRIEF" })}
        >
          Review Mission evidence
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={() => dispatch({ type: "STOP" })}
          data-primary-action
        >
          Stop at this boundary <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  );
}
