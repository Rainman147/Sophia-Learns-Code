# Experience-First Platform Blueprint

**Status:** proposed product authority for the first playable build  
**Date:** 2026-09-01  
**Scope:** learner workflow, interaction model, live-code behavior, adaptive guidance, lesson organization, and vertical iteration

## 1. Executive decision

Sophia Learns Code should be built as a **browser-first learning game whose core unit is a playable mission, not a lesson page**.

The experience must make this loop irresistible for the right reason:

```text
I wonder what will happen
        ↓
I make a prediction or change
        ↓
The program responds immediately
        ↓
I notice a mismatch or pattern
        ↓
I investigate and repair it
        ↓
I can now do something I could not do before
        ↓
A more interesting possibility opens
```

The product should feel compelling because programming itself becomes responsive, understandable, and consequential. Rewards decorate and clarify that growth. They must not replace it.

## 2. Fresh high-level diagnosis

The existing foundation is strong on:

- absolute-zero support;
- evidence-based learning;
- execution visualization;
- transparent mastery;
- humane gamification;
- deterministic grading;
- constrained AI tutoring; and
- vertical-slice delivery.

The missing authority was a single, concrete answer to four questions:

1. What does the learner repeatedly do minute by minute?
2. When does code run live, and when must Run remain intentional?
3. How do missions, rewards, unlocks, and mastery fit together?
4. What exactly should Codex build and validate before curriculum expansion?

This document supplies that answer.

## 3. The five nested product loops

The platform should operate through five loops at different timescales.

### Loop A: the response loop, 2 to 15 seconds

```text
Edit or manipulate
      → visible response
      → inspect consequence
      → edit again
```

This is the tactile pleasure of programming. It should feel crisp enough that experimentation remains effortless.

Examples:

- change text and see the console update;
- change a number and see a visual card recalculate;
- move a code block and see the execution path change;
- repair punctuation and see the error disappear;
- change a condition and see a different branch illuminate.

### Loop B: the insight loop, 30 seconds to 3 minutes

```text
Question
   → prediction
   → execution
   → discrepancy
   → explanation
   → fresh application
```

This is the main learning engine. It turns immediate feedback into a mental model instead of random tinkering.

### Loop C: the mission loop, 12 to 25 minutes

```text
Re-entry
   → cold open
   → guided discovery
   → challenge
   → twist or bug
   → independent check
   → debrief
   → reward and route choice
```

A mission should produce one meaningful capability and one visible artifact.

### Loop D: the case loop, 4 to 7 missions

Each case arc combines several missions into a coherent outcome.

```text
Mission 1 adds a capability
Mission 2 adds a capability
Mission 3 reuses both in a new form
Mission 4 introduces a realistic complication
Final checkride combines the case
```

The case ends with a program, analysis, report, or tool worth keeping.

### Loop E: the journey loop, weeks to months

The capability map, evolving badges, project cabinet, review queue, and professional-tool unlocks show long-term growth.

The journey loop must answer:

- What can I now do independently?
- What is getting rusty?
- What am I ready to learn next?
- What have I built?
- Which professional tool is opening next?

## 4. One product, four execution modes

Live code is powerful, but auto-running everything would weaken prediction, make side effects confusing, and teach an inaccurate model of ordinary Python work.

The workspace therefore has four explicit modes.

### 4.1 Learn mode

Use for first exposure and mental-model work.

- Run remains an intentional action.
- Selected steps ask for a prediction before execution.
- The learner can step through relevant state changes.
- Feedback emphasizes expected versus observed behavior.
- Auto-advance never follows a successful run.

### 4.2 Live Lab mode

Use for safe experimentation after the basic execution model is established.

- Small, bounded snippets rerun after a short debounce.
- Output, selected state, and visual previews update live.
- Stale executions are cancelled or ignored by revision ID.
- A visible status distinguishes editing, running, success, and error.
- The learner may switch back to manual Run.

Live Lab should feel like touching a circuit and watching the lights reroute.

### 4.3 Checkride mode

Use for clean mastery evidence.

- Manual Run and Test controls remain available.
- Live coaching and solution hints are withheld until submission.
- Scratch experimentation is allowed unless mental tracing is the target.
- Results are reported by capability, not dramatic identity-level pass or fail.

### 4.4 Project Studio mode

Use for multi-file work and realistic cases.

- Manual Run and Test behavior resembles professional development.
- Files, tests, logs, and reports become visible.
- Background linting may run continuously.
- Expensive or side-effectful execution remains explicit.
- The workspace gradually approaches a real IDE.

## 5. The focus-first workspace

The product should not display every powerful panel at once. A beginner confronted by six panes has entered an airplane cockpit before learning which direction the runway points.

### Persistent regions

```text
┌──────────────────────────────────────────────────────────────┐
│ Mission objective · current beat · clean stop               │
├──────────────────────────────┬───────────────────────────────┤
│                              │                               │
│ Code canvas                  │ Result canvas                 │
│                              │ console / visual output       │
│                              │                               │
├──────────────────────────────┴───────────────────────────────┤
│ Coach dock · Run · Test · Hint · Explain · Reset            │
└──────────────────────────────────────────────────────────────┘
```

### Contextual regions

Reveal only when useful:

- Computer's Mind execution state;
- prediction card;
- test details;
- hint ladder;
- case evidence;
- mastery evidence;
- lesson notes; and
- comparison view.

### Focus rule

At any moment the interface should make one learner action visually dominant.

Examples:

- `Change the message` highlights the editable value, not five controls.
- `Predict the next line` dims Run until a prediction or “not sure” is submitted.
- `Find the bug` shows code and failing observation before any fix box.
- `Explain the change` collapses unrelated panels.

## 6. The repeatable mission anatomy

Every mission should be authored as a sequence of beats rather than a scroll of content.

### Beat 0: re-entry retrieval

Wake up one or two prior ideas without reopening the lesson.

### Beat 1: cold open

Present a concrete, answerable situation in under one minute.

> A badge reader rejected three scans after midnight. Bring its console online and identify the event it reports.

### Beat 2: tinker first

Allow one safe change before introducing terminology. The learner should feel causal power quickly.

### Beat 3: reveal the mental model

Use the smallest visual or explanation needed to name what just happened.

### Beat 4: guided challenge

Predict, arrange, complete, or modify one meaningful part.

### Beat 5: complication

Introduce a plausible bug, edge case, or changed requirement.

### Beat 6: independent check

Require a fresh act with reduced support. This produces evidence, not merely completion.

### Beat 7: debrief and reward

Ask one specific explanation, show what capability changed, award any earned reward, and offer one or two meaningful next routes.

## 7. Feedback should arrive as a stack

The application should never jump directly from code to a generic AI paragraph.

```text
Editor affordance
      ↓
Parser and runtime result
      ↓
Deterministic tests
      ↓
Execution trace predicates
      ↓
Authored misconception rules
      ↓
AI coach phrasing and dialogue
      ↓
Mastery evidence update
```

### Feedback packet

Every meaningful run can produce:

```text
What happened
What was expected
Where the mismatch appeared
Which concept is relevant
The smallest useful next action
What evidence this attempt created
```

Example:

```text
Target: keep one count across all three login records.
Observed: the count returns to zero at the start of every loop.
Inspect: the line that creates `count`.
Next move: predict the count after the second record before editing.
```

### Feedback timing

- syntax feedback can appear quickly but should not write the solution;
- runtime output appears immediately after execution;
- test feedback groups failures by behavior, not raw noise;
- tutor intervention waits long enough for productive struggle;
- celebration never blocks the next action.

## 8. The live learner snapshot

The platform maintains an inspectable, continuously updated snapshot. It is not a secret score.

### Per-skill state

```text
skill identifier
mastery state
latest independent evidence
latest delayed evidence
latest transfer evidence
prediction accuracy
trace accuracy
hint depth
recurring misconceptions
last practiced
next useful review
readiness dependencies
```

### Current-session state

```text
current mission and beat
recent success and failure pattern
self-reported challenge level
possible boredom, productive struggle, random-walk stuckness, or overload
current support ceiling
unfinished artifact
natural stopping opportunities
```

### Readiness routing

The next activity is selected from transparent rules.

- Strong independent evidence plus stable prerequisites opens the next concept.
- Correct work with heavy support produces a parallel mission before advancement.
- Repeated misconception triggers a short alternate representation.
- Random edits trigger an expectation question or trace task.
- Repeated easy success fades support or opens a transfer mission.
- Return after absence begins with two to five compact retrieval tasks.
- Learner choice can override recommendations within prerequisite-safe routes.

The learner can always inspect why an activity was recommended.

## 9. Organize the curriculum as a golden path with meaningful branches

Absolute beginners need direction. A giant open skill tree on day one creates decision work before programming work.

### Golden path

The core prerequisite spine remains clear and recommended.

```text
First execution
  → values
  → names and assignment
  → expressions
  → decisions
  → repetition
  → collections
  → functions
  → files and structured data
  → testing and debugging
  → projects and professional tools
```

### Branches

Branches change context, challenge, or artifact without breaking prerequisite logic.

- cyber mission variant;
- financial-forensics variant;
- general everyday automation variant;
- deeper “under the hood” explanation;
- debugging side quest;
- harder edge-case challenge;
- creative free-build lab; and
- review mission.

### Case arcs

A recommended unit is one case containing four learning missions and one checkride.

```text
Case 001: The Midnight Badge

1. First Contact       print and console
2. Identity Tag        values and variables
3. Access Rule         comparison and if/else
4. Repeated Attempts   a small loop
5. Checkride           combine the case independently
```

The same structural case can have cyber, financial, or general surface variants.

## 10. Experience hierarchy

```text
Journey
└── Phase
    └── Case arc
        └── Mission
            └── Beat
                └── Interaction
```

### Interaction

One meaningful action or observation, usually seconds to two minutes.

### Beat

A small coherent moment such as prediction, trace, repair, or explanation.

### Mission

One primary capability plus an artifact, normally 12 to 25 minutes.

### Case arc

Several capabilities combined into an authentic purpose, normally 4 to 7 missions.

### Phase

A durable capability band with an exit checkride and project.

### Journey

The full path from first execution to independent engineering.

## 11. Fun and motivation requirements

Every mission must include:

```text
one visible consequence
one answerable uncertainty
one meaningful learner choice
one safe surprise or complication
one independent act
one artifact or conclusion
one clean stopping point
```

The experience should use:

- satisfying state transitions;
- compact narrative stakes;
- optional motion and sound;
- expressive code changes;
- surprise through edge cases and alternate solutions;
- evolving capability badges;
- tool and mission unlocks;
- a visible project cabinet; and
- mentor-visible achievements only with learner permission.

The detailed reward economy is defined in `docs/16-reward-progression-and-badges.md`.

## 12. What “adaptive” means in version 1

Adaptive does not initially mean a black-box model inventing the curriculum.

Version 1 adaptation is a deterministic router over authored content and evidence:

```text
attempt result
+ support level
+ misconception code
+ time since practice
+ transfer distance
+ learner challenge signal
+ prerequisite state
= next recommended interaction
```

The AI may phrase feedback, ask follow-up questions, and choose among allowed authored strategies. It does not create prerequisite logic or award mastery on its own.

## 13. Product metrics by loop

### Response loop

- time from edit to visible response;
- stale-run cancellation correctness;
- voluntary experimentation;
- interface responsiveness.

### Insight loop

- prediction quality;
- discrepancy inspection;
- error-repair success;
- explanation quality;
- hint depth.

### Mission loop

- independent final act;
- perceived challenge;
- natural-stop continuation choice;
- frustration and delight moments;
- artifact completion.

### Case loop

- synthesis performance;
- misconception recurrence;
- transfer between mission contexts;
- checkride result.

### Journey loop

- delayed retrieval;
- readiness accuracy;
- return without streak pressure;
- project quality;
- transition to local tools;
- independent work outside the platform.

## 14. Vertical iteration rule

Codex should not first build a generalized course engine and then pour lessons into it.

The build sequence is:

```text
one playable beat
  → one complete mission
  → one second mission proving reuse
  → one five-mission case
  → only then broader curriculum tooling
```

Every increment must include the visible experience, execution behavior, feedback, evidence update, reward response, accessibility path, and a learner-observation plan.

`docs/17-vertical-slice-build-plan.md` defines the implementation order.

## 15. Stop signals

Pause and revise when:

- auto-run makes execution feel magical rather than understandable;
- rewards attract more attention than the capability earned;
- the learner guesses predictions only to unblock Run;
- the visualizer is watched but not used to explain behavior;
- the tutor produces answer dependence;
- the workspace exposes more panels than the current concept needs;
- narrative reading exceeds code interaction;
- a skill state cannot explain itself from evidence;
- a learner is advanced because of XP rather than capability; or
- the team starts optimizing infrastructure before observing the first mission.

## 16. Experience acceptance bar

The first experience architecture is validated only when a true beginner can:

- orient without verbal rescue;
- cause a live, visible code consequence;
- understand the difference between editing and execution;
- make at least one thoughtful prediction;
- use the execution view to explain a state change;
- recover from an error using product feedback;
- complete a fresh task with reduced support;
- understand why a badge or unlock was earned;
- see what the platform believes she knows and correct it if needed;
- stop cleanly or voluntarily choose another mission; and
- retrieve the core idea later.

The product is not trying to make homework prettier. It is trying to make learning Python feel like gaining control over a responsive world.
