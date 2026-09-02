import { getFirstActionSeconds } from "../experience/machine";
import type { ExperienceAction, ExperienceState } from "../experience/model";
import { SignalGlyph } from "./SignalGlyph";

interface OperationsCenterProps {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
  completed: boolean;
}

export function OperationsCenter({
  state,
  dispatch,
  completed,
}: OperationsCenterProps) {
  return (
    <main
      className={`operations-center content-shell${completed ? " is-complete" : ""}`}
      data-screen={completed ? "hub-after" : "hub-before"}
    >
      <header className="operations-hero">
        <div className="operations-hero__copy">
          <p className="eyebrow">Python Investigator · Prototype Operations Center</p>
          <h1 data-screen-heading tabIndex={-1}>
            {completed ? "One new capability is online." : "One Case is waiting."}
          </h1>
          <p>
            {completed
              ? "First Contact changed the Center: the Case has a verified channel, and the Investigation Console is now available."
              : "A synthetic badge event arrived after midnight. The timing is unusual, but unusual is not the same as wrongdoing."}
          </p>
        </div>
        <div className="operations-hero__instrument">
          <SignalGlyph state={state.caseState} compact />
        </div>
      </header>

      {completed && (
        <section className="change-ribbon" aria-label="Operations Center change summary">
          <span aria-hidden="true">↗</span>
          <strong>Center change recorded</strong>
          <span>Evidence channel: unresolved → verified</span>
          <span>Tool: Investigation Console now available</span>
        </section>
      )}

      <div className="operations-layout">
        <section className="active-case-card" aria-labelledby="active-case-title">
          <div className="card-index"><span>01</span> Active Case</div>
          <div className="case-emblem" aria-hidden="true">
            <span>00:43</span>
          </div>
          <p className="eyebrow">Synthetic evidence · Access event</p>
          <h2 id="active-case-title">The Midnight Badge</h2>
          <p>
            {completed
              ? "The verified message channel can now carry the next Case fact. No conclusion has been drawn from the event."
              : "One badge event at 00:43 needs disciplined inspection. The first job is simply to establish console contact."}
          </p>
          <dl className="case-facts">
            <div><dt>Status</dt><dd>{completed ? "Channel verified" : "Awaiting contact"}</dd></div>
            <div><dt>Evidence</dt><dd>1 synthetic event</dd></div>
            <div><dt>Conclusion</dt><dd>None</dd></div>
          </dl>
        </section>

        <section className="recommended-card" aria-labelledby="recommended-title">
          <div className="card-index"><span>02</span> Recommended Mission</div>
          <p className="recommendation-reason">
            {completed ? "Because the console is now online" : "Because the Case has no message channel yet"}
          </p>
          <h2 id="recommended-title">{completed ? "Identity Tag" : "First Contact"}</h2>
          <p>
            {completed
              ? "Next, names and values could preserve investigator and Case facts. That Mission is intentionally outside this prototype."
              : "Run, personalize, predict, inspect, break, repair, and verify one small Python-looking program."}
          </p>
          <div className="mission-meta">
            <span>{completed ? "Next capability" : "~12–15 min"}</span>
            <span>{completed ? "Not built here" : "No prerequisites"}</span>
          </div>
          {!completed && (
            <button
              type="button"
              className="button button--primary button--wide"
              onClick={() => dispatch({ type: "ENTER_MISSION" })}
              data-primary-action
            >
              Begin First Contact <span aria-hidden="true">→</span>
            </button>
          )}
          {completed && (
            <div className="completion-actions">
              <button
                type="button"
                className="button button--primary button--wide"
                onClick={() => dispatch({ type: "STOP" })}
                data-primary-action
              >
                Stop at this boundary <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => dispatch({ type: "REVIEW_DEBRIEF" })}
              >
                Review Mission evidence
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="tool-row" aria-label="Operations Center tools and possibilities">
        <section className="tool-card tool-card--available" aria-labelledby="available-tool-title">
          <div className="tool-icon" aria-hidden="true">⌁</div>
          <div>
            <p className="eyebrow">Exactly one available tool</p>
            <h2 id="available-tool-title">
              {completed ? "Investigation Console" : "Case Brief"}
            </h2>
            <p>
              {completed
                ? "Send a value to Console output and produce a semantic Case event."
                : "Read the current question, facts, and limits without changing the evidence."}
            </p>
          </div>
          <span className="status-chip status-chip--verified">Available</span>
        </section>
        <section className="tool-card tool-card--locked" aria-labelledby="locked-tool-title">
          <div className="tool-icon" aria-hidden="true">◇</div>
          <div>
            <p className="eyebrow">Exactly one locked possibility</p>
            <h2 id="locked-tool-title">Computer’s Mind</h2>
            <p>
              Inspect execution order as a step sequence. The preview appeared in
              First Contact; durable access requires future capability evidence.
            </p>
          </div>
          <span className="status-chip">Locked · future gate</span>
        </section>
      </div>

      {completed && (
        <aside className="observer-readout" aria-label="Local prototype observer readout">
          <strong>Local engineering readout</strong>
          <span>First code action: {getFirstActionSeconds(state) ?? "—"}s</span>
          <span>Pre-run navigation steps: {state.metrics.navigationBeforeFirstRun}</span>
          <small>Local-only instrumentation; not learner evidence.</small>
        </aside>
      )}
    </main>
  );
}
