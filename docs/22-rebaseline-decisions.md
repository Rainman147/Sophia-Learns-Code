# Rebaseline Decision Addendum

**Status:** accepted authority extending `docs/13-decisions.md`  
**Date:** 2026-09-01  
**Reconciliation rule:** when an older decision conflicts with this addendum, this addendum governs. Fold these decisions into the main log after the pre-build Wayfinder map closes.

## D032: Establish one canonical product vision

- **Status:** Accepted
- **Decision:** `VISION.md` is the shortest complete authority for the product. Specialized documents elaborate it but do not redefine the product independently.
- **Rationale:** The project evolved through several good ideas whose accumulation risked creating inconsistent language and architecture.
- **Alternatives considered:** continue adding specialized documents without a canonical synthesis; replace all prior documents immediately.
- **Consequences:** Codex reads `VISION.md` first. Conflicts are raised explicitly. Prior documents remain valuable source material and are reconciled after prototype decisions.
- **Revisit trigger:** a major product pivot approved by the owner.

## D033: Make real Python the primary game mechanic

- **Status:** Accepted
- **Decision:** Python execution directly produces case events, evidence changes, tool behavior, and investigative progress. The learner does not complete unrelated exercises to earn turns in a separate game.
- **Rationale:** Intrinsic integration gives every concept a visible purpose and prevents the game layer from becoming decorative or distracting.
- **Alternatives considered:** course with themed rewards; quiz-driven RPG; standalone mystery scenes between lessons.
- **Consequences:** runtime and deterministic evaluation remain game truth. Story reactions are downstream of actual code behavior.
- **Revisit trigger:** learner evidence shows the integrated case layer harms understanding despite iteration.

## D034: Use one primary investigation vocabulary

- **Status:** Accepted as the working language; individual terms remain testable
- **Decision:** Use Python Investigator as the experience identity and Operations Center, Case, Mission, Encounter, Lab, Investigation Console, Computer's Mind, Debrief, Field Test, Capability Map, Case Archive, and Side Mission as the canonical learner-facing vocabulary.
- **Rationale:** Flight Deck, checkride, investigation, lesson, quest, and module language were competing for the same concepts.
- **Alternatives considered:** retain Flight Deck as the primary identity; mix aviation and detective language; defer all terminology.
- **Consequences:** Flight-deck precision may influence visual design but no longer governs product vocabulary. Old documents are migrated later.
- **Revisit trigger:** Sophia and novice testing consistently prefer a different coherent language.

## D035: Use cases as the narrative spine and missions as the learning unit

- **Status:** Accepted
- **Decision:** Organize the learner experience as Journey to Phase to Case to Mission to Encounter. A Case spans several capabilities and ends in an artifact or defensible finding. A Mission targets one primary capability.
- **Rationale:** This structure connects short learning loops to meaningful outcomes without requiring a giant story or open world.
- **Alternatives considered:** flat lessons; an open exercise feed; one continuous campaign without natural stops.
- **Consequences:** the content model must eventually represent case state, semantic events, artifacts, and mission dependencies.
- **Revisit trigger:** prototype evidence shows the hierarchy creates confusion or unnecessary authoring cost.

## D036: Treat the Operations Center as a prototype-dependent hub

- **Status:** Experiment
- **Decision:** Prototype a restrained persistent Operations Center against a mission-only experience before making it a required product surface.
- **Rationale:** The hub could strengthen anticipation, progress understanding, and return behavior, but it could also delay the first code action and create costly decoration.
- **Alternatives considered:** commit to the hub immediately; reject it; build a large city or base system.
- **Consequences:** compare matched variants and measure time to action, comprehension, curiosity, return intention, and implementation cost.
- **Revisit trigger:** close after the R2 prototype with keep, revise, hybridize, or remove.

## D037: Define a shared experience identity before large asset production

- **Status:** Accepted
- **Decision:** UI, graphics, motion, sound, writing, video, rewards, and progress use one token system, semantic event model, vocabulary, and creative direction.
- **Rationale:** Individually attractive parts can still feel assembled from unrelated products.
- **Alternatives considered:** choose components and assets independently; rely on a logo and color palette for cohesion.
- **Consequences:** create visual directions, motion grammar, asset provenance rules, and cohesion reviews before scaling screens or media.
- **Revisit trigger:** none for the principle; exact visual direction remains experimental.

## D038: Use a layered graphics stack and reject a game engine by default

- **Status:** Accepted for the first case
- **Decision:** Begin with semantic React UI, HTML, CSS, SVG, and one general motion system. Evaluate Rive for a bounded interactive vector asset. Add GSAP only for a proven complex timeline. Do not include PixiJS, Phaser, or another game engine unless a later scene clears a documented capability gate.
- **Rationale:** The first game interactions are information-rich interfaces, not sprite-heavy worlds. A canvas engine creates a second layout, input, testing, and accessibility system.
- **Alternatives considered:** Phaser-first; PixiJS-first; Rive throughout; CSS-only.
- **Consequences:** case state remains renderer-independent. Optional graphics degrade to accessible static or semantic views.
- **Revisit trigger:** a validated persistent scene requires high object counts, camera behavior, sprite systems, physics, or measured rendering performance unavailable through the baseline.

## D039: Use motion to explain state, not merely decorate it

- **Status:** Accepted
- **Decision:** Every animation is classified as causal, orienting, feedback, reward, or ambient motion. Instructional motion follows semantic execution and provides a reduced-motion and text-equivalent path.
- **Rationale:** Motion can expose invisible program behavior or become expensive visual noise.
- **Alternatives considered:** animate opportunistically; remove motion entirely; let animation state own product logic.
- **Consequences:** animation never decides correctness, blocks the next action, or becomes the only state representation.
- **Revisit trigger:** learner evidence shows a category does not improve comprehension, orientation, or motivation.

## D040: Keep direct interaction primary and gate tutorial media

- **Status:** Accepted
- **Decision:** Use short, captioned, transcribed, learner-controlled media only when narration or temporal demonstration adds value beyond direct manipulation. Validate the interaction before producing a broad video library.
- **Rationale:** Long passive video can undermine the action density and becomes expensive to revise as the product changes.
- **Alternatives considered:** video-first curriculum; no video; large pre-recorded library before prototyping.
- **Consequences:** prototype in-app animation, ordinary video, and a programmatic Remotion candidate for representative concepts. Record licensing and revision cost.
- **Revisit trigger:** R4 media spike and later concept-specific evidence.

## D041: Stabilize contracts before vendors and libraries

- **Status:** Accepted
- **Decision:** Define project-owned MissionDefinition, MissionActor, EditorAdapter, ExecutionRuntime, MissionEvaluator, CaseState, SceneRenderer, EvidenceStore, TutorGateway, and MediaAsset boundaries before broad implementation.
- **Rationale:** The expensive lock-in is usually semantic and architectural leakage, not the mere presence of a dependency.
- **Alternatives considered:** let the first chosen framework define the domain; abstract every dependency before use.
- **Consequences:** abstractions must protect a real boundary and remain small. Do not create speculative indirection that has no second use or identified replacement risk.
- **Revisit trigger:** prototypes reveal a different domain boundary.

## D042: Keep the candidate web stack provisional until measured spikes

- **Status:** Provisional
- **Decision:** Continue with a responsive web application, React and TypeScript, Next.js candidate, explicit mission statechart, CodeMirror guided editor, Pyodide Web Worker, deterministic evaluator, local evidence store, and no initial backend as the leading hypothesis. Lock each component only after its named gate.
- **Rationale:** The direction is plausible and modern, but learner experience, runtime behavior, accessibility, and authoring cost must decide.
- **Alternatives considered:** native-first; notebook-first; full backend-first; Monaco-first; game-engine-first.
- **Consequences:** pre-build R1 through R6 generate the required evidence. Codex may prototype but cannot present the stack as permanently settled.
- **Revisit trigger:** architecture checkpoint.

## D043: Treat early vertical slices as a design laboratory

- **Status:** Accepted
- **Decision:** Before production First Contact, create bounded visual, interaction, motion, media, editor, and runtime prototypes. The architecture checkpoint determines what survives into the production slice.
- **Rationale:** A high-fidelity prototype can answer questions that prose cannot, while a premature production build can fossilize weak choices.
- **Alternatives considered:** research everything before coding; begin production E0 immediately and refactor later.
- **Consequences:** prototypes declare whether they are disposable, transferable, or production candidates. Narrow scope should still receive high design quality.
- **Revisit trigger:** architecture checkpoint completes.

## D044: Do not expand the current lesson schema by accumulation

- **Status:** Accepted
- **Decision:** Treat the current lesson schema as a valuable specimen. Prototype the Case, Mission, Encounter, ExecutionTask, EvidenceRule, CaseEvent, SceneEffect, RewardRule, MediaCue, and AccessibilityAlternative domain before migrating it.
- **Rationale:** Adding many optional game fields to a lesson object would create a shallow, brittle content blob.
- **Alternatives considered:** immediately extend the existing YAML; discard all prior schema work; hard-code the first case.
- **Consequences:** two missions must demonstrate a boundary before it becomes a general authoring contract.
- **Revisit trigger:** after Identity Tag proves or disproves reuse.

## D045: General learning research is sufficient for prototypes

- **Status:** Accepted
- **Decision:** Do not delay the first experience prototypes for another broad review of retrieval, spacing, worked examples, fading, self-explanation, feedback, visualization, and humane gamification. Conduct only targeted research tied to a named decision.
- **Rationale:** The repository has enough evidence to act. More general reading risks becoming avoidance.
- **Alternatives considered:** comprehensive new literature review before any prototype; no further research at all.
- **Consequences:** targeted research remains required for editor usability, runtime behavior, graphics and media tools, accessibility, intrinsic game integration, and licensing.
- **Revisit trigger:** a new material claim or product result challenges the current foundation.

## D046: Keep custom Rust outside the first validated case

- **Status:** Accepted
- **Decision:** Do not add custom Rust to the rebaseline prototypes or first case. Existing Rust-powered tools may be used normally. Evaluate custom Rust only at a measured stable boundary such as a Tauri professional companion, profiled WebAssembly computation, distributable CLI, or sandbox supervisor.
- **Rationale:** The learner loop and creative system are the current risks. Rust would not resolve them and would slow iteration in the most changeable layer.
- **Alternatives considered:** Rust frontend; Tauri-first; RustPython; early Rust services.
- **Consequences:** every later Rust proposal states the measured problem, learner benefit, comparison, maintenance cost, and rollback path.
- **Revisit trigger:** documented Rust entry gate is satisfied.
