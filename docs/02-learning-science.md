# Learning-Science Foundation

## 1. Position

Sophia Learns Code will be evidence-informed, not decorated with neuroscience vocabulary.

Learning research offers strong directional principles, but no paper can design the product for us. Findings vary by domain, learner, duration, assessment, and implementation. We will translate evidence into testable product behaviors, measure delayed performance, and revise when the learner data disagrees with our assumptions.

The standard is not “research says gamification works.” The standard is:

> Which mechanism should cause which learning behavior, under what conditions, and how will we know?

## 2. Evidence hierarchy

When making a durable product decision, prefer:

1. replicated findings and high-quality meta-analyses;
2. research in programming or closely related procedural domains;
3. controlled studies with delayed or transfer outcomes;
4. observational evidence from comparable learners;
5. direct product experiments with delayed measures;
6. expert practice and design heuristics; and
7. intuition, clearly labeled as a hypothesis.

Immediate enjoyment and immediate quiz accuracy matter, but neither substitutes for later independent performance.

## 3. Core principles and product translations

| Principle | What the evidence broadly suggests | Product translation | Failure mode to avoid |
|---|---|---|---|
| Retrieval practice | Actively recalling information can strengthen later retention more than additional passive study | Begin sessions with recall; ask for output, syntax, strategy, or explanation before showing it | Turning every interaction into stressful testing |
| Spacing | Revisiting learning across time generally improves durable retention relative to massed repetition | Schedule short reviews across days and weeks; mix representations | A giant pile of “overdue” work and guilt |
| Worked examples | Novices can learn efficiently from complete, well-explained solutions | Show annotated examples early, synchronized with state visuals | Copying examples without cognitive engagement |
| Fading | Guidance should recede as knowledge grows | Move from full example to completion, ordering, debugging, generation, and transfer | Removing support by calendar rather than evidence |
| Self-explanation | Explaining steps can reveal gaps and integrate principles | Ask targeted “why did this change?” and “what would happen if?” questions | Generic “explain your answer” prompts that invite fluff |
| Informative feedback | Feedback is most useful when it clarifies the goal, present state, and next action | Describe expected versus observed behavior and point to the smallest useful inspection | Praise-only, score-only, or instant answer replacement |
| Cognitive-load management | Novices have limited capacity for simultaneously processing unfamiliar elements | Segment lessons, coordinate code and visuals, introduce one new mental model at a time | Split attention, decorative animation, terminology avalanches |
| Variation and transfer | Knowledge becomes useful when practiced across changed surface features and contexts | Reuse one structure in general, cyber, and financial cases | Repeating nearly identical exercises that train pattern matching only |
| Autonomy, competence, relatedness | Motivation is supported when learners experience meaningful choice, growing capability, and human connection | Offer route and flavor choices, honest progress, optional mentor debriefs | False choice, controlling rewards, public comparison pressure |
| Challenge-skill calibration | Engagement benefits from clear goals, control, and difficulty near current capability | Adjust scaffolding and edge cases from evidence; provide a recovery path | Equating frustration with rigor or speed with skill |
| Mastery learning | Time and support may vary while the target capability remains stable | Progress by evidence states; allow revisiting and alternate demonstrations | One-shot gates and permanent labels |
| Metacognition | Learners benefit from monitoring what they know, expected, and tried | Prediction, confidence estimates, debugging journals, and debriefs | Asking for confidence without comparing it with evidence |

## 4. Retrieval practice in a coding system

Retrieval must extend beyond flashcards.

Useful retrieval forms include:

- write the syntax from memory;
- predict exact output;
- trace a variable after each iteration;
- name the problem-solving pattern;
- select a data structure and justify it;
- repair a previously seen misconception;
- write a function contract;
- produce a test case;
- explain a traceback; and
- implement a small solution without starter code.

Recognition tasks remain useful for orientation and diagnosis, but they provide weaker evidence than generation.

### Product rule

After a concept is first learned, at least one later encounter must require recall before the explanation is reopened.

## 5. Spacing and review

The first scheduler should be simple and transparent. A concept may return later the same session, then approximately after one day, three days, one week, two weeks, and one month. Exact intervals should adapt to performance and product evidence rather than pretending one schedule is universal.

Reviews should be small enough to welcome return. A review queue is a recommendation, not debt.

### Review variety

A single concept might return as:

```text
Day 0: predict a dictionary update
Day 1: repair a missing-key bug
Day 3: write a frequency counter
Day 7: use the pattern on vendor records
Day 14: explain why initialization belongs outside the loop
Day 30: choose the pattern inside an unfamiliar case
```

This combines spacing with varied retrieval and transfer.

## 6. Worked examples and fading

The instructional ladder should be explicit:

```mermaid
flowchart LR
    A[Watch and annotate] --> B[Predict a step]
    B --> C[Complete a missing step]
    C --> D[Arrange code blocks]
    D --> E[Repair a defect]
    E --> F[Modify for a new requirement]
    F --> G[Write independently]
    G --> H[Transfer to a new domain]
```

Not every lesson needs every rung, but every important skill needs the full progression across its learning sequence.

### Adaptive fading

Support can fade when the learner demonstrates:

- accurate predictions;
- correct state tracing;
- low hint dependence;
- correct explanation of the mechanism; and
- successful completion under changed surface details.

Support should return when evidence reveals a misconception. Reintroducing a diagram is not regression; it is targeted instruction.

## 7. Self-explanation

Good self-explanation prompts are specific and anchored to observable code:

- Why is `total` created before the loop?
- Which value changed on iteration three?
- Why does this function return a value instead of printing it?
- What assumption caused the failing test?
- What remains true if the input list is empty?

Poor prompts are broad, repetitive, or easily answered by paraphrasing:

- Explain the code.
- Do you understand?
- Why is Python useful?

The platform should accept text, a short voice response with transcript, diagram selection, or line annotation when equivalent.

## 8. Feedback model

Every instructional feedback response should answer only what is currently useful from three questions:

1. **Where am I going?** The target behavior or contract.
2. **How am I going?** The discrepancy between expected and observed state.
3. **Where next?** The smallest productive action.

Example:

```text
Goal: preserve a running count across every login record.
Observed: `counts` becomes empty at the start of each iteration.
Next inspection: find the line that creates a new dictionary.
```

This is better than “Incorrect” and usually better than replacing the line.

Praise should describe effective behavior rather than identity:

- useful: “You checked the value before and after the loop and isolated the reset.”
- weak: “You’re a natural coder!”

## 9. Cognitive load and multimedia

The platform coordinates representations rather than multiplying them.

A useful execution view may show:

- the current line;
- one plain-language action;
- relevant variables or objects;
- output produced so far; and
- a scrubber for time.

It should not simultaneously show a video, long prose, full object graph, achievement animation, chat panel, minimap, and six badges.

### Multimedia rules

- Segment explanations into learner-controlled steps.
- Put labels near the element they describe.
- Highlight changes rather than repainting everything.
- Remove decorative motion during high-effort reasoning.
- Provide captions, transcripts, and text alternatives.
- Pause video for prediction rather than playing code like television.
- Use animation only when time or state change is the idea.

## 10. Interleaving and discrimination

Blocked practice is useful when a beginner is forming a first pattern. Later, mix adjacent patterns so the learner must decide which tool applies.

Example:

```text
Blocked: three list-iteration examples
Then mixed: choose between a list, dictionary, set, or direct calculation
```

The difficulty increase is intentional. The product must explain that harder-feeling practice can produce stronger discrimination, while still monitoring overload.

## 11. Motivation and humane gamification

A meta-analysis of gamified learning found positive average effects but substantial variation across implementations and outcomes. That supports experimentation, not a license to scatter points everywhere.

The design should support:

- **autonomy:** meaningful route, theme, and challenge choices;
- **competence:** progress tied to demonstrated capabilities;
- **relatedness:** optional mentor, peer, or cohort connection;
- **clear goals:** one visible target at a time;
- **control:** ability to retry, inspect, pause, and request help; and
- **appropriate challenge:** scaffolding that responds to evidence.

Extrinsic mechanics must not crowd out the intrinsic reward of making code work and understanding why.

## 12. Desirable difficulty versus bad friction

Useful difficulty:

- recalling a concept;
- predicting before running;
- choosing a structure;
- debugging a plausible misconception;
- adapting to an edge case;
- explaining a design decision.

Bad friction:

- unclear buttons;
- unexplained terminology;
- typing boilerplate unrelated to the concept;
- losing work;
- waiting for execution;
- being forced through mastered examples;
- guessing the tutor’s preferred wording;
- inaccessible visualizations; or
- fighting package and environment setup before it is the lesson.

The product should remove bad friction so it can preserve useful difficulty.

## 13. Measurement plan

For a concept sequence, measure:

- pre-instruction prediction or generation;
- immediate independent performance;
- delayed retrieval;
- transfer to changed context;
- hints used and their depth;
- confidence calibration;
- misconception recurrence;
- explanation quality;
- time spent productively stuck versus interface-stuck; and
- voluntary continuation.

A feature that increases session time but decreases delayed transfer is not automatically successful.

## 14. Research cautions

- Most memory research is not specific to Python; product translation must be tested.
- Short laboratory outcomes may not predict semester-long persistence.
- Self-report of fun is valuable but not equivalent to learning.
- Fast performance may reflect familiarity rather than flexible knowledge.
- AI tutoring evidence is evolving quickly and must be reevaluated regularly.
- One learner is an excellent design partner but not a universal sample.
- “Learning styles” are not used as a basis for separate visual/auditory learner tracks; accessibility and multimodal representation are different concerns.

## 15. Foundational references

### Retrieval and spacing

- Roediger, H. L., & Karpicke, J. D. (2006). *Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention.* https://doi.org/10.1111/j.1467-9280.2006.01693.x
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). *Distributed Practice in Verbal Recall Tasks: A Review and Quantitative Synthesis.* https://doi.org/10.1037/0033-2909.132.3.354
- Karpicke, J. D., & Roediger, H. L. (2008). *The Critical Importance of Retrieval for Learning.* https://doi.org/10.1126/science.1152408

### Examples, explanation, and programming scaffolds

- Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). *Self-Explanations: How Students Study and Use Examples in Learning to Solve Problems.* https://doi.org/10.1207/s15516709cog1302_1
- Renkl, A. (1997). *Learning from Worked-Out Examples: A Study on Individual Differences.* https://doi.org/10.1207/s15516709cog2101_1
- Renkl, A. (2002). *Worked-out examples: instructional explanations support learning by self-explanations.* https://doi.org/10.1016/S0959-4752(01)00030-5
- Hou, X., Ericson, B. J., & Wang, X. (2022). *Using Adaptive Parsons Problems to Scaffold Write-Code Problems.* https://doi.org/10.1145/3501385.3543977

### Feedback, motivation, and gamification

- Hattie, J., & Timperley, H. (2007). *The Power of Feedback.* https://doi.org/10.3102/003465430298487
- Ryan, R. M., & Deci, E. L. (2000). *Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being.* https://doi.org/10.1037/0003-066X.55.1.68
- Sailer, M., & Homner, L. (2020). *The Gamification of Learning: a Meta-analysis.* https://doi.org/10.1007/s10648-019-09498-w
- Fong, C. J., Zaleski, D. J., & Leach, J. K. (2015). *The challenge-skill balance and antecedents of flow: A meta-analytic investigation.* https://doi.org/10.1080/17439760.2014.967799

## 16. Research update procedure

For any material change in instructional strategy:

1. Add the source and claim to `docs/11-research-and-benchmarks.md`.
2. State the proposed product behavior.
3. State the expected learner mechanism.
4. Define immediate, delayed, and transfer measures.
5. Test with real learners.
6. Record whether the decision is retained, revised, or rejected.

Learning science is the keel, not the autopilot.
