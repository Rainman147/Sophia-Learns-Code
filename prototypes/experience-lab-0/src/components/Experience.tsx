import { useEffect, useRef, useState } from "react";
import { useExperience } from "../experience/useExperience";
import { VARIANT_SHELLS } from "../experience/mission";
import { clearExperienceState } from "../experience/persistence";
import type { Variant } from "../experience/model";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { CompletionScreen } from "./CompletionScreen";
import { MissionScreen } from "./MissionScreen";
import { OperationsCenter } from "./OperationsCenter";
import { PausedScreen } from "./PausedScreen";
import { ResetDialog } from "./ResetDialog";

export function Experience({ variant }: { variant: Variant }) {
  const [state, dispatch] = useExperience(variant);
  const [resetOpen, setResetOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const shell = VARIANT_SHELLS[variant];
  const previousScreen = useRef(state.screen);
  const previousStage = useRef(state.stage);

  useEffect(() => {
    const heading = document.querySelector<HTMLElement>("[data-screen-heading]");
    const majorOrientationChange =
      previousScreen.current !== state.screen ||
      (previousStage.current !== "debrief" && state.stage === "debrief");
    heading?.focus({ preventScroll: true });
    if (majorOrientationChange) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    previousScreen.current = state.screen;
    previousStage.current = state.stage;
  }, [state.screen, state.stage]);

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
      <a className="skip-link" href="#prototype-main">Skip to current experience</a>
      <header className="reviewer-bar">
        <a className="wordmark" href="/" aria-label="Experience Lab 0 comparison home">
          <span className="wordmark__mark" aria-hidden="true">S</span>
          <span>
            <strong>Experience Lab 0</strong>
            <small>Issue #22 · Product-question prototype</small>
          </span>
        </a>
        <nav className="variant-nav" aria-label="Controlled prototype variants">
          {(Object.values(VARIANT_SHELLS)).map((item) => (
            <a
              key={item.variant}
              href={item.route}
              aria-current={item.variant === variant ? "page" : undefined}
            >
              {item.shortLabel}
            </a>
          ))}
        </nav>
        <div className="reviewer-actions">
          <span className="motion-status">
            <span aria-hidden="true">{reducedMotion ? "—" : "∿"}</span>
            {reducedMotion ? "Reduced motion" : "Motion on"}
          </span>
          <button type="button" className="reset-button" onClick={() => setResetOpen(true)}>
            Reset
          </button>
        </div>
      </header>

      <div className="prototype-banner" role="note">
        <strong>{shell.label}</strong>
        <span>Scripted execution · synthetic Case data · not production architecture</span>
        {state.restored && <span className="restored-chip">Reload state recovered</span>}
      </div>

      <div id="prototype-main">
        {state.screen === "hub-before" && (
          <OperationsCenter state={state} dispatch={dispatch} completed={false} />
        )}
        {state.screen === "mission" && (
          <MissionScreen state={state} dispatch={dispatch} />
        )}
        {state.screen === "direct-complete" && (
          <CompletionScreen state={state} dispatch={dispatch} />
        )}
        {state.screen === "hub-after" && (
          <OperationsCenter state={state} dispatch={dispatch} completed />
        )}
        {state.screen === "paused" && (
          <PausedScreen state={state} dispatch={dispatch} />
        )}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.announcement}
      </div>

      <footer className="prototype-footer">
        <span>Case data is synthetic.</span>
        <span>One controlled variable: Operations Center entry and return.</span>
        <a href="https://github.com/Rainman147/Sophia-Learns-Code/issues/22">
          Governing issue #22
        </a>
      </footer>

      <ResetDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={confirmReset}
      />
    </div>
  );
}
