import type { ExperienceVariant } from "../contracts/shared";

export interface VariantConfig {
  readonly id: ExperienceVariant;
  readonly label: string;
  readonly route: "/direct/" | "/operations/";
  readonly entrySurface: "mission" | "operations-center";
  readonly completionSurface: "compact-mission-panel" | "changed-operations-center";
}

export const VARIANTS: Readonly<Record<ExperienceVariant, VariantConfig>> = {
  direct: {
    id: "direct",
    label: "Variant A · Direct Mission",
    route: "/direct/",
    entrySurface: "mission",
    completionSurface: "compact-mission-panel",
  },
  operations: {
    id: "operations",
    label: "Variant B · Operations Center + Mission",
    route: "/operations/",
    entrySurface: "operations-center",
    completionSurface: "changed-operations-center",
  },
};

export const CONTROLLED_PARITY = [
  "mission definition",
  "mission state sequence",
  "code tasks and runtime",
  "story facts",
  "feedback wording",
  "case event",
  "evidence and reward",
  "accessibility support",
  "visual tokens",
] as const;
