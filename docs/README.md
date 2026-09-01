# Sophia Learns Code Documentation Map

This directory contains the durable product, learning, game, experience, architecture, research, safety, and delivery authorities for Sophia Learns Code.

## Canonical authority order

Read in this order when starting fresh or when documents appear to conflict:

1. [`../VISION.md`](../VISION.md): the shortest complete and current product definition
2. [`22-rebaseline-decisions.md`](22-rebaseline-decisions.md): decisions added by the Python Investigator rebaseline
3. [`13-decisions.md`](13-decisions.md): prior accepted, provisional, experimental, rejected, and superseded decisions
4. the specialized authority for the question being worked

The rebaseline does not discard the original work. It gives it one coherent center.

## Current product in one line

Sophia Learns Code is a beautiful, adaptive mystery-investigation game in which a learner uses real Python to examine evidence, test theories, repair tools, and solve cyber and financial-forensics cases while progressing from absolute zero to independent engineering.

## Start here for the current rebaseline

1. [`../VISION.md`](../VISION.md)
2. [`21-project-rebaseline-assessment.md`](21-project-rebaseline-assessment.md)
3. [`18-game-and-narrative-design-system.md`](18-game-and-narrative-design-system.md)
4. [`19-experience-identity-and-media-system.md`](19-experience-identity-and-media-system.md)
5. [`20-prebuild-architecture-and-research-gates.md`](20-prebuild-architecture-and-research-gates.md)
6. [`22-rebaseline-decisions.md`](22-rebaseline-decisions.md)
7. [`handoffs/CODEX-PREBUILD-EXPERIENCE-REBASELINE.md`](handoffs/CODEX-PREBUILD-EXPERIENCE-REBASELINE.md)

## Canonical rebaseline authorities

- [`18-game-and-narrative-design-system.md`](18-game-and-narrative-design-system.md): Python as gameplay, Operations Center, cases, missions, case state, tools, narrative, and evidence ethics
- [`19-experience-identity-and-media-system.md`](19-experience-identity-and-media-system.md): one visual and emotional identity across UI, motion, graphics, sound, rewards, and tutorial media
- [`20-prebuild-architecture-and-research-gates.md`](20-prebuild-architecture-and-research-gates.md): reversible and irreversible choices, candidate stack, stable seams, targeted research, and gates R0 through R6
- [`21-project-rebaseline-assessment.md`](21-project-rebaseline-assessment.md): whole-project audit, tensions, readiness, and recommended sequence
- [`22-rebaseline-decisions.md`](22-rebaseline-decisions.md): decisions D032 through D046 extending the prior log

## Durable product and learner foundations

- [`00-product-charter.md`](00-product-charter.md): purpose, audience, outcomes, principles, and north-star metric
- [`01-learner-journey.md`](01-learner-journey.md): experience from the learner's side of the glass
- [`03-interactivity-and-fun.md`](03-interactivity-and-fun.md): interaction grammar and humane gamification principles
- [`14-experience-first-platform-blueprint.md`](14-experience-first-platform-blueprint.md): playable loops, live-code behavior, adaptation, and experience-first delivery
- [`16-reward-progression-and-badges.md`](16-reward-progression-and-badges.md): XP, mastery, unlocks, artifacts, badges, and momentum

When these files use Flight Deck or checkride terminology, apply the current vocabulary in `VISION.md` until the migration pass updates them.

## Learning and curriculum foundations

- [`02-learning-science.md`](02-learning-science.md): evidence-informed learning mechanisms and product translations
- [`04-curriculum-map.md`](04-curriculum-map.md): complete zero-to-advanced Python journey
- [`05-lesson-design-system.md`](05-lesson-design-system.md): repeatable instructional interaction design
- [`06-mastery-and-assessment.md`](06-mastery-and-assessment.md): evidence states, delayed review, transfer, and deterministic assessment
- [`07-ai-tutor-spec.md`](07-ai-tutor-spec.md): constrained AI coaching contract

The existing lesson schema and First Contact specimen are valuable prototypes. Do not expand them by adding game fields until the Case, Mission, Encounter, CaseEvent, and SceneEffect model clears the pre-build gate.

## Engineering and delivery foundations

- [`08-technical-architecture.md`](08-technical-architecture.md): staged system architecture and security boundaries
- [`09-mvp-roadmap.md`](09-mvp-roadmap.md): milestone strategy
- [`15-platform-stack-and-rust-strategy.md`](15-platform-stack-and-rust-strategy.md): browser, editor, Python runtime, backend staging, and measured Rust direction
- [`17-vertical-slice-build-plan.md`](17-vertical-slice-build-plan.md): original Experience Loop 0 increments E0 through E6
- [`handoffs/CODEX-EXPERIENCE-LOOP-0.md`](handoffs/CODEX-EXPERIENCE-LOOP-0.md): original First Contact implementation brief

The pre-build rebaseline now sits upstream of production Experience Loop 0. Use the new handoff before beginning implementation issue #12.

## Validation, governance, and safety

- [`10-sophia-pilot-plan.md`](10-sophia-pilot-plan.md): learner observation and delayed follow-up
- [`11-research-and-benchmarks.md`](11-research-and-benchmarks.md): evidence and external pattern ledger
- [`12-risks-and-guardrails.md`](12-risks-and-guardrails.md): privacy, safety, integrity, and product-risk controls
- [`13-decisions.md`](13-decisions.md): original decision log
- [`22-rebaseline-decisions.md`](22-rebaseline-decisions.md): current decision addendum

## Current delivery sequence

```text
R0 canonical rebaseline
  → R1 visual and verbal identity
  → R2 mission-only versus Operations Center
  → R3 motion and graphics pipeline
  → R4 tutorial-media pipeline
  → R5 mission-shell technology spike
  → R6 architecture checkpoint
  → production First Contact
  → Identity Tag proves reuse
  → The Midnight Badge proves the first case
  → immediate, delayed, and transfer validation
  → curriculum expansion decision
```

## Current tracker structure

- The pre-build Wayfinder map coordinates unresolved design and architecture decisions.
- GitHub issue #11 remains the downstream Experience Loop 0 implementation epic.
- Issues #12 through #19 should not be treated as permission to freeze unvalidated product or stack choices.

## Public repository boundary

Never commit real learner data, school assignments, grades, tutor conversations, recordings, credentials, private financial records, or identifiable analytics. Store only product documents, code, synthetic content, evaluation fixtures, and public-safe anonymized findings.
