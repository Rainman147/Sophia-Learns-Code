# Product and Architecture Decision Log

This file records durable direction. It is not a meeting transcript.

## Status meanings

- **Accepted:** current authority until a stated revisit trigger occurs.
- **Provisional:** direction for prototyping, not a permanent commitment.
- **Experiment:** requires learner or technical evidence before adoption.
- **Rejected:** considered and intentionally not pursued.
- **Superseded:** replaced by a later decision.

## D001 — Optimize for independence, not course completion

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** The north-star outcome is independent success on delayed, unfamiliar transfer tasks.
- **Rationale:** Completion and immediate recognition can create an illusion of competence.
- **Consequences:** Product metrics, lesson design, and roadmap must include generation, delay, and transfer.
- **Revisit trigger:** Strong evidence that another observable measure predicts independent work better.

## D002 — Assume an absolute-zero learner

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** The opening curriculum explicitly teaches editor orientation, Run, console, code/output distinction, punctuation, state, and error handling.
- **Rationale:** Beginner platforms frequently conceal computer-literacy prerequisites.
- **Consequences:** Phase 0 is granular, observed with novices, and skippable only through performance evidence.
- **Revisit trigger:** None; advanced placement may alter route but not remove the zero-capable path.

## D003 — Use Python Investigator: Flight Deck as a working experience concept

- **Date:** 2026-09-01
- **Status:** Provisional
- **Decision:** Frame lessons as briefings, simulator interactions, missions, case files, debriefs, and checkrides.
- **Rationale:** The metaphor supplies purpose, progression language, and a mature playful tone.
- **Consequences:** Narrative must remain short and concept-serving. No official school branding is used.
- **Revisit trigger:** Sophia or broader novice testing finds the framing childish, distracting, or unclear.

## D004 — Define fun through competence and curiosity

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Fun originates in visible causality, discovery, meaningful choice, authentic cases, expression, and growing capability.
- **Rationale:** A cosmetic reward layer cannot rescue passive instruction.
- **Consequences:** Every game mechanic states its intended learning and motivational mechanism.
- **Revisit trigger:** None for the principle; individual mechanics remain experimental.

## D005 — Reject punitive streaks and public leaderboards for the initial product

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Use streakless momentum, return-friendly review, private capability progress, and optional mentor connection.
- **Rationale:** Missed-day shame and social comparison can distort motivation and performance.
- **Consequences:** No lost progress, broken-chain copy, or rank pressure.
- **Revisit trigger:** Learner-requested optional social modes with evidence of benefit and strong privacy controls.

## D006 — Use an evidence ladder for important concepts

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Progress from worked example through prediction, completion, ordering, repair, modification, independent generation, transfer, and delayed retrieval.
- **Rationale:** No single exercise form establishes programming capability.
- **Consequences:** Content scope includes more than linear lessons and quizzes.
- **Revisit trigger:** Research or product evidence supports a more efficient ladder for a specific capability.

## D007 — Make mastery states transparent

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Use Unseen, Introduced, Guided, Independent, Durable, Transferable, and Integrated evidence states.
- **Rationale:** One percentage hides support level, delay, and transfer.
- **Consequences:** The learner can inspect why a state exists.
- **Revisit trigger:** State complexity confuses learners; labels may simplify while evidence semantics remain.

## D008 — Deterministic systems decide code correctness

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Tests, execution, trace predicates, and explicit rubrics are authority for executable behavior.
- **Rationale:** Language models can hallucinate runtime claims and grading judgments.
- **Consequences:** AI tutoring must be grounded in grader results and cannot override them.
- **Revisit trigger:** None; human review can supplement but AI does not become sole authority.

## D009 — AI is a constrained coach

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** The tutor explains, nudges, diagnoses, reviews, and debriefs under authored hint and integrity policies.
- **Rationale:** Unrestricted answer generation can reduce learner agency and corrupt mastery evidence.
- **Consequences:** Structured I/O, reveal levels, deterministic grounding, direct-explanation escape hatch, and evaluations are required.
- **Revisit trigger:** Tutor evidence shows a mode is ineffective or harmful.

## D010 — Store curriculum as versioned data

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Lessons, tests, hints, misconceptions, prerequisites, and rubrics live in schema-validated repository files.
- **Rationale:** Content must be reviewable, testable, diffable, and reproducible.
- **Consequences:** Build a renderer and validation pipeline before a large authoring CMS.
- **Revisit trigger:** File-based authoring becomes the validated bottleneck for contributors.

## D011 — Begin browser-first

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Foundational lessons run without local installation.
- **Rationale:** Environment setup is bad friction when the concept is `print`, variables, or loops.
- **Consequences:** Browser runtime and editor integration are early technical spikes.
- **Revisit trigger:** Representative devices cannot provide reliable performance or accessibility.

## D012 — Evaluate Pyodide in a Web Worker

- **Date:** 2026-09-01
- **Status:** Provisional
- **Decision:** Use Pyodide as the first candidate for browser Python, isolated from the UI thread.
- **Rationale:** It provides CPython in WebAssembly and supports substantial package coverage.
- **Consequences:** Startup, cancellation, trace hooks, memory, package loading, and sandbox boundaries require measurement.
- **Revisit trigger:** Technical spike fails latency, compatibility, isolation, or trace requirements.

## D013 — Use Monaco as a desktop editor candidate, not a mobile promise

- **Date:** 2026-09-01
- **Status:** Provisional
- **Decision:** Evaluate Monaco for laptop and desktop professional fidelity while keeping the editor behind an adapter.
- **Rationale:** Familiarity can ease transition to VS Code, but mobile support and first-time complexity are concerns.
- **Consequences:** Mobile focuses on review and trace initially; a lighter editor may be tested.
- **Revisit trigger:** Bundle, accessibility, or novice usability results are poor.

## D014 — Use browser execution for basics and isolated remote execution for advanced labs

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Route code based on required capabilities rather than forcing one runtime to do everything.
- **Rationale:** Browser execution is fast and economical; OS, process, and advanced package work needs stronger environments.
- **Consequences:** A stable execution contract abstracts both runtimes.
- **Revisit trigger:** Browser or local execution covers advanced requirements safely enough to remove remote infrastructure.

## D015 — Build a modular monolith before distributed services

- **Date:** 2026-09-01
- **Status:** Provisional
- **Decision:** Begin with a cohesive FastAPI backend organized by domain boundaries.
- **Rationale:** Early service distribution increases operational cost before scaling needs are known.
- **Consequences:** Boundaries are preserved in code; network separation waits.
- **Revisit trigger:** Security, ownership, independent scaling, or reliability demands service extraction.

## D016 — Keep learner data out of the public repository

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** This repository contains product documents, code, synthetic content, and anonymized aggregate findings only.
- **Rationale:** Assessment, tutor, and identity data are sensitive.
- **Consequences:** Protected stores, consent, retention, export, deletion, and sharing controls are required.
- **Revisit trigger:** None.

## D017 — Begin with mixed mission flavor, specialize after foundations

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Offer general, cyber, and financial surface choices early while keeping the same concept graph; introduce specialized complexity later.
- **Rationale:** Purpose increases relevance, but domain complexity can overload a novice.
- **Consequences:** Early datasets stay tiny and traceable.
- **Revisit trigger:** Learner evidence shows a different sequence improves transfer or motivation.

## D018 — Teach the platform's exit

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Files, terminal, local Python, environments, tests, Git, GitHub, and independent projects are required curriculum stages.
- **Rationale:** Platform fluency is not professional independence.
- **Consequences:** Later checkrides execute outside the guided platform.
- **Revisit trigger:** None; exact timing remains experimental.

## D019 — Build five polished lessons before broad curriculum production

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** First Contact, Names and Values, Make a Decision, Repeat the Signal, and Case 001 form the initial runnable slice.
- **Rationale:** A thin end-to-end slice tests more important assumptions than a large content inventory.
- **Consequences:** General engines are built only as these lessons require them.
- **Revisit trigger:** Storyboard or learner test reveals a better minimum sequence.

## D020 — Validate interactions before producing a video library

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Record micro-video only where narration or motion demonstrably improves an already validated lesson.
- **Rationale:** Video is expensive and can fossilize weak design.
- **Consequences:** Early explanations may use text, diagrams, and temporary clips.
- **Revisit trigger:** A concept cannot be communicated effectively through the initial media.

## D021 — Repository license remains undecided

- **Date:** 2026-09-01
- **Status:** Experiment / open decision
- **Decision:** Do not add a license until the intended openness, commercial path, contribution model, and third-party reuse strategy are decided.
- **Rationale:** A public repository without a license does not grant broad reuse; adding a license has durable consequences.
- **Consequences:** External contributions should wait or use explicit terms.
- **Revisit trigger:** Before accepting contributions or distributing implementation beyond ordinary public viewing.

## D022 — Sophia is the first design partner, not the universal learner

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Optimize the first experience with Sophia, then validate across varied novices.
- **Rationale:** Direct observation is invaluable, but one person cannot represent every learner.
- **Consequences:** Personal preferences are hypotheses; accessibility and broader testing remain required.
- **Revisit trigger:** None.

## D023 — Make the playable mission the core product unit

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Organize the learner experience as `Journey → Phase → Case Arc → Mission → Beat → Interaction`; build and validate complete missions rather than lesson pages.
- **Rationale:** The product must coordinate code, feedback, narrative, evidence, rewards, and stopping behavior as one experience.
- **Alternatives considered:** chapter pages with embedded exercises; a flat exercise feed; an open skill tree from the first session.
- **Consequences:** Mission state and learner actions are explicit. Case arcs combine four to seven missions into an artifact and checkride.
- **Evidence:** `docs/14-experience-first-platform-blueprint.md`.
- **Revisit trigger:** Learner testing shows mission framing adds friction or obscures the concept.

## D024 — Use a browser application as the primary product and defer a native shell

- **Date:** 2026-09-01
- **Status:** Accepted for the initial product; Tauri remains Provisional for later field work
- **Decision:** Deliver the first learning experience through a laptop-first responsive web application. Evaluate an installable PWA after the core loop and a Tauri companion when local files, terminal, Git, and offline professional work become relevant.
- **Rationale:** A browser removes installation friction and supports rapid iteration. A native shell adds value later only when local capabilities are part of the lesson.
- **Alternatives considered:** Tauri from day one; Electron; native mobile; notebook-first delivery.
- **Consequences:** Phones initially support review and trace rather than primary coding. Native integration must clear a capability gate.
- **Evidence:** `docs/15-platform-stack-and-rust-strategy.md`.
- **Revisit trigger:** Browser performance, accessibility, or required local capabilities prevent the validated learner experience.

## D025 — Use a guided editor first and reveal a professional editor later

- **Date:** 2026-09-01
- **Status:** Provisional
- **Decision:** Evaluate CodeMirror 6 behind an editor adapter for the guided beginner workspace. Retain Monaco as a later Pro Workspace candidate when multi-file work and VS Code transfer matter.
- **Rationale:** A lighter, controllable surface can reduce novice interface load while an eventual professional workspace supports authentic transfer.
- **Alternatives considered:** Monaco from the first line; custom textarea editor; one editor for all stages.
- **Consequences:** Mission logic cannot depend directly on one editor implementation. Editor progression becomes an intentional unlock.
- **Evidence:** `docs/15-platform-stack-and-rust-strategy.md`.
- **Revisit trigger:** Comparative usability, accessibility, bundle, or implementation evidence favors a different editor strategy.

## D026 — Use explicit execution modes rather than blanket auto-run

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Support Learn, Live Lab, Checkride, and Project execution policies. Manual Run remains the foundation; debounced live execution is an unlockable laboratory affordance for safe bounded tasks.
- **Rationale:** Immediate response encourages experimentation, but auto-running every edit can weaken prediction, confuse execution semantics, and become unsafe or noisy.
- **Alternatives considered:** auto-run everywhere; manual execution everywhere; output preview disconnected from actual Python.
- **Consequences:** Results carry revision identifiers, stale runs are cancelled or ignored, and live mode is visibly distinct from ordinary execution.
- **Evidence:** `docs/14-experience-first-platform-blueprint.md` and `docs/15-platform-stack-and-rust-strategy.md`.
- **Revisit trigger:** Learner and runtime tests show a simpler execution policy improves understanding and usability.

## D027 — Separate XP, mastery, unlocks, and artifacts

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** XP records meaningful momentum, mastery records capability evidence, unlocks open possibilities, and artifacts preserve work. XP never grants mastery or prerequisite readiness.
- **Rationale:** Combining these systems makes point accumulation look like competence and invites farming.
- **Alternatives considered:** one global level; progress based on lesson completion; rewards directly controlling curriculum readiness.
- **Consequences:** Reward events reference evidence but cannot write mastery directly. Badge details explain the supporting evidence.
- **Evidence:** `docs/16-reward-progression-and-badges.md`.
- **Revisit trigger:** The separation proves too complex for learners; presentation may simplify without merging authority.

## D028 — Let evidence and prerequisites control readiness

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** A transparent deterministic router uses prerequisite state, support level, misconceptions, delay, transfer, recent performance, and learner challenge signals to recommend the next activity.
- **Rationale:** Absolute beginners need a clear path, but the platform must adapt without an opaque model inventing the curriculum.
- **Alternatives considered:** a strictly linear course; XP-based unlocks; an AI-selected route without deterministic bounds; predictive knowledge tracing from the first release.
- **Consequences:** The learner can inspect why an activity is recommended and override the route within prerequisite-safe options.
- **Evidence:** `docs/14-experience-first-platform-blueprint.md` and `docs/06-mastery-and-assessment.md`.
- **Revisit trigger:** A validated adaptive model makes consistently better decisions while preserving inspectability.

## D029 — Add custom Rust only at measured stable boundaries

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Do not add custom Rust to Experience Loop 0. Consider Rust later for a Tauri companion, measured trace or state-diff bottlenecks, a distributable content CLI, or a sandbox-supervision boundary. Existing Rust-based tools may be adopted normally.
- **Rationale:** Rust cannot rescue an unvalidated learner loop and would slow iteration in the most changeable layer.
- **Alternatives considered:** Rust frontend; Tauri-first application; RustPython as primary runtime; early Rust microservices.
- **Consequences:** Every custom Rust proposal requires measurements, a stable contract, learner benefit, maintenance analysis, and a rollback path. RustPython is not the initial runtime.
- **Evidence:** `docs/15-platform-stack-and-rust-strategy.md`.
- **Revisit trigger:** A profiled bottleneck or required native capability clears the documented Rust entry gate.

## D030 — Keep the first playable slice local-first and backend-free

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Experience Loop 0 uses local content, browser execution where required, and IndexedDB or equivalent local persistence behind an adapter. It has no production account or backend dependency.
- **Rationale:** The first product risk is learner experience, not cross-device identity or service scaling.
- **Alternatives considered:** FastAPI and PostgreSQL before prototyping; third-party authentication; cloud event storage from the first mission.
- **Consequences:** The prototype needs local export, reset, content versioning, and clear migration boundaries. A protected backend begins only after the learning loop earns expansion.
- **Evidence:** `docs/15-platform-stack-and-rust-strategy.md`.
- **Revisit trigger:** A learner-tested feature genuinely requires cross-device, collaboration, protected AI, or mentor-sharing infrastructure.

## D031 — Build end-to-end vertical increments before scaling curriculum

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision:** Deliver one playable beat, one complete First Contact mission, a second mission proving reuse, and one five-mission case before broad curriculum production.
- **Rationale:** Experience, execution, feedback, mastery, reward, and accessibility must be proven together. Horizontal platform construction can hide a broken learner workflow.
- **Alternatives considered:** build the general engine first; author the entire curriculum before implementation; parallel feature teams from the start.
- **Consequences:** Every learner-facing increment includes a preview, deterministic behavior, evidence, reward handling, accessibility, and an observation plan. Generalize only after two real uses.
- **Evidence:** `docs/17-vertical-slice-build-plan.md`.
- **Revisit trigger:** A boundary is proven stable enough that horizontal investment clearly accelerates multiple validated missions.

## New decision template

```markdown
## DXXX — Decision title

- **Date:** YYYY-MM-DD
- **Status:** Accepted / Provisional / Experiment / Rejected / Superseded
- **Decision:**
- **Rationale:**
- **Alternatives considered:**
- **Consequences:**
- **Evidence:**
- **Revisit trigger:**
- **Supersedes / superseded by:**
```
