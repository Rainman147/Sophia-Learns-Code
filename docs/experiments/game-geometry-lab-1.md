# Game Geometry Lab 1 — Python Investigator structural comparison

## Status and provenance

This is the owner comparison package for a bounded derivative experiment under
Wayfinder map [#20](https://github.com/Rainman147/Sophia-Learns-Code/issues/20).
It pressure-tests product topology; it does not select a production design.

| Record | Exact value |
|---|---|
| Base branch | `prototype/experience-lab-0` |
| Exact recorded base SHA | `2ead4f9ec30405f0d6e5d7a14b1fc2432f787d7a` |
| Experiment branch | `prototype/game-geometry-lab-1` |
| Exact tested and visually captured SHA | `86d77d20a8182f10673945b3e65ded8e85335f4c` |
| Final publication SHA | Recorded in the stacked draft PR after this report commit |
| Experiment classification | **Throwaway structural product experiment** |
| Data classification | Synthetic Case data; no learner data |

The tested SHA is the exact implementation commit used for the final unit,
integration, browser, accessibility, responsive, build, and screenshot evidence.
The final branch head also adds this report. A commit cannot contain its own SHA,
so the draft PR records the final publication head after this document exists.

### Stacked evidence boundary

- PR #29 and `prototypes/experience-lab-0/` remain frozen evidence.
- This branch adds only `prototypes/game-geometry-lab-1/` plus this report.
- The draft PR targets `prototype/experience-lab-0`, not `main`.
- PR #30 was read for technical context. No Next.js, Pyodide, XState, Monaco,
  shell code, visual treatment, or other PR #30 implementation was imported.
- No issue should close automatically from this lane.

## Authorities applied

The experiment was built after reading the following in full:

1. `VISION.md`
2. `docs/18-game-and-narrative-design-system.md`
3. `docs/19-experience-identity-and-media-system.md`
4. `docs/20-prebuild-architecture-and-research-gates.md`
5. `docs/21-project-rebaseline-assessment.md`
6. `docs/22-rebaseline-decisions.md`
7. `docs/01-learner-journey.md`
8. `docs/03-interactivity-and-fun.md`
9. `docs/05-lesson-design-system.md`
10. `docs/06-mastery-and-assessment.md`
11. `docs/12-risks-and-guardrails.md`
12. `docs/experiments/issue-22-experience-lab-0.md`
13. the complete implementation and tests under `prototypes/experience-lab-0/`
14. GitHub issues #20, #21, #22, and #23, including their recorded comments
15. the issue #26 Mission Shell report from PR #30

Where earlier course, Flight Deck, or checkride language conflicted with
`docs/22-rebaseline-decisions.md`, the rebaseline language governs: Python
Investigator, Operations Center, Case, Mission, Encounter, Investigation
Console, Debrief, and Field Test.

## Primary question

What is the smallest structural shape that makes Python Investigator feel like
a flowing mystery game powered by code rather than a dashboard, wizard, course
page, or sequence of administrative steps?

This package supplies an instrument for owner and learner comparison. It does
not answer that question on their behalf.

## Experimental design

The lab combines two reviewer-controlled comparisons:

1. **Entry geometry:** three routes into and out of the same First Contact
   Mission.
2. **Code-to-world causality:** three presentations of the same deterministic
   source, evaluated value, output, semantic result, and changed Case fact.

### Entry geometry variants

Run from `prototypes/game-geometry-lab-1/` with:

```powershell
npm ci
npm run dev -- --port 4174
```

| Variant | Route | Structural treatment |
|---|---|---|
| A — Direct Mission | `http://127.0.0.1:4174/direct?causality=c` | First Contact opens immediately; success reaches a compact completion boundary. |
| B — Hub First | `http://127.0.0.1:4174/hub-first?causality=c` | Operations Center → First Contact → visibly changed Operations Center. |
| C — Earned Hub | `http://127.0.0.1:4174/earned-hub?causality=c` | Short Case cold open → First Contact → successful Field Test → first Operations Center reveal. |
| Reviewer home | `http://127.0.0.1:4174/` | Explains the instrument and links to all routes; it is outside the learner path. |

Variant C starts with `operationsCenter: not-revealed`. The first Operations
Center render occurs only after `field_test_passed`,
`investigation_console_online`, and `operations_center_online` are recorded. Its
learner-facing explanation explicitly connects the requested printed result to
the newly available Investigation Console and first Center appearance.

Mission 002 is visible after success for orientation only. It has no runnable
action and cannot autoplay.

### Mission rhythm

Exactly five learner-facing beats remain visible throughout the Mission:

1. **Activate** — run the first message and distinguish source from output.
2. **Experiment** — personalize the message and see the changed consequence.
3. **Predict** — predict and trace two lines inside one connected encounter.
4. **Investigate** — create and repair an unmatched quotation mark.
5. **Prove** — complete a fresh reduced-support Field Test.

The reducer retains ten internal phases for editing, result inspection,
prediction choice, trace, error creation, repair, Field Test, persistence, focus,
and recovery. Those internal phases are not presented as a learner-facing wizard
or ten-step progress display. Source, current action, output, and the Case object
evolve inside one Mission scene.

### Causality presentations

The reviewer panel switches presentation without re-running or changing the
semantic result.

| Level | Treatment | Same authored result |
|---|---|---|
| A — Output only | source runs → output appears | `Hello, Sophia!`; First Contact result recorded semantically |
| B — Output + Case | source runs → output appears → First Contact folder changes | same |
| C — Explicit bridge | active source → evaluated value → output → specific Case destination → changed evidence | same |

The Case object is a labeled First Contact file, not an abstract signal graphic.
Level C always supplies a complete textual explanation. With reduced motion, the
same ordered explanation, output, folder state, and changed-evidence label remain
present without animation.

## Controlled variables

The following are shared by construction across all three routes:

- one frozen `FIRST_CONTACT` Mission definition;
- Case title, Case question, timestamp, facts, and non-accusatory framing;
- starter source, two-line source, unmatched-quotation task, and Field Test;
- deterministic evaluator inputs, output, error wording, and semantic events;
- five visible beats and ten internal phases;
- Goal, Observed, Clue, and Next action recovery packet;
- capability evidence, reward meaning, and Mission 002 preview copy;
- keyboard, focus, announcement, Stop/Resume, persistence, and Reset behavior;
- reduced-motion and text-equivalent causal meaning;
- responsive ordering and approximate authored duration; and
- the neutral forensic-editorial visual system.

The intended entry variable is only where the Operations Center first appears
and which boundary follows completion. The intended causality variable is only
how much of the same code-to-Case relationship is made visible.

## Implementation boundaries

### Reused ideas from PR #29

- typed reducer progression and deterministic evaluator behavior;
- versioned, route-scoped persistence;
- First Contact source tasks and recovery shape;
- keyboard and reduced-motion hooks;
- Stop, Resume, and confirmed Reset behavior; and
- journey, parity, and no-dead-end test patterns.

### Rebuilt for this experiment

- all CSS, tokens, layout, and visual treatment;
- the five-beat learner rhythm and internal-phase mapping;
- direct, hub-first, and earned-hub boundaries;
- the Operations Center composition and reward reveal;
- the specific First Contact folder SVG;
- learner-facing copy and capability evidence treatment; and
- the reviewer-only causality comparison.

### Explicitly not implemented

- real Python or Pyodide;
- Next.js, backend services, accounts, or production persistence;
- AI tutoring, analytics, curriculum generalization, or authoring architecture;
- XState, Monaco, Rive, GSAP, Phaser, PixiJS, Three.js, or Remotion;
- final identity, art direction, illustration, audio, or motion language; and
- Identity Tag or any Mission beyond the non-runnable Mission 002 preview.

The artifact uses ordinary React, TypeScript, CSS, semantic HTML, and one
semantic inline SVG. The evaluator is deliberately bounded to this comparison.

## Screenshot evidence

All captures contain synthetic data. They show engineering states, not learner
behavior or preferences.

### Entry geometry

| Direct Mission | Hub first | Earned-hub cold open |
|---|---|---|
| ![Direct Mission entry](../../prototypes/game-geometry-lab-1/artifacts/screenshots/direct-mission-entry.png) | ![Hub-first entry](../../prototypes/game-geometry-lab-1/artifacts/screenshots/hub-first-entry.png) | ![Earned-hub cold open](../../prototypes/game-geometry-lab-1/artifacts/screenshots/earned-hub-cold-open.png) |

### Continuous Mission states

| First run | Prediction and trace |
|---|---|
| ![First program run and causal bridge](../../prototypes/game-geometry-lab-1/artifacts/screenshots/first-run-causal-bridge.png) | ![Prediction and first-line trace](../../prototypes/game-geometry-lab-1/artifacts/screenshots/prediction-and-trace.png) |

| Error | Repair | Field Test |
|---|---|---|
| ![Unmatched quotation error and recovery packet](../../prototypes/game-geometry-lab-1/artifacts/screenshots/error-unmatched-quotation.png) | ![Repaired quotation result](../../prototypes/game-geometry-lab-1/artifacts/screenshots/repaired-quotation.png) | ![Fresh reduced-support Field Test](../../prototypes/game-geometry-lab-1/artifacts/screenshots/field-test.png) |

### Earned Operations Center

![Operations Center revealed after successful Field Test](../../prototypes/game-geometry-lab-1/artifacts/screenshots/operations-center-reveal.png)

### Causality comparison

| A — Output only | B — Output + Case | C — Explicit bridge |
|---|---|---|
| ![Causality A](../../prototypes/game-geometry-lab-1/artifacts/screenshots/causality-a-output-only.png) | ![Causality B](../../prototypes/game-geometry-lab-1/artifacts/screenshots/causality-b-case-reaction.png) | ![Causality C](../../prototypes/game-geometry-lab-1/artifacts/screenshots/causality-c-explicit-bridge.png) |

### Responsive and reduced-motion evidence

| Narrow layout | Reduced-motion state |
|---|---|
| ![Narrow direct Mission layout](../../prototypes/game-geometry-lab-1/artifacts/screenshots/narrow-layout.png) | ![Reduced-motion causal explanation](../../prototypes/game-geometry-lab-1/artifacts/screenshots/reduced-motion-state.png) |

The detailed browser record is in
`prototypes/game-geometry-lab-1/artifacts/visual-inspection.md`.

## Observed engineering facts

These statements come from code inspection, deterministic tests, and browser
inspection. They are not claims about comprehension, delight, motivation, or
learning.

### Route and state facts

- All routes import one Mission definition and render one Mission component.
- The same reducer produces the same eleven semantic Case-event names on a
  successful route; the route boundary changes only entry/completion screens and
  Operations Center availability.
- Direct Mission requires zero shell-navigation actions before the first source
  run.
- Hub First requires one Center-to-Mission action before the first source run.
- Earned Hub requires one Case-cold-open action before the first source run and
  has no Operations Center state available before success.
- The visible rhythm always contains exactly five beat items.
- Causality A, B, and C preserve the same output text and semantic Case result.
- A failed quotation run preserves earlier progress and provides a specific
  repair action.
- Each route persists under a separate versioned local-storage key. Reset asks
  for confirmation and clears only the active route.
- Stop records the current boundary, and Resume returns to it.
- Mission 002 has no start control and no reducer action.

### Final verification record

| Command | Tested result at `86d77d20a8182f10673945b3e65ded8e85335f4c` |
|---|---|
| `npm test` | 5 files passed; 27 tests passed |
| `npm run test:e2e` | 17 applicable tests passed; 3 laptop duplicates intentionally skipped because their assertions are narrow-only |
| `npm run build` | TypeScript check passed; Vite production build passed; 35 modules transformed |
| Browser console | No warnings or errors in the final inspected session |
| Frozen prior prototype | No diff under `prototypes/experience-lab-0/` |

The browser suite includes serious/critical axe checks at route entry, Mission,
reduced-motion causal state, direct completion, and earned Operations Center.
Automated accessibility checks do not establish conformance.

## Learner observation fields — intentionally blank

No learner session was conducted in this implementation lane. Do not populate
these fields from automated tests, author familiarity, or screenshot review.

### Session record

| Field | Observation |
|---|---|
| Session ID | _Not observed_ |
| Date | _Not observed_ |
| Learner age/context | _Not observed_ |
| Device/input/assistive technology | _Not observed_ |
| Route order | _Not observed_ |
| Causality order | _Not observed_ |
| Facilitation given | _Not observed_ |
| Recording/consent notes | _Not observed_ |

### Entry geometry observation sheet

| Prompt | Direct Mission | Hub first | Earned hub |
|---|---|---|---|
| “Where are you right now?” | _Blank_ | _Blank_ | _Blank_ |
| “What are you trying to do?” | _Blank_ | _Blank_ | _Blank_ |
| First unprompted meaningful action | _Blank_ | _Blank_ | _Blank_ |
| Hesitation or wrong turn | _Blank_ | _Blank_ | _Blank_ |
| Can distinguish source from output | _Blank_ | _Blank_ | _Blank_ |
| Can explain what changed in the Case | _Blank_ | _Blank_ | _Blank_ |
| Can explain why the Center is present | _Blank_ | _Blank_ | _Blank_ |
| Can identify what happens next | _Blank_ | _Blank_ | _Blank_ |
| Voluntary return/exploration behavior | _Blank_ | _Blank_ | _Blank_ |
| Exact learner words | _Blank_ | _Blank_ | _Blank_ |

### Causality observation sheet

| Prompt | A — Output only | B — Output + Case | C — Explicit bridge |
|---|---|---|---|
| “What did Python do?” | _Blank_ | _Blank_ | _Blank_ |
| “What changed in the Case?” | _Blank_ | _Blank_ | _Blank_ |
| “Why did it change?” | _Blank_ | _Blank_ | _Blank_ |
| Attention followed meaningful movement | _Blank_ | _Blank_ | _Blank_ |
| Visual noise or distraction | _Blank_ | _Blank_ | _Blank_ |
| Delay before next action | _Blank_ | _Blank_ | _Blank_ |
| Meaning understood with motion disabled | _Blank_ | _Blank_ | _Blank_ |
| Exact learner words | _Blank_ | _Blank_ | _Blank_ |

## Owner comparison rubric — entry geometry

Score only after direct inspection and, when available, learner evidence. Use
`1` for weak, `3` for mixed, and `5` for strong. Leave blank when not observed.

| Criterion | Direct Mission | Hub first | Earned hub | Evidence/notes |
|---|---:|---:|---:|---|
| Immediate understanding of where she is | _—_ | _—_ | _—_ | _Blank_ |
| Speed to first meaningful code action | _—_ | _—_ | _—_ | _Blank_ |
| Mission feels continuous rather than procedural | _—_ | _—_ | _—_ | _Blank_ |
| Case identity remains understandable | _—_ | _—_ | _—_ | _Blank_ |
| Operations Center has a clear purpose | _—_ | _—_ | _—_ | _Blank_ |
| Success visibly causes the reward boundary | _—_ | _—_ | _—_ | _Blank_ |
| Completion state explains what changed | _—_ | _—_ | _—_ | _Blank_ |
| Next Mission is visible without feeling like autoplay | _—_ | _—_ | _—_ | _Blank_ |
| Navigation cost is justified | _—_ | _—_ | _—_ | _Blank_ |
| Keyboard, narrow, and reduced-motion experience | _—_ | _—_ | _—_ | _Blank_ |
| Authoring/engineering cost is proportionate | _—_ | _—_ | _—_ | _Blank_ |

### Entry owner notes

- Strongest evidence for Direct Mission: _Blank_
- Strongest evidence against Direct Mission: _Blank_
- Strongest evidence for Hub First: _Blank_
- Strongest evidence against Hub First: _Blank_
- Strongest evidence for Earned Hub: _Blank_
- Strongest evidence against Earned Hub: _Blank_
- Evidence needed before a decision: _Blank_

## Owner comparison rubric — code-to-world causality

| Criterion | A — Output only | B — Output + Case | C — Explicit bridge | Evidence/notes |
|---|---:|---:|---:|---|
| Comprehension | _—_ | _—_ | _—_ | _Blank_ |
| Visual noise | _—_ | _—_ | _—_ | _Blank_ |
| Delight | _—_ | _—_ | _—_ | _Blank_ |
| Speed to understand and continue | _—_ | _—_ | _—_ | _Blank_ |
| Movement explains causality | _—_ | _—_ | _—_ | _Blank_ |
| Same meaning survives without animation | _—_ | _—_ | _—_ | _Blank_ |
| Source/output/Case distinctions remain clear | _—_ | _—_ | _—_ | _Blank_ |
| Treatment cost is justified by the task | _—_ | _—_ | _—_ | _Blank_ |

### Causality owner notes

- Minimum explanation needed for a first run: _Blank_
- Contexts that warrant a more explicit bridge: _Blank_
- Contexts where the bridge becomes noise: _Blank_
- Evidence needed before a decision: _Blank_

## Accessibility findings

- The complete learner path is operable with keyboard input alone in automated
  DOM and real-browser journeys.
- Major screen/beat changes move programmatic focus to the new heading without a
  visible focus trap. Interactive controls retain a strong focus indicator.
- Source, output, causal explanation, and Case object are separate named regions.
- Folder states use text, geometry, and labels in addition to color.
- The causal sequence has a complete text equivalent; the Case result is also
  exposed as a concise semantic sentence.
- Reduced motion removes nonessential transition duration while preserving the
  same output, ordered explanation, Case state, and changed-evidence label.
- The five-beat strip is a labeled, keyboard-focusable ordered list when it needs
  horizontal scrolling on narrow screens.
- At 390×844, all routes stayed within document width and the primary action
  stayed within the viewport.
- Stop, Resume, persistence, and confirmed Reset have keyboard paths.
- Final automated scans reported no serious or critical axe finding in tested
  entry, Mission, reduced-motion, completion, or earned-Center states.

Open accessibility work for any future production direction includes human
screen-reader testing, 200%/400% zoom, high-contrast/forced-colors review, touch
target observation, language/cognitive-load study, and testing with the intended
learner population. This prototype makes no WCAG conformance claim.

## Implementation cost

These are bounded implementation proxies, not a production estimate:

- 56 files in the tested prototype commit, including 14 screenshot artifacts,
  a lockfile, documentation, source, and tests;
- 3,691 lines across TypeScript/TSX/CSS source and 601 lines across tests;
- one shared 296-line Mission screen and one 549-line typed reducer rather than
  three route-specific Mission copies;
- 126 lines for the shared Operations Center boundary and 137 lines for the
  three causality presentations;
- 1,941 CSS lines covering the neutral treatment, three geometries, Mission
  states, causality levels, responsive order, focus, and motion parity;
- two runtime packages and twelve exact-pinned development packages;
- one route-scoped local-storage schema and one scripted evaluator; and
- no backend, runtime download, third-party media, production shell, or root
  application initialization.

The cost signal is mixed by design: sharing one Mission keeps content parity
cheap, while supporting three shells, three causal presentations, screenshot
evidence, and accessibility/responsive parity creates meaningful surface area.
Whether that cost is warranted is an owner decision, not an engineering finding.

## Unresolved questions

1. Does the cold open add useful Case context, or simply insert another click?
2. Does seeing the Center first improve orientation enough to justify exposing a
   persistent hub before the learner has earned or understood it?
3. Does the earned reveal make the Center feel caused by success, or does it
   still read as a delayed dashboard?
4. Is the compact direct completion boundary sufficient for return orientation?
5. Are five beats remembered as one Mission rhythm, or still experienced as a
   sequence of procedural panels?
6. When does explicit causal explanation teach the code-to-world relationship,
   and when does it slow the game down?
7. Should causal presentation adapt by novelty, task risk, learner control, or
   reduced-motion preference?
8. Does the First Contact folder remain concrete and meaningful across later
   Cases, or would a different Case object be needed?
9. How much persistent Center content can be authored without becoming a grid of
   equal-weight administrative cards?
10. What human evidence is sufficient to remove the persistent hub rather than
    refining it again?

## Open decision fields — no outcome selected

### Entry geometry outcome

- [ ] direct Mission
- [ ] hub first
- [ ] earned hub
- [ ] hybrid
- [ ] retest
- [ ] remove persistent hub

Decision owner: _Blank_

Decision date: _Blank_

Evidence cited: _Blank_

Decision rationale: _Blank_

Follow-up issue: _Blank_

### Causality outcome

- [ ] output only
- [ ] output plus Case reaction
- [ ] explicit causal bridge
- [ ] adaptive use by context

Decision owner: _Blank_

Decision date: _Blank_

Evidence cited: _Blank_

Decision rationale: _Blank_

Follow-up issue: _Blank_

## Stop boundary

This lane stops with the working comparison, evidence captures, this owner
package, and a stacked draft PR. It deliberately does not continue into Identity
Tag, final visual identity, production architecture, real Python integration, or
curriculum expansion.
