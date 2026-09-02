import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { type Diagnostic, lintKeymap, setDiagnostics } from "@codemirror/lint";
import {
  Annotation,
  Compartment,
  EditorState,
  StateEffect,
  StateField,
  Transaction,
  type Text,
} from "@codemirror/state";
import {
  Decoration,
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  type DecorationSet,
  type KeyBinding,
  type ViewUpdate,
} from "@codemirror/view";

import type {
  EditorAdapter,
  EditorDecoration,
  EditorDiagnostic,
  SourceChange,
} from "../contracts/editor";
import { nextSourceRevision } from "../contracts/shared";
import type { SourceRevision } from "../contracts/shared";

export interface CodeMirrorEditorOptions {
  readonly parent: HTMLElement;
  readonly source: string;
  readonly sourceRevision: SourceRevision;
  readonly readOnly?: boolean;
  readonly ariaLabel?: string;
  readonly ariaDescribedBy?: string;
}

const sourceOrigin = Annotation.define<SourceChange["origin"]>();
const explicitSourceRevision = Annotation.define<SourceRevision>();
const replaceDecorations = StateEffect.define<readonly EditorDecoration[]>();

function clampPosition(position: number, documentLength: number): number {
  if (!Number.isFinite(position)) {
    return 0;
  }
  return Math.max(0, Math.min(documentLength, Math.trunc(position)));
}

function decorationSet(document: Text, decorations: readonly EditorDecoration[]): DecorationSet {
  const ranges = decorations.flatMap((decoration) => {
    const from = clampPosition(decoration.range.from, document.length);
    const to = Math.max(from, clampPosition(decoration.range.to, document.length));
    const attributes = {
      "data-decoration-kind": decoration.kind,
      "data-decoration-label": decoration.label,
      title: decoration.label,
    };

    if (decoration.kind === "active-line" || from === to) {
      const line = document.lineAt(from);
      return [
        Decoration.line({
          class: `cm-guided-${decoration.kind}`,
          attributes,
        }).range(line.from),
      ];
    }

    return [
      Decoration.mark({
        class: `cm-guided-${decoration.kind}`,
        attributes,
      }).range(from, to),
    ];
  });

  return Decoration.set(ranges, true);
}

const decorationField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(current, transaction) {
    let next = current.map(transaction.changes);
    for (const effect of transaction.effects) {
      if (effect.is(replaceDecorations)) {
        next = decorationSet(transaction.state.doc, effect.value);
      }
    }
    return next;
  },
  provide: (field) => EditorView.decorations.from(field),
});

function accessibleAttributes(
  ariaLabel: string,
  ariaDescribedBy: string | undefined,
  readOnly: boolean,
): Record<string, string> {
  return {
    "aria-label": ariaLabel,
    "aria-multiline": "true",
    "aria-readonly": String(readOnly),
    autocapitalize: "off",
    autocomplete: "off",
    spellcheck: "false",
    ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
  };
}

function editorKeymap(): readonly KeyBinding[] {
  // CodeMirror's default Mod-Enter inserts a blank line. The mission shell owns
  // the Run shortcut, so that binding must bubble instead of being consumed.
  return [...defaultKeymap, ...historyKeymap, ...lintKeymap].filter(
    (binding) =>
      binding.key !== "Mod-Enter" && binding.key !== "Ctrl-Enter" && binding.key !== "Cmd-Enter",
  );
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

function moveFocusFromEditor(view: EditorView, backwards: boolean): boolean {
  const ownerDocument = view.dom.ownerDocument;
  const controls = Array.from(
    ownerDocument.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      element.getClientRects().length > 0 &&
      element.getAttribute("aria-hidden") !== "true",
  );
  const activeElement = ownerDocument.activeElement;
  const currentIndex = controls.findIndex(
    (element) => element === activeElement || element.contains(activeElement),
  );
  if (currentIndex < 0 || controls.length < 2) return false;

  const offset = backwards ? -1 : 1;
  const nextIndex = (currentIndex + offset + controls.length) % controls.length;
  controls[nextIndex]?.focus();
  return true;
}

function toCodeMirrorDiagnostic(
  diagnostic: EditorDiagnostic,
  documentLength: number,
): Diagnostic {
  const from = clampPosition(diagnostic.range.from, documentLength);
  const to = Math.max(from, clampPosition(diagnostic.range.to, documentLength));
  return {
    from,
    to,
    severity: diagnostic.severity,
    message: diagnostic.message,
    source: "First Contact mission",
  };
}

class CodeMirrorEditorAdapter implements EditorAdapter {
  readonly #view: EditorView;
  readonly #readOnly = new Compartment();
  readonly #contentAttributes = new Compartment();
  readonly #listeners = new Set<(change: SourceChange) => void>();
  readonly #ariaLabel: string;
  readonly #ariaDescribedBy: string | undefined;

  #source: string;
  #sourceRevision: SourceRevision;
  #isReadOnly: boolean;
  #destroyed = false;

  constructor(options: CodeMirrorEditorOptions) {
    this.#source = options.source;
    this.#sourceRevision = options.sourceRevision;
    this.#isReadOnly = options.readOnly ?? false;
    this.#ariaLabel = options.ariaLabel ?? "Investigation Console Python editor";
    this.#ariaDescribedBy = options.ariaDescribedBy;

    this.#view = new EditorView({
      parent: options.parent,
      doc: options.source,
      extensions: [
        lineNumbers(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        python(),
        decorationField,
        keymap.of(editorKeymap()),
        EditorView.domEventHandlers({
          keydown: (event, view) => {
            if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) {
              return false;
            }
            if (!moveFocusFromEditor(view, event.shiftKey)) return false;
            event.preventDefault();
            return true;
          },
        }),
        this.#readOnly.of([
          EditorState.readOnly.of(this.#isReadOnly),
          EditorView.editable.of(!this.#isReadOnly),
        ]),
        this.#contentAttributes.of(
          EditorView.contentAttributes.of(
            accessibleAttributes(this.#ariaLabel, this.#ariaDescribedBy, this.#isReadOnly),
          ),
        ),
        EditorView.updateListener.of((update) => this.#handleUpdate(update)),
      ],
    });
  }

  getSource(): { readonly source: string; readonly sourceRevision: SourceRevision } {
    return { source: this.#source, sourceRevision: this.#sourceRevision };
  }

  setSource(
    source: string,
    sourceRevision: SourceRevision,
    origin: SourceChange["origin"],
  ): void {
    if (this.#destroyed) {
      return;
    }

    if (this.#view.state.doc.toString() === source) {
      this.#source = source;
      this.#sourceRevision = sourceRevision;
      this.#emit({ source, sourceRevision, origin });
      return;
    }

    this.#view.dispatch({
      changes: { from: 0, to: this.#view.state.doc.length, insert: source },
      annotations: [
        sourceOrigin.of(origin),
        explicitSourceRevision.of(sourceRevision),
        Transaction.addToHistory.of(false),
      ],
    });
  }

  focus(): void {
    if (!this.#destroyed) {
      this.#view.focus();
    }
  }

  revealLine(line: number): void {
    if (this.#destroyed) {
      return;
    }
    const clampedLine = Math.max(1, Math.min(this.#view.state.doc.lines, Math.trunc(line) || 1));
    const position = this.#view.state.doc.line(clampedLine).from;
    this.#view.dispatch({
      effects: EditorView.scrollIntoView(position, { y: "center" }),
    });
  }

  setReadOnly(readOnly: boolean): void {
    if (this.#destroyed || this.#isReadOnly === readOnly) {
      return;
    }
    this.#isReadOnly = readOnly;
    this.#view.dispatch({
      effects: [
        this.#readOnly.reconfigure([
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!readOnly),
        ]),
        this.#contentAttributes.reconfigure(
          EditorView.contentAttributes.of(
            accessibleAttributes(this.#ariaLabel, this.#ariaDescribedBy, readOnly),
          ),
        ),
      ],
    });
  }

  setDiagnostics(diagnostics: readonly EditorDiagnostic[]): void {
    if (this.#destroyed) {
      return;
    }
    this.#view.dispatch(
      setDiagnostics(
        this.#view.state,
        diagnostics.map((diagnostic) =>
          toCodeMirrorDiagnostic(diagnostic, this.#view.state.doc.length),
        ),
      ),
    );
  }

  setDecorations(decorations: readonly EditorDecoration[]): void {
    if (!this.#destroyed) {
      this.#view.dispatch({ effects: replaceDecorations.of(decorations) });
    }
  }

  onSourceChange(listener: (change: SourceChange) => void): () => void {
    if (this.#destroyed) {
      return () => undefined;
    }
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  destroy(): void {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;
    this.#listeners.clear();
    this.#view.destroy();
  }

  #handleUpdate(update: ViewUpdate): void {
    if (!update.docChanged || this.#destroyed) {
      return;
    }

    let origin: SourceChange["origin"] = "learner";
    let revision: SourceRevision | undefined;
    for (const transaction of update.transactions) {
      origin = transaction.annotation(sourceOrigin) ?? origin;
      revision = transaction.annotation(explicitSourceRevision) ?? revision;
    }

    this.#source = update.state.doc.toString();
    this.#sourceRevision = revision ?? nextSourceRevision(this.#sourceRevision);
    this.#emit({
      source: this.#source,
      sourceRevision: this.#sourceRevision,
      origin,
    });
  }

  #emit(change: SourceChange): void {
    for (const listener of [...this.#listeners]) {
      listener(change);
    }
  }
}

export function createEditorAdapter(options: CodeMirrorEditorOptions): EditorAdapter {
  return new CodeMirrorEditorAdapter(options);
}
