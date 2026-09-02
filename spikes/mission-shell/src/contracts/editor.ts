import type { RevisionedSource, SourceRevision, Unsubscribe } from "./shared";

export interface SourceRange {
  readonly from: number;
  readonly to: number;
}

export interface EditorDiagnostic {
  readonly id: string;
  readonly range: SourceRange;
  readonly severity: "info" | "warning" | "error";
  readonly message: string;
}

export interface EditorDecoration {
  readonly id: string;
  readonly range: SourceRange;
  readonly kind: "active-line" | "changed-value" | "error-clue";
  readonly label: string;
}

export interface SourceChange extends RevisionedSource {
  readonly origin: "learner" | "mission" | "reset" | "resume";
}

export interface EditorAdapter {
  getSource(): RevisionedSource;
  setSource(source: string, sourceRevision: SourceRevision, origin: SourceChange["origin"]): void;
  focus(): void;
  revealLine(line: number): void;
  setReadOnly(readOnly: boolean): void;
  setDiagnostics(diagnostics: readonly EditorDiagnostic[]): void;
  setDecorations(decorations: readonly EditorDecoration[]): void;
  onSourceChange(listener: (change: SourceChange) => void): Unsubscribe;
  destroy(): void;
}
