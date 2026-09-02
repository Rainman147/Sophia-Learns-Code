import { MISSION_BEATS } from "../experience/mission";
import type { MissionBeat } from "../experience/model";

export function MissionRhythm({ beat }: { beat: MissionBeat }) {
  const activeIndex = MISSION_BEATS.findIndex((item) => item.id === beat);
  return (
    <nav className="mission-rhythm" aria-label="Five Mission beats">
      <ol tabIndex={0} aria-label="Mission progress: five beats">
        {MISSION_BEATS.map((item, index) => (
          <li
            key={item.id}
            data-testid="mission-beat"
            data-state={index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming"}
            aria-current={index === activeIndex ? "step" : undefined}
          >
            <span aria-hidden="true">{index < activeIndex ? "✓" : index + 1}</span>
            <strong>{item.label}</strong>
          </li>
        ))}
      </ol>
    </nav>
  );
}
