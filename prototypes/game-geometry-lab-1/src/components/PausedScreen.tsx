import { MISSION_BEATS, VARIANT_GEOMETRIES } from "../experience/mission";
import type { ExperienceAction, ExperienceState } from "../experience/model";

export function PausedScreen({
  state,
  dispatch,
}: {
  state: ExperienceState;
  dispatch: React.Dispatch<ExperienceAction>;
}) {
  const beat = MISSION_BEATS.find((item) => item.id === state.beat);
  return (
    <main className="paused-screen learner-shell" data-screen="paused" data-terminal="true">
      <p className="pause-symbol" aria-hidden="true">Ⅱ</p>
      <p>Clean stop · Work preserved</p>
      <h1 data-screen-heading tabIndex={-1}>Your investigation is paused.</h1>
      <p>
        Return whenever you are ready. There is no countdown, streak, or automatic
        next Mission.
      </p>
      <dl>
        <div><dt>Route</dt><dd>{VARIANT_GEOMETRIES[state.variant].label}</dd></div>
        <div><dt>Current beat</dt><dd>{beat?.label}</dd></div>
        <div><dt>Evidence recorded</dt><dd>{state.evidence.length} items</dd></div>
      </dl>
      <button
        type="button"
        className="button button--primary"
        onClick={() => dispatch({ type: "RESUME" })}
        data-primary-action
      >
        Resume from here <span aria-hidden="true">→</span>
      </button>
    </main>
  );
}
