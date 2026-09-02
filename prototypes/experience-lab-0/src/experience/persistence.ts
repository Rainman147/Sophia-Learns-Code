import { createInitialState } from "./machine";
import type { ExperienceState, Variant } from "./model";

export const STORAGE_PREFIX = "sophia-experience-lab-0";

export function storageKey(variant: Variant) {
  return `${STORAGE_PREFIX}:${variant}`;
}

function isStoredState(value: unknown, variant: Variant): value is ExperienceState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ExperienceState>;
  return (
    candidate.version === 1 &&
    candidate.variant === variant &&
    typeof candidate.screen === "string" &&
    typeof candidate.stage === "string" &&
    typeof candidate.source === "string" &&
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.evidence)
  );
}

export function loadExperienceState(
  storage: Pick<Storage, "getItem">,
  variant: Variant,
  now = Date.now(),
): ExperienceState {
  try {
    const serialized = storage.getItem(storageKey(variant));
    if (!serialized) return createInitialState(variant, now);
    const parsed: unknown = JSON.parse(serialized);
    if (!isStoredState(parsed, variant)) return createInitialState(variant, now);
    return {
      ...parsed,
      restored: true,
      announcement: "Saved prototype state recovered on reload.",
    };
  } catch {
    return createInitialState(variant, now);
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
  variant: Variant,
) {
  storage.removeItem(storageKey(variant));
}
