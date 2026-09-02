import type {
  FeedbackPacket,
  MissionStage,
  Variant,
  VariantShell,
} from "./model";

export const STARTER_SOURCE = 'print("Hello, Sophia!")';
export const TWO_LINE_SOURCE =
  'print("Console online")\nprint("Case ready")';
export const CLUE_SOURCE = 'print("Case ready")';
export const BROKEN_SOURCE = 'print("Case ready)';
export const FIELD_TEST_OUTPUT = "Evidence channel ready";

export const FIRST_CONTACT = {
  id: "case-001.first-contact",
  caseTitle: "The Midnight Badge",
  missionTitle: "First Contact",
  objective:
    "Use one Python-looking instruction to establish a message channel, inspect what happens, repair a punctuation clue, and prove the pattern on a fresh Field Test.",
  caseQuestion:
    "Can one line establish a trusted message channel with the unexplained midnight badge record?",
  feedbackWording: "Goal · Observed · Clue · Next Action",
  rewardEvidence: {
    capability: "First execution · Introduced",
    artifact: "A verified one-line console message",
    reward: "Investigation Console online",
  },
  stageOrder: [
    "first-run",
    "personalize",
    "personalize-result",
    "prediction",
    "trace",
    "intentional-error",
    "repair",
    "repair-result",
    "field-test",
    "debrief",
  ] satisfies MissionStage[],
} as const;

export const VARIANT_SHELLS: Record<Variant, VariantShell> = {
  direct: {
    variant: "direct",
    label: "Variant A · Direct Mission",
    shortLabel: "A · Direct Mission",
    route: "/direct",
    entry: "mission",
    exit: "direct-complete",
  },
  "operations-center": {
    variant: "operations-center",
    label: "Variant B · Operations Center + Mission",
    shortLabel: "B · Operations Center",
    route: "/operations-center",
    entry: "hub-before",
    exit: "hub-after",
  },
};

export const CONTROL_VARIABLES = Object.freeze({
  missionDefinition: FIRST_CONTACT.id,
  learningObjective: FIRST_CONTACT.objective,
  starterSource: STARTER_SOURCE,
  storyFacts: Object.freeze([
    "A synthetic badge event occurred at an unusual time.",
    "The event is an anomaly, not proof of wrongdoing.",
    "The Mission establishes a message channel; it does not solve the Case.",
  ]),
  feedbackWording: FIRST_CONTACT.feedbackWording,
  rewardEvidence: FIRST_CONTACT.rewardEvidence,
  stageOrder: FIRST_CONTACT.stageOrder,
  accessibility: Object.freeze([
    "keyboard-complete",
    "status-announcements",
    "reduced-motion-equivalent",
    "non-color-status",
  ]),
});

export const UNMATCHED_QUOTE_FEEDBACK: FeedbackPacket = {
  kind: "calm-error",
  goal: "Run a complete text value through print.",
  observed:
    "The text began with a quotation mark, but the line ended before Python found its matching partner.",
  clue: "The opening quotation mark after the parenthesis has no closing match before the final parenthesis.",
  nextAction:
    "Add the missing quotation mark after ready, then run the line again.",
};

export const FIELD_TEST_FEEDBACK: FeedbackPacket = {
  kind: "guidance",
  goal: `Send the exact message “${FIELD_TEST_OUTPUT}” to the console.`,
  observed: "The current line did not produce that one exact output line.",
  clue: "Keep the print instruction, parentheses, and a matching pair of quotation marks. Check the words inside them.",
  nextAction: "Revise your line and submit the Field Test again.",
};

export function getMissionDefinition(_variant: Variant) {
  return FIRST_CONTACT;
}
