# Codex Launch Packet: Issue #22, Experience Lab 0

## Recommended Codex configuration

- **Model:** GPT-5.6 Sol
- **Intelligence:** Max
- **Speed:** Standard for the initial build. Use `/fast` only during active owner-steered visual iteration if lower latency is worth the extra usage.
- **Orchestration:** One lead agent. Do not use Ultra for this lane.
- **Thread mode:** Use `/goal` with the bounded objective below.
- **Branch:** `prototype/experience-lab-0`
- **Workspace:** A separate Codex worktree based on the latest `main` commit.

This lane is deliberately single-agent. The thing being tested is cohesion, hierarchy, pacing, and one visual voice. A design committee made of parallel implementers would contaminate that test.

## Goal command

```text
/goal Build two polished, controlled variants of the complete First Contact experience for issue #22, direct mission and Operations Center plus mission, then stop with a draft PR and an owner comparison package without selecting the winner or changing production architecture.
```

## Full prompt

```text
ROLE

Act as the lead product prototyper, interaction designer, senior frontend engineer, accessibility engineer, and visual QA owner for one bounded experiment.

Build a real, inspectable prototype. Do not merely write a plan. Maintain one coherent design voice. Do not delegate implementation to subagents and do not use Ultra in this lane.

REPOSITORY

Rainman147/Sophia-Learns-Code

BASELINE

Start from the latest main commit. Record the exact base SHA before changing anything.

GOVERNING ISSUE

GitHub issue #22: Prototype: Compare direct mission entry with the Operations Center hub.
Parent Wayfinder map: issue #20.

BRANCH AND ISOLATION

Create or use:

prototype/experience-lab-0

Keep this experiment self-contained under:

prototypes/experience-lab-0/

Do not initialize a production application at the repository root. Do not edit production architecture, curriculum schemas, canonical vision, decision records, or unrelated issues. Findings belong in a prototype report, not in canonical authority.

READ FIRST

Read these exact authorities before implementation:

1. VISION.md
2. docs/21-project-rebaseline-assessment.md
3. docs/18-game-and-narrative-design-system.md
4. docs/19-experience-identity-and-media-system.md
5. docs/20-prebuild-architecture-and-research-gates.md
6. docs/22-rebaseline-decisions.md
7. docs/01-learner-journey.md
8. docs/03-interactivity-and-fun.md
9. docs/05-lesson-design-system.md
10. docs/06-mastery-and-assessment.md
11. docs/12-risks-and-guardrails.md
12. content/examples/phase-0/001-first-contact.yaml
13. GitHub issue #22

When an older document conflicts with VISION.md or docs/22-rebaseline-decisions.md, the rebaseline governs. Record meaningful contradictions rather than silently blending them.

OBJECTIVE

Answer one product question with a high-quality interactive artifact:

Does a restrained persistent Operations Center improve anticipation, progress understanding, tool desirability, case identity, and return motivation enough to justify its navigation, visual, authoring, and engineering cost?

Build two matched versions of the same complete First Contact journey.

VARIANT A: DIRECT MISSION

- Enter directly into First Contact.
- Show a compact case cold open and dominant first action.
- Keep objective, Investigation Console, live case result, coach, feedback, and progress inside the Mission.
- End with a compact capability, reward, and next-action panel.

VARIANT B: OPERATIONS CENTER PLUS MISSION

- Enter through a restrained Operations Center or visit it at a clearly justified natural boundary.
- Show exactly one active Case, one available tool, one locked possibility, and one recommended Mission.
- Enter the same First Contact Mission used by Variant A.
- Return to an Operations Center that has changed because of the completed Mission.
- Make the new capability, artifact, or tool possibility understandable without turning the hub into a dashboard maze.

CONTROL VARIABLES

Keep these equivalent between variants:

- First Contact content and learning objective
- Python-looking task
- story facts
- feedback wording
- reward evidence
- accessibility support
- visual quality
- approximate session length
- mission state sequence
- final learning evidence

Do not make one variant intentionally weaker. The hub must be the principal experimental variable.

COMPLETE EXPERIENCE PATH

Both variants must support this full loop:

1. Understand a compact Case question.
2. Distinguish the Investigation Console from the result or Case-state surface.
3. Run a scripted first program based on print("Hello, Sophia!").
4. See a clear code-to-world causal response.
5. Personalize the text and observe the changed result.
6. Predict the result of a two-line example or choose “Not sure yet.”
7. Inspect a short, comprehensible execution sequence.
8. Encounter an intentionally unmatched quotation mark.
9. Receive calm Goal, Observed, Clue, and Next Action feedback.
10. Repair the line personally.
11. Complete a fresh reduced-support Field Test using different surface details.
12. See honest capability evidence and one restrained reward.
13. Understand why the Case changed.
14. Choose Continue or Stop without autoplay pressure.
15. Reload and recover the supported prototype state.
16. Reset the experiment deliberately.

PROTOTYPE TRUTH BOUNDARY

Scripted execution and scripted Case events are allowed. Clearly label the implementation as a prototype. Do not imply that this lane has validated the real Python runtime.

The visual consequence must still be driven by explicit prototype state, not by scattered animation callbacks. A source action should produce a semantic event, and the presentation should react to that event.

Use a small typed state model or explicit local state machine. Do not build a generalized course engine.

VISUAL AND EXPERIENCE QUALITY

The prototype must be narrow but premium enough to judge honestly.

Aim for:

- adult, warm, precise, futuristic investigation language
- restrained atmosphere rather than hacker clichés
- beautiful typography and spacing
- unmistakable visual hierarchy
- one dominant action at each state
- original CSS and semantic SVG graphics where useful
- subtle causal motion that never delays the learner
- coherent badge, tool, evidence, and Case treatments
- calm and useful error states
- strong laptop presentation and a sensible narrow-screen fallback

Treat the visual direction as provisional. Do not declare a permanent brand, logo, design system, or asset pipeline in this lane.

Avoid:

- neon overload
- fake terminals filled with decoration
- long lore passages
- giant dashboards
- game currencies or stores
- childish mascot language
- alarm sounds or shaking error panels
- full-screen routine confetti
- copied proprietary art or interface assets

IMPLEMENTATION GUIDANCE

Use a self-contained modern React and TypeScript prototype. Next.js is acceptable. Keep dependencies few and pinned.

Use semantic HTML and SVG first. Use CSS or one ordinary UI motion library only where motion has a named purpose: causality, orientation, feedback, or reward.

Do not add Pyodide, Monaco, a backend, authentication, AI tutoring, a game engine, Tauri, custom Rust, a production database, or a generalized plugin system.

Provide an obvious way to switch between the two controlled variants, for example separate routes or a query parameter. Do not force the reviewer to rebuild or edit code to compare them.

ACCESSIBILITY

The entire prototype must be usable by keyboard.

Include:

- logical focus order
- visible focus treatment
- status announcements for meaningful state changes
- semantic labels for code, output, Case state, prediction, feedback, and reward
- a reduced-motion path
- non-color-only status communication
- adequate contrast
- no essential information available only through animation, hover, or sound

TESTING

At minimum, add:

- state-transition tests
- happy-path test for both variants
- intentional-error and recovery-path test for both variants
- reload and resume test
- reset test
- keyboard-path test
- reduced-motion behavior test
- no-dead-end assertion
- control-variable parity check where practical

Use browser automation to inspect both variants at a representative laptop viewport and a narrow viewport. Correct obvious clipping, focus, hierarchy, and motion defects before opening the PR.

MEASUREMENT PACKAGE

Create:

docs/experiments/issue-22-experience-lab-0.md

Record:

- exact base and head commit
- exact routes for both variants
- what is shared versus different
- prototype status: throwaway, transferable, or production candidate
- hypotheses
- time to first meaningful action
- navigation steps and likely hesitation points
- Case comprehension prompts
- progress and tool-desirability prompts
- voluntary continuation and return prompts
- remembered learning versus remembered decoration prompt
- accessibility observations
- additional authoring and engineering cost
- owner review rubric
- learner observation script
- keep, revise, remove, or retest fields left open for human judgment

Do not fabricate learner evidence. Engineering observations and human observations must be clearly separated.

DELIVERABLES

1. Runnable Variant A.
2. Runnable Variant B.
3. Shared First Contact flow and controlled comparison mechanism.
4. Automated tests.
5. Setup and run instructions.
6. Experiment report and owner review rubric.
7. Representative screenshots or a short visual capture in the PR description using synthetic data only.
8. A draft pull request linked to issue #22.

GIT AND PR RULES

- Commit only on prototype/experience-lab-0.
- Keep all implementation inside prototypes/experience-lab-0 except the experiment report.
- Do not merge.
- Open a draft PR against main.
- Link issue #22 and Wayfinder map #20.
- State explicitly that the PR answers a product question and is not production architecture.
- List every dependency and its license in the PR.

STOP CONDITIONS

Stop after both variants are runnable, tested, visually inspected, documented, and placed in a draft PR.

Do not:

- select the winning variant
- close issue #22
- rewrite canonical documents
- move prototype code into a production app
- build the next Mission
- add real Python execution
- broaden the experiment into visual identity exploration

FINAL REPORT

Return:

- branch and exact head SHA
- draft PR link
- local run command
- Variant A route
- Variant B route
- test commands and results
- screenshots or capture locations
- major implementation choices
- parity controls used
- accessibility support
- known limitations
- questions requiring owner or learner judgment
- explicit confirmation that no winner was selected and no production architecture was declared
```

## Owner review after the lane

Judge the two variants before asking for cosmetic revisions. The owner decision is one of:

- mission-only;
- hub plus mission;
- hybrid hub at natural boundaries;
- remove the hub;
- retest after a named change.

Do not merge the prototype merely because one version looks attractive. First record what it taught us.