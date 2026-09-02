import type { ExperienceState } from "../experience/model";
import { CaseFolder } from "./CaseFolder";

function OutputSurface({ state }: { state: ExperienceState }) {
  const output = state.execution.output.join("\n");
  return (
    <section className="output-surface" aria-labelledby="output-heading">
      <header>
        <div>
          <h2 id="output-heading">Output</h2>
          <p>What Python did</p>
        </div>
        <span data-output-status={state.execution.status}>
          {state.execution.status === "idle"
            ? "Waiting"
            : state.execution.status === "error"
              ? "Stopped"
              : "Printed"}
        </span>
      </header>
      <pre aria-live="polite" aria-atomic="true" tabIndex={0}>
        {output || state.execution.message || "Run the source to see its output."}
      </pre>
    </section>
  );
}

function semanticDescription(state: ExperienceState) {
  if (state.execution.status === "error") {
    return "Python stopped before producing a new result. The Case did not change again.";
  }
  if (state.execution.status === "success") {
    const output = state.execution.output.join("; ");
    return `Python evaluated the source and printed ${output}. That successful result reached the First Contact file; its current state is ${state.caseState.folder}.`;
  }
  return "The source has not run yet. Output and the Case object are waiting.";
}

export function CausalityView({
  state,
  reducedMotion,
}: {
  state: ExperienceState;
  reducedMotion: boolean;
}) {
  const hasResult = state.execution.status === "success";
  const hasError = state.execution.status === "error";
  const value = hasResult
    ? state.execution.output.at(-1) ?? ""
    : hasError
      ? "No complete value"
      : "Waiting";
  const description = semanticDescription(state);

  if (state.causality === "a") {
    return (
      <section
        className="causality-view causality-view--a"
        data-causality="a"
        aria-label="Causality level A: runtime output only"
      >
        <OutputSurface state={state} />
        <p className="sr-only" data-semantic-result>
          {description}
        </p>
      </section>
    );
  }

  if (state.causality === "b") {
    return (
      <section
        className="causality-view causality-view--b"
        data-causality="b"
        aria-label="Causality level B: runtime output and Case reaction"
      >
        <OutputSurface state={state} />
        <section className="case-surface" aria-labelledby="case-surface-heading">
          <header>
            <h2 id="case-surface-heading">Case</h2>
            <p>What changed in the investigation</p>
          </header>
          <CaseFolder caseState={state.caseState} emphasized={hasResult} />
        </section>
        <p className="causal-equivalent" data-semantic-result>{description}</p>
      </section>
    );
  }

  return (
    <section
      className="causality-view causality-view--c"
      data-causality="c"
      data-sequence={hasResult ? "complete" : hasError ? "stopped" : "waiting"}
      aria-labelledby="causal-bridge-heading"
    >
      <header className="causal-bridge-heading">
        <div>
          <h2 id="causal-bridge-heading">From source to Case</h2>
          <p>{reducedMotion ? "Ordered static explanation" : "Follow the result across the scene"}</p>
        </div>
        <span>{hasError ? "Stopped before change" : hasResult ? "Change traced" : "Waiting to run"}</span>
      </header>

      <ol className="causal-bridge" aria-label="Four-part causal explanation">
        <li data-bridge-step="source" data-state={state.execution.status === "idle" ? "waiting" : "active"}>
          <span className="bridge-number">1</span>
          <div>
            <strong>Active source</strong>
            <code>{state.source.split("\n")[Math.max(0, state.traceStep - 1)] || "Waiting for source"}</code>
          </div>
        </li>
        <li data-bridge-step="value" data-state={hasResult ? "active" : hasError ? "stopped" : "waiting"}>
          <span className="bridge-number">2</span>
          <div>
            <strong>Evaluated value</strong>
            <samp>{value}</samp>
          </div>
        </li>
        <li data-bridge-step="output" data-state={hasResult ? "active" : hasError ? "stopped" : "waiting"}>
          <span className="bridge-number">3</span>
          <OutputSurface state={state} />
        </li>
        <li data-bridge-step="case" data-state={hasResult ? "changed" : hasError ? "unchanged" : "waiting"}>
          <span className="bridge-number">4</span>
          <div className="bridge-case-copy">
            <strong>Case destination</strong>
            <span>{hasError ? "No new change" : hasResult ? "Changed evidence" : "Waiting"}</span>
          </div>
          <CaseFolder caseState={state.caseState} emphasized={hasResult} />
        </li>
      </ol>

      <p className="causal-equivalent" data-semantic-result>{description}</p>
    </section>
  );
}
