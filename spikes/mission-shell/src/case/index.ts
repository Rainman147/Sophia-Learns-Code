import type {
  CaseEvent,
  CaseState,
  SceneProjection,
  SceneRenderer,
} from "../contracts/case";

export function applyCaseEvents(
  caseState: CaseState,
  events: readonly CaseEvent[],
): CaseState {
  if (events.length === 0) {
    return caseState;
  }

  const seenEventIds = new Set(caseState.timeline.map((event) => event.id));
  let nextState = caseState;

  for (const event of events) {
    if (seenEventIds.has(event.id)) {
      continue;
    }

    seenEventIds.add(event.id);
    nextState = applyUnseenCaseEvent(nextState, event);
  }

  return nextState;
}

export function createSceneRenderer(): SceneRenderer {
  return {
    project(caseState, options) {
      const isOnline = caseState.consoleStatus === "online";
      const changedLabel = isOnline
        ? "Changed: Investigation Console is online."
        : "No verified console activation yet.";
      const capabilityLabel = capabilityText(caseState.capabilityStatus);
      const reducedMotionDetail =
        isOnline && options.motionPreference === "reduced"
          ? " The state change is shown immediately without animation."
          : "";

      return {
        state: caseState.consoleStatus,
        eyebrow: isOnline ? "Verified case change" : "Case system status",
        heading: isOnline
          ? "Investigation Console online"
          : "Investigation Console offline",
        detail: `${caseState.consoleMessage}${reducedMotionDetail}`,
        textEquivalent: [
          `Case: ${caseState.caseTitle}.`,
          `Investigation Console status: ${caseState.consoleStatus}.`,
          caseState.consoleMessage,
          `Available tool: ${caseState.availableTool}.`,
          `Capability evidence: ${capabilityLabel}.`,
          `Locked possibility: ${caseState.lockedPossibility}.`,
          changedLabel,
        ].join(" "),
        changedLabel,
        motionCue:
          isOnline && options.motionPreference === "full"
            ? "console-activation"
            : "none",
      } satisfies SceneProjection;
    },
  };
}

function applyUnseenCaseEvent(
  caseState: CaseState,
  event: CaseEvent,
): CaseState {
  switch (event.type) {
    case "console_activated":
      return {
        ...caseState,
        consoleStatus: "online",
        consoleMessage: event.message,
        capabilityStatus:
          caseState.capabilityStatus === "unseen"
            ? "introduced"
            : caseState.capabilityStatus,
        timeline: [...caseState.timeline, event],
      };
    default:
      return assertNever(event.type);
  }
}

function capabilityText(status: CaseState["capabilityStatus"]): string {
  switch (status) {
    case "unseen":
      return "not yet observed";
    case "introduced":
      return "introduced";
    case "guided":
      return "demonstrated with guidance";
    case "independent":
      return "demonstrated independently";
    default:
      return assertNever(status);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported case value: ${String(value)}`);
}
