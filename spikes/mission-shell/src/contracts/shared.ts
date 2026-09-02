export type ExperienceVariant = "direct" | "operations";
export type RuntimeMode = "scripted" | "pyodide";
export type MotionPreference = "full" | "reduced";
export type SourceRevision = number;
export type IsoTimestamp = string;

export type Unsubscribe = () => void;

export interface RevisionedSource {
  readonly source: string;
  readonly sourceRevision: SourceRevision;
}

export function nextSourceRevision(current: SourceRevision): SourceRevision {
  if (!Number.isSafeInteger(current) || current < 0 || current >= Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Source revision must be an incrementable non-negative safe integer.");
  }
  return current + 1;
}
