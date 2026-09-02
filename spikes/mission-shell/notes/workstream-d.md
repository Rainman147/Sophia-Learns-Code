# Workstream D — verification, accessibility, performance, and failure analysis

**Prototype status:** throwaway technical experiment. This package verifies the issue #26 spike; it does not declare production architecture or select an issue #22 experience winner.

**Authority baseline:** `f176e8dc36cb0e0c70fd6d96844a3ec9e098c7b1` on `spike/mission-shell-stack`.

## Evidence-status rule

Only an executed command or observed browser session may become a result. `Implemented` below means a check exists, not that the integrated spike has passed it. Root integration commands, browser versions, hardware, timings, screenshots, and assistive-technology observations remain **PENDING ROOT RUN** until the root integrator records them.

Subagent preflight as of 2026-09-01:

- `npm run typecheck`: passed after the owned Playwright config fix and root integration updates.
- `npm run lint`: passed.
- `npm test`: 7 files and 37 tests passed.
- `npx playwright test --list`: 56 project/test combinations discovered across Chromium/Firefox laptop/narrow projects; this validates collection, not browser behavior.
- `node --check scripts/measure.mjs` and `node --check scripts/bundle-report.mjs`: passed.
- Real browser, axe, real Pyodide, bundle, and performance results: **PENDING ROOT RUN**.

An early contract test found that `nextSourceRevision(Number.MAX_SAFE_INTEGER)` returned an unsafe value. The root contract owner added the overflow guard; the regression test now passes. An early concurrent `RuntimeStatusTracker` optional-observer type error was likewise resolved before the clean typecheck above.

## Root integration commands

Run from `spikes/mission-shell` after all workstreams are integrated:

```text
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium firefox
npm run test:e2e
npm run test:e2e:real
npm run test:a11y
npm run measure -- --browser chromium --output artifacts/measurements/chromium.json
npm run measure -- --browser firefox --output artifacts/measurements/firefox.json
npm run measure:bundle -- --output artifacts/measurements/bundle-report.json
```

Do not turn a missing browser binary, unavailable CDP metric, absent screen reader, or one-host limitation into a pass. Record it as a limitation.

## Test matrix

| Requirement | Deterministic/unit evidence | Real-browser evidence | Status before root run |
|---|---|---|---|
| Typed request/result shape | `tests/unit/contracts.test.ts` plus strict TypeScript | Output identity/revision attributes | Implemented; root run pending |
| Valid output and normalized unmatched quote | Scripted runtime and evaluator tests | Both variants; real runtime tagged `@real-runtime` | Pending runtime integration |
| Source preservation after error | MissionActor plus runtime tests | Error-repair path reads editor before repair | Implemented/pending browser |
| Revision propagation and stale rejection | Contract, runtime, MissionActor tests | Superseded run never renders stale text/revision | Implemented/pending browser |
| Timeout, cancellation, replacement, recovery | Scripted/fake-worker runtime tests | Real worker cancellation and valid rerun | Pending runtime export/browser |
| Runtime and Mission reset | Runtime and MissionActor tests | Full local reset returns authored source and offline Case | Implemented/pending browser |
| Mission transitions/no dead ends | Full authored stage-order test | Keyboard completion in both variants | Unit preflight passed; browser pending |
| Deterministic evaluator | Exact output, mismatch, task identity, Field Test | Same feedback in both variants | Unit preflight passed; browser pending |
| Semantic event and CaseState | Event emission, idempotent reducer, projection parity | Case consequence and text equivalent | Unit preflight passed; browser pending |
| Evidence persistence/reload/export/reset | Memory and fake-IndexedDB adapter parity | Reload/resume, download export, full reset | Unit preflight passed; browser pending |
| Guided editor adapter | Source revision, diagnostics, decorations, focus, cleanup | Label, keyboard editing, focus visibility | Pending editor export |
| Accessibility | Semantic component assertions | Axe plus manual-behavior assertions | Pending browser |
| Performance and assets | Harness schema/syntax | Chromium and Firefox observation JSON | Pending root run |

## Playwright browser matrix

The config defines four projects so layout and interaction are exercised independently:

| Project | Engine | Viewport | Purpose |
|---|---|---:|---|
| `chromium-laptop` | bundled Chromium | 1366 × 768 | primary laptop behavior, CDP-capable diagnostics |
| `firefox-laptop` | bundled Firefox | 1366 × 768 | second browser engine and accessibility behavior |
| `chromium-narrow` | bundled Chromium | 390 × 844 | narrow responsive interaction |
| `firefox-narrow` | bundled Firefox | 390 × 844 | narrow second-engine parity |

Real Pyodide cold/cancellation tests should run on laptop projects. The narrow projects still exercise both complete variants, keyboard logic, reduced motion, and accessibility structure without multiplying the large cold-runtime cost.

Required limitation language after the run:

> Automated coverage used Playwright's bundled **[exact Chromium version]** and **[exact Firefox version]** on **[exact host OS/CPU/RAM]**. The narrow projects emulate a viewport and input capabilities; they are not physical phones. **[A second physical hardware combination was/was not available.]** Browser automation is not a substitute for a consenting novice observation, a screen-reader session, battery measurement, or device thermal testing. Unavailable coverage is a limitation, not an inferred pass.

## Stable browser-observation contract expected from root

Tests prefer roles, labels, visible text, and state. The following hooks are the small exception needed for asynchronous truth, revision identity, and measurement:

| Hook | Required observable state |
|---|---|
| `data-testid="mission-shell"` | `data-variant`, `data-stage`, `data-runtime-mode`, and current `data-source-revision` |
| `data-testid="source-editor"` | wraps the labelled editable surface; source must remain readable after failure |
| `data-testid="console-output"` | rendered text plus `data-request-id`, `data-source-revision`, `data-worker-generation`, `data-initialize-ms`, `data-execute-ms`, and `data-total-ms` when a result exists |
| `data-testid="runtime-status"` | accessible text plus `data-runtime-phase`, `data-runtime-mode`, and `data-worker-generation` |
| `data-testid="case-scene"` | semantic `data-state`; visual SVG stays `aria-hidden`, text equivalent stays visible |
| `data-testid="mission-live-status"` | one polite, atomic live region for meaningful stage/run changes |

Existing route-level hooks such as `operations-center`, `direct-completion`, and `paused-state` are useful but not required when headings and buttons are unambiguous.

The runtime query is expected to be deterministic for verification: `/direct/?runtime=scripted` and `/direct/?runtime=pyodide` (same for `/operations/`). A learner-facing runtime switch is optional. No test hook may bypass evaluation, Case events, or EvidenceStore.

Required accessible names used by browser tests:

- Investigation Console editor (`textbox` or equivalent CodeMirror editable role);
- Run, Cancel run, Continue, Lock prediction, Step forward, Export, Reset, and Stop;
- Investigation Console output;
- Begin First Contact / Resume First Contact at the Operations Center boundary.

## Browser scenarios

The E2E package covers these user-observable paths for both variants:

1. Enter the route (including Operations Center boundary in Variant B).
2. Complete valid first run and verify code/output separation.
3. Personalize source and verify revision propagation.
4. Submit prediction, trace both lines, and verify the text sequence.
5. Produce the unmatched-quote clue, verify calm non-color-only feedback, and verify source preservation.
6. Repair without source replacement.
7. Complete the fresh Field Test and inspect capability evidence.
8. Finish at the variant-specific boundary with no autoplay.
9. Compare controlled parity: stage sequence, task prompts, output, feedback, Case event, and reward evidence.
10. Reload during an actionable stage, resume exact source/revision, export synthetic local evidence, and fully reset.
11. Complete using keyboard input only; inspect focus indication at every actionable control.
12. Run with `prefers-reduced-motion: reduce`; verify the same text and Case outcome with no essential animation.
13. Verify all essential controls work without hover and remain available at the narrow viewport.
14. Supersede an older run and verify only the current result/revision can render.
15. Cancel a non-terminating real run, observe worker generation replacement, preserve source, and run valid real Python again.

## Accessibility method

Automated axe checks are a baseline, not proof. They catch static rule violations after key states (briefing, editor, error, reward, Operations Center), but they cannot establish:

- whether the CodeMirror editing model is understandable or efficient for a novice screen-reader user;
- whether virtual-cursor and edit-mode transitions are clear;
- whether live-status wording arrives at a useful pace in NVDA, JAWS, VoiceOver, or Narrator;
- whether focus visibility is perceptually sufficient in every display/contrast setting;
- whether reduced motion feels equivalent rather than merely disabled;
- whether the code-to-world relationship is cognitively clear; or
- whether keyboard completion is comfortable rather than technically possible.

CodeMirror requires explicit review of its editable element, hidden textarea/contenteditable behavior, line announcements, diagnostic association, Tab behavior, and browser/screen-reader combination. Axe may report no violations while that interaction is still poor.

The automated live-region check records meaningful text mutations during one run and requires bounded, non-duplicate announcements. It does not claim audible screen-reader timing. Manual follow-up should use at least NVDA with Firefox or Chrome on Windows if available and record exact versions.

## Failure matrix

| Failure | Expected invariant | Automated evidence | Residual risk / observation |
|---|---|---|---|
| Unmatched quotation mark | normalized `unmatched-quote`; calm clue; exact source retained | unit + both browser variants | real Pyodide wording may change by pinned version |
| Runtime syntax/runtime error | normalized category; source retained | runtime contract + browser error path | only the bounded First Contact subset is exercised |
| Output limit | bounded stdout/stderr and deterministic normalized error | runtime unit | multibyte boundary should remain covered |
| Invalid or oversized request | rejected before worker dispatch | runtime unit | contract is TypeScript-only across trusted caller boundary |
| Timeout | run resolves `timeout`; poisoned worker terminated | fake-worker unit + real browser where practical | timer scheduling varies under heavily throttled tabs |
| Learner cancellation | run resolves `cancelled`; replacement generation increases | fake-worker unit + `@real-runtime` | worker startup dominates recovery on a cold cache |
| Superseded source | prior request/result cannot render current truth | MissionActor unit + browser revision assertion | UI must expose both current and displayed revisions |
| Worker crash/protocol mismatch | normalized worker failure; recovery attempted | fake-worker unit | inducing a genuine browser worker crash may require a fixture |
| Replacement fails | status becomes failed; source remains; reset stays available | fake-worker unit | UI needs calm, actionable failure copy |
| IndexedDB unavailable/open failure | error remains bounded; memory adapter is test-only, not silent persistence | adapter unit | private modes and quotas vary by browser |
| Reload during mission | exact source, revision, stage, runtime mode, Case state restored | IndexedDB unit + browser reload | schema migration is intentionally absent in spike v1 |
| Full reset | event log and session removed; Case offline; starter source restored | adapter + MissionActor + browser | downloaded exports cannot be recalled after deletion |
| Export | only synthetic local evidence, explicit description and timestamp | adapter + browser download | exported file is user-controlled after download |
| Reduced motion | no causal information lost; text equivalent unchanged | projection unit + browser media emulation | vestibular comfort still needs human review |
| Narrow layout | no clipped action, horizontal task loss, or hover-only dependency | four Playwright projects | viewport emulation is not device/OS testing |

## Performance methodology and required JSON

`scripts/measure.mjs` writes machine-readable observations and explicit `not-measured` reasons. It records:

- navigation timing and first useful interface (labelled editor plus enabled Run);
- per-character editor responsiveness proxy, with automation overhead caveat;
- scripted and real warm-run distributions (count, min, median, p95, max, mean, samples);
- real Pyodide cold wall time plus contract metrics;
- cancellation and replacement-to-valid-run latency;
- stale-result text and revision checks;
- source preservation through cancellation;
- Chromium JS heap proxy where available, explicitly excluding Worker/Wasm memory;
- Chromium `TaskDuration` across an idle window as a coarse CPU proxy; and
- Pyodide response URLs, lengths, status, and cache headers.

Run the harness separately in Chromium and Firefox. Keep the raw JSON even when an observation is `not-measured`. A missing expected hook is an integration finding, not permission to estimate.

`scripts/bundle-report.mjs` runs after `next build` and records raw/gzip Next chunk sizes, build-manifest file references, copied Pyodide asset sizes and hashes, content-hashed filename observations, and the direct dependency ledger. Static byte size does not prove parse cost, execution cost, or cache correctness.

## Dependency and license ledger

Generated from `package-lock.json` root declarations and each direct `node_modules/<name>` package entry. Versions are pinned. SPDX metadata is evidence to review, not legal advice.

| Direct package | Version | Role | Declared license |
|---|---:|---|---|
| `@codemirror/commands` | 6.11.0 | runtime | MIT |
| `@codemirror/lang-python` | 6.2.1 | runtime | MIT |
| `@codemirror/lint` | 6.9.7 | runtime | MIT |
| `@codemirror/state` | 6.7.2 | runtime | MIT |
| `@codemirror/view` | 6.43.10 | runtime | MIT |
| `@xstate/react` | 6.1.0 | runtime | MIT |
| `idb` | 8.0.3 | runtime | ISC |
| `next` | 16.3.4 | runtime | MIT |
| `pyodide` | 314.0.6 | runtime | MPL-2.0 |
| `react` | 19.2.8 | runtime | MIT |
| `react-dom` | 19.2.8 | runtime | MIT |
| `xstate` | 5.32.6 | runtime | MIT |
| `@axe-core/playwright` | 4.13.0 | development | MPL-2.0 |
| `@playwright/test` | 1.62.1 | development | Apache-2.0 |
| `@testing-library/jest-dom` | 7.0.1 | development | MIT |
| `@testing-library/react` | 16.3.3 | development | MIT |
| `@testing-library/user-event` | 14.6.6 | development | MIT |
| `@types/node` | 26.4.1 | development | MIT |
| `@types/react` | 19.2.18 | development | MIT |
| `@types/react-dom` | 19.2.5 | development | MIT |
| `@vitejs/plugin-react` | 6.1.1 | development | MIT |
| `eslint` | 9.39.5 | development | MIT |
| `eslint-config-next` | 16.3.4 | development | MIT |
| `fake-indexeddb` | 6.2.5 | development | Apache-2.0 |
| `jsdom` | 30.0.1 | development | MIT |
| `typescript` | 6.0.3 | development | Apache-2.0 |
| `vitest` | 4.1.11 | development | MIT |

Review before any architecture checkpoint:

- Pyodide and axe-core carry MPL-2.0 obligations; retain notices and review distribution/source obligations for copied runtime assets.
- Playwright browser downloads are separate artifacts with their own third-party notices.
- The Pyodide distribution contains Python standard-library and bundled-package metadata beyond the npm package's top-level license. Generate and retain its notices when assets are copied.
- Lockfile integrity fields were present for direct packages at generation time; a supply-chain scan/provenance review remains outside this workstream.

## Seam-depth review

This is a review of whether each seam protects a named risk. It is not a production adoption decision.

| Seam | Risk it protects | Evidence that it is more than a wrapper | Depth finding before root run |
|---|---|---|---|
| `MissionDefinition` | authored content independent of UI/state library | evaluator and actor consume task/stage semantics | Useful specimen; one Mission cannot validate the final schema. Revise before production, do not generalize now. |
| `MissionActor` | explicit flow independent of React/XState APIs | stale guards, pause/restore/reset, no-dead-end path | Meaningful boundary if UI imports only the port. XState choice still depends on bundle/maintenance evidence. |
| `EditorAdapter` | CodeMirror replacement and accessibility risk | source revision, focus, diagnostics, decorations, subscriptions | Deep enough only if component integration never reaches CodeMirror state directly and keyboard/SR behavior passes. |
| `ExecutionRuntime` | Pyodide replacement, isolation, cancellation, stale identity | normalized bounded protocol, lifecycle, worker generation, recovery | Strongest justified seam; real-browser recovery and asset evidence remain mandatory. |
| `MissionEvaluator` | deterministic truth independent of runtime and AI | task identity, exact output/error rules, semantic event creation | Meaningful domain seam; preserve determinism. More task kinds wait for a second Mission. |
| `CaseState` | story truth independent of components/animation | idempotent semantic transition and timeline | Useful but shallow by design with one event. Do not infer a generalized Case engine. |
| `SceneRenderer` | accessible projection independent of animation library | full/reduced motion projection and text equivalent from same state | Meaningful if React/SVG remain downstream and parity passes; no generic graphics framework needed. |
| `EvidenceStore` | local persistence replacement and schema boundary | memory/IndexedDB parity, validation, export, reset, reload | Justified boundary. Migration and quota behavior are deliberately deferred, not silently solved. |

## Security and privacy checks

- Learner execution remains in a module Worker and never on the UI thread.
- Requests are bounded by source size, output size, timeout, and the First Contact source policy.
- Package installation, imports outside the bounded specimen, learner-controlled networking, credentials, analytics, and backend calls remain out of scope.
- Worker replacement is the recovery mechanism after timeout/cancellation; tests must not accept a merely relabelled poisoned worker.
- Evidence is synthetic, local, exportable, and fully resettable. Tests must not introduce real learner data.
- Pyodide assets should be same-origin and pinned. Record Content Security Policy implications and actual cache headers in the root report; the harness cannot infer deployment headers from filenames.

## Open integration findings

1. The root shell must expose current/displayed revision identity and runtime phase/generation for stale/recovery assertions. Visible text remains primary; data attributes carry only asynchronous identity/metrics.
2. The root measurement route must map the exact `while True: pass` fixture to request task ID `runtime-cancellation-fixture`; ordinary learner requests retain the authored task ID. A cancelled fixture must never count as Mission success.
3. Real screen-reader timing, physical low-end hardware, battery, and worker/Wasm memory are not established by browser automation.
4. A warm-run distribution needs an integrated way to rerun the same runtime without resetting/reloading the worker. The measurement query may expose this behavior, but it must use the real `ExecutionRuntime`, evaluator, and rendered result—not a bypass.
5. Exact root command results, browser versions, hardware, measurements, and screenshots remain **PENDING ROOT RUN**.
