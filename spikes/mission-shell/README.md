# Mission Shell Stack Spike

> Architecture experiment for GitHub issues #22 and #26. This directory is not the production application.

This self-contained Next.js prototype compares two matched First Contact routes while exercising the issue #26 technical seams:

- `/direct/` — Variant A, direct Mission entry;
- `/operations/` — Variant B, restrained Operations Center plus the same Mission; and
- `?runtime=scripted` — deterministic browser-review route. Without that query, the prototype uses the real pinned Pyodide worker.

Both variants share the same Mission definition, actor, editor, execution runtime, evaluator, Case transition, scene projection, evidence store, feedback, reward evidence, visual tokens, and accessibility path. The entry and completion boundary are the controlled variable.

## Requirements

- Node.js 20.9 or newer (the measured environment is recorded in the experiment report);
- npm; and
- network access only for the initial `npm ci`. Pyodide runtime assets are copied from the pinned npm package and served from the same origin.

## Run locally

```text
cd spikes/mission-shell
npm ci
npm run dev
```

Open `http://127.0.0.1:3100/`.

## Verify

```text
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium firefox
npm run test:e2e
npm run capture:screenshots
npm run measure
npm run measure:bundle
```

Exact commands, browser coverage, measurements, caveats, and results are recorded in:

- `docs/experiments/issue-26-mission-shell-spike.md`
- `docs/experiments/issue-22-experience-lab-0.md`

Machine-readable measurements are under `artifacts/measurements/`. The synthetic owner-review captures and their manifest are under `artifacts/screenshots/`.

## Scope boundary

There is no backend, account, cloud sync, AI tutor, remote execution, analytics, arbitrary package installation, learner-controlled networking, game engine, native shell, or custom Rust. Local evidence is synthetic and can be inspected, exported, or fully reset.
