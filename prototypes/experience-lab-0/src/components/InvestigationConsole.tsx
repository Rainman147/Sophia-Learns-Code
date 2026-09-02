import type { ExperienceState } from "../experience/model";

interface InvestigationConsoleProps {
  state: ExperienceState;
  onSourceChange: (source: string) => void;
  readOnly?: boolean;
}

export function InvestigationConsole({
  state,
  onSourceChange,
  readOnly = false,
}: InvestigationConsoleProps) {
  const activeLine = state.stage === "trace" ? state.traceStep : 0;

  return (
    <section className="investigation-console panel" aria-labelledby="console-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Code surface</p>
          <h2 id="console-title">Investigation Console</h2>
        </div>
        <span className="prototype-chip">Scripted</span>
      </div>
      <div className="source-region">
        <div className="region-label">
          <label htmlFor="source-code">Python-looking source</label>
          <span>{readOnly ? "Inspect" : "Edit"}</span>
        </div>
        <div className="code-frame">
          <div className="line-numbers" aria-hidden="true">
            {state.source.split("\n").map((_, index) => (
              <span
                className={activeLine === index + 1 ? "is-active" : undefined}
                key={index}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <textarea
            id="source-code"
            aria-label="Python-looking source code"
            value={state.source}
            onChange={(event) => onSourceChange(event.target.value)}
            readOnly={readOnly}
            rows={Math.max(3, state.source.split("\n").length)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
      </div>
      <div className="output-region">
        <div className="region-label">
          <span id="output-label">Console output</span>
          <span>{state.execution.status}</span>
        </div>
        <pre aria-labelledby="output-label" tabIndex={0}>
          {state.execution.output.length > 0
            ? state.execution.output.join("\n")
            : state.execution.status === "error"
              ? state.execution.message
              : "Waiting for a source action…"}
        </pre>
      </div>
      <p className="truth-note">
        Prototype truth boundary: this evaluator recognizes a tiny scripted print
        pattern. It does not validate a real Python runtime.
      </p>
    </section>
  );
}
