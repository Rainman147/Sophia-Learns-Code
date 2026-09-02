import { CAUSALITY_LEVELS, VARIANT_GEOMETRIES } from "../experience/mission";
import type {
  CausalityLevel,
  EntryVariant,
  ExperienceAction,
} from "../experience/model";

export function ReviewerPanel({
  variant,
  causality,
  reducedMotion,
  restored,
  dispatch,
  onReset,
}: {
  variant: EntryVariant;
  causality: CausalityLevel;
  reducedMotion: boolean;
  restored: boolean;
  dispatch: React.Dispatch<ExperienceAction>;
  onReset: () => void;
}) {
  return (
    <aside className="reviewer-panel" aria-label="Reviewer controls">
      <div className="reviewer-panel__identity">
        <a href="/">Game Geometry Lab 1</a>
        <span>Research controls · outside learner experience</span>
      </div>
      <nav aria-label="Entry geometry variants">
        {Object.values(VARIANT_GEOMETRIES).map((item) => (
          <a
            href={`${item.route}?causality=${causality}`}
            aria-current={item.variant === variant ? "page" : undefined}
            key={item.variant}
          >
            {item.shortLabel}
          </a>
        ))}
      </nav>
      <fieldset className="causality-control">
        <legend>Causality</legend>
        {(Object.keys(CAUSALITY_LEVELS) as CausalityLevel[]).map((level) => (
          <label key={level} title={CAUSALITY_LEVELS[level].reviewerDescription}>
            <input
              type="radio"
              name="causality-level"
              checked={causality === level}
              onChange={() => dispatch({ type: "SET_CAUSALITY", level })}
            />
            <span>{level.toUpperCase()}</span>
          </label>
        ))}
      </fieldset>
      <div className="reviewer-panel__status">
        <span>{reducedMotion ? "Reduced motion" : "Motion available"}</span>
        {restored && <span>Saved state restored</span>}
        <button type="button" onClick={onReset}>Reset route</button>
      </div>
    </aside>
  );
}
