# Game Geometry Lab 1

This is a bounded derivative research prototype for the Python Investigator
pre-build decisions in Wayfinder map #20. It extends the frozen First Contact
evidence in PR #29 without changing `prototypes/experience-lab-0/`.

It compares three entry geometries with the same First Contact content and one
shared five-beat Mission:

- **Variant A — Direct Mission:** `/direct`
- **Variant B — Hub First:** `/hub-first`
- **Variant C — Earned Hub:** `/earned-hub`

The reviewer controls also compare three presentations of the same deterministic
source/result relationship:

- **A:** runtime output only;
- **B:** runtime output plus a changed Case folder; and
- **C:** source → evaluated value → output → Case destination → changed evidence.

This prototype does not select an entry winner, a causality winner, final visual
identity, production architecture, or a real Python runtime.

## Run locally

Requirements:

- Node.js `^20.19.0` or `>=22.12.0`
- npm compatible with the committed lockfile

From the repository root:

```powershell
cd prototypes/game-geometry-lab-1
npm ci
npm run dev -- --port 4174
```

Open:

- reviewer comparison home: <http://127.0.0.1:4174/>
- direct Mission: <http://127.0.0.1:4174/direct?causality=c>
- hub first: <http://127.0.0.1:4174/hub-first?causality=c>
- earned hub: <http://127.0.0.1:4174/earned-hub?causality=c>

The reviewer panel is outside the learner experience. It controls route and
causality presentation, reports motion/persistence state, and exposes a confirmed
per-route reset. All Case data is synthetic.

## Verify

```powershell
npm test
npm run test:e2e
npm run build
```

The automated checks cover:

- all three entry routes and shared-content parity;
- exactly five visible learner-facing Mission beats;
- complete keyboard-only progression with no dead end;
- Field Test completion and no Mission 002 autoplay;
- earned-hub absence before success and reveal after success;
- identical semantic output across causality A, B, and C;
- reduced-motion text/state equivalence;
- entry, Mission, and completion axe scans for serious or critical findings;
- route-scoped persistence, Stop/Resume, confirmed reset; and
- 390×844 responsive containment and primary-action visibility.

## Prototype structure

```text
src/experience/
  mission.ts       one shared First Contact definition and five visible beats
  evaluator.ts     deterministic bounded print evaluator
  machine.ts       typed internal progression, Case state, and route boundaries
  persistence.ts   versioned route-scoped localStorage boundary

src/components/
  MissionScreen.tsx       one continuously evolving Mission scene
  CausalityView.tsx       reviewer-controlled A/B/C comparison
  OperationsCenter.tsx    hub-before, hub-after, and earned reveal treatments
  CompletionScreen.tsx    compact direct-route completion boundary

tests/                    reducer, evaluator, parity, persistence, and DOM journeys
tests/e2e/                browser keyboard, accessibility, causality, and responsive checks
artifacts/screenshots/    representative synthetic inspection captures
```

The learner sees five continuous beats—Activate, Experiment, Predict,
Investigate, and Prove—while the reducer retains finer internal states for
feedback, focus, persistence, recovery, and testing.

## Accessibility boundary

The working experiment includes semantic source/output/Case regions, heading and
landmark structure, a skip link, visible focus, keyboard operation, a polite live
region, non-color state labels, text equivalents for causal presentation,
reduced-motion parity, narrow-layout ordering, Stop/Resume, and confirmed Reset.

The browser suite found no serious or critical automated axe findings in the
tested entry, Mission, reduced-motion, direct-completion, and earned-Center
states. This is an engineering observation, not a WCAG conformance claim or a
substitute for human assistive-technology and cognitive-load testing.

## Truth boundary

The evaluator accepts only the authored `print(...)` shapes needed by this
experiment. There is no Pyodide, backend, account, AI tutor, Monaco, XState,
production analytics, generalized curriculum layer, or code copied from PR #30.
No automated result is learner evidence.

Dependency licenses and asset provenance are in [DEPENDENCIES.md](DEPENDENCIES.md).
Browser QA is recorded in [artifacts/visual-inspection.md](artifacts/visual-inspection.md).
