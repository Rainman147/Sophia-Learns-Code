import type { ExperienceState } from "../experience/model";

export function CodeSurface({
  state,
  onSourceChange,
  readOnly,
}: {
  state: ExperienceState;
  onSourceChange: (source: string) => void;
  readOnly: boolean;
}) {
  const activeLine = state.phase === "predict-trace" ? state.traceStep : 0;
  const lines = state.source.split("\n");

  return (
    <section className="code-surface" aria-labelledby="source-heading">
      <header>
        <div>
          <h2 id="source-heading">Source</h2>
          <p>What you tell Python</p>
        </div>
        <span>{readOnly ? "Inspecting" : "Editable"}</span>
      </header>
      <div className="editor-frame">
        <div className="line-numbers" aria-hidden="true">
          {lines.map((_, index) => (
            <span data-active={activeLine === index + 1 || undefined} key={index}>
              {index + 1}
            </span>
          ))}
        </div>
        <textarea
          id="mission-source"
          aria-label="Python source"
          aria-describedby="source-help"
          value={state.source}
          onChange={(event) => onSourceChange(event.target.value)}
          readOnly={readOnly}
          rows={Math.max(4, lines.length + 1)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
      <p id="source-help" className="surface-note">
        Source stays here after you run it. Output appears beside it.
      </p>
    </section>
  );
}
