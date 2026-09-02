import type {
  CausalityLevel,
  EntryVariant,
  FeedbackPacket,
  MissionBeat,
  VariantGeometry,
} from "./model";

export const STARTER_SOURCE = 'print("Hello, Sophia!")';
export const TWO_LINE_SOURCE =
  'print("Console online")\nprint("Case folder ready")';
export const CLUE_SOURCE = 'print("Case folder ready")';
export const BROKEN_SOURCE = 'print("Case folder ready)';
export const FIELD_TEST_OUTPUT = "Investigation console online";

export const MISSION_BEATS = Object.freeze([
  {
    id: "activate",
    label: "Activate",
    summary: "Run the first message and distinguish source from output.",
  },
  {
    id: "experiment",
    label: "Experiment",
    summary: "Personalize the message and see the changed consequence.",
  },
  {
    id: "predict",
    label: "Predict",
    summary: "Predict and trace two lines inside one connected encounter.",
  },
  {
    id: "investigate",
    label: "Investigate",
    summary: "Create and repair an unmatched quotation mark.",
  },
  {
    id: "prove",
    label: "Prove",
    summary: "Complete a fresh reduced-support Field Test.",
  },
] satisfies ReadonlyArray<{
  id: MissionBeat;
  label: string;
  summary: string;
}>);

export const FIRST_CONTACT = Object.freeze({
  id: "case-001.first-contact.geometry-lab-1",
  caseTitle: "The Midnight Badge",
  missionTitle: "First Contact",
  objective:
    "Use a small Python instruction to open the First Contact file, inspect what Python does, repair one punctuation clue, and prove the pattern on a fresh task.",
  caseQuestion:
    "Can one clear message open the First Contact file without drawing a conclusion about the midnight badge event?",
  facts: Object.freeze([
    "A synthetic badge event was recorded at 00:43.",
    "The time is unusual; it does not prove wrongdoing.",
    "The first task is to establish a readable message channel.",
  ]),
  beats: MISSION_BEATS,
  feedbackWording: "Goal · Observed · Clue · Next action",
  capabilityEvidence: "First execution · Introduced",
  reward: "Investigation Console online",
});

export const VARIANT_GEOMETRIES: Record<EntryVariant, VariantGeometry> = {
  direct: {
    variant: "direct",
    label: "Variant A · Direct Mission",
    shortLabel: "A · Direct",
    route: "/direct",
    entry: "mission",
    completion: "direct-complete",
  },
  "hub-first": {
    variant: "hub-first",
    label: "Variant B · Hub First",
    shortLabel: "B · Hub first",
    route: "/hub-first",
    entry: "hub-before",
    completion: "hub-after",
  },
  "earned-hub": {
    variant: "earned-hub",
    label: "Variant C · Earned Hub",
    shortLabel: "C · Earned hub",
    route: "/earned-hub",
    entry: "cold-open",
    completion: "earned-hub",
  },
};

export const CAUSALITY_LEVELS: Record<
  CausalityLevel,
  { label: string; reviewerDescription: string }
> = {
  a: {
    label: "A · Output only",
    reviewerDescription: "Runtime output appears without a visible Case reaction.",
  },
  b: {
    label: "B · Output + Case",
    reviewerDescription: "Output appears and the Case folder changes.",
  },
  c: {
    label: "C · Explicit bridge",
    reviewerDescription:
      "Source, value, output, destination, and changed evidence are connected.",
  },
};

export const CONTROL_VARIABLES = Object.freeze({
  missionDefinition: FIRST_CONTACT.id,
  content: FIRST_CONTACT,
  starterSource: STARTER_SOURCE,
  twoLineSource: TWO_LINE_SOURCE,
  fieldTestOutput: FIELD_TEST_OUTPUT,
  feedbackWording: FIRST_CONTACT.feedbackWording,
  capabilityEvidence: FIRST_CONTACT.capabilityEvidence,
  reward: FIRST_CONTACT.reward,
  accessibility: Object.freeze([
    "keyboard-complete",
    "visible-focus",
    "semantic-source-output-case",
    "reduced-motion-equivalence",
    "text-causal-equivalent",
    "non-color-status",
  ]),
});

export const UNMATCHED_QUOTE_FEEDBACK: FeedbackPacket = {
  kind: "calm-error",
  goal: "Run one complete text value through print.",
  observed:
    "Python found the beginning of the message, but the line ended before it found the matching quotation mark.",
  clue: "The quotation mark before Case needs a partner after ready.",
  nextAction: "Add the missing quotation mark after ready, then run the line again.",
};

export const FIELD_TEST_FEEDBACK: FeedbackPacket = {
  kind: "guidance",
  goal: `Print the exact message “${FIELD_TEST_OUTPUT}”.`,
  observed: "The current line did not produce that one exact output line.",
  clue:
    "Use print, parentheses, and a matching pair of quotation marks. Check every word inside them.",
  nextAction: "Revise the line and submit the Field Test again.",
};

export function getMissionDefinition(_variant: EntryVariant) {
  return FIRST_CONTACT;
}
