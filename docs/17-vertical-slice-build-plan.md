# Vertical Slice Build Plan

**Status:** proposed delivery authority  
**Date:** 2026-09-01  
**Current program:** Experience Loop 0  
**Goal:** prove the learner workflow and feedback system before scaling the curriculum

## 1. Delivery principle

Build vertically through the learner experience.

Do not separately spend months building:

- a generic lesson engine;
- a generic mastery service;
- a generic badge system;
- a generalized execution visualizer;
- a production AI tutor;
- a backend platform; or
- dozens of lesson specifications.

Instead, make one tiny path complete:

```text
Learner arrives
  → understands the goal
  → edits real Python
  → sees a live consequence
  → predicts and executes
  → receives useful feedback
  → repairs an error
  → completes an independent task
  → earns transparent evidence and a reward
  → returns to saved progress
```

Then prove the same product machinery can support a second mission without cloning the first. Only then expand into the five-mission case.

## 2. Program outcome

Experience Loop 0 is complete when a true beginner can move through the first case arc and the project can answer, with evidence:

- Is the interface understandable without verbal rescue?
- Does the code response feel immediate?
- Does live execution clarify or confuse the distinction between editing and running?
- Do prediction and tracing improve the learner's explanation?
- Is feedback specific enough to guide repair without supplying the answer?
- Does the learner understand what the platform believes she has mastered?
- Do badges and unlocks feel earned and desirable?
- Does the learner voluntarily continue or return?
- Does learning survive a delay and changed context?
- Can the architecture support the next lesson without premature generalization?

## 3. First case arc

### Case 001: The Midnight Badge

A tiny synthetic access-control story provides one coherent reason to learn the first capabilities.

| Mission | Primary capability | Core Python | Artifact contribution |
|---|---|---|---|
| 001. First Contact | Execute and distinguish code from output | `print()` and strings | Bring the case console online |
| 002. Identity Tag | Associate names with values | assignment, strings, numbers | Store investigator and case data |
| 003. Access Rule | Choose based on evidence | comparisons, Boolean result, `if`/`else` | Classify one badge event |
| 004. Repeated Attempts | Follow changing state through repetition | `for`, `range`, simple count | Inspect several badge attempts |
| 005. Case Checkride | Combine the prior capabilities | all above | Produce a tiny access-review program |

The case has optional general and financial surface variants using the same capability graph.

## 4. Increment sequence

Each increment should be small enough for one coherent pull request or a short series of tightly connected pull requests. Every increment ends with a runnable preview.

## E0: Storyboard and state-machine skeleton

### Learner value

The complete First Contact journey can be clicked from arrival to completion before real Python execution is integrated.

### Build

- focus-first page shell;
- mission header and current objective;
- code and result canvases;
- coach dock;
- explicit mission state machine;
- scripted first-run, prediction, error, repair, checkride, and reward states;
- keyboard path;
- reduced-motion variant;
- clean Stop and Continue outcomes;
- preview deployment.

### Required states

```text
briefing
editing
awaiting_prediction
executing
inspecting
repairing
independent_check
feedback
reward
complete
paused
```

### Tests

- state transition model tests;
- all actions reachable by keyboard;
- browser happy path;
- browser error-recovery path;
- reduced-motion snapshot;
- no dead-end state.

### Learner test

Observe whether the learner:

- finds the dominant action;
- distinguishes code and result regions;
- understands why prediction is being requested;
- knows how to recover from the scripted error; and
- recognizes the natural stopping point.

### Exit gate

Do not integrate the Python runtime until the screen flow has at least one documented novice observation and the most serious navigation confusion is revised.

## E1: Real First Contact workspace

### Learner value

The learner edits and runs real Python with immediate, stable feedback.

### Build

- editor adapter with CodeMirror candidate;
- Pyodide module Web Worker;
- typed execution request and result contracts;
- stdout and normalized exception capture;
- manual Learn mode;
- worker initialization status;
- timeout, cancellation, reset, and replacement;
- revision-safe result handling;
- local code preservation;
- deterministic tests for First Contact.

### Required behaviors

- `print("Hello, Sophia!")` executes correctly;
- learner edits produce new output;
- a missing quote produces a useful normalized syntax event;
- stale output cannot overwrite a newer revision;
- runaway code cannot freeze the UI;
- reset returns to authored code while preserving an optional recovery snapshot.

### Tests

- worker unit and contract tests;
- output and error fixtures;
- timeout and replacement test;
- stale-revision test;
- keyboard and screen-reader execution status;
- end-to-end run, edit, break, repair.

### Exit gate

The warm execution loop feels immediate on representative hardware and failure recovery does not lose learner work.

## E2: Prediction and Computer's Mind

### Learner value

The learner can predict behavior and step through the smallest relevant execution model.

### Build

- exact-output prediction interaction;
- “not sure yet” option;
- confidence signal;
- bounded trace model for `print`, primitive values, and simple assignment;
- source-line synchronization;
- output progression;
- step forward, step backward, and reset;
- semantic text equivalent;
- lesson-selected visible state;
- golden trace fixtures.

### Important constraint

The visualizer must answer a learner question. It must not become a decorative animation.

### Tests

- trace matches actual execution;
- source line and output remain synchronized;
- unsupported state degrades honestly;
- keyboard trace controls;
- reduced-motion presentation;
- screen-reader text describes every meaningful change.

### Learner test

Compare whether the learner can explain code and output after:

- code and console alone; and
- code, prediction, and bounded trace.

### Exit gate

Keep the visualizer only if it helps the learner explain or diagnose behavior rather than merely attracting attention.

## E3: Deterministic feedback and recovery ladder

### Learner value

A mistake becomes a clue and the next useful action remains hers.

### Build

- feedback packet model;
- parser/runtime feedback codes;
- deterministic task tests;
- authored misconception matching;
- expected-versus-observed panel;
- seven-level hint ladder;
- direct-explanation escape hatch;
- solution reveal classification;
- fresh parallel task after full reveal;
- frustration and challenge self-report controls.

### First misconception paths

- code and output treated as the same place;
- quotation marks treated as decoration;
- `print()` treated as fixed text to copy;
- prediction treated as a guessing toll;
- random editing after an error.

### Tests

- each misconception fixture produces the intended feedback code;
- correct alternate code is accepted;
- AI is not required;
- a full reveal cannot produce independent evidence;
- direct explanation produces a fresh parallel task;
- feedback never contradicts runtime or tests.

### Exit gate

The learner repairs the intentional error using product support and can state what Python expected, what occurred, and which edit resolved it.

## E4: Live learner snapshot, mastery, and rewards

### Learner value

The learner sees honest progress, earns satisfying rewards, and understands why the next activity is recommended.

### Build

- local evidence event model;
- transparent mastery-state rules;
- IndexedDB persistence adapter;
- capability-map slice for first capabilities;
- XP event rules;
- evolving Console Navigator, Prediction Pilot, and Recovery Engineer badges;
- Build Cabinet entry for the first artifact;
- one capability-gated Live Lab unlock;
- route choice unlock;
- reward reveal and clean stop;
- local data export and reset.

### Required separation

```text
Mastery and readiness derive from evidence.
Rewards decorate evidence.
XP never grants mastery.
```

### Tests

- evidence-to-mastery transitions;
- reward eligibility and anti-farming;
- solution-level hints reduce evidence classification;
- persistence resume and migration;
- unlock requirements;
- every state and reward explains its source;
- color-independent map and badge state.

### Learner test

Ask the learner:

- What does the app believe you can do?
- Why did you earn this badge?
- What would strengthen it?
- Why did Live Lab unlock?
- Does the reward feel proportional?

### Exit gate

The learner can answer those questions without a product-team explanation.

## E5: Second mission proves reuse

### Mission

**Identity Tag** introduces names referring to values and adds investigator and case information to the artifact.

### Learner value

The product proves that its mission engine, execution, feedback, evidence, and reward systems are reusable rather than handcrafted for one demo.

### Build

- second lesson data file;
- assignment and name/value trace;
- edit-to-output dependency highlighting;
- Live Lab for a safe expression after manual execution is understood;
- prediction of which output changes;
- assignment misconception fixtures;
- delayed review candidate;
- badge evolution;
- artifact version history.

### Refactor rule

Extract a shared package or abstraction only after First Contact and Identity Tag reveal the same real boundary. Do not generalize based on imagined future lessons.

### Tests

- both missions run through shared contracts;
- no copied mission-specific state machine;
- trace supports assignment accurately;
- live mode cancels stale revisions;
- artifact retains both versions;
- mastery remains skill-specific.

### Exit gate

Adding Identity Tag does not require duplicating the application shell or bypassing established contracts.

## E6: First five-mission case

### Learner value

The learner finishes a coherent beginner case, combines capabilities, and earns the first meaningful case completion.

### Build

- Access Rule mission;
- Repeated Attempts mission;
- Case Checkride;
- comparison, branch, and small-loop traces;
- deterministic tests;
- case-level progress;
- delayed retrieval set;
- near and far transfer tasks;
- case badge evolution;
- final artifact card;
- anonymized pilot evidence export.

### Exit gate

The learner:

- completes the case without technical setup;
- understands editing, execution, and output;
- predicts selected behavior;
- explains one branch and loop state;
- repairs at least one defect;
- finishes a bounded independent program;
- retrieves selected capabilities later;
- applies at least one in a changed context; and
- voluntarily reports whether another case feels desirable.

Only after this gate should broad Phase 0 curriculum production begin.

## 5. Pull request definition of done

Every learner-facing increment must include:

### Experience

- the exact learner problem;
- screenshots or preview link;
- dominant action at each state;
- loading, empty, error, recovery, and stop behavior;
- adult and respectful copy.

### Learning

- observable capability target;
- prerequisite;
- misconception path;
- support condition;
- independent evidence;
- delayed or transfer plan where relevant.

### Execution and feedback

- deterministic result authority;
- cancellation and stale-result behavior;
- feedback code and next action;
- no answer-only dead end.

### Mastery and rewards

- evidence event;
- mastery effect or explicit none;
- reward effect or explicit none;
- anti-farming review;
- inspectable reason.

### Accessibility

- keyboard path;
- screen-reader semantics;
- reduced-motion behavior;
- non-color-only meaning;
- focus restoration.

### Product validation

- automated tests;
- learner-observation question;
- success and failure criteria;
- keep, revise, remove, or retest condition.

## 6. Codex operating rules

Codex build lanes should follow these rules:

1. Read the product authorities before changing architecture.
2. Work on one named vertical increment.
3. Begin from the learner outcome, not the component list.
4. Preserve deterministic authority over AI output.
5. Keep Python execution off the UI thread.
6. Preserve learner code through failure and recovery.
7. Do not add a backend, account, native shell, or custom Rust without the relevant gate.
8. Do not build generalized abstractions before two real uses exist.
9. Add tests and observable failure behavior with each contract.
10. Leave the preview in a complete, demoable state.
11. Record decisions and measured findings in durable docs.
12. Never commit real learner information.

## 7. Branch and review strategy

Use short-lived branches named by increment and learner outcome, for example:

```text
experience/e0-first-contact-flow
runtime/e1-real-python-workspace
learning/e2-predict-and-trace
feedback/e3-recovery-ladder
progress/e4-mastery-and-rewards
content/e5-identity-tag
case/e6-midnight-badge
```

Pull requests should remain reviewable as one coherent product change. Large infrastructure work must demonstrate which learner-visible behavior it enables.

## 8. Suggested first app architecture

```text
apps/web/
├── app/
│   ├── page.tsx
│   └── mission/[missionId]/page.tsx
├── features/
│   ├── mission/
│   │   ├── machine.ts
│   │   ├── MissionShell.tsx
│   │   └── mission.types.ts
│   ├── workspace/
│   │   ├── EditorAdapter.ts
│   │   ├── GuidedEditor.tsx
│   │   ├── ResultCanvas.tsx
│   │   └── CoachDock.tsx
│   ├── execution/
│   │   ├── execution.contracts.ts
│   │   ├── execution.client.ts
│   │   └── python.worker.ts
│   ├── trace/
│   ├── feedback/
│   ├── evidence/
│   ├── mastery/
│   └── rewards/
├── content/
├── lib/
└── tests/
```

Keep this shape provisional. The first pull request may use fewer directories. Boundaries become packages only after reuse is demonstrated.

## 9. Product event vocabulary

The first slice should use a small stable event set:

```text
mission_started
beat_entered
code_changed
prediction_submitted
run_requested
run_completed
trace_inspected
feedback_presented
hint_requested
solution_revealed
misconception_observed
independent_task_submitted
evidence_recorded
mastery_changed
reward_earned
unlock_granted
artifact_saved
challenge_reported
session_paused
mission_completed
session_stopped
```

Each event carries lesson version, mission state, support level, and privacy classification where relevant.

## 10. Experiment discipline

Use feature flags for meaningful variants, not endless configuration.

Good early comparisons:

- required versus optional prediction;
- static state checkpoints versus scrubber;
- CodeMirror minimal chrome variants;
- manual-only versus unlockable Live Lab;
- badge fragment immediately versus mission-end reveal;
- capability map versus simple golden path with branches;
- cyber versus neutral opening narrative.

Change one major experience variable at a time when possible.

## 11. What not to build during Experience Loop 0

- production authentication;
- billing;
- public profiles;
- social feed;
- public leaderboard;
- store or virtual currency;
- loot boxes;
- native mobile application;
- Tauri desktop shell;
- custom Rust services or WASM;
- production AI tutor;
- arbitrary remote execution;
- full notebook system;
- hundreds of lessons;
- generalized authoring CMS;
- predictive knowledge model;
- real cyber targets; or
- learner surveillance analytics.

## 12. Experience Loop 0 completion record

When E6 is complete, create a durable checkpoint containing:

- product version and commit;
- learner journey demonstrated;
- immediate learning evidence;
- delayed and transfer evidence;
- experience findings;
- reward and motivation findings;
- accessibility findings;
- runtime and performance measurements;
- architecture boundaries proven or rejected;
- features removed or deferred;
- unresolved risks;
- decision to expand, revise, repeat, simplify, or stop.

## 13. Bottom line

The first thing Codex should build is not “the platform.”

It should build **one beautiful, real, replayable learning loop** where Sophia changes code, sees the world respond, understands why, recovers from a mistake, proves the capability, and unlocks something meaningful.

Once that loop survives contact with a real learner, the rest of the curriculum has a trustworthy track to run on.
