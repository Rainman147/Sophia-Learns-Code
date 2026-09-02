import { useEffect, useReducer } from "react";
import { experienceReducer } from "./machine";
import { loadExperienceState, saveExperienceState } from "./persistence";
import type { Variant } from "./model";

export function useExperience(variant: Variant) {
  const [state, dispatch] = useReducer(
    experienceReducer,
    variant,
    (initialVariant) =>
      loadExperienceState(window.localStorage, initialVariant, Date.now()),
  );

  useEffect(() => {
    saveExperienceState(window.localStorage, state);
  }, [state]);

  return [state, dispatch] as const;
}
