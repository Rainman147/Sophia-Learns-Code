"use client";

import { useId, useLayoutEffect, useRef } from "react";

import type {
  EditorAdapter,
  EditorDecoration,
  EditorDiagnostic,
  SourceChange,
} from "../contracts/editor";
import type { SourceRevision } from "../contracts/shared";
import { createEditorAdapter } from "./code-mirror-editor-adapter";
import styles from "./guided-editor.module.css";

export interface GuidedEditorProps {
  readonly source: string;
  readonly sourceRevision: SourceRevision;
  readonly sourceOrigin?: Exclude<SourceChange["origin"], "learner">;
  readonly readOnly?: boolean;
  readonly diagnostics?: readonly EditorDiagnostic[];
  readonly decorations?: readonly EditorDecoration[];
  readonly ariaLabel?: string;
  readonly instructions?: string;
  readonly className?: string;
  readonly onSourceChange?: (change: SourceChange) => void;
  readonly onAdapterReady?: (adapter: EditorAdapter) => void;
}

const DEFAULT_INSTRUCTIONS =
  "Edit Python here. Tab moves to the next control. Use the mission Run control to execute your code.";

export function GuidedEditor({
  source,
  sourceRevision,
  sourceOrigin = "mission",
  readOnly = false,
  diagnostics = [],
  decorations = [],
  ariaLabel = "Investigation Console Python editor",
  instructions = DEFAULT_INSTRUCTIONS,
  className,
  onSourceChange,
  onAdapterReady,
}: GuidedEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<EditorAdapter | null>(null);
  const sourceChangeRef = useRef(onSourceChange);
  const adapterReadyRef = useRef(onAdapterReady);
  const setupRef = useRef({ source, sourceRevision, readOnly });
  const reactId = useId();
  const assistanceId = `guided-editor-${reactId.replaceAll(":", "")}-assistance`;

  useLayoutEffect(() => {
    sourceChangeRef.current = onSourceChange;
    adapterReadyRef.current = onAdapterReady;
    setupRef.current = { source, sourceRevision, readOnly };
  }, [onAdapterReady, onSourceChange, readOnly, source, sourceRevision]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const adapter = createEditorAdapter({
      parent: host,
      source: setupRef.current.source,
      sourceRevision: setupRef.current.sourceRevision,
      readOnly: setupRef.current.readOnly,
      ariaLabel,
      ariaDescribedBy: assistanceId,
    });
    const unsubscribe = adapter.onSourceChange((change) => sourceChangeRef.current?.(change));
    adapterRef.current = adapter;
    adapterReadyRef.current?.(adapter);

    return () => {
      unsubscribe();
      adapter.destroy();
      adapterRef.current = null;
    };
  }, [ariaLabel, assistanceId]);

  useLayoutEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) {
      return;
    }
    const current = adapter.getSource();
    if (current.source !== source || current.sourceRevision !== sourceRevision) {
      adapter.setSource(source, sourceRevision, sourceOrigin);
    }
  }, [source, sourceOrigin, sourceRevision]);

  useLayoutEffect(() => {
    adapterRef.current?.setReadOnly(readOnly);
  }, [readOnly]);

  useLayoutEffect(() => {
    adapterRef.current?.setDiagnostics(diagnostics);
  }, [diagnostics]);

  useLayoutEffect(() => {
    adapterRef.current?.setDecorations(decorations);
  }, [decorations]);

  const rootClassName = className ? `${styles.root} ${className}` : styles.root;

  return (
    <section className={rootClassName} aria-label="Investigation Console">
      <div ref={hostRef} className={styles.host} />
      <div id={assistanceId} className={styles.assistance}>
        <p>{instructions}</p>
        {diagnostics.length > 0 ? (
          <ul className={styles.diagnosticList} aria-label="Editor diagnostics">
            {diagnostics.map((diagnostic) => (
              <li key={diagnostic.id}>
                <span className={styles.severity}>{diagnostic.severity}:</span>{" "}
                {diagnostic.message}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
