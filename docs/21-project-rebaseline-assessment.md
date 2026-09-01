# Project Rebaseline Assessment

**Status:** current whole-project assessment  
**Date:** 2026-09-01  
**Reviewed baseline:** repository `main` through `6efb82e43cf3d6c1766db1d39d4fde7f513f6a17`, plus the product discussion that followed

## 1. Executive verdict

The project has not merely gained a gaming feature. It has evolved from an adaptive Python tutor with investigation-themed lessons into a more coherent and differentiated product:

> **A Python-powered mystery investigation game whose adaptive tutor, learning science, case world, feedback, rewards, and professional progression all serve the same learner journey.**

That evolution is valuable and should be treated as a rebaseline rather than appended as another feature layer.

The repository is ready for bounded visual, interaction, and technical prototypes. It is not yet ready to freeze the production content schema, graphics pipeline, or broad implementation stack.

## 2. What the previous baseline got right

The initial documents established several durable foundations that remain authoritative.

### Absolute-zero support

The product explicitly teaches editor orientation, Run, console, code and output, punctuation, execution state, and error recovery. This is essential and remains unchanged.

### Learning as evidence

The project distinguishes exposure, guided work, independent performance, delayed retrieval, transfer, and integrated project use. This remains the core mastery model.

### Deterministic truth

Real execution, tests, trace predicates, and explicit rules determine executable behavior. AI may coach but cannot override them.

### High-action lessons

Prediction, tracing, code ordering, modification, debugging, generation, explanation, and transfer are already part of the learning grammar.

### Humane motivation

The repository already rejects streak shame, public ranking pressure, answer dependence, and meaningless XP.

### Vertical delivery

The five-mission slice before broad curriculum production is the correct strategy.

### Browser-first runway

Removing local installation from the first concepts while still teaching a later exit into real tools remains sound.

## 3. What changed materially

### From themed tutor to integrated game

Previous documents often described investigation as a framing device around lessons. The new vision makes the case world a direct projection of actual code execution.

```text
Old emphasis
Learn concept → complete exercise → receive themed reward

Rebaseline
Encounter evidence → write Python → case changes → interpret result → advance investigation
```

This is a product-model change, not a cosmetic improvement.

### From Flight Deck to Python Investigator

The repository mixed aviation and investigation language. The new canonical vocabulary uses an Operations Center, Cases, Missions, Encounters, Labs, Debriefs, Field Tests, Capability Map, and Case Archive.

The original flight-deck idea remains useful as visual inspiration for a precise control-room environment. It no longer controls learner-facing terminology.

### From lesson pages to playable missions

A mission coordinates:

- case question;
- code or puzzle;
- execution;
- scene reaction;
- feedback;
- recovery;
- mastery evidence;
- reward;
- artifact change;
- stopping behavior; and
- future route.

This requires a richer domain model than a lesson renderer alone.

### From generic polish to an experience system

The project now treats visual design, motion, graphics, sound, video, writing, and interaction hierarchy as one identity. High quality is a requirement, but quality must support comprehension and agency.

### From early stack recommendation to gated selection

The existing Next.js, CodeMirror, Pyodide, XState, and local-first direction remains a strong candidate. It is now explicitly provisional until bounded prototypes clear the relevant gates.

## 4. Current conceptual tensions and their resolution

| Tension | Risk | Rebaseline resolution |
|---|---|---|
| Flight Deck versus investigation game | mixed metaphor and fragmented language | Python Investigator is primary; Operations Center is the hub; aviation is visual inspiration only |
| lesson versus mission | content and experience diverge | Mission is learner-facing product unit; internal content model will be redesigned after two prototypes |
| checkride versus case language | identity drift | use Field Test in the canonical vocabulary; old references migrate later |
| live code everywhere versus prediction | auto-run can confuse execution and weaken reasoning | use explicit Learn, Live Lab, Field Test, and Project modes |
| badges versus mastery | points can counterfeit competence | XP, mastery, unlocks, and artifacts remain separate |
| beautiful prototype versus disposable prototype | polished work can accidentally become architecture | label each prototype's production status and retain only validated contracts |
| React application versus game engine | duplicate UI, input, and accessibility systems | begin with React, HTML, CSS, SVG, and motion; game engine requires a later capability gate |
| broad technical research versus momentum | analysis can become the product | research answers named decisions and runs alongside tangible prototypes |
| generic schema versus game semantics | adding optional fields can create a brittle blob | prototype Case, Mission, Encounter, CaseEvent, and SceneEffect boundaries before migration |
| tutorial video versus interactive learning | passive media can dominate | video is short, interactive, optional where appropriate, and validated after the interaction itself |

## 5. Document authority after rebaseline

### Canonical entry point

- `VISION.md`

### Canonical rebaseline support

- `docs/18-game-and-narrative-design-system.md`
- `docs/19-experience-identity-and-media-system.md`
- `docs/20-prebuild-architecture-and-research-gates.md`
- `docs/21-project-rebaseline-assessment.md`
- `docs/22-rebaseline-decisions.md`

### Durable prior foundations

The following remain strong supporting authorities where they do not conflict with the canonical rebaseline:

- product charter;
- learner journey;
- learning science;
- interactivity and humane gamification;
- curriculum map;
- lesson design system;
- mastery and assessment;
- AI tutor specification;
- technical architecture;
- MVP roadmap;
- Sophia pilot plan;
- research and benchmark ledger;
- risks and guardrails; and
- prior decision log.

### Provisional artifacts requiring later reconciliation

- the existing lesson schema;
- First Contact lesson specimen;
- Flight Deck and checkride terminology;
- any stack choice presented without its new prototype gate; and
- issues #11 through #19 where the new pre-build map changes ordering.

They remain valuable source material and should not be deleted. A later reconciliation pass should update terminology and contracts after the decision map closes.

## 6. Whole-product model

```text
LEARNER
  enters an Operations Center

CASE
  presents a coherent mystery and evidence

MISSION
  introduces one capability through a necessary investigative action

ENCOUNTER
  asks the learner to inspect, predict, code, run, trace, repair, or explain

PYTHON RUNTIME
  produces real output, errors, tests, and state

MISSION EVALUATOR
  determines what happened

CASE STATE
  changes semantically

PRESENTATION SYSTEM
  expresses the change through UI, graphics, motion, sound, and media

EVIDENCE LEDGER
  records support, performance, delay, transfer, and misconceptions

MASTERY ROUTER
  recommends the next useful mission and explains why

PROGRESSION SYSTEM
  evolves tools, badges, cases, and artifacts without replacing mastery

PROFESSIONAL EXIT
  moves the learner into files, terminal, tests, Git, GitHub, and independent projects
```

Every major feature should identify where it belongs in this model. Features that cut across it without a clear authority boundary are likely to feel bolted on.

## 7. Experience quality assessment

### Strongly defined

- absolute-zero learner needs;
- first-session action density;
- prediction and execution loop;
- error-as-evidence philosophy;
- scaffold fading;
- mastery distinctions;
- adaptive response categories;
- non-punitive motivation;
- first five Python capabilities; and
- vertical-slice logic.

### Newly defined by rebaseline

- Python as the direct game mechanic;
- Operations Center hub;
- Case and Mission structure;
- semantic case events;
- direct code-to-world reactions;
- cohesive visual and motion grammar;
- tutorial-media principles;
- asset pipeline requirements;
- game-engine exclusion gate; and
- production architecture checkpoint.

### Still requires human and prototype evidence

- exact visual direction;
- exact product name and mark;
- whether the Operations Center appears before the first mission;
- how much narrative is motivating;
- how much motion clarifies causality;
- first reward timing and visual treatment;
- best first tool unlock;
- CodeMirror novice experience;
- Pyodide performance and cancellation;
- XState value versus overhead;
- Rive workflow and accessibility;
- video production workflow; and
- final Case, Mission, and Encounter schema.

## 8. Technical assessment

### Browser and React

The browser remains the best first delivery platform because the product needs immediate access, rapid iteration, strong UI composition, and a later PWA path. React and TypeScript align well with the interface and available tooling.

### Next.js

Next.js is a reasonable application shell, but the mission workspace is client-heavy. Codex should not force high-frequency execution and state orchestration through server boundaries simply because the framework supports them.

### Explicit state machines

The mission flow genuinely contains enough branching, retry, pause, recovery, and assessment state to justify an explicit statechart experiment. XState should be measured against a smaller explicit alternative rather than assumed.

### Editor

CodeMirror remains the stronger first candidate for a quiet guided workspace. Monaco remains a later Pro Workspace candidate. The adapter boundary is more important than the initial library.

### Python runtime

Pyodide in a Web Worker remains the leading first candidate. Startup, API exposure, tracing, cancellation, reset, package behavior, and representative-device performance must be measured.

### Graphics and animation

A full game engine is not justified by the current product. The required first scenes can be expressed through React, semantic HTML, SVG, and a motion layer. Rive is worth a bounded experiment for an Operations Center element. GSAP is a contingency for complex timelines, not a default. PixiJS and Phaser remain future gates.

### Tutorial media

Direct manipulation remains primary. Short media can help with dynamic mental models and professional demonstrations. Remotion is a promising candidate for consistency but requires workflow and license review.

### Rust

The project currently has no measured boundary where custom Rust improves the learner experience enough to justify slower iteration. Rust remains appropriate later for a Tauri professional companion, profiled WebAssembly computation, a distributable CLI, or sandbox supervision.

## 9. Research assessment

### Broad learning-science research

Sufficient for first prototypes. The repository already supports retrieval, spacing, worked examples, faded guidance, self-explanation, feedback, visualization, motivation, and gamification variability.

Do not perform another broad literature sweep before making the first experience tangible.

### Targeted research

Still needed for named decisions:

- intrinsic game-learning integration in adult or programming contexts;
- accessible code and canvas interactions;
- Motion, Rive, GSAP, and game-framework tradeoffs;
- tutorial-video production and captions;
- novice editor usability;
- Pyodide worker behavior;
- asset licensing and provenance; and
- whether the persistent hub improves return and comprehension.

Research should end with a product decision, prototype, or rejection. A bibliography alone does not clear a gate.

## 10. Readiness verdict

### Ready now

- canonical vision review;
- owner grilling and domain-language decisions;
- three visual directions;
- mission-only versus Operations Center prototypes;
- scripted First Contact interaction;
- code-to-world motion experiment;
- CodeMirror and Pyodide spikes;
- Rive and tutorial-media proof-of-concepts;
- mission-state modeling; and
- learner observation with consent.

### Not ready yet

- production-wide content schema;
- large curriculum build;
- large illustration or animation library;
- broad video production;
- backend and account system;
- production AI tutor;
- full game engine;
- native app;
- social competition;
- monetization; or
- custom Rust.

## 11. Recommended delivery sequence

```text
1. Review and approve canonical vision
2. Run the bounded Wayfinder decision map
3. Create visual identity directions
4. Prototype mission-only and Operations Center variants
5. Prototype code-to-world causality and recovery
6. Run editor, runtime, motion, and media spikes
7. Hold the architecture checkpoint
8. Reconcile old terminology and content schema
9. Issue a production Codex handoff
10. Build First Contact vertically
11. Build Identity Tag to prove reuse
12. Complete The Midnight Badge
13. Measure immediate, delayed, and transfer outcomes
14. Decide whether and how to expand
```

## 12. Main risks after rebaseline

| Risk | Early control |
|---|---|
| the mystery overwhelms Python | code action within the opening minutes; narrative budget |
| graphics create a second product | semantic case events and shared design system |
| rewards become the goal | keep mastery, unlocks, XP, and artifacts separate |
| a full game engine fractures accessibility | React and SVG baseline; explicit engine gate |
| beautiful prototype becomes accidental production | prototype status and architecture checkpoint |
| operations hub delays learning | A/B prototype against mission-only flow |
| video becomes passive curriculum | direct interaction first; media job statement |
| schema absorbs every idea | domain-model prototype before migration |
| Codex fills gaps with arbitrary choices | canonical vision, decision map, and handoff |
| planning never stops | bounded tickets, named exits, one first case |

## 13. Final assessment

The project now has a more distinctive and internally coherent concept than the original tutor plan. The new direction should be embraced, but deliberately.

The next phase is not broad implementation and not another abstract brainstorm. It is a short sequence of high-quality, decision-producing prototypes that allow the team to see, touch, compare, measure, and then lock the first production boundary.
