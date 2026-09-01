# Research and Benchmark Ledger

**Last reviewed:** 2026-09-01  
**Purpose:** preserve the evidence, external patterns, open questions, and licensing boundaries behind product decisions.

## 1. How to use this document

Every research-backed feature proposal should identify:

1. the claim;
2. the quality and relevance of the evidence;
3. the mechanism expected to help learning;
4. the product behavior being proposed;
5. the immediate, delayed, and transfer measures;
6. known caveats; and
7. the decision after testing.

Research is not a shield against product evidence. A strong general finding can still be implemented badly.

## 2. Foundational evidence ledger

| Claim | Evidence posture | Product implication | Primary caution |
|---|---|---|---|
| Retrieval can improve long-term retention relative to restudy | Strong, replicated memory literature | Require recall, prediction, generation, and explanation before reopening support | Excessive testing can feel punitive and may assess the wrong construct |
| Spacing generally improves durable retention | Strong meta-analytic support | Revisit concepts across days and weeks; cap review burden | Optimal intervals depend on retention goal and learner history |
| Worked examples help novices acquire initial procedures | Strong instructional literature | Begin new patterns with compact, annotated examples | Passive copying does not ensure learning |
| Guidance should fade as expertise grows | Strong theoretical and empirical support | Move through completion, ordering, repair, generation, and transfer | Fading too early creates overload; too late creates boredom |
| Self-explanation can deepen learning from examples | Substantial support with individual and task variation | Ask specific why/state/assumption questions | Generic prompts can produce paraphrase rather than reasoning |
| Informative task/process feedback can improve learning | Strong but highly implementation-dependent | Show goal, observation, discrepancy, and next action | Praise, reward, or answer-only feedback carries little information |
| Parsons problems can scaffold novice code writing | Relevant programming-education evidence | Offer code ordering before or during blank-editor work | Correct ordering can occur without understanding; follow with explanation or generation |
| Gamification can help on average but effects vary widely | Meta-analytic evidence with heterogeneity | Test mechanics tied to motivation and learning mechanisms | Points and leaderboards can change behavior without improving durable skill |
| Autonomy, competence, and relatedness support motivation | Broad motivational evidence | Meaningful choice, honest capability progress, optional human connection | Cosmetic choice or controlling rewards can undermine autonomy |
| Challenge-skill balance, clear goals, and control relate to flow | Moderate evidence across contexts | Calibrate support and provide clear goals and recoverability | “Flow” should not become a vague justification for any game feature |
| Visualizing execution can help some novice programming concepts | Domain-relevant studies and long-standing tool practice | Show selected state, control flow, references, and stack behavior | Visual overload and passive watching can negate the value |

## 3. Foundational sources

### Retrieval and spacing

- Roediger, H. L., & Karpicke, J. D. (2006). *Test-Enhanced Learning: Taking Memory Tests Improves Long-Term Retention.* https://doi.org/10.1111/j.1467-9280.2006.01693.x
- Karpicke, J. D., & Roediger, H. L. (2008). *The Critical Importance of Retrieval for Learning.* https://doi.org/10.1126/science.1152408
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). *Distributed Practice in Verbal Recall Tasks: A Review and Quantitative Synthesis.* https://doi.org/10.1037/0033-2909.132.3.354

### Worked examples and self-explanation

- Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). *Self-Explanations: How Students Study and Use Examples in Learning to Solve Problems.* https://doi.org/10.1207/s15516709cog1302_1
- Renkl, A. (1997). *Learning from Worked-Out Examples: A Study on Individual Differences.* https://doi.org/10.1207/s15516709cog2101_1
- Renkl, A. (2002). *Worked-out examples: instructional explanations support learning by self-explanations.* https://doi.org/10.1016/S0959-4752(01)00030-5
- Shin, Y., Jung, J., Zumbach, J., & Yi, E. (2023). *The Effects of Worked-Out Example and Metacognitive Scaffolding on Problem-Solving Programming.* https://doi.org/10.1177/07356331231174454

### Programming scaffolds and visualization

- Hou, X., Ericson, B. J., & Wang, X. (2022). *Using Adaptive Parsons Problems to Scaffold Write-Code Problems.* https://doi.org/10.1145/3501385.3543977
- Smith, P. A., & Webb, G. I. (2000). *The Efficacy of a Low-Level Program Visualization Tool for Teaching Programming Concepts to Novice C Programmers.* https://doi.org/10.2190/N0VV-0P48-XJ9G-F8WV
- Lahtinen, E., Ala-Mutka, K., & Järvinen, H.-M. (2005). *A Study of the Difficulties of Novice Programmers.* https://doi.org/10.1145/1151954.1067453

### Feedback and motivation

- Hattie, J., & Timperley, H. (2007). *The Power of Feedback.* https://doi.org/10.3102/003465430298487
- Ryan, R. M., & Deci, E. L. (2000). *Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being.* https://doi.org/10.1037/0003-066X.55.1.68
- Sailer, M., & Homner, L. (2020). *The Gamification of Learning: a Meta-analysis.* https://doi.org/10.1007/s10648-019-09498-w
- Fong, C. J., Zaleski, D. J., & Leach, J. K. (2015). *The challenge-skill balance and antecedents of flow: A meta-analytic investigation.* https://doi.org/10.1080/17439760.2014.967799

## 4. Platform benchmarks

The goal is not to clone one platform. It is to study proven interaction patterns, identify gaps, and compose a system around Sophia’s journey.

### futurecoder

Repository: https://github.com/alexmojaki/futurecoder  
Experience: https://futurecoder.io/

Current public materials describe a free interactive Python course aimed especially at complete beginners. Its documented patterns include:

- code execution required to advance;
- predict-the-output questions;
- automatic checking;
- gradual hints;
- partial solution reveal;
- Parsons problems;
- enhanced tracebacks;
- beginner-focused mistake detection; and
- multiple debugging and visualization tools.

**Borrow as patterns:** dense learning interaction, progressive hints, misconception-aware feedback, Parsons fallback, and useful traceback design.

**Do not assume:** that the same curriculum, interface, or architecture fits this product; evaluate the actual learner journey.

**License:** MIT at the time of review. Any direct code reuse requires license preservation and a deliberate dependency decision.

### Exercism Python track

Repository: https://github.com/exercism/python  
Experience: https://exercism.org/tracks/python

Current public materials distinguish constrained concept exercises from more open practice exercises, organize progression through a syllabus tree, and keep instructions, tests, code, and support files in a versioned repository.

**Borrow as patterns:** explicit concept prerequisites, test-backed exercise contracts, concept-versus-practice separation, and maintainable repository content structure.

**Extend:** add integrated visual execution, beginner orientation, spaced mastery, adaptive scaffolding, domain narratives, and a stronger platform-to-professional transition.

**License:** MIT at the time of review. Exercise content and implementation still require attribution and reuse review rather than casual copying.

### Python Tutor

Experience: https://pythontutor.com/

Python Tutor publicly describes step-by-step visualization of variables, objects, pointers/references, data structures, and stack frames.

**Borrow as patterns:** execution timeline, stack/object views, current-line focus, and time travel.

**Extend:** couple visualization to required predictions, selected misconceptions, authored lessons, explanation, mastery evidence, and accessibility text.

**Avoid:** treating the visualizer as self-explanatory. Watching an animation is not automatically learning.

### Brilliant

Experience: https://brilliant.org/

**Study:** visual problem manipulation, short discovery loops, progressive challenge, polished feedback, and the sense that the learner is solving rather than receiving.

**Do not copy:** proprietary lessons, text, art, interaction assets, or branded progression.

**Product gap to fill:** actual Python execution, debugging, professional tools, and domain-specific project depth.

### Codecademy

Experience: https://www.codecademy.com/

Current public course pages emphasize hands-on learning, guided and independent projects, quizzes, and contextual AI assistance.

**Study:** integrated editor/course layout, smooth progression, project packaging, and broad pathway communication.

**Product gap to fill:** transparent delayed mastery evidence, deeper execution visualization, stricter AI agency protection, and an explicit exit into local engineering workflows.

### JupyterLite

Documentation: https://jupyterlite.readthedocs.io/en/stable/

JupyterLite runs Jupyter interfaces and supported kernels entirely in the browser. It can support interactive visualizations and browser-side files.

**Potential role:** later investigation-notebook mode for data analysis and reports.

**Do not use as the opening interface:** a notebook exposes too much workspace complexity before the learner understands cells, state, files, and execution.

### Pyodide

Documentation: https://pyodide.org/en/stable/

Pyodide runs CPython compiled to WebAssembly in the browser and supports many Python packages.

**Potential role:** immediate, low-infrastructure execution for foundational and data lessons.

**Research needs:** startup latency, cancellation, input handling, package loading, trace hooks, browser memory, accessibility, and sandbox limits on representative student devices.

### Monaco Editor

Documentation: https://microsoft.github.io/monaco-editor/

Monaco powers the editing experience of VS Code and offers a professional browser editor. Its documentation does not position it as a mobile editor.

**Potential role:** desktop/laptop code workspace that eases later transition to VS Code.

**Research needs:** first-time usability, accessibility, bundle weight, mobile alternatives, and whether professional controls overwhelm the first lesson.

## 5. Benchmark rubric

When reviewing a platform or open-source project, evaluate:

| Dimension | Questions |
|---|---|
| Absolute-zero support | Which prerequisite knowledge is assumed? |
| Action density | How often does the learner make a meaningful decision? |
| Mental models | Is execution state visible and explained? |
| Scaffold quality | How does support increase and fade? |
| Debugging | Are errors taught as evidence? |
| Mastery | Is progress based on completion, immediate correctness, delay, or transfer? |
| AI agency | Does assistance build reasoning or supply answers? |
| Fun | Is engagement intrinsic, narrative, social, cosmetic, or coercive? |
| Authenticity | When do real files, tools, and projects appear? |
| Exit path | Can the learner work outside the platform? |
| Accessibility | Are interactions usable by keyboard, screen reader, and reduced-motion users? |
| Privacy | What student data is collected and shared? |
| Maintainability | Can content be reviewed, tested, and versioned? |
| License | What can legally and ethically be reused? |

## 6. Active research questions

### First-session questions

- Should output prediction be required before Run, optional, or adaptive?
- Does the flight-deck metaphor clarify purpose for an adult learner?
- How much animation improves state understanding before it becomes noise?
- Is Monaco approachable enough for the first five minutes?
- Does an intentional early error create confidence or anxiety?

### Scaffold questions

- When should Parsons problems appear: by choice, after evidence of stuckness, or in the standard ladder?
- Which hint order best preserves agency?
- How should the system distinguish productive struggle from random editing?
- Do specific self-explanation prompts improve later transfer for these lessons?

### Gamification questions

- Does a capability map motivate more than a linear path?
- Which rewards feel meaningful to a college learner?
- Does optional mission flavor increase practice without adding split attention?
- Can streakless momentum support regular return?
- Does a small celebration after independent evidence help without interrupting flow?

### Tutor questions

- Does a structured debug coach reduce time-to-insight without reducing independent edits?
- How often should the tutor ask versus explain directly?
- Can authored misconception tags outperform generic model diagnosis?
- Does answer reveal followed by a parallel task restore learning effectively?

### Long-term questions

- Does browser-to-local-tool transition occur early enough?
- Which mastery evidence predicts success in real projects?
- How well does learning transfer between cyber and financial cases?
- Does the platform improve performance in formal coursework without becoming a homework solver?

## 7. Experiment record template

```markdown
## Experiment: <name>

- Date:
- Product version:
- Learner group:
- Capability target:
- Hypothesis:
- Mechanism:
- Variant A:
- Variant B:
- Immediate measure:
- Delayed measure:
- Transfer measure:
- Experience measure:
- Result:
- Caveats:
- Decision: keep / revise / remove / retest
```

## 8. Licensing and intellectual-property rules

- Learn from interaction patterns; do not copy closed-source lesson text, art, videos, or proprietary datasets.
- Before incorporating open-source code, record the project, version, license, purpose, modifications, and required notices.
- An MIT license permits broad use but still requires preservation of copyright and permission notices.
- Network-accessed AGPL components require deliberate legal and architecture review.
- Research papers may inform design; their figures and full text are not automatically reusable.
- Generated content must not be prompted to imitate a living author’s course or reproduce a proprietary lesson.
- The repository’s own license remains an explicit open decision.

## 9. Research freshness

Review this ledger:

- before choosing major infrastructure;
- before introducing a new learning mechanic;
- before adding production AI tutoring;
- before broad learner recruitment;
- at least once per major milestone; and
- whenever new evidence materially challenges a decision.

Record the review date and changed conclusions. Avoid continuously chasing novelty when a stable finding and direct learner evidence already support the design.
