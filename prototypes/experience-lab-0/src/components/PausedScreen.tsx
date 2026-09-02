import type { ExperienceAction, ExperienceState } from "../experience/model";

export function PausedScreen({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  return (
    <main className="paused-screen content-shell" data-screen="paused" data-terminal="true">
      <div className="paused-mark" aria-hidden="true">Ⅱ</div>
      <p className="eyebrow">Clean stop · Local state preserved</p>
      <h1 data-screen-heading tabIndex={-1}>Your investigation is paused.</h1>
      <p>
        Reloading this route will recover the supported prototype state. There is
        no streak, countdown, or autoplay pressure.
      </p>
      <dl className="pause-summary">
        <div><dt>Variant</dt><dd>{state.variant === "direct" ? "A · Direct Mission" : "B · Operations Center"}</dd></div>
        <div><dt>Last Mission state</dt><dd>{state.stage}</dd></div>
        <div><dt>Saved evidence items</dt><dd>{state.evidence.length}</dd></div>
      </dl>
      <button
        type="button"
        className="button button--primary"
        onClick={() => dispatch({ type: "RESUME" })}
        data-primary-action
      >
        Resume saved state <span aria-hidden="true">→</span>
      </button>
    </main>
  );
}
