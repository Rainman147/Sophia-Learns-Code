# Mastery and Assessment System

## 1. Position

Completion records activity. Mastery records capability.

Sophia Learns Code uses an evidence ledger rather than pretending that one percentage summarizes everything a programmer can do.

The system asks:

- Can the learner recognize the idea?
- Can she predict its behavior?
- Can she trace state?
- Can she modify a solution?
- Can she diagnose a defect?
- Can she generate a solution?
- Can she explain it?
- Can she use it later?
- Can she transfer it into a different situation?

## 2. Mastery states

| State | Meaning | Typical evidence |
|---|---|---|
| Unseen | No meaningful interaction yet | None |
| Introduced | Has encountered the concept and completed guided actions | Worked example, prediction with support |
| Guided | Can perform with scaffolding | Completion, Parsons, targeted hints |
| Independent | Can perform on a fresh task without solution hints | Write, debug, or explain independently |
| Durable | Can retrieve and perform after a meaningful delay | Delayed no-hint task |
| Transferable | Can select and apply the concept in changed context | Novel domain or representation plus explanation |
| Integrated | Can combine it with other skills in open work | Project or capstone evidence |

The interface may simplify these labels, but the underlying distinctions remain.

## 3. Evidence types

### Recognition evidence

Examples: choose valid syntax, identify a function, select an output from options.

Useful for orientation and diagnosis. Weak by itself.

### Prediction evidence

Examples: exact output, next line, state after iteration, expected error.

Stronger evidence of an execution model.

### Construction evidence

Examples: fill an expression, write a function, design a class, build a pipeline.

Strength depends on scaffold depth and novelty.

### Diagnostic evidence

Examples: locate a defect, identify a broken assumption, produce a minimal failing case.

Essential because real programming includes reading and repair.

### Explanation evidence

Examples: justify initialization, describe mutation, explain a test failure, defend a design.

Best used alongside performance rather than as a substitute.

### Delayed evidence

Any meaningful evidence gathered after time has passed and before support is reopened.

### Transfer evidence

Application where surface details, domain, representation, or tool context change.

### Project evidence

Integrated performance across requirements, implementation, tests, documentation, debugging, and communication.

## 4. Hint handling

Hints are not penalties. They describe the support condition under which evidence was produced.

```text
No hint                 → independent evidence candidate
Goal clarification      → light-guidance evidence
Concept reminder        → guided evidence
Pseudocode or diagram   → guided evidence
Partial syntax          → strongly guided evidence
Full solution           → instructional exposure, not mastery evidence
```

After a full reveal, the learner receives a fresh parallel problem. The original problem is not counted as independent simply because the revealed code was retyped.

## 5. Initial transition rules

Version 1 should use transparent rules rather than an opaque predictive model.

### Introduced

- completed the concept’s worked interaction; and
- made at least one prediction, trace, or explanation attempt.

### Guided

- completed at least two structurally meaningful tasks with scaffolding; and
- corrected a misconception or explained a relevant state change.

### Independent

- completed at least two fresh tasks without solution-level hints;
- at least one task required generation, diagnosis, or trace rather than recognition; and
- passed required deterministic tests.

### Durable

- completed a no-hint retrieval task after a configured delay, initially at least three days for ordinary skills; and
- did not reopen the concept explanation before the attempt.

### Transferable

- selected and applied the concept in a changed context;
- passed tests or a defined rubric; and
- supplied a specific explanation of why the concept fit.

### Integrated

- used the capability appropriately inside a project containing several competing skills;
- maintained correctness under edge cases; and
- documented or defended the decision.

These rules will evolve with data. The learner should always be able to inspect why a state was assigned.

## 6. Evidence ledger

Each entry records:

```text
learner
skill
lesson or project
interaction type
attempt time
code snapshot hash or artifact reference
support level
result
misconception tags
confidence estimate
latency where relevant
review interval
environment
transfer distance
```

Raw sensitive content is minimized. Public repositories never contain learner records.

## 7. Review scheduler version 1

Begin with an understandable schedule:

```text
same session
approximately 1 day
approximately 3 days
approximately 7 days
approximately 14 days
approximately 30 days
```

Rules:

- correct, confident, independent retrieval lengthens the interval;
- correct but uncertain retrieval may keep a moderate interval;
- misconception recurrence shortens the interval and changes representation;
- a full solution reveal schedules a fresh parallel item soon;
- integrated project use can supply review evidence; and
- review volume is capped so returning never feels like debt collection.

An adaptive algorithm such as FSRS or another memory model may be evaluated later. It should not be adopted before the product has clean evidence semantics.

## 8. Review item design

Reviews rotate among:

- syntax generation;
- output prediction;
- state tracing;
- bug diagnosis;
- code writing;
- test design;
- explanation;
- data-structure choice; and
- near or far transfer.

A learner should not “master loops” by recognizing the same four multiple-choice patterns.

## 9. Assessment dimensions

Code is assessed across separate dimensions.

### Correctness

Does it satisfy the contract and tests?

### Robustness

Does it handle defined edge cases and malformed input?

### Clarity

Are names, structure, and control flow understandable at the current level?

### Decomposition

Are responsibilities divided appropriately?

### Testing

Do tests cover important examples, boundaries, and prior defects?

### Security and privacy

Does the solution validate input, protect secrets, avoid unsafe operations, and handle evidence appropriately?

### Efficiency

Is performance acceptable for the stated scale? Efficiency is introduced when relevant, not used to punish beginners for clear solutions.

### Explanation

Can the learner state the design, assumptions, evidence, and limits?

A task may emphasize only selected dimensions.

## 10. Deterministic grading

Tests and explicit rules determine code behavior whenever practical.

The grader may use:

- visible tests;
- hidden tests;
- property-based tests;
- static checks;
- AST checks used cautiously;
- output comparison;
- execution traces;
- performance bounds; and
- human-reviewable rubrics.

The AI tutor never becomes the sole authority for whether executable code is correct.

## 11. Visible and hidden tests

### Visible tests

Teach the contract, support debugging, and model good testing.

### Hidden tests

Check generalization and edge cases, but must not become arbitrary traps. On failure, feedback should describe the violated class of behavior without leaking the exact answer.

Example:

```text
Your solution works for the sample records but fails when the input is empty.
What should the function return when there is no evidence?
```

## 12. Checkrides

A checkride gathers clean evidence under reduced assistance.

Rules:

- capability targets are visible;
- live solution hints are disabled until submission;
- ordinary scratch code is allowed unless mental execution is being assessed;
- time limits are optional and justified;
- failure opens diagnosis and review, not shame;
- a second form uses different surface details; and
- passing requires the defined evidence, not a global point threshold.

## 13. Confidence calibration

Before selected answers, the learner may indicate:

```text
Guessing | Unsure | Fairly sure | Certain
```

The system later compares confidence with evidence. This helps distinguish lucky correctness from stable understanding and teaches metacognition.

Confidence is never used to scold the learner.

## 14. Misconception model

Misconceptions are first-class content objects.

Examples:

- assignment means equality forever;
- `print` and `return` are interchangeable;
- a loop automatically preserves state;
- a function changes outer variables by default;
- indexing starts at one;
- changing one alias creates a new object;
- an exception means the whole idea is wrong;
- passing sample tests proves all inputs work;
- an anomaly proves malicious or fraudulent activity.

Evidence records the signature, lesson response, and whether it recurs in a new context.

## 15. Mastery-map display

The learner sees capability states and supporting evidence, not a mysterious score.

Example:

```text
Frequency tables
  Independent
  Evidence:
    ✓ built a login counter without hints
    ✓ repaired a reset-inside-loop bug
    ○ delayed review scheduled
    ○ financial transfer not yet attempted
```

This display turns progress into a useful map.

## 16. Speed

Speed can represent fluency after accuracy and understanding are established. It is not a default quality measure.

Timed interactions are:

- optional unless the professional scenario genuinely requires time pressure;
- compared primarily with the learner’s own prior performance;
- separated from mastery state; and
- accessible through untimed alternatives.

## 17. Academic integrity

When work resembles a current graded assignment:

- the system asks the learner to identify the course context;
- full solution generation is restricted;
- the tutor uses different examples;
- debugging focuses on the learner’s attempt;
- conceptual explanations remain available;
- the learner makes final implementation decisions; and
- interaction records can show which assistance level was used.

The product supports learning, not covert submission production.

## 18. Project assessment

Projects use an evidence packet:

- requirements interpretation;
- issue or task breakdown;
- implementation;
- tests;
- defect history;
- documentation;
- data handling;
- security and privacy review;
- report or presentation; and
- reflection on limitations.

The packet enables a mentor or reviewer to discuss concrete work.

## 19. Product metrics

Useful aggregate metrics include:

- independent-attempt success;
- delayed-retrieval success;
- transfer success;
- hint depth by skill;
- misconception recurrence;
- time to isolate defects;
- review burden;
- confidence calibration;
- project completion with quality thresholds;
- local-tool transition; and
- voluntary continuation.

Do not optimize lesson completion at the expense of delayed independence.

## 20. Fairness and accessibility

Assessment must not confuse unrelated friction with skill.

- keyboard speed is not Python mastery;
- perfect spelling in prose is not debugging ability;
- color perception is not trace ability;
- audio access is not conceptual knowledge;
- one preferred explanation style is not understanding; and
- anxiety under artificial timers is not professional incapacity.

Equivalent evidence pathways should exist where they preserve the target construct.

## 21. Data governance

- Collect the minimum evidence required for learning and product improvement.
- Separate identity from analytics where practical.
- Explain what is stored and why.
- Provide export and deletion controls.
- Never place real learner histories in this public repository.
- Establish retention limits before broad deployment.
- Do not train external models on private learner content without explicit informed consent.

## 22. Version-1 implementation rule

Start with transparent state transitions and human-inspectable evidence. Add predictive sophistication only when it produces demonstrably better decisions than the simple model.
