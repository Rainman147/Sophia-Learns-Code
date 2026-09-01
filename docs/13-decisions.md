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
- **Rationale:** “Beginner” platforms frequently conceal computer-literacy prerequisites.
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
- **Decision:** Evaluate Monaco for laptop/desktop professional fidelity while keeping the editor behind an adapter.
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

## D018 — Teach the platform’s exit

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
