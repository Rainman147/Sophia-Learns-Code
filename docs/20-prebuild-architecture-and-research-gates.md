# Pre-Build Architecture and Research Gates

**Status:** canonical pre-build authority  
**Date:** 2026-09-01  
**Parent vision:** `VISION.md`

## 1. Position

The project should understand its product before locking expensive architecture, but it should not wait for imaginary certainty before making anything tangible.

The correct strategy is:

```text
Stabilize hard-to-reverse contracts
      ↓
Build cheap, high-fidelity prototypes
      ↓
Measure the uncertain technologies
      ↓
Record decisions and rejection reasons
      ↓
Build the first production vertical slice
```

The first prototypes are research instruments. They may be visually polished enough to judge, but they are not automatically the production foundation.

## 2. Not all choices create equal lock-in

### Hard to reverse after scale

- learner-facing product vocabulary;
- case, mission, encounter, and artifact semantics;
- content and prerequisite model;
- execution request and result contract;
- semantic case events;
- evidence and mastery meaning;
- support-level and solution-reveal semantics;
- learner-data, privacy, and consent boundaries;
- accessibility guarantees;
- asset ownership and source pipeline; and
- published content versioning.

These should be deliberately modeled and tested before broad production.

### Moderately expensive to reverse

- application framework;
- mission orchestration model;
- editor integration;
- execution runtime;
- state tracing strategy;
- persistent storage model;
- animation and vector-asset pipeline;
- video-production pipeline; and
- backend boundary.

These need prototypes and adapters before scale.

### Comparatively replaceable when isolated

- specific editor library;
- animation helper library;
- component primitives;
- icon set;
- hosting provider;
- analytics provider;
- AI model provider;
- local database implementation; and
- one decorative graphics runtime.

Do not let a replaceable library leak into mission, evidence, or case semantics.

## 3. Current candidate architecture

The following is a hypothesis to validate, not an unconditional stack decree.

```text
Responsive browser application
  Next.js App Router + React + strict TypeScript

Mission orchestration
  XState 5 or equivalent explicit statecharts

Guided code surface
  CodeMirror 6 behind EditorAdapter

Professional code surface later
  Monaco behind the same product boundary

Foundational Python
  pinned Pyodide inside a module Web Worker

Instructional visuals
  semantic HTML + SVG + Motion for React candidate

Interactive vector asset experiment
  Rive for one bounded Operations Center element

Persistence during Experience Loop 0
  IndexedDB behind EvidenceStore

Truth and feedback
  deterministic evaluator, tests, authored misconceptions, bounded trace

Backend
  none for the pre-build prototypes or first local vertical slice

Custom Rust
  none until a measured stable boundary earns it
```

Official references:

- Next.js App Router: https://nextjs.org/docs/app
- XState 5: https://stately.ai/docs
- CodeMirror: https://codemirror.net/docs/
- Monaco: https://microsoft.github.io/monaco-editor/
- Pyodide: https://pyodide.org/en/stable/
- Motion for React: https://motion.dev/docs/react
- Rive React runtime: https://rive.app/docs/runtimes/react/react
- GSAP timelines: https://gsap.com/docs/v3/GSAP/Timeline/
- PixiJS: https://pixijs.com/8.x/guides
- Phaser: https://docs.phaser.io/
- Remotion: https://www.remotion.dev/
- View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API

## 4. Stable product seams

Codex should build against project-owned contracts, not import third-party APIs throughout the product.

### `MissionDefinition`

Describes objectives, encounters, prerequisites, content version, hints, tests, evidence rules, semantic case events, accessibility, and safety.

### `MissionActor`

Owns the explicit learner-flow state machine: briefing, prediction, execution, inspection, feedback, repair, field test, reward, pause, resume, and completion.

### `EditorAdapter`

Provides source text, selection, diagnostics, focus, read-only ranges, decorations, accessibility behavior, and change events independent of CodeMirror or Monaco.

### `ExecutionRuntime`

Accepts a versioned run request and returns normalized output, error, metrics, trace, cancellation, and revision identity independent of Pyodide or a later remote runtime.

### `MissionEvaluator`

Converts execution and tests into deterministic task results, misconception evidence, and semantic case events.

### `CaseState`

Represents the investigation world in domain terms rather than component state.

### `SceneRenderer`

Turns semantic case state into accessible DOM, SVG, optional vector assets, motion, sound, and static fallbacks.

### `EvidenceStore`

Records attempts, support, delay, transfer, mastery transitions, rewards, and content versions behind local or remote storage.

### `TutorGateway`

Later converts bounded evidence into constrained coaching. It is absent from the first experience unless an authored deterministic fallback already works.

### `MediaAsset`

Describes video, animation, transcript, caption, poster, reduced-motion alternative, license, and version independent of one host or player.

## 5. Pre-build sequence

# R0: Canonical rebaseline

### Purpose

Create one coherent product idea and identify conflicts in the previous baseline.

### Deliverables

- `VISION.md`;
- game and narrative system;
- experience identity and media system;
- architecture and research gates;
- rebaseline assessment;
- decision addendum; and
- bounded Wayfinder map.

### Exit

Every contributor can explain the same product in one paragraph and can identify which documents govern conflicts.

# R1: Identity and vocabulary exploration

### Question

Which visual and verbal identity makes the product feel adult, coherent, inviting, and investigative without becoming cold, childish, or a hacker cliché?

### Prototype

Create three creative directions using the same eight states:

- Operations Center;
- mission cold open;
- code and result;
- prediction;
- execution consequence;
- error and repair;
- badge evolution; and
- tool unlock.

### Measure

- immediate comprehension;
- age appropriateness;
- emotional preference and reason;
- perceived trust and quality;
- desire to interact;
- accessibility risk;
- asset and implementation cost; and
- whether the direction remains legible in both light and dark environments.

### Exit

Choose, combine, or reject directions and record the visual principles. Do not select only from aesthetic preference. The direction must support the code-learning hierarchy.

# R2: Mission-only versus Operations Center prototype

### Question

Does a persistent hub improve anticipation, progress understanding, and return behavior enough to justify its navigation and asset cost?

### Variant A

The learner enters directly into a mission and receives a compact completion screen.

### Variant B

The learner begins and returns through a restrained Operations Center whose tools and case state evolve.

### Keep constant

- mission content;
- code task;
- feedback;
- reward evidence;
- visual quality; and
- session length.

### Measure

- time to first meaningful code action;
- understanding of what to do next;
- interest in future unlocks;
- voluntary exploration;
- cognitive load;
- return intention;
- memory of capability versus decorative state; and
- implementation complexity.

### Exit

Choose mission-only, hub-plus-mission, or a hybrid where the hub appears only at natural boundaries.

# R3: Motion and graphics pipeline spike

### Question

What is the smallest visual stack that can deliver premium, accessible code-to-world causality and a cohesive identity?

### Baseline

Build the same short sequence using HTML, CSS, SVG, and the selected React motion candidate:

```text
Run code
  → highlight current source
  → move or reveal semantic value
  → update result and case card
  → show changed-state evidence
  → reduced-motion equivalent
```

### Optional comparison

Use Rive for one interactive Operations Center instrument. Evaluate GSAP only for one genuinely complex timeline. Do not compare tools on a decorative loading spinner.

### Record

- authoring speed;
- runtime weight;
- frame stability;
- accessibility;
- state synchronization;
- design iteration workflow;
- testing strategy;
- asset ownership;
- dark/light/high-contrast variants;
- failure fallback; and
- Codex maintainability.

### Exit

Adopt one general UI motion system and, at most, one specialized vector or timeline tool. Reject unnecessary engines explicitly.

# R4: Tutorial-media pipeline spike

### Question

How can short tutorials look like the same product, support interaction, remain accessible, and be economical to revise?

### Prototype the same explanation in two forms

- in-app animated explanation using shared visual primitives;
- short captioned video or programmatically rendered clip with a prediction pause.

### Evaluate

- learning value beyond direct manipulation;
- production and revision time;
- visual cohesion;
- captions and transcript workflow;
- localization potential;
- file size and streaming;
- analytics and privacy;
- source ownership; and
- licensing.

### Remotion gate

Evaluate Remotion only if reusing React-driven visual primitives materially reduces production cost or enables necessary parameterization. Record its current license obligations before adoption.

### Exit

Define which explanations use direct interaction, animated diagrams, human-recorded video, or programmatic video. Do not create a broad video library yet.

# R5: Mission-shell technology spike

### Question

Can the proposed web stack support the validated flow cleanly and quickly on representative devices?

### Build

- one explicit mission actor;
- guided editor adapter;
- one scripted execution mode;
- one real Pyodide worker path;
- normalized output and unmatched-quote error;
- cancellation and stale-result rejection;
- one local evidence record;
- one semantic case event;
- one accessible animation and static fallback; and
- one reload/resume path.

### Compare only when evidence warrants

- XState versus a smaller explicit reducer/statechart;
- CodeMirror versus a simpler temporary editor;
- Pyodide startup and worker behavior;
- Motion versus native CSS and View Transitions for ordinary navigation.

### Exit

The shell works without a backend, survives error and cancellation, remains responsive, and preserves all stable seams.

# R6: Architecture checkpoint

### Purpose

Convert prototype evidence into a production boundary for Experience Loop 0.

### Required decisions

- canonical identity and vocabulary;
- hub strategy;
- mission domain model;
- state-machine approach;
- editor and adapter contract;
- runtime contract and initial implementation;
- case event and scene rendering model;
- general motion system;
- optional asset runtime;
- tutorial-media approach;
- local persistence and migration boundary;
- content schema migration plan;
- performance budgets;
- accessibility acceptance tests;
- licensing and provenance obligations; and
- what remains deliberately disposable.

### Exit

A Codex implementation lane can begin without inventing product meaning or selecting untested infrastructure on the fly.

## 6. Architecture decision matrix

| Area | Leading candidate | Why it fits | Main risk | Decision gate |
|---|---|---|---|---|
| Delivery | responsive web app | no installation, fast iteration | browser/runtime constraints | R5 |
| Framework | Next.js App Router | mature React product shell | unnecessary server complexity in client-heavy workspace | R5 |
| Mission flow | XState 5 | explicit, testable branching states | conceptual and bundle overhead | R5 |
| Guided editor | CodeMirror 6 | modular and controllable | accessibility and integration must be proven | R5 |
| Pro editor later | Monaco | professional fidelity and VS Code bridge | weight and novice complexity | future multi-file gate |
| Python runtime | Pyodide worker | real CPython-compatible browser execution | startup, cancellation, memory, Web API exposure | R5 |
| Core graphics | HTML, CSS, SVG | accessible and integrated with UI | may become verbose for complex scenes | R3 |
| UI motion | Motion for React | layout, gesture, and reduced-motion support | overuse or library coupling | R3 |
| Interactive vectors | Rive | designer-authored stateful assets | canvas accessibility, tool workflow, asset lock-in | R3 |
| Complex timelines | GSAP | precise sequencing | second motion dialect and added complexity | R3 only if needed |
| Game rendering | Phaser or PixiJS | capable 2D scene rendering | separate rendering and accessibility universe | rejected unless a later scene requires it |
| Tutorial video | ordinary video plus shared in-app visuals | simple and portable | editing drift | R4 |
| Programmatic video | Remotion | React-driven reusable video system | license and production complexity | R4 |
| Local persistence | IndexedDB adapter | backend-free multi-session prototype | migration and debugging | R5 |
| Backend later | FastAPI modular monolith | Python-aligned domain and clear API | premature operations | after Experience Loop 0 |
| Native later | Tauri | local files, terminal, Git, offline | platform and Rust complexity | professional-transition gate |
| Custom Rust | none initially | preserves iteration speed | missing future optimization | measured boundary only |

## 7. Rust entry gate

Rust is not a brand attribute. It enters only when all are true:

1. a bottleneck or native capability gap is measured;
2. the product interface is stable;
3. learner benefit is explicit;
4. TypeScript, Python, browser APIs, and existing tools were compared;
5. testing, debugging, build, deployment, and maintenance costs are acceptable; and
6. a rollback path exists.

Plausible later boundaries:

- Tauri professional companion;
- profiled trace or state-diff computation in WebAssembly;
- distributable content or project CLI;
- remote sandbox supervision; and
- existing Rust-based tools such as Ruff and uv.

Custom Rust remains excluded from R0 through the first validated case.

## 8. Content-schema gate

The existing lesson schema is a valuable specimen, not yet the final game-content model.

Before expanding it, decide whether authoring uses:

```text
CaseDefinition
MissionDefinition
EncounterDefinition
ExecutionTask
EvidenceRule
CaseEvent
SceneEffect
RewardRule
MediaCue
AccessibilityAlternative
```

Do not merely add dozens of optional game fields to the current lesson file. Prototype two missions, identify the true reusable boundaries, then migrate the schema deliberately.

## 9. Targeted research still needed

### Needed before production E0

- comparative novice reaction to the visual directions;
- mission-only versus Operations Center prototype;
- motion and vector-asset workflow;
- guided editor accessibility and usability;
- Pyodide worker performance and cancellation;
- exact mission-state model; and
- asset provenance and licensing plan.

### Needed before tutorial-media scale

- direct interaction versus video for representative concepts;
- captions and transcript workflow;
- hosting and privacy;
- Remotion licensing and revision cost; and
- localization and reduced-motion alternatives.

### Needed later, not now

- production authentication;
- cross-device synchronization;
- backend hosting;
- AI tutor model selection;
- remote sandbox provider;
- native application;
- game engine;
- social features;
- monetization; and
- custom Rust.

### Already sufficient to begin prototypes

The repository has enough general learning-science support for retrieval, spacing, worked examples, faded guidance, self-explanation, feedback, visualization, and humane gamification. More broad literature review should not delay the first experience prototypes. New research should answer a named decision.

## 10. Performance and quality gates

The first production boundary must define measurable budgets for:

- time to first useful action;
- editor input latency;
- worker initialization and warm execution;
- cancellation and recovery;
- animation frame stability;
- asset payload and decode time;
- idle CPU and battery use;
- memory across repeated runs;
- stale-result prevention;
- screen-reader status timing;
- keyboard completion;
- reduced-motion parity; and
- preservation of learner work through failure.

Do not optimize abstract benchmark scores while the learner waits to see her code respond.

## 11. No premature build freeze

This plan does not mean “stop building until every question is answered.” It means:

```text
Build prototypes now
Lock production architecture later
```

Allowed immediately:

- visual directions;
- storyboards;
- clickable mission flows;
- scripted case reactions;
- motion experiments;
- editor and Pyodide spikes;
- Rive or Remotion proof-of-concepts; and
- disposable state models.

Not allowed yet:

- broad curriculum implementation;
- permanent schema expansion;
- backend platform construction;
- large animation or video asset production;
- full game-engine integration;
- production AI tutor;
- native shell; or
- custom Rust.

## 12. Final pre-build rule

A technology is selected only when the project can complete this sentence:

> We are choosing this tool because it improves this learner-visible behavior or this measured stable boundary, and the prototype showed the benefit exceeds the cost.
