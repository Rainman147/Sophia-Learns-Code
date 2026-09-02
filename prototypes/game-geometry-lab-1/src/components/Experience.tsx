import { useEffect, useRef, useState } from "react";
import { clearExperienceState } from "../experience/persistence";
import { useExperience } from "../experience/useExperience";
import type { CausalityLevel, EntryVariant } from "../experience/model";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ColdOpen } from "./ColdOpen";
import { CompletionScreen } from "./CompletionScreen";
import { MissionScreen } from "./MissionScreen";
import { OperationsCenter } from "./OperationsCenter";
import { PausedScreen } from "./PausedScreen";
import { ResetDialog } from "./ResetDialog";
import { ReviewerPanel } from "./ReviewerPanel";

export function Experience({
  variant,
  initialCausality,
}: {
  variant: EntryVariant;
  initialCausality: CausalityLevel;
}) {
  const [state, dispatch] = useExperience(variant, initialCausality);
  const [resetOpen, setResetOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const previousScreen = useRef(state.screen);
  const previousBeat = useRef(state.beat);

  useEffect(() => {
    const screenChanged = previousScreen.current !== state.screen;
    const beatChanged = previousBeat.current !== state.beat;
    const target = screenChanged
      ? document.querySelector<HTMLElement>("[data-screen-heading]")
      : beatChanged
        ? document.querySelector<HTMLElement>("[data-beat-heading]")
        : null;
    target?.focus({ preventScroll: true });
    if (screenChanged) window.scrollTo({ top: 0, behavior: "auto" });
    previousScreen.current = state.screen;
    previousBeat.current = state.beat;
  }, [state.screen, state.beat]);

  const confirmReset = () => {
    clearExperienceState(window.localStorage, variant);
    dispatch({ type: "RESET", now: Date.now() });
    setResetOpen(false);
  };

  return (
    <div
      className="prototype-app"
      data-variant={variant}
      data-motion={reducedMotion ? "reduced" : "full"}
    >
      <a className="skip-link" href="#learner-experience">Skip to learner experience</a>
      <ReviewerPanel
        variant={variant}
        causality={state.causality}
        reducedMotion={reducedMotion}
        restored={state.restored}
        dispatch={dispatch}
        onReset={() => setResetOpen(true)}
      />

      <div className="prototype-boundary" role="note">
        <strong>Disposable product-topology experiment</strong>
        <span>Scripted evaluation · synthetic Case data · no production decision</span>
      </div>

      <div id="learner-experience">
        {state.screen === "cold-open" && <ColdOpen state={state} dispatch={dispatch} />}
        {state.screen === "hub-before" && <OperationsCenter state={state} dispatch={dispatch} mode="before" />}
        {state.screen === "mission" && (
          <MissionScreen state={state} dispatch={dispatch} reducedMotion={reducedMotion} />
        )}
        {state.screen === "direct-complete" && <CompletionScreen state={state} dispatch={dispatch} />}
        {state.screen === "hub-after" && <OperationsCenter state={state} dispatch={dispatch} mode="after" />}
        {state.screen === "earned-hub" && <OperationsCenter state={state} dispatch={dispatch} mode="earned" />}
        {state.screen === "paused" && <PausedScreen state={state} dispatch={dispatch} />}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.announcement}
      </div>

      <footer className="prototype-footer">
        <span>Case data is synthetic.</span>
        <span>No learner result is inferred from this prototype.</span>
      </footer>

      <ResetDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={confirmReset}
      />
    </div>
  );
}
