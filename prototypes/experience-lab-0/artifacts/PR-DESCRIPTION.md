## Product question

This draft PR is the bounded research artifact for #22 under Wayfinder map #20.
It compares two polished versions of the complete First Contact journey:

- **Variant A — Direct Mission:** `/direct`
- **Variant B — Operations Center + Mission:** `/operations-center`

It asks whether a restrained persistent Operations Center earns its added
navigation, visual, authoring, and engineering cost. This is **not production
architecture**, does not choose a winner, and does not close #22.

**Latest-main base:** `c442c5bd6f09c0ac59cf3bc9ae1e3f5ecbe43`

**Tested and visually captured implementation:** `a5c32ec9e12a67b6b19426553b6bcd5b80ade1e8`

<!-- FINAL_HEAD_SHA -->

## Controlled comparison

Shared between routes:

- one `FIRST_CONTACT` definition and one typed state model;
- identical Case question, Python-looking tasks, state sequence, feedback,
  Field Test, evidence, reward, and approximate Mission length;
- identical Mission UI, responsive quality, keyboard path, announcements, and
  reduced-motion behavior; and
- scripted source → semantic event → visible Case consequence.

Changed between routes:

- Variant A enters the Mission directly and exits to a compact completion panel.
- Variant B adds one pre-Mission navigation boundary and returns to a visibly
  changed Center with exactly one active Case, one available tool, one locked
  possibility, and one recommended Mission.

The next Mission is not built. Continue and Stop are explicit, with no autoplay.
Reload/revisit recovery and confirmed per-variant Reset are included.

## Representative synthetic captures

### Variant A — compact Debrief

![Variant A compact Debrief](https://github.com/Rainman147/Sophia-Learns-Code/blob/prototype/experience-lab-0/prototypes/experience-lab-0/artifacts/screenshots/direct-laptop-debrief.jpg?raw=1)

### Variant B — changed Operations Center

![Variant B changed Operations Center](https://github.com/Rainman147/Sophia-Learns-Code/blob/prototype/experience-lab-0/prototypes/experience-lab-0/artifacts/screenshots/operations-center-laptop-complete.jpg?raw=1)

Additional laptop, narrow-screen, and intentional-error captures are under
`prototypes/experience-lab-0/artifacts/screenshots/`. They contain synthetic
Case data only and are engineering inspection evidence, not learner results.

## Verification

- `npm test` — 4 files and 19 tests passed
- `npm run build` — TypeScript check and Vite production build passed
- browser inspection — complete A and B paths at 1440×1000 and 390×844
- final inspected browser paths — zero console warnings or errors
- automated coverage — state transitions, both happy paths, both intentional
  error/recovery paths, Field Test, reload/resume, Reset, keyboard completion,
  reduced motion, no dead ends, and control-variable parity

Run locally:

```powershell
cd prototypes/experience-lab-0
npm ci
npm run dev -- --port 4173
```

## Declared dependencies and licenses

All direct declarations are exactly pinned; the committed lockfile is the
transitive dependency record.

| Package | Version | License |
|---|---:|---|
| `react` | 19.2.8 | MIT |
| `react-dom` | 19.2.8 | MIT |
| `@testing-library/jest-dom` | 7.0.1 | MIT |
| `@testing-library/react` | 16.3.3 | MIT |
| `@testing-library/user-event` | 14.6.6 | MIT |
| `@types/react` | 19.2.18 | MIT |
| `@types/react-dom` | 19.2.5 | MIT |
| `jsdom` | 30.0.1 | MIT |
| `typescript` | 7.0.2 | Apache-2.0 |
| `vite` | 8.2.2 | MIT |
| `vitest` | 4.1.11 | MIT |

No third-party art, fonts, audio, video, or proprietary interface assets are
included.

## Truth boundary and open judgment

This is a throwaway research instrument with a bounded scripted evaluator, not a
validated Python runtime or generalized course engine. No learner study has been
run, and no comprehension, motivation, quality, desirability, retention, or
return result is inferred from engineering QA.

The full owner rubric, blank observation worksheet, hypotheses, prompts,
engineering-cost record, contradictions, and limitations are in
`docs/experiments/issue-22-experience-lab-0.md`.

Open owner outcomes remain: mission-only, hub plus mission, hybrid hub at natural
boundaries, remove the hub, or retest after a named change. This PR intentionally
selects none of them and makes no production architecture decision.

Relates to #22. Parent map: #20. Vocabulary dependency: #21.
