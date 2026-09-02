# Workstream B — Mission flow and guided editor

**Prototype status:** transferable contracts and findings; disposable implementation pending the architecture checkpoint.

**Pinned candidates:** XState 5.32.6 and CodeMirror 6 (`@codemirror/view` 6.43.10, `state` 6.7.2, `commands` 6.11.0, `lint` 6.9.7, `lang-python` 6.2.1).

**Authority:** `VISION.md`, `docs/20-prebuild-architecture-and-research-gates.md`, `docs/22-rebaseline-decisions.md`, issue #26, and the root-owned contracts under `src/contracts`.

## What was implemented

- `createMissionActor(definition, runtimeMode)` returns only the root `MissionActor` contract. XState types do not cross the module boundary.
- The machine exposes each contract `MissionStage`: briefing, first run/result, personalization/result, prediction, two trace steps, controlled error/feedback, repair/result, fresh Field Test/result, debrief, reward, completion, pause, and clean stop.
- Run results are accepted only when both request ID and source revision match the actor's active run. A stale result changes only the calm status message; it cannot change stage, source, or `lastExecution`.
- Runtime error, rejection, timeout, and cancellation paths never replace learner source. Authored source replacement occurs only on explicit mission transitions, Field Test entry, or reset.
- Pause and clean stop remember the exact actionable stage and preserve source. Restore requires matching mission ID and version; reset advances the revision so in-flight results become stale.
- `createEditorAdapter(options)` implements the exact root `EditorAdapter` using CodeMirror. `GuidedEditor` supplies the React lifecycle, label, instructions, diagnostic text, controlled source synchronization, and teardown.
- CodeMirror's `Mod-Enter` binding is removed so the shell owns Run. No Tab binding is installed, so Tab and Shift+Tab leave the editor. Enter remains ordinary code editing while a focused shell button still activates with Enter.

## XState 5 versus a small explicit reducer

### Evidence from this spike

The flow has 19 public stages, asynchronous result/evaluation handoff, request and revision guards, global reset/restore behavior, resumable pause/stop behavior, and stage-specific retry transitions. Workstream D's current actor suite exercises six paths and passes all six. The statechart keeps legal transitions beside each stage, and named guards make stale-result and deterministic-evaluation boundaries inspectable.

XState's official v5 documentation describes state/event transitions as deterministic and provides actor lifecycle, subscriptions, guards, and transition inspection. Those are directly used here rather than imported speculatively:

- [XState events and transitions](https://stately.ai/docs/transitions)
- [XState inspection](https://stately.ai/docs/inspection)
- [XState typed setup](https://stately.ai/docs/setup)

The cost is real. The mission module is intentionally explicit and currently about 770 source lines, with substantial routing for pause/resume/restore. TypeScript inference becomes awkward when transition fragments are generated, so helper action names and targets must remain narrow. The installed `xstate.esm.js` entry file is 17,848 bytes before bundling, minification, compression, and transitive resolution; this is **not** a client-bundle measurement. Root bundle measurement must decide payload acceptability.

A small reducer could represent this specific linear mission with a `{stage, context}` object and a `switch(event.type)`. It would remove the XState runtime dependency and likely reduce framework-specific type friction. It would not remove the domain complexity: the reducer still needs guard ordering, actor subscriptions, lifecycle, pause/stop history, compatible restore, request identity, revision rejection, and a no-dead-end transition audit. Building those facilities locally would be justified only if the second mission remains similarly linear and measured payload or maintenance cost favors it.

### Recommendation

**XState 5: REVISE.** Keep it isolated behind `MissionActor` for this spike and carry it to the architecture checkpoint, but do not declare it production architecture yet. Before accepting it, simplify the routing code after the browser tests and implement the second mission through the same actor shape without copying a machine.

**Small explicit reducer: DEFER.** Keep it as the bounded fallback, not a parallel implementation. Revisit when either (a) the measured XState share of the client bundle exceeds the agreed budget, or (b) Identity Tag demonstrates no need for hierarchical, parallel, invoked, delayed, or inspectable statechart behavior and a reducer prototype passes the same transition model with materially less code.

## CodeMirror 6 versus a textarea

### Evidence from this spike

The exact adapter contract requires source/revision events, focus, line reveal, diagnostics, arbitrary range decorations, read-only reconfiguration, and teardown. CodeMirror provides these through its state/view split, transactions, effects, decoration sets, lint diagnostics, and compartments. The implementation did not need DOM overlays, cursor mirroring, or a second source of truth. The official reference documents those primitives, while its Tab guidance intentionally prioritizes keyboard escape:

- [CodeMirror reference manual](https://codemirror.net/docs/ref/)
- [CodeMirror decoration example](https://codemirror.net/examples/decoration/)
- [CodeMirror handling-Tab guidance](https://codemirror.net/examples/#handling-tab)

A plain textarea would be smaller and has strong native form semantics. It can satisfy source changes, focus, read-only, labeling, and teardown. It cannot directly provide syntax highlighting, per-range diagnostics, active-line/changed-value/error-clue decorations, or reliable reveal-line behavior. Adding a synchronized highlighted overlay and custom diagnostic geometry would recreate a fragile editor and weaken the replacement seam. A textarea remains useful as an emergency fallback if CodeMirror blocks the first useful interaction, but it is not feature-equivalent to this contract.

Raw installed module sizes are not bundle sizes: `@codemirror/view` is 491,099 bytes, `state` 147,001, `commands` 84,656, `lint` 36,579, and `lang-python` 13,319 before tree-shaking, minification, compression, and shared transitive dependencies. The root's production build report is the relevant measurement.

### Recommendation

**CodeMirror 6: KEEP** as the leading spike candidate, strictly behind `EditorAdapter`. It met every adapter operation without adding dependencies or leaking CodeMirror into mission code.

**Textarea: DEFER** as a tested fallback concept rather than a competing implementation. Revisit if keyboard/screen-reader browser tests reveal a blocker that cannot be fixed inside the adapter, or if measured editor payload/startup exceeds the architecture checkpoint budget enough to delay first useful interaction.

## Keyboard and accessibility risks

Implemented controls:

- The editable surface receives an explicit “Investigation Console Python editor” label and a described instruction explaining Run and Tab behavior.
- The editor has a visible focus outline, high-contrast/forced-colors treatment, severity words in diagnostic text, and no color-only diagnostic dependency.
- Tab/Shift+Tab are not editor commands. `Mod-Enter`, `Ctrl-Enter`, and `Cmd-Enter` are excluded from the CodeMirror keymap so the shell can own Run.
- Default navigation, selection, undo/redo, Enter editing, and the lint next-diagnostic key remain available.
- Decorations have stable kind/label metadata, but mission/trace text remains the semantic authority; a decoration is never the only explanation.
- Read-only state updates both CodeMirror behavior and `aria-readonly`. Destroy is idempotent and clears listeners.

Risks requiring real-browser verification:

- CodeMirror is a contenteditable-based editor; announcements and cursor behavior vary across browser/screen-reader pairs. Verify at least Chromium + NVDA and one second combination if available. One environment is a limitation, not evidence of parity.
- The shell must install the Run shortcut above the editor and test that the unhandled modifier event reaches it exactly once. It must not treat plain Enter in the editor as Run.
- Programmatic source replacement can move the cursor because the adapter replaces the complete document. Mission transitions should restore focus intentionally and must not surprise a learner mid-edit.
- Diagnostics are available through CodeMirror and repeated in described text, but the shell's polite live status must own timing so each keystroke does not become a screen-reader firehose.
- Read-only content can still require focus for review and line navigation; verify the chosen browser exposes it sensibly.
- IME, dictation, browser zoom, high contrast, and mobile virtual keyboard behavior remain unmeasured.
- Tab-to-indent is intentionally unavailable in First Contact. Before the first indentation mission, decide on an accessible, discoverable opt-in that always preserves a keyboard escape path.

## Seam recommendations and revisit triggers

| Candidate or seam | Decision | Evidence now | Exact revisit trigger |
|---|---|---|---|
| `MissionActor` seam | **KEEP** | XState remains private; tests consume only the root contract. | Contract cannot express a second mission's required learner-visible state without framework leakage. |
| XState 5.32.6 | **REVISE** | Explicit guarded flow passes the current six-path suite. | Identity Tag reuse result or measured bundle/maintenance budget breach. |
| Small reducer | **DEFER** | Plausible for a linear flow, but would duplicate lifecycle/guard/restore machinery today. | XState exceeds budget or second mission remains linear enough for a same-tests comparison. |
| `EditorAdapter` seam | **KEEP** | Mission code has no CodeMirror imports; all required operations fit the contract. | A second editor requires semantics the contract cannot represent without vendor terms. |
| CodeMirror 6 | **KEEP** | All adapter operations implemented with native CodeMirror primitives; no extra dependency. | A real browser accessibility blocker, unacceptable first-use latency, or bundle-budget failure. |
| Textarea fallback | **DEFER** | Native semantics are attractive, but it cannot meet diagnostics/decorations/reveal-line parity alone. | CodeMirror blocks useful interaction and the minimum mission can explicitly reduce the editor contract. |

No production architecture is selected by these recommendations. The actor and editor remain spike candidates until root integration, real-browser testing, measurements, owner comparison, and the architecture checkpoint.
