# Sophia Learns Code: Canonical Product Vision

**Status:** canonical product rebaseline  
**Date:** 2026-09-01  
**Authority:** this document is the shortest complete description of the product. When an older document conflicts with it, this vision and `docs/22-rebaseline-decisions.md` govern until the older document is reconciled.

## 1. The product in one sentence

**Sophia Learns Code is a beautiful, adaptive mystery-investigation game in which a learner uses real Python to examine evidence, test theories, repair investigative tools, and solve cyber and financial-forensics cases while progressing from absolute zero to independent software engineering.**

This is not a course with a game bolted onto it. Python is how the game is played.

```text
A mystery presents evidence
          ↓
The learner predicts or forms a theory
          ↓
She writes, changes, or repairs Python
          ↓
Real Python executes
          ↓
The case world changes from the result
          ↓
She inspects what happened
          ↓
The case advances or exposes a new question
          ↓
Capability, progress, and future possibilities become visible
```

## 2. Why it exists

Many beginner coding platforms create recognition without independence. A learner watches, copies, passes a friendly exercise, and then freezes when the editor is blank or the output is unexpected.

Sophia Learns Code is designed to produce a different outcome. The learner should be able to:

- understand what the computer is doing;
- predict behavior before running code;
- convert a vague problem into small, testable steps;
- read errors as evidence rather than judgment;
- debug unfamiliar programs;
- retrieve concepts after time has passed;
- transfer the same pattern into a changed situation;
- build useful tools outside the platform; and
- explain what a result supports and what it does not prove.

The destination is not course completion. The destination is capability without the course.

## 3. The initial learner

The first learner is a college-aged absolute beginner who is studying cybersecurity and financial forensic analysis. She may arrive with no reliable mental model of an editor, console, function call, variable, file, terminal, package, or traceback.

The experience must therefore:

- assume no hidden programming prerequisites;
- feel adult, intelligent, warm, and respectful;
- offer useful sessions from roughly ten minutes to an hour;
- connect Python to authentic interests without overloading the first concepts;
- make progress visible without turning family support into surveillance;
- allow direct explanations when question-led coaching becomes frustrating; and
- gradually move from a guided browser environment into professional tools.

Sophia is the first design partner, not a permanent universal persona. Her observations guide the first product, then the system must be tested with other novices.

## 4. The core experience identity

The canonical working identity is **Python Investigator**.

| Product element | Canonical learner-facing term |
|---|---|
| Persistent hub | Operations Center |
| Multi-mission story | Case |
| One focused learning experience | Mission |
| Small interaction inside a mission | Encounter |
| Safe experimentation space | Lab |
| Code surface | Investigation Console |
| Execution-state explanation | Computer's Mind |
| Reflection after action | Debrief |
| Reduced-support mastery event | Field Test |
| Capability progression | Capability Map |
| Portfolio of completed work | Case Archive |
| Optional reinforcement | Side Mission |

Earlier documents use Flight Deck and checkride language. The control-room precision of that idea may inform the visual direction, but it is no longer the primary vocabulary. One coherent investigation language is easier for the learner, content authors, designers, and Codex to follow.

## 5. The game-learning thesis

The game and the instruction must be intrinsically integrated:

```text
Python capability
      ↓
Investigative power
      ↓
New evidence or tool
      ↓
Harder and more interesting case
```

Examples:

| Python capability | Direct game function |
|---|---|
| `print()` | Bring the investigation console online and communicate a finding |
| Values and variables | Label evidence and preserve case facts |
| Comparisons | Test an investigative rule |
| `if` and `else` | Route an event for approval or review |
| Loops | Scan repeated records |
| Lists | Hold a batch of evidence |
| Dictionaries | Build identity, count, and relationship indexes |
| Functions | Create reusable investigative tools |
| Files, CSV, and JSON | Open and normalize evidence packages |
| Exceptions | Recover safely from malformed evidence |
| Tests | Calibrate tools and protect prior conclusions |
| SQL | Query the case database |
| APIs | Enrich evidence from controlled sources |
| Async Python | Run independent intelligence lookups concurrently |
| Git | Preserve a reviewable history of the investigation |

A learner should never complete unrelated drills merely to earn permission to play. The code action itself changes the case.

## 6. The five nested loops

### Response loop: seconds

```text
Edit or manipulate → run or preview → see consequence → inspect → try again
```

This produces the tactile pleasure of making a machine respond.

### Insight loop: one to three minutes

```text
Question → prediction → execution → discrepancy → explanation → fresh application
```

This turns experimentation into a mental model.

### Mission loop: roughly twelve to twenty-five minutes

```text
Re-entry → case question → compact model → guided action → complication → repair → independent act → debrief → reward or clean stop
```

Each mission produces one primary capability and one visible change to an artifact or case.

### Case loop: four to seven missions

A case reuses capabilities and ends with a working program, analysis, report, test suite, or other artifact worth keeping.

### Journey loop: weeks to months

The Operations Center, Capability Map, evolving tools, badges, review queue, and Case Archive show growth from first execution to professional independence.

## 7. What the learner sees

The interface is focus-first. At any moment, one action is visually dominant.

```text
┌──────────────────────────────────────────────────────────┐
│ CASE · MISSION · CURRENT OBJECTIVE                       │
├─────────────────────────┬────────────────────────────────┤
│ INVESTIGATION CONSOLE   │ LIVE CASE RESULT               │
│                         │                                │
│ real Python code        │ evidence, scene, or output     │
│                         │ produced by that execution     │
├─────────────────────────┴────────────────────────────────┤
│ COACH · PRIMARY ACTION · HINT · RESET · STOP             │
└──────────────────────────────────────────────────────────┘
```

Prediction, trace, tests, feedback, mastery, and rewards appear only when the current encounter needs them. The product can be powerful without displaying every power at once.

## 8. Real code is the case engine

The application must not fake story success independently of Python execution.

```text
Learner source
    ↓
Bounded Python runtime
    ↓
Normalized output, exceptions, tests, and trace
    ↓
Deterministic mission evaluator
    ↓
Semantic case-state change
    ↓
Visual, audio, feedback, evidence, and reward responses
```

The story layer reacts to semantic events such as:

```text
console_activated
late_scan_flagged
invalid_record_detected
counter_repaired
evidence_batch_processed
case_report_completed
```

Animations visualize those events. They never decide whether the code was correct.

## 9. Execution modes

The platform uses explicit execution policies instead of auto-running all code everywhere.

### Learn

The learner presses Run. This teaches the distinction between editing and executing.

### Live Lab

After that distinction is demonstrated, selected safe and bounded encounters may rerun after a short pause. Live Lab exists for exploration, not assessment.

### Field Test

Execution remains deliberate, solution-level help is withheld until submission, and evidence is classified by the actual support used.

### Project Studio

The experience resembles professional development: files, tests, manual commands, diagnostics, and explicit runs.

Every result carries a source revision so an old asynchronous result cannot overwrite newer code.

## 10. Feedback and recovery

Feedback follows a stable structure:

```text
Goal
Observed result
Difference or useful clue
Smallest next action
```

The support ladder is:

1. clarify the goal;
2. ask what the learner expected;
3. identify the smallest mismatch;
4. show a relevant state or visual model;
5. reduce the task to one decision;
6. offer code ordering or partial syntax;
7. explain the solution directly; and
8. require a fresh parallel task before claiming independence.

Errors are calm investigative evidence. They do not trigger alarm sounds, shaking panels, lost points, or identity-level praise and blame.

## 11. Adaptive learner model

The platform maintains an inspectable snapshot for every capability:

```text
Capability state
Recent independent evidence
Support and hint depth
Prediction and trace evidence
Recurring misconceptions
Delayed retrieval evidence
Transfer evidence
Related artifacts
Recommended next action and reason
```

Initial routing is deterministic and transparent:

```text
Independent success → move forward, increase novelty, or offer transfer
Heavy support → short parallel mission
Recurring misconception → alternate representation and targeted repair
Repeated easy success → fade scaffolds and offer harder constraints
Random editing → ask for the expected result and expose state
Return after absence → two to five compact wake-up encounters
Successful transfer → evolve capability and open mixed-domain work
```

An AI tutor may phrase explanations and ask questions later. It does not secretly invent mastery or override runtime evidence.

## 12. Rewards and progression

Four systems remain separate:

- **XP:** a light record of meaningful momentum;
- **mastery:** evidence of capability under known support, delay, and transfer conditions;
- **unlocks:** new tools, routes, cases, or customizations;
- **artifacts:** the work the learner actually built.

```text
Evidence → mastery and readiness
Evidence → rewards and unlocks
XP never → mastery
```

The strongest rewards are new powers and meaningful artifacts:

- Live Lab;
- Computer's Mind time travel;
- a Debugger Lens;
- new cyber, financial, or mixed cases;
- more difficult edge-case missions;
- a multi-file workspace;
- a completed script, report, test suite, chart, or Git repository.

Badges evolve from discovered to practiced, proven, durable, transferred, and integrated. Every badge opens to show its evidence.

No loot boxes, energy systems, lost progress, streak shame, public ranking pressure, fake scarcity, or XP farming belong in the core product.

## 13. The first case

### Case 001: The Midnight Badge

A synthetic badge event occurred at an unusual time. The evidence begins tiny and becomes richer as the learner gains capability.

| Mission | Primary Python capability | Case contribution |
|---|---|---|
| First Contact | `print()`, text, code versus output | Bring the console online |
| Identity Tag | values and assignment | Store investigator and case facts |
| Access Rule | comparison, Boolean result, `if`/`else` | Classify one badge event |
| Repeated Attempts | `for`, `range`, changing state | Examine several attempts |
| Case Field Test | combine prior capabilities | Build a small access-review program |

The case has optional neutral and financial surface variants that preserve the same prerequisite graph.

The goal is not to prove guilt. The learner distinguishes facts, anomalies, hypotheses, and conclusions.

## 14. Visual and emotional character

The product should feel:

- polished and modern;
- precise without being cold;
- cinematic without becoming theatrical;
- playful without becoming childish;
- futuristic without falling into hacker clichés;
- calm and legible during failure;
- responsive enough to invite experimentation;
- coherent across code, story, feedback, rewards, video, sound, and progress; and
- increasingly professional as capability grows.

The identity is carried by a shared system of typography, spacing, surface hierarchy, icons, illustration, motion, sound, terminology, and writing. It is not created by adding a logo to unrelated components.

## 15. Motion, graphics, sound, and tutorial media

Motion has named jobs:

- **causal motion:** show code producing an output or state change;
- **orienting motion:** preserve context as panels and evidence change;
- **feedback motion:** acknowledge an action or focus attention;
- **reward motion:** mark a meaningful achievement briefly;
- **ambient motion:** create atmosphere without competing with learning.

Every important motion has a reduced-motion equivalent. Errors never use violent motion or alarm-like audio.

The initial visual stack should favor accessible HTML, CSS, and SVG. A React motion library can handle interface transitions. Interactive vector tools such as Rive may be evaluated for selected Operations Center assets. Timeline tools such as GSAP, and rendering or game frameworks such as PixiJS or Phaser, enter only if a prototype demonstrates a real need.

Tutorial media is short, learner-controlled, captioned, transcribed, and interrupted by meaningful interaction. Video uses the same visual language and code components as the application. A programmatic video system such as Remotion is a candidate, not a commitment, and its licensing and workflow must be reviewed before scale.

## 16. Architecture principle

Choose stable product contracts before locking replaceable libraries.

Hard-to-reverse contracts include:

- mission, case, and encounter semantics;
- execution request and result shape;
- evidence and mastery meaning;
- case-state events;
- learner privacy boundaries;
- content versioning; and
- accessibility requirements.

More replaceable choices include:

- editor library;
- animation library;
- component primitives;
- storage implementation;
- model provider;
- hosting platform; and
- optional illustration runtime.

The current candidate stack is a browser-delivered React and TypeScript application, an explicit mission state machine, a guided editor behind an adapter, Pyodide in a Web Worker, deterministic grading, local-first evidence storage, and no custom Rust in the initial experience. Every named library remains subject to the gates in `docs/20-prebuild-architecture-and-research-gates.md`.

## 17. Vertical development strategy

The first slices are a design and architecture laboratory, not a license to build the whole platform.

```text
Canonical vision and vocabulary
      ↓
Visual identity explorations
      ↓
Mission-only and Operations Center prototypes
      ↓
Motion and feedback prototype
      ↓
Editor, runtime, and state-machine spikes
      ↓
Architecture checkpoint
      ↓
One production-quality First Contact mission
      ↓
Second mission proves reuse
      ↓
Five-mission case proves the system
      ↓
Only then expand the curriculum
```

A narrow slice may be beautiful and polished. Narrow scope is not permission for sloppy execution.

## 18. Success criteria

The project succeeds when learners:

- understand the next action without verbal rescue;
- experience fast, truthful cause and effect;
- predict and explain selected behavior;
- recover from errors using evidence;
- complete fresh work with reduced assistance;
- understand what the mastery model believes and why;
- find rewards earned and desirable;
- voluntarily continue or return without coercion;
- retrieve important ideas later;
- transfer them into different cyber, financial, and general contexts; and
- increasingly work in real files, terminals, tests, Git, and independent projects.

The north-star outcome remains **independent success on a delayed, unfamiliar transfer task**.

## 19. Guardrails

- Real learner data never enters this public repository.
- Real Python and deterministic tests remain the authority for executable behavior.
- The game never implies that an anomaly proves wrongdoing.
- Cybersecurity content uses synthetic, authorized, and defensive contexts.
- The tutor does not complete likely graded assignments for submission.
- Accessibility is part of the core interaction, not later polish.
- Core progress is not controlled by purchases, randomized rewards, or streak pressure.
- A game mechanic is removed when it increases clicks but reduces reflection, independence, retention, or transfer.
- A technology is not adopted because it is fashionable. It must improve the learner experience or a measured engineering boundary.

## 20. Current decision posture

### Decided

- absolute-zero learner path;
- Python-powered mystery investigation as the core experience;
- browser-first delivery;
- playable cases and missions;
- real execution and deterministic feedback;
- transparent adaptive mastery;
- integrated, non-punitive progression;
- vertical validation before broad curriculum scale;
- professional-tool exit path; and
- no custom Rust in the initial experience.

### Provisional and prototype-dependent

- exact product name and visual mark;
- Operations Center presentation;
- guided editor choice;
- state-machine library;
- Pyodide performance and trace strategy;
- Motion, Rive, GSAP, Remotion, or other media tools;
- whether a rendering or game framework is ever necessary;
- exact badge, XP, and unlock presentation; and
- exact tutorial-video production workflow.

### Explicitly deferred

- production backend and accounts;
- native shell;
- broad AI tutoring;
- full game engine;
- large asset library;
- entire curriculum implementation;
- social competition;
- monetization; and
- custom Rust components without a measured gate.

## 21. The durable review question

Every product, lesson, game, design, and architecture review ends with:

> Does this make it more likely that the learner will understand, remember, adapt, and independently use Python, while genuinely wanting to investigate what happens next?
