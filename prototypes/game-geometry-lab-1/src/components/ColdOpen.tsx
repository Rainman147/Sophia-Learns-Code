import { FIRST_CONTACT } from "../experience/mission";
import type { ExperienceAction, ExperienceState } from "../experience/model";
import { CaseFolder } from "./CaseFolder";

export function ColdOpen({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  return (
    <main className="cold-open learner-shell" data-screen="cold-open">
      <header className="cold-open__heading">
        <p>Case 001 · Incoming record</p>
        <h1 data-screen-heading tabIndex={-1}>A badge event arrived at 00:43.</h1>
        <p>
          The time is unusual. It is not a conclusion. One sealed file holds the
          first fact you can inspect with Python.
        </p>
      </header>
      <div className="cold-open__scene">
        <CaseFolder caseState={state.caseState} />
        <section className="evidence-note" aria-labelledby="cold-evidence-heading">
          <h2 id="cold-evidence-heading">What is known</h2>
          <dl>
            <div><dt>Timestamp</dt><dd>00:43</dd></div>
            <div><dt>Record</dt><dd>Synthetic badge event</dd></div>
            <div><dt>Conclusion</dt><dd>None</dd></div>
          </dl>
          <p>
            First Contact takes about 12–15 minutes. You will run, change, predict,
            repair, and prove one small pattern.
          </p>
          <button
            type="button"
            className="button button--primary"
            onClick={() => dispatch({ type: "ENTER_MISSION" })}
            data-primary-action
          >
            Begin First Contact <span aria-hidden="true">→</span>
          </button>
        </section>
      </div>
      <p className="case-ethics-note">{FIRST_CONTACT.facts[1]}</p>
    </main>
  );
}
