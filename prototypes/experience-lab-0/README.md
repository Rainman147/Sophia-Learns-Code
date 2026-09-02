# Experience Lab 0 — First Contact hub comparison

This is the bounded, throwaway product-question prototype for GitHub issue #22.
It compares two matched versions of the complete First Contact journey:

- **Variant A — Direct Mission:** `/direct`
- **Variant B — Operations Center + Mission:** `/operations-center`

The Mission content, state sequence, scripted source tasks, feedback, Field Test,
evidence, reward, visual system, and accessibility support are shared. The only
intended experimental difference is the Operations Center entry and return
boundary.

This prototype is **not production architecture** and does **not execute real
Python**. Its tiny deterministic evaluator recognizes a bounded set of
Python-looking `print(...)` examples and emits explicit semantic Case events.

## Run locally

Requirements:

- Node.js `^20.19.0` or `>=22.12.0` (Node 24 was used for this lane)
- npm 11 or another npm version compatible with the committed lockfile

From the repository root:

```powershell
cd prototypes/experience-lab-0
npm ci
npm run dev -- --port 4173
```

Open:

- comparison home: <http://127.0.0.1:4173/>
- Variant A: <http://127.0.0.1:4173/direct>
- Variant B: <http://127.0.0.1:4173/operations-center>

No Python installation, backend, account, network service, or learner data is
required. All Case data is synthetic.

## Verify

```powershell
npm test
npm run build
```

The test suite covers:

- typed state transitions and semantic Case events;
- matched happy paths for both variants;
- intentional unmatched-quote and personal recovery paths for both variants;
- fresh reduced-support Field Test completion;
- reload and resume;
- deliberate per-variant reset;
- keyboard completion for both variants;
- reduced-motion behavior and text-equivalent tracing;
- no-dead-end assertions throughout the complete journeys; and
- controlled-variable parity.

## Prototype structure

```text
src/experience/
  mission.ts       shared Mission definition and parity controls
  evaluator.ts     bounded scripted print evaluator
  machine.ts       typed reducer, semantic events, and Case state
  persistence.ts   versioned localStorage boundary

src/components/
  MissionScreen.tsx       shared complete First Contact flow
  OperationsCenter.tsx    Variant B entry and changed return boundary
  CompletionScreen.tsx    Variant A compact completion boundary
  ...                     shared Console, Case, feedback, and reset UI

tests/              transition, parity, persistence, and keyboard-path tests
artifacts/          visual inspection record and synthetic screenshots
```

Local state is stored separately for each route under keys prefixed with
`sophia-experience-lab-0`. The visible **Reset** control requires confirmation
and resets only the active variant.

## Accessibility support

- semantic landmarks, headings, labels, status text, and an `aria-live` update;
- keyboard-operable source, prediction, trace, run, recovery, Continue, Stop,
  resume, and reset paths;
- strong visible focus treatment and a skip link;
- non-color labels and symbols for Case and feedback states;
- an always-present textual execution sequence;
- `prefers-reduced-motion` support that removes nonessential animation; and
- responsive layouts validated at 1440×1000 and 390×844.

This is a prototype observation, not a WCAG conformance claim. See
[`artifacts/visual-inspection.md`](artifacts/visual-inspection.md) for the QA
record.

## Dependencies and assets

All declared dependencies are exactly pinned. Their purposes and licenses are
listed in [`DEPENDENCIES.md`](DEPENDENCIES.md). No third-party art, icons,
fonts, audio, video, or animation assets are included; the CSS and semantic SVG
graphics are original to this prototype lane.

## Captures

Representative synthetic captures are in [`artifacts/screenshots/`](artifacts/screenshots/).
They are evidence for owner comparison, not learner-study results.
