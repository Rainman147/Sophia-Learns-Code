import { FIRST_CONTACT } from "../experience/mission";
import type { ExperienceAction, ExperienceState } from "../experience/model";
import { CaseFolder } from "./CaseFolder";

type CenterMode = "before" | "after" | "earned";

export function OperationsCenter({
  state,
  dispatch,
  mode,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
  mode: CenterMode;
}) {
  const completed = mode !== "before";
  const earned = mode === "earned";

  return (
    <main
      className={`operations-center learner-shell${earned ? " operations-center--earned" : ""}`}
      data-screen={earned ? "earned-hub" : completed ? "hub-after" : "hub-before"}
    >
      <header className="center-heading">
        <p>{earned ? "Mission reward · Workspace online" : "Python Investigator"}</p>
        <h1 data-screen-heading tabIndex={-1}>
          {earned
            ? "Operations Center brought online."
            : completed
              ? "The Center reflects what you proved."
              : "Operations Center"}
        </h1>
        <p>
          {earned
            ? "Your Field Test printed the requested message. That result brought this workspace online and made the Investigation Console available."
            : completed
              ? "First Contact changed this workspace: the Case file is open, and the Investigation Console is ready for the next fact."
              : "One active Case, one clear recommendation, and one useful stopping point. The midnight record remains a question, not a conclusion."}
        </p>
      </header>

      {completed && (
        <section className="center-change" aria-labelledby="center-change-heading">
          <h2 id="center-change-heading">What caused this change</h2>
          <ol>
            <li><span>1</span>Your Field Test printed “Investigation console online”.</li>
            <li><span>2</span>The Investigation Console became available.</li>
            <li><span>3</span>{earned ? "The Operations Center appeared for the first time." : "The existing Center recorded the new capability."}</li>
          </ol>
        </section>
      )}

      <article className="center-ledger" aria-labelledby="active-case-heading">
        <div className="ledger-margin">
          <span>CASE</span>
          <strong>001</strong>
          <small>00:43</small>
        </div>
        <section className="ledger-case">
          <p>Active Case</p>
          <h2 id="active-case-heading">The Midnight Badge</h2>
          <p>
            {completed
              ? "The message channel is verified. No conclusion has been drawn from the unusual timestamp."
              : "A synthetic badge event needs careful inspection. First establish a readable message channel."}
          </p>
          <dl>
            <div><dt>Case file</dt><dd>{completed ? "Open" : "Sealed"}</dd></div>
            <div><dt>Console</dt><dd>{completed ? "Online" : "Offline"}</dd></div>
            <div><dt>Conclusion</dt><dd>None</dd></div>
          </dl>
        </section>
        <CaseFolder caseState={state.caseState} emphasized={completed} />
      </article>

      <section className="center-next" aria-labelledby="recommended-heading">
        <div>
          <p>{completed ? "Next visible Mission" : "Recommended now"}</p>
          <h2 id="recommended-heading">{completed ? "Mission 002 · Identity Tag" : "Mission 001 · First Contact"}</h2>
          <p>
            {completed
              ? "Names and values could preserve investigator and Case facts. This Mission is visible for orientation but is not implemented."
              : "Run, change, predict, repair, and prove one small Python pattern in about 12–15 minutes."}
          </p>
        </div>
        {!completed ? (
          <button
            type="button"
            className="button button--primary"
            onClick={() => dispatch({ type: "ENTER_MISSION" })}
            data-primary-action
          >
            Begin First Contact <span aria-hidden="true">→</span>
          </button>
        ) : (
          <span className="preview-boundary" aria-label="Preview only; Mission 002 is not available">
            Preview only · no autoplay
          </span>
        )}
      </section>

      {completed && (
        <section className="center-capability" aria-labelledby="center-capability-heading">
          <div>
            <h2 id="center-capability-heading">{FIRST_CONTACT.reward}</h2>
            <p>{FIRST_CONTACT.capabilityEvidence}</p>
          </div>
          <ul>
            {state.evidence.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
          </ul>
        </section>
      )}

      {completed && (
        <div className="boundary-actions">
          <button type="button" className="button button--quiet" onClick={() => dispatch({ type: "REVIEW_MISSION" })}>
            Review Mission
          </button>
          <button type="button" className="button button--primary" onClick={() => dispatch({ type: "STOP" })} data-primary-action>
            Stop at this boundary <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </main>
  );
}
