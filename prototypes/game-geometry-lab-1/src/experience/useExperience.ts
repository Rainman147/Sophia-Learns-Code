import { useEffect, useReducer } from "react";
import { experienceReducer } from "./machine";
import { loadExperienceState, saveExperienceState } from "./persistence";
import type { CausalityLevel, EntryVariant } from "./model";

export function useExperience(
  variant: EntryVariant,
  initialCausality: CausalityLevel,
) {
  const [state, dispatch] = useReducer(
    experienceReducer,
    { variant, causality: initialCausality },
    ({ variant: initialVariant, causality }) =>
      loadExperienceState(
        window.localStorage,
        initialVariant,
        causality,
        Date.now(),
      ),
  );

  useEffect(() => {
    saveExperienceState(window.localStorage, state);
  }, [state]);

  return [state, dispatch] as const;
}
