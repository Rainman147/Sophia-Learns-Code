# Codex Handoff: Experience Loop 0

**Repository:** `Rainman147/Sophia-Learns-Code`  
**Initial increment:** E0, First Contact flow prototype  
**Status:** ready for an implementation lane

## Objective

Build the smallest complete, beautiful learner experience for Mission 001: First Contact.

This is a product-flow prototype. It should prove that a college-aged absolute beginner can understand the interface, change code-looking content, predict a result, inspect an execution sequence, recover from an intentional syntax mistake, complete a fresh check, receive honest progress evidence, and choose to continue or stop.

E0 uses scripted execution states. Real Pyodide execution begins in E1.

## Read before changing code

1. `README.md`
2. `docs/00-product-charter.md`
3. `docs/01-learner-journey.md`
4. `docs/03-interactivity-and-fun.md`
5. `docs/05-lesson-design-system.md`
6. `docs/06-mastery-and-assessment.md`
7. `docs/12-risks-and-guardrails.md`
8. `docs/13-decisions.md`
9. `docs/14-experience-first-platform-blueprint.md`
10. `docs/15-platform-stack-and-rust-strategy.md`
11. `docs/16-reward-progression-and-badges.md`
12. `docs/17-vertical-slice-build-plan.md`
13. `content/examples/phase-0/001-first-contact.yaml`
14. GitHub issues #1, #2, and the issue assigned to E0

Treat those files as authority. Identify conflicts rather than silently choosing around them.

## Learner journey to implement

The learner should be able to:

1. See a compact mission and find the dominant action.
2. Distinguish the code canvas from the result canvas.
3. Trigger the scripted first run of `print("Hello, Sophia!")`.
4. Personalize the text and observe the changed result.
5. Predict a two-line result or choose `Not sure yet`.
6. Step through a short execution sequence.
7. Encounter an intentionally unmatched quotation mark.
8. Read expected-versus-observed feedback.
9. Repair the line herself.
10. Complete a fresh check with reduced support.
11. See why capability evidence and a small reward were earned.
12. Choose Continue or Stop.
13. Reload and resume the supported prototype state.

## Required mission states

Use an explicit state machine rather than scattered component flags.

```text
booting
briefing
editing
awaiting_prediction
executing
inspecting_result
intentional_break
error_feedback
repairing
independent_check
check_feedback
reward_reveal
complete
paused
recovered
```

Names may change, but the transitions, guards, retries, reset, pause, resume, and terminal states must remain inspectable and tested.

## Interface direction

Use a focus-first workspace:

```text
Mission objective and current beat
────────────────────────────────────────────
Code canvas              Result canvas
────────────────────────────────────────────
Coach dock · primary action · hint · reset
```

Prediction, trace, feedback, mastery, and reward surfaces appear only when the current beat needs them. At every state, one learner action is visually dominant.

The experience should feel polished, calm, intelligent, lightly cinematic, adult, and welcoming. Use concise investigation framing without long fictional lore. Do not use official Embry-Riddle branding.

## Technical direction for E0

Preferred baseline:

- current stable Next.js App Router;
- React and strict TypeScript;
- Tailwind or an equivalent maintainable styling system;
- accessible UI primitives;
- XState 5 or another explicit state-machine implementation;
- CodeMirror only if a genuine editable surface is useful in this scripted prototype;
- local persistence behind an adapter;
- unit, component, and browser tests.

Do not add:

- a backend or account system;
- Pyodide or remote execution;
- Monaco;
- production AI tutoring;
- Tauri, RustPython, or custom Rust;
- a generalized curriculum engine;
- public leaderboards, stores, currencies, or loot systems.

## Product behavior

### First consequence

The first action should produce an immediate visible result. Motion may show code causing output, but it must never delay the learner. Reduced-motion mode uses emphasis and state changes instead.

### Prediction

A prediction is followed by an explanation of the result. `Not sure yet` is valid evidence. Do not reduce the interaction to a gate that encourages random tapping.

### Error recovery

The error view states:

```text
Expected
Observed
Useful place to inspect
Smallest next action
```

The learner performs the repair. Errors use calm language and no alarm-like sound.

### Independent check

Use fresh surface details. Withhold solution-level assistance until submission. Report evidence by capability, not identity-level pass or fail.

### Reward

Show a small evidence-linked reward, why it was earned, what remains unproven, and one or two next choices. XP and badges must not create mastery or prerequisite readiness.

## Accessibility requirements

E0 is incomplete without:

- keyboard-only completion;
- logical focus order and restoration;
- visible focus;
- semantic labels and status announcements;
- reduced-motion behavior;
- no color-only meaning;
- scalable text and sufficient contrast;
- text equivalents for execution motion; and
- browser tests for the supported paths.

Document honest limitations.

## Local persistence and privacy

Persist only what the prototype needs:

- content version;
- current mission state;
- learner-authored sample code or text;
- completed beats;
- selected preferences;
- prototype evidence and reward state.

Provide a `Reset prototype data` control. Do not collect identity, grades, school assignments, recordings, raw keystrokes, or private analytics.

## Required tests

### Unit

- state transitions and invalid-event rejection;
- pause, resume, reset, and recovery;
- prediction handling;
- evidence and reward rules;
- persistence serialization and migration.

### Component

- dominant action and contextual panels;
- error association;
- keyboard behavior;
- reduced-motion rendering;
- semantic status text.

### End to end

- complete happy path;
- intentional-error repair path;
- `Not sure yet` path;
- pause, reload, and resume;
- reset data;
- keyboard-only completion;
- reduced-motion completion;
- no dead-end state.

## Product-validation artifacts

Add:

- a screen-by-screen state table;
- screenshots or a short recording using synthetic content;
- an observer guide;
- hypotheses and acceptance criteria;
- expected confusion points;
- explicit keep, revise, remove, or retest candidates.

Do not claim learner validation before an observed session.

## Repository workflow

1. Confirm the current default branch and authority commit.
2. Create `experience/e0-first-contact-flow` unless the active issue sets another branch.
3. Comment a concise plan on the linked issue.
4. Keep commits coherent.
5. Open a draft pull request with a runnable preview.
6. Include exact test commands and results.
7. Leave merging to explicit repository authority.

## Definition of done

Engineering completion requires:

- documented install, test, and run commands;
- the full scripted mission with happy and recovery paths;
- explicit, tested mission state transitions;
- no learner-facing dead ends;
- working keyboard and reduced-motion paths;
- local resume and reset;
- a deployable preview;
- product-validation artifacts; and
- a clear list of what is not yet proven.

Product validation requires a separate consented novice observation and a recorded keep, revise, remove, or retest decision.

## Final lane report

Return:

1. branch and exact head commit;
2. draft pull request;
3. learner experience implemented;
4. architecture and dependency choices;
5. files changed;
6. tests and results;
7. accessibility verification;
8. preview or local run instructions;
9. open questions and limitations;
10. decisions recorded; and
11. next smallest vertical increment.

The deliverable is not a landing page. It is one complete playable learning loop that can be observed, tested, and revised.
