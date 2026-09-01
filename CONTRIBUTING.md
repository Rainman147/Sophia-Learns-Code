# Contributing to Sophia Learns Code

Thank you for helping shape a learning system whose destination is learner independence.

This repository is currently in product-design and validation mode. Contributions should make the learner journey clearer, safer, more effective, more enjoyable, or easier to test.

## Important license note

This public repository does not yet contain an open-source license. Public visibility alone does not grant broad permission to copy, redistribute, or create derivative works.

Before submitting an external contribution, open an issue to discuss contribution terms and the intended repository license. The project should resolve its commercial, open-source, and third-party dependency posture before accepting substantial outside code or content.

## Before proposing a change

Read the relevant authorities:

- `README.md`
- `docs/00-product-charter.md`
- `docs/01-learner-journey.md`
- `docs/03-interactivity-and-fun.md`
- `docs/05-lesson-design-system.md`
- `docs/06-mastery-and-assessment.md`
- `docs/12-risks-and-guardrails.md`
- `docs/13-decisions.md`

For a major direction change, open an issue before implementation. State what learner behavior should improve and how the improvement will be observed.

## Contribution types

Useful contributions include:

- learner-journey research;
- storyboards and prototypes;
- lesson specifications;
- tests and misconception cases;
- accessibility improvements;
- execution and visualization spikes;
- learning-science research updates;
- tutor evaluation scenarios;
- privacy, safety, or threat-model improvements;
- synthetic datasets; and
- corrections to product assumptions.

## Non-negotiable privacy rule

Never commit:

- real learner records;
- grades or school assignments;
- tutor conversations;
- screen or audio recordings;
- email addresses or student identifiers;
- credentials, tokens, or secrets;
- private financial records;
- private health information; or
- raw analytics tied to an identifiable person.

Use synthetic content and anonymized aggregate findings only.

## Proposing a feature

A feature proposal should answer:

1. Which learner is this for?
2. What problem occurs in the current journey?
3. What observable learner behavior should change?
4. What motivational mechanism is involved?
5. What learning mechanism is involved?
6. What is the smallest testable version?
7. How will immediate, delayed, and transfer effects be checked?
8. How could the feature distort behavior or reduce agency?
9. What accessibility, privacy, safety, and integrity concerns apply?
10. Under what evidence should the feature be removed?

Features justified only by “engagement” need a more precise hypothesis.

## Proposing a lesson

A lesson proposal must include:

- an observable objective;
- prerequisite skills;
- one primary mental model;
- likely misconceptions and observable signatures;
- active interaction sequence;
- worked and faded support;
- independent evidence;
- delayed review item;
- transfer task;
- deterministic tests;
- authored hint ladder;
- accessibility requirements;
- data provenance and safety classification; and
- a natural stopping point.

Use `content/schema/lesson.schema.yaml` and study `content/examples/phase-0/001-first-contact.yaml`.

## Content-writing style

- Assume zero knowledge until a prerequisite proves otherwise.
- Use short, concrete explanations near the code they describe.
- Define new terms before requiring them.
- Prefer visible cause and effect over decorative metaphor.
- Keep narrative useful and compact.
- Use an adult, respectful tone.
- Treat errors as evidence, never punishment.
- Distinguish anomalies from conclusions.
- Avoid identity praise such as “you are a natural.”
- Use specific feedback about strategy and observation.
- Never introduce unexplained syntax just to make an example look realistic.

## Research contributions

For a research claim, add or update an entry in `docs/11-research-and-benchmarks.md` with:

- source;
- exact claim;
- evidence relevance and limitations;
- proposed product translation;
- expected mechanism;
- measurement plan; and
- current decision status.

Do not use “proven by science” as a substitute for describing the evidence.

## Product decisions

A change that alters product direction, learner-data policy, architecture boundaries, assessment meaning, AI authority, safety policy, or roadmap gates requires an entry in `docs/13-decisions.md`.

Use the decision template already present there.

## Technical changes

Technical contributions should include:

- tests for the changed contract;
- failure and cancellation behavior;
- accessibility implications;
- privacy and security review;
- performance evidence where relevant;
- versioned schemas or migrations where applicable; and
- documentation updates.

Learner code must never execute in the application server process or UI thread.

## AI-related changes

AI tutor changes require:

- structured input and output;
- deterministic grounding;
- authored reveal-policy compliance;
- privacy redaction;
- academic-integrity review;
- cyber-safety review;
- at least one adversarial evaluation scenario; and
- a deterministic fallback path.

A pleasant demonstration is not sufficient evaluation.

## Accessibility

Every core interaction must support an equivalent path for the capability being measured. Review keyboard operation, focus order, screen-reader semantics, reduced motion, non-color-only meaning, captions, transcripts, error announcements, and untimed alternatives where speed is not the construct.

## Pull requests

Keep pull requests small enough to review as one coherent learner or system change.

A pull request should include:

- problem and learner outcome;
- scope and non-goals;
- evidence or hypothesis;
- changed product behavior;
- verification;
- accessibility review;
- privacy and safety review;
- screenshots or recordings using synthetic data when visual; and
- follow-up experiments or unresolved questions.

## Commit style

Use concise, action-oriented messages such as:

```text
docs: define the first-session learner journey
content: add First Contact prediction interaction
runtime: cancel runaway browser execution
evals: add tutor conflict-with-trace scenario
fix: preserve learner code when simplifying a stuck task
```

## Definition of done

For a learning feature, engineering completion is necessary but insufficient. Done also requires:

- intended learner behavior stated;
- product and lesson tests passing;
- accessibility and safety review;
- observed learner use;
- delayed evidence where the claim requires retention; and
- a recorded decision to keep, revise, remove, or retest.

Build the learner loop before polishing the ornaments.
