import { createInitialState } from "./machine";
import type {
  CausalityLevel,
  EntryVariant,
  ExperienceState,
} from "./model";

export const STORAGE_PREFIX = "sophia-game-geometry-lab-1";

export function storageKey(variant: EntryVariant) {
  return `${STORAGE_PREFIX}:${variant}`;
}

function isStoredState(
  value: unknown,
  variant: EntryVariant,
): value is ExperienceState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ExperienceState>;
  return (
    candidate.version === 1 &&
    candidate.variant === variant &&
    typeof candidate.screen === "string" &&
    typeof candidate.beat === "string" &&
    typeof candidate.phase === "string" &&
    typeof candidate.source === "string" &&
    typeof candidate.sourceRevision === "number" &&
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.evidence)
  );
}

export function loadExperienceState(
  storage: Pick<Storage, "getItem">,
  variant: EntryVariant,
  causality: CausalityLevel,
  now = Date.now(),
): ExperienceState {
  try {
    const serialized = storage.getItem(storageKey(variant));
    if (!serialized) return createInitialState(variant, causality, now);
    const parsed: unknown = JSON.parse(serialized);
    if (!isStoredState(parsed, variant)) {
      return createInitialState(variant, causality, now);
    }
    return {
      ...parsed,
      causality,
      restored: true,
      announcement: "Saved work recovered on reload.",
    };
  } catch {
    return createInitialState(variant, causality, now);
  }
}

export function saveExperienceState(
  storage: Pick<Storage, "setItem">,
  state: ExperienceState,
) {
  storage.setItem(storageKey(state.variant), JSON.stringify(state));
}

export function clearExperienceState(
  storage: Pick<Storage, "removeItem">,
  variant: EntryVariant,
) {
  storage.removeItem(storageKey(variant));
}
