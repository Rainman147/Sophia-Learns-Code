# Root integration record

The root integrator established the shared contracts in commit `f176e8dc36cb0e0c70fd6d96844a3ec9e098c7b1` before four bounded workstreams began. The workstream handoffs in this directory are historical inputs; this file records the integrated result.

## Partition

- Workstream A owned Pyodide worker execution, normalization, cancellation, replacement, and runtime metrics.
- Workstream B owned the Mission actor and CodeMirror implementation behind `EditorAdapter`.
- Workstream C owned the deterministic evaluator, semantic Case events/state, scene projection, and `EvidenceStore` implementations.
- Workstream D owned test, accessibility, measurement, failure-review, and license-ledger scaffolding.
- The root alone owned shared contracts, routes, the integrated controller, variant boundaries, package/build decisions, evidence generation, reports, and Git/PR integration.

No workstreams edited the same contract files concurrently or created competing application frameworks.

## Root integration findings and fixes

1. Next/Turbopack emitted the worker wrapper as a classic worker, which Pyodide rejected. The root retained the `ExecutionRuntime` contract and added a pinned esbuild step that emits one same-origin native ESM worker.
2. The authored Mission trace originally allowed the controlled-error boundary to advance implicitly. The root made the third transition explicit so the learner sees trace step 2 before continuing.
3. Browser QA found stage changes retaining a stale scroll position. Mission boundaries now restore the viewport to the top.
4. Firefox kept Tab inside CodeMirror. The adapter now moves Tab and Shift+Tab through the visible document controls, while the Mission retains a separate explicit Run action.
5. A syntactically valid but incorrect result exposed a read-only dead end. Failed result checkpoints now remain editable; passing checkpoints remain read-only.
6. Measurement exposed two harness races: hydration was mistaken for a route decision, and CodeMirror `fill()` could append under concurrency. The shared automation path now waits for explicit route markers and replaces source with keyboard-realistic select-all/input plus exact-source assertions.
7. Visual QA exposed missing CSS custom properties on the direct completion boundary and framework dev UI in captures. The real CTA contrast was fixed; the capture script suppresses only the development badge.
8. Scripted review mode previously inherited “real Python” completion copy. Runtime-aware copy now keeps scripted evidence explicitly synthetic while the default Pyodide route retains the real-execution claim.

## Integrated verification

- TypeScript and ESLint: pass.
- Vitest: 37/37 pass across seven files.
- Playwright: 54 pass, six intentional project-scope skips, zero failures across 60 cases in Chromium and Firefox at laptop and narrow viewports.
- Both laptop engines execute real Pyodide, cancellation, worker generation replacement, stale-result rejection, source preservation, and recovery.
- Static Next build: pass for `/`, `/direct`, and `/operations`.
- npm audit: zero reported vulnerabilities at the recorded lockfile state.
- Chromium, Firefox, Operations-entry, bundle/license, and screenshot artifacts were generated from the integrated tree.

The reports, not these workstream notes, own final candidate dispositions. No winner and no production architecture are selected here.
