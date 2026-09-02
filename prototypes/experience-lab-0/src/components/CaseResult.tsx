import type { ExperienceState } from "../experience/model";
import { SignalGlyph } from "./SignalGlyph";

export function CaseResult({ state }: { state: ExperienceState }) {
  const latestEvent = state.events.at(-1);

  return (
    <section className="case-result panel" aria-labelledby="case-result-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Case-state surface</p>
          <h2 id="case-result-title">Live Case Result</h2>
        </div>
        <span className={`status-chip status-chip--${state.caseState.signal}`}>
          <span aria-hidden="true">{state.caseState.signal === "verified" ? "✓" : "◇"}</span>
          {state.caseState.signal}
        </span>
      </div>
      <SignalGlyph state={state.caseState} />
      <div className="case-result__copy" aria-live="polite">
        <p className="case-result__headline">{state.caseState.headline}</p>
        <p>{state.caseState.detail}</p>
      </div>
      <div className="event-readout">
        <span>Latest semantic event</span>
        <strong>{latestEvent?.name ?? "No event emitted yet"}</strong>
      </div>
    </section>
  );
}
