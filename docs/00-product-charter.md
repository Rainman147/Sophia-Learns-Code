# Product Charter

**Project:** Sophia Learns Code  
**Working experience concept:** Python Investigator: Flight Deck  
**Stage:** pre-build discovery, design, and validation  
**Last foundational review:** 2026-09-01

## 1. Purpose

Sophia Learns Code exists to help a true beginner grow from her first line of Python into an independent programmer who can use code confidently in cybersecurity, financial forensics, data analysis, automation, and software development.

It is not merely a sequence of explanations. It is a learning system that repeatedly converts unfamiliar ideas into visible models, guided action, independent performance, durable memory, and transfer to authentic problems.

The platform succeeds when the learner no longer needs it for ordinary work.

## 2. The problem

Most beginner coding experiences have one or more structural weaknesses:

- they assume invisible prerequisite knowledge about editors, files, terminals, punctuation, or error messages;
- they confuse watching with learning;
- they introduce syntax without a mental model of execution;
- they provide exercises that are too easy to recognize but too hard to generate independently;
- they reward completion, streaks, or points without proving durable skill;
- they reveal solutions too quickly and train dependence;
- they treat errors as failure instead of evidence;
- they jump from toy examples to intimidating projects without a bridge;
- they stop before testing, Git, debugging, architecture, and professional tools; or
- they use an AI assistant that completes work rather than building the learner’s judgment.

The result is often an “illusion of competence”: a learner can follow along but cannot start, diagnose, or adapt a program alone.

## 3. Initial learner

The initial learner is an adult college student who:

- is beginning Python with little or no prior coding experience;
- is taking a formal Python class while using this platform as acceleration and reinforcement;
- is pursuing cybersecurity with a complementary interest in financial-forensics work;
- may arrive tired, busy, or uncertain after normal college responsibilities;
- needs an adult, respectful tone rather than a children’s coding game;
- benefits from clear explanations, visual execution, immediate feedback, and authentic purpose; and
- should retain ownership of her progress and privacy.

This profile guides the first release, but the system must not hard-code assumptions that only one learner can use it.

## 4. Jobs to be done

### Functional jobs

- Learn Python from absolute zero without hidden prerequisites.
- Understand how code executes rather than memorize isolated syntax.
- Keep pace with and move ahead of a college course.
- Build debugging and problem-solving habits early.
- Apply Python to realistic cyber and financial evidence.
- Develop a portfolio of tested, explainable projects.
- Transition into professional tools and workflows.

### Emotional jobs

- Feel safe experimenting and breaking things.
- Replace “I am bad at this” with “I can inspect what happened.”
- Experience frequent, honest wins that come from understanding.
- Know what to do next when stuck.
- See progress without feeling manipulated by streaks or comparison.

### Identity jobs

- Begin thinking like a programmer and investigator.
- Become someone who can reason from evidence.
- Develop confidence grounded in capability, not praise.
- Be able to explain technical ideas clearly to another person.

## 5. Product outcomes by horizon

### First five minutes

The learner has run a valid Python program, changed it, predicted an output, and recovered from one intentionally created error. She understands the editor, Run control, output area, and the basic meaning of `print("...")`.

### First session

The learner leaves with a small finished mission, a visible map of what she unlocked, and a reason to return. She has typed meaningful code rather than only copied it.

### First week

The learner can use values, variables, expressions, strings, simple input, and conditionals in small programs. She can read a basic traceback with support and explain the difference between code and output.

### First month

The learner can decompose small problems, use loops, collections, and functions, write simple tests, and complete a small evidence-analysis project with fading support.

### Intermediate horizon

The learner can work with files, CSV, JSON, dates, regular expressions, APIs, SQL, modules, Git, testing, logging, and typed multi-file programs.

### Advanced horizon

The learner can reason about design, algorithms, complexity, classes, composition, iterators, generators, decorators, context managers, asynchronous work, concurrency, packaging, security, and architecture. She can complete open-ended capstones and defend her decisions.

## 6. Non-negotiable product principles

### Assume zero

Every new interface, symbol, and workflow is introduced before it is required. “Basic” is not a synonym for “obvious.”

### Concrete before abstract

Begin with a visible situation or problem. Show the data and the machine state. Name the abstraction only after the learner has something to attach it to.

### Action density

The learner should make a meaningful choice, prediction, edit, explanation, or execution at least once every 30 to 90 seconds during an active lesson.

### Prediction before revelation

When practical, ask what will happen before running the code. The gap between expectation and result is fertile learning ground.

### Errors are instruments

Errors are framed as observations. Feedback identifies what Python expected, what it received, and the next useful inspection.

### Support fades

Instruction moves through worked example, completion problem, code ordering, debugging, modification, independent generation, and transfer. Assistance recedes as evidence grows.

### Mastery is evidence

A watched lesson or passed recognition quiz is not mastery. Strong evidence requires independent performance, delayed retrieval, and use in a changed context.

### AI protects agency

The tutor helps the learner reason. It does not silently replace her reasoning. Deterministic tests judge code correctness; AI provides diagnosis, explanation, and coaching.

### Fun serves competence

Game mechanics must cause or illuminate a valuable learning behavior. Cosmetic rewards may decorate progress, but cannot define it.

### The platform teaches its own exit

The learner eventually works in a local editor, terminal, virtual environment, test runner, and Git repository. Platform dependence is a defect.

## 7. Product boundaries

### In scope

- Python from absolute zero through advanced language and engineering concepts.
- Visual, interactive, browser-first lessons.
- Deterministic code execution and testing.
- Execution tracing and mental-model visualization.
- Adaptive scaffolding and spaced review.
- AI tutoring with strict instructional policies.
- Safe, synthetic cyber and financial-forensics cases.
- Portfolio and GitHub export.
- Optional mentor or parent debrief summaries controlled by the learner.

### Not in the first product

- A general learning-management system for every subject.
- A giant video catalog.
- Public competitive leaderboards.
- Native mobile coding as the primary experience.
- Live offensive-security targets or uncontrolled malware.
- Automatic completion of graded college assignments.
- Certification claims before outcomes are validated.
- A complex multi-agent tutor architecture.

## 8. Experience character

The experience should feel:

- intelligent but welcoming;
- cinematic but not theatrical;
- playful but not childish;
- challenging but recoverable;
- technically honest;
- calm during failure;
- visually explanatory; and
- increasingly professional as mastery grows.

A mission-control and investigation metaphor offers useful language without trapping the product in decoration:

```text
Briefing → Simulator → Mission → Debrief → Checkride → Field Work
```

The metaphor may evolve after testing. The learning loop is more durable than the theme.

## 9. North-star metric

**Independent success on a delayed, unfamiliar transfer task.**

This metric asks whether learning survived three changes:

1. support is removed;
2. time has passed; and
3. surface details differ.

It is supported by secondary evidence:

- prediction accuracy;
- trace accuracy;
- independent code generation;
- hint depth;
- time to isolate a defect;
- misconception recurrence;
- explanation quality;
- delayed retrieval success;
- transfer success;
- project correctness and test quality; and
- use of professional tools outside the platform.

## 10. Core product hypotheses

1. A complete beginner can experience a meaningful first win in under five minutes without concealing how the code works.
2. Predict-run-explain interactions will build more accurate execution models than passive examples alone.
3. Visual state tracing will reduce confusion around variables, loops, references, scope, and mutation.
4. A worked-example-to-transfer ladder will reduce blank-editor paralysis.
5. A non-punitive mastery map will motivate return better than streak anxiety for this learner profile.
6. Authentic investigation stories will increase voluntary practice when they remain tightly coupled to the target concept.
7. A constrained tutor will produce more learning than an unrestricted answer generator.
8. Early transition into real files, tests, Git, and local tools will improve professional transfer.

Each is a testable claim, not a permanent belief.

## 11. Definition of product progress

A feature is not “done” because it renders or because its tests pass. For learning features, done requires:

- an explicit learner behavior it is intended to cause;
- a plausible evidence basis or clearly labeled experiment;
- accessibility and privacy review;
- observable success and failure conditions;
- at least one real learner session;
- qualitative notes on confusion, emotion, and delight; and
- a decision to keep, revise, or remove it.

## 12. Governance

- Product-direction decisions are recorded in `docs/13-decisions.md`.
- Research claims are recorded in `docs/11-research-and-benchmarks.md`.
- Lesson content follows `docs/05-lesson-design-system.md` and the versioned schema.
- User data never belongs in this public repository.
- The first learner may inspire the design but must not be treated as a captive tester.
- The learner can pause, skip, request direct explanation, or revoke mentor sharing.

## 13. The durable question

Every design review should end by asking:

> Does this make it more likely that the learner can understand, remember, adapt, and independently use Python, while still wanting to come back tomorrow?
