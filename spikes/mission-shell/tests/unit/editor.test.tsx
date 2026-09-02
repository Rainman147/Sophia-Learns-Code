import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { EditorAdapter, SourceChange } from "../../src/contracts";
import { GuidedEditor, createEditorAdapter } from "../../src/editor";

describe("CodeMirror EditorAdapter", () => {
  it("keeps CodeMirror behind the root adapter and preserves explicit revisions", async () => {
    const parent = document.createElement("div");
    document.body.append(parent);
    const adapter = createEditorAdapter({
      parent,
      source: 'print("Hello, Sophia!")',
      sourceRevision: 2,
      ariaLabel: "Investigation Console Python editor",
      ariaDescribedBy: "editor-help",
    });
    const changes: SourceChange[] = [];
    const unsubscribe = adapter.onSourceChange((change) => changes.push(change));

    expect(adapter.getSource()).toEqual({
      source: 'print("Hello, Sophia!")',
      sourceRevision: 2,
    });
    const editable = parent.querySelector<HTMLElement>("[contenteditable='true']");
    expect(editable).toHaveAttribute("role", "textbox");
    expect(editable).toHaveAttribute("aria-label", "Investigation Console Python editor");
    expect(editable).toHaveAttribute("aria-describedby", "editor-help");
    expect(editable).toHaveAttribute("aria-multiline", "true");

    adapter.setSource('print("Restored")', 8, "resume");
    expect(adapter.getSource()).toEqual({
      source: 'print("Restored")',
      sourceRevision: 8,
    });
    expect(changes.at(-1)).toEqual({
      source: 'print("Restored")',
      sourceRevision: 8,
      origin: "resume",
    });
    expect(editable).toHaveTextContent('print("Restored")');

    adapter.setReadOnly(true);
    expect(parent.querySelector("[role='textbox']")).toHaveAttribute("aria-readonly", "true");
    expect(parent.querySelector("[role='textbox']")).not.toHaveAttribute("contenteditable", "true");

    adapter.setReadOnly(false);
    adapter.focus();
    expect(parent.querySelector("[role='textbox']")).toHaveFocus();

    unsubscribe();
    adapter.destroy();
    parent.remove();
  });

  it("renders bounded diagnostics and semantic decorations without changing source", async () => {
    const parent = document.createElement("div");
    document.body.append(parent);
    const adapter = createEditorAdapter({
      parent,
      source: 'print("Case ready)',
      sourceRevision: 4,
    });

    adapter.setDiagnostics([
      {
        id: "missing-quote",
        range: { from: 6, to: 18 },
        severity: "error",
        message: "Add the matching closing quotation mark.",
      },
    ]);
    adapter.setDecorations([
      {
        id: "error-clue",
        range: { from: 6, to: 18 },
        kind: "error-clue",
        label: "Opening quote without a partner",
      },
    ]);

    await waitFor(() => {
      expect(parent.querySelector("[data-decoration-kind='error-clue']")).toHaveAttribute(
        "data-decoration-label",
        "Opening quote without a partner",
      );
    });
    expect(parent.textContent).toContain("Case ready");
    expect(adapter.getSource()).toEqual({
      source: 'print("Case ready)',
      sourceRevision: 4,
    });

    adapter.revealLine(999);
    adapter.destroy();
    parent.remove();
  });
});

describe("GuidedEditor", () => {
  it("connects visible instructions and diagnostics to the labelled editable surface", async () => {
    const onAdapterReady = vi.fn<(adapter: EditorAdapter) => void>();
    const { rerender } = render(
      <GuidedEditor
        source={'print("Hello, Sophia!")'}
        sourceRevision={0}
        diagnostics={[
          {
            id: "clue",
            range: { from: 6, to: 7 },
            severity: "error",
            message: "A matching quote is required.",
          },
        ]}
        onAdapterReady={onAdapterReady}
      />,
    );

    const editor = await screen.findByRole("textbox", {
      name: "Investigation Console Python editor",
    });
    const describedBy = editor.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy ?? "")).toHaveTextContent(
      /Tab moves to the next control/i,
    );
    expect(screen.getByRole("list", { name: "Editor diagnostics" })).toHaveTextContent(
      "A matching quote is required.",
    );
    expect(onAdapterReady).toHaveBeenCalledOnce();

    rerender(
      <GuidedEditor
        source={'print("Resumed")'}
        sourceRevision={12}
        sourceOrigin="resume"
        readOnly
        diagnostics={[]}
        onAdapterReady={onAdapterReady}
      />,
    );

    await waitFor(() => {
      expect(onAdapterReady.mock.calls[0]?.[0]?.getSource()).toEqual({
        source: 'print("Resumed")',
        sourceRevision: 12,
      });
    });
    expect(editor).toHaveAttribute("aria-readonly", "true");
    expect(screen.queryByRole("list", { name: "Editor diagnostics" })).not.toBeInTheDocument();
  });
});
