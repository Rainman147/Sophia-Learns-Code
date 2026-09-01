# Codex Handoff: Pre-Build Experience Rebaseline

**Repository:** `Rainman147/Sophia-Learns-Code`  
**Program:** pre-build R1 through R6  
**Downstream implementation epic:** GitHub issue #11, Experience Loop 0  
**Status:** ready for a product-discovery and prototype lane, not broad production implementation

## 1. Objective

Turn the canonical Python Investigator vision into an owner-approved, prototype-informed production boundary for the first playable case.

The lane must answer how the game looks, feels, moves, teaches, reacts to real code, presents progress, and remains cohesive before Codex scales implementation or curriculum.

The destination is:

> A validated creative direction, mission flow, Operations Center decision, motion and graphics pipeline, tutorial-media policy, editor/runtime/state-machine recommendation, and architecture checkpoint that lets a production First Contact lane build without inventing core product decisions.

## 2. Read in this order

1. `VISION.md`
2. `docs/21-project-rebaseline-assessment.md`
3. `docs/18-game-and-narrative-design-system.md`
4. `docs/19-experience-identity-and-media-system.md`
5. `docs/20-prebuild-architecture-and-research-gates.md`
6. `docs/22-rebaseline-decisions.md`
7. `docs/00-product-charter.md`
8. `docs/01-learner-journey.md`
9. `docs/02-learning-science.md`
10. `docs/05-lesson-design-system.md`
11. `docs/06-mastery-and-assessment.md`
12. `docs/12-risks-and-guardrails.md`
13. `docs/13-decisions.md`
14. `content/examples/phase-0/001-first-contact.yaml`
15. the pre-build Wayfinder map and its current decision ticket

When old terminology conflicts, `VISION.md` and `docs/22-rebaseline-decisions.md` govern. Raise other contradictions rather than silently choosing.

## 3. Product truth

Sophia Learns Code is a Python-powered mystery investigation game.

```text
Case presents evidence
  → learner predicts or changes Python
  → real execution produces output, errors, tests, and state
  → deterministic evaluator emits semantic case events
  → accessible UI and motion express the consequence
  → learner interprets, repairs, or extends
  → evidence updates mastery and rewards
  → a useful next possibility opens
```

Python is not an exercise gate before a separate game. It is the game control system.

## 4. Canonical vocabulary

Use:

```text
Python Investigator
Operations Center
Case
Mission
Encounter
Lab
Investigation Console
Computer's Mind
Debrief
Field Test
Capability Map
Case Archive
Side Mission
```

Do not introduce additional competing vocabulary without a recorded decision.

## 5. Required work phases

# R1: Creative-direction prototypes

Create three coherent directions using the same product states:

- Operations Center;
- First Contact cold open;
- code and live case result;
- prediction;
- code-to-world causal response;
- syntax error and calm repair;
- badge evolution;
- tool unlock; and
- reduced-motion equivalent.

Directions:

1. Analytical Noir
2. Luminous Operations Lab
3. Precision Field Console

These are starting hypotheses, not rigid art direction. Each direction must feel college-aged, polished, modern, and usable.

Deliver:

- visual boards or runnable routes;
- token samples;
- core component examples;
- motion notes;
- accessibility notes;
- estimated asset and implementation cost;
- owner comparison table; and
- recommendation or synthesis.

# R2: Mission-only versus Operations Center prototype

Create matched variants of the same First Contact flow.

### Variant A

Direct entry into the mission with a compact end state.

### Variant B

A restrained Operations Center at natural boundaries, showing the case, one tool, capability evidence, and the next mission.

Keep learning content and visual quality equivalent.

Measure:

- time to first action;
- navigation hesitation;
- understanding of the case;
- interest in future tools;
- perceived cohesion;
- voluntary exploration;
- desire to continue; and
- added complexity.

Record keep, revise, hybridize, or remove.

# R3: Code-to-world motion and graphics spike

Implement one real semantic sequence:

```text
source line becomes active
  → value is evaluated
  → output appears
  → investigation console changes state
  → evidence card records the result
```

Baseline implementation:

- React;
- semantic HTML and SVG;
- Motion for React or equivalent;
- reduced-motion and text-only path.

Optional experiment:

- one Rive asset driven by semantic application state.

Use GSAP only if a genuinely complex timeline proves the baseline inadequate. Do not add PixiJS, Phaser, or Three.js during this lane.

Deliver:

- performance observations;
- state synchronization tests;
- reduced-motion behavior;
- accessibility behavior;
- fallback with the optional asset missing;
- authoring workflow notes; and
- stack decision.

# R4: Tutorial-media spike

Take one dynamic concept and compare:

- direct in-app explanation;
- animated diagram;
- short captioned video or programmatic clip;
- interaction immediately after the explanation.

A Remotion proof-of-concept is allowed only as one comparison. Record current licensing, revision workflow, rendering path, and whether shared React primitives create real savings.

Do not produce a video library.

# R5: Mission-shell technology spike

Build the minimum shared shell with:

- Next.js or the candidate application framework;
- strict TypeScript;
- explicit mission actor using XState 5 or a documented alternative;
- `EditorAdapter` with CodeMirror candidate;
- one scripted execution route;
- one real Pyodide Web Worker route;
- normalized stdout and unmatched-quote error;
- timeout, cancellation, reset, and stale-result rejection;
- semantic case event;
- accessible scene reaction;
- IndexedDB or equivalent storage behind `EvidenceStore`;
- reload and resume; and
- unit, component, and browser tests.

Do not build a backend, account system, production AI tutor, generalized curriculum engine, remote sandbox, native shell, game engine, or custom Rust.

# R6: Architecture checkpoint

Produce a durable decision record covering:

- chosen creative direction;
- product vocabulary;
- hub decision;
- Case, Mission, Encounter, CaseEvent, and SceneEffect boundaries;
- mission state-machine approach;
- editor strategy;
- Python runtime strategy;
- evaluator and case-state contract;
- motion and graphics stack;
- optional vector asset tool;
- tutorial-media strategy;
- local storage and migration boundary;
- content-schema migration plan;
- performance budgets;
- accessibility tests;
- asset and license provenance;
- what prototype code survives;
- what is deliberately discarded; and
- exact production handoff for First Contact.

## 6. Stable seams to preserve

Prototype these project-owned boundaries without overengineering them:

```text
MissionDefinition
MissionActor
EditorAdapter
ExecutionRuntime
MissionEvaluator
CaseState
SceneRenderer
EvidenceStore
MediaAsset
```

A boundary must protect a real change risk or domain seam. Do not build a generic plugin system merely because multiple libraries are under consideration.

## 7. Quality standard

The prototype scope is narrow. Its execution should still be high quality.

Required qualities:

- one visually dominant action per state;
- immediate control response;
- precise hierarchy;
- coherent typography, surfaces, icons, and writing;
- no fake hacker interface clutter;
- truthful code-to-result causality;
- calm error state;
- meaningful rather than excessive motion;
- responsive layout for target laptop sizes;
- keyboard completion;
- screen-reader semantics;
- reduced-motion parity;
- no color-only meaning;
- work preserved through reset, error, and worker replacement; and
- clean stopping and return.

## 8. Research rule

Use primary official sources for technology decisions and relevant research for learning or motivation claims.

Research must answer a named decision. Store concise findings, implications, limitations, and the decision. Do not perform a broad technology or learning-science survey without a ticket.

## 9. Prototype status rule

Every artifact declares one of:

- **throwaway:** made only to answer a question;
- **transferable:** concepts or assets may be reused, implementation may not;
- **production candidate:** may survive after architecture review.

No prototype becomes production because it looks polished or already exists.

## 10. Branch and review strategy

- Keep each prototype or spike on a clearly named branch.
- Link the branch, preview, screenshots, and findings from its decision ticket.
- Do not merge large experimental dependency sets into `main` before the architecture checkpoint.
- Merge durable documents, selected assets, and accepted contracts only after review.
- Record rejected approaches and why they were rejected.

## 11. Observation

The owner and consenting novice learner should be able to compare prototypes without installation.

Observe:

- first-action comprehension;
- code and result distinction;
- narrative burden;
- code-to-world understanding;
- meaningful experimentation;
- error recovery;
- reward comprehension;
- visual trust and appeal;
- motion helpfulness;
- voluntary continuation; and
- delayed recall of what the code did.

Do not treat preference alone as learning evidence, and do not treat correctness alone as a complete experience measure.

## 12. Exit criteria

This lane is complete only when:

- one canonical visual and verbal direction is recorded;
- the Operations Center has a keep, revise, hybrid, or remove decision;
- the motion and graphics stack has a bounded accepted baseline;
- tutorial media has a clear role and production rule;
- editor, runtime, mission state, and local persistence have measured decisions;
- the domain model is sharp enough to migrate the content schema;
- accessibility and performance gates are explicit;
- no material product choice is being left for the production Codex lane to guess; and
- a new First Contact implementation handoff is committed.

The lane does not build the rest of the course or the complete game.
