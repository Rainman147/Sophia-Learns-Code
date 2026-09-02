## Architecture spike — human checkpoint required

Relates to #26, parent map #20, and the controlled First Contact comparison in #22.

This draft PR contains a self-contained technical/architecture spike under `spikes/mission-shell/`. It is **not** the production application, does not declare production architecture, does not select the issue #22 winner, and should not close any of those issues.

- Base: `c442c5bd6fdbf09c0ac59cf3bc9ae1e3f5ecbe43`
- Exact tested implementation/evidence SHA: `fcef1c043f6b03b39692de225d29e798b509a315`
- Root-contract SHA: `f176e8dc36cb0e0c70fd6d96844a3ec9e098c7b1`
- Branch: `spike/mission-shell-stack`

### What is runnable

- `/direct/` — compact Case cold open → shared complete First Contact Mission → compact completion
- `/operations/` — restrained Operations Center → the same Mission → visibly changed Operations Center
- `?runtime=scripted` — explicitly synthetic deterministic review route
- default route — pinned Pyodide `314.0.6` in a replaceable native module Worker

Both variants share the same 16-stage Mission, content, editor, runtime, evaluator, error/repair path, Case consequence, evidence, reward, accessibility support, and persistence. Only the entry/completion boundary differs.

```text
cd spikes/mission-shell
npm ci
npm run dev
```

### Evidence

- [Issue #26 architecture/findings report](https://github.com/Rainman147/Sophia-Learns-Code/blob/spike/mission-shell-stack/docs/experiments/issue-26-mission-shell-spike.md)
- [Issue #22 owner comparison package](https://github.com/Rainman147/Sophia-Learns-Code/blob/spike/mission-shell-stack/docs/experiments/issue-22-experience-lab-0.md)
- [Root integration record](https://github.com/Rainman147/Sophia-Learns-Code/blob/spike/mission-shell-stack/spikes/mission-shell/notes/root-integration.md)
- [Measurements and dependency ledger](https://github.com/Rainman147/Sophia-Learns-Code/tree/spike/mission-shell-stack/spikes/mission-shell/artifacts/measurements)
- [Synthetic screenshot set](https://github.com/Rainman147/Sophia-Learns-Code/tree/spike/mission-shell-stack/spikes/mission-shell/artifacts/screenshots)

![Direct and Operations comparison](https://raw.githubusercontent.com/Rainman147/Sophia-Learns-Code/fcef1c043f6b03b39692de225d29e798b509a315/spikes/mission-shell/artifacts/screenshots/comparison-index-laptop.png)

![Changed Operations Center after the shared Mission](https://raw.githubusercontent.com/Rainman147/Sophia-Learns-Code/fcef1c043f6b03b39692de225d29e798b509a315/spikes/mission-shell/artifacts/screenshots/operations-after-laptop.png)

### Verification at the tested SHA

- `npm run typecheck` — pass
- `npm run lint` — pass
- `npm test` — 38/38 pass across 7 files
- `npm run build` — pass; `/`, `/direct`, and `/operations` statically prerender
- `npm run test:e2e -- --workers=8` — 54 pass, 6 intentional project-scope skips, 0 fail across Chromium/Firefox × laptop/narrow
- `npm run test:e2e:real -- --workers=2` — 2 laptop-engine passes, 2 intentional narrow-project skips; real output, real unmatched quote, cancellation, replacement, stale rejection, and recovery
- `npm run test:a11y -- --workers=8` — 22 pass, 2 intentional laptop-project skips of the narrow-only case, 0 fail
- `npm audit --audit-level=low` — 0 reported vulnerabilities

### Measurements worth owner attention

One Windows/AMD host, Chromium 151 and Firefox 153; this is not low-end hardware evidence.

| Observation | Chromium | Firefox |
|---|---:|---:|
| Direct first useful interface | 389.16 ms | 627.05 ms |
| Real Pyodide cold wall | 1,381.85 ms | 8,256.47 ms |
| Real warm median / p95, n=12 | 59.58 / 60.59 ms | 57.28 / 62.46 ms |
| Cancel nontermination → replacement ready | 1,204.36 ms | 8,521.98 ms |
| Valid run after replacement | 68.66 ms | 68.70 ms |

- Next chunks: 1,156,689 raw / 360,906 gzip bytes.
- Copied Pyodide assets: 13,526,497 bytes across 5 files; generated Worker: 8,795 bytes.
- Chromium renderer heap delta: +1,591,824 bytes; this excludes Worker/Wasm memory.
- Development runtime assets used `max-age=0`; deployed caching/CSP remain unvalidated.

### Candidate dispositions — checkpoint inputs, not selections

| Candidate | Disposition |
|---|---|
| Responsive browser shell | keep |
| React + strict TypeScript | keep |
| Next.js App Router | revise |
| XState 5 | revise |
| CodeMirror 6 behind `EditorAdapter` | revise |
| Pyodide module Worker | revise |
| Deterministic `MissionEvaluator` | keep |
| Semantic `CaseState` + `SceneRenderer` direction | keep |
| Motion for React candidate | replace with native CSS/SVG for this bounded effect |
| Lazy worker/cache strategy | revise |
| IndexedDB via `idb` behind `EvidenceStore` | keep |
| No backend for the high-frequency slice | keep |
| Custom Rust | defer |

Exact evidence, limitations, accessibility/security implications, and revisit triggers are in the issue #26 report.

### Root integration and work split

The root defined all shared contracts before delegation and retained routes, controller, architecture, measurements, visual QA, reports, and Git/PR ownership. Disjoint workstreams covered: (A) Pyodide execution/recovery, (B) Mission flow/editor, (C) evaluator/Case/evidence, and (D) verification/failure analysis. No workstreams edited the same contract files concurrently or introduced competing frameworks. The root inspected and repaired all integrated work; Workstream D ended before a final handoff, so its final results are root-owned.

### Direct dependencies and licenses

- **MIT:** `@codemirror/commands@6.11.0`, `@codemirror/lang-python@6.2.1`, `@codemirror/lint@6.9.7`, `@codemirror/state@6.7.2`, `@codemirror/view@6.43.10`, `@xstate/react@6.1.0`, `next@16.3.4`, `react@19.2.8`, `react-dom@19.2.8`, `xstate@5.32.6`, `@testing-library/jest-dom@7.0.1`, `@testing-library/react@16.3.3`, `@testing-library/user-event@14.6.6`, `@types/node@26.4.1`, `@types/react@19.2.18`, `@types/react-dom@19.2.5`, `@vitejs/plugin-react@6.1.1`, `esbuild@0.28.2`, `eslint@9.39.5`, `eslint-config-next@16.3.4`, `jsdom@30.0.1`, `vitest@4.1.11`
- **ISC:** `idb@8.0.3`
- **MPL-2.0:** `pyodide@314.0.6`, `@axe-core/playwright@4.13.0`
- **Apache-2.0:** `@playwright/test@1.62.1`, `fake-indexeddb@6.2.5`, `typescript@6.0.3`

The lockfile records integrity/transitives. Production distribution still needs notice/source review for MPL-covered files, Pyodide's bundled stdlib/package metadata, and Playwright/browser notices; this PR does not claim legal review.

### Review boundary

Please judge the evidence and the two variants before asking to migrate or merge architecture. The issue #22 rubric deliberately leaves `keep`, `revise`, `remove`, and `retest` fields open. Known gaps include low-end hardware, real screen readers, Worker/Wasm memory, deployment cache/CSP, IndexedDB migration/quota/multi-tab behavior, and a second Mission to pressure-test the seams.
