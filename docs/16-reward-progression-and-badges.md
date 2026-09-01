# Reward, Progression, and Badge System

**Status:** proposed product authority for the first playable build  
**Date:** 2026-09-01  
**Scope:** motivation, rewards, unlocks, badges, momentum, anti-farming rules, and their relationship to mastery

## 1. Position

Sophia Learns Code should be compelling, rewarding, and beautiful. It should not try to manufacture compulsion through opaque “dopamine hacks.”

The durable motivational loop is:

```text
Curiosity
  → meaningful action
  → clear consequence
  → insight
  → earned capability
  → visible progress
  → new possibility
```

The learner should return because she is gaining power over code, building useful things, and opening richer challenges. Cosmetic rewards add sparkle. They never counterfeit competence.

## 2. Separate four systems that learning products often blur

### 2.1 Experience points: momentum and celebration

XP is a light, visible record of meaningful activity. It is not mastery and does not decide readiness.

XP may recognize:

- making a thoughtful prediction;
- repairing a defect;
- completing a no-hint task;
- writing a useful test;
- explaining a state change;
- finishing a delayed review;
- completing a transfer task; or
- shipping an artifact.

XP is not awarded for:

- opening the app;
- clicking Next;
- watching a video without an interaction;
- rerunning unchanged code repeatedly;
- copying a revealed solution;
- waiting on a screen; or
- farming trivial tasks after mastery.

### 2.2 Mastery: capability evidence

Mastery is governed by the evidence model in `docs/06-mastery-and-assessment.md`.

It answers what the learner can demonstrate under known support, delay, and transfer conditions.

XP can rise without mastery. Mastery can rise without a dramatic XP burst. The two systems must never share one hidden formula.

### 2.3 Keys and unlocks: new possibilities

Keys represent permission to explore an optional tool, case, challenge, or customization. They should usually require capability evidence, not merely accumulated XP.

Examples:

- Live Lab mode;
- execution time travel;
- a debugger lens;
- a financial or cyber case route;
- a harder edge-case mission;
- a synthetic dataset;
- a theme or workspace customization;
- the first multi-file project;
- Pro Workspace; or
- local Field Lab instructions.

### 2.4 Artifacts: the strongest reward

Artifacts are things the learner made:

- a working script;
- a case banner;
- a password rule;
- a login analyzer;
- a transaction report;
- a chart;
- a test suite;
- a Git commit;
- a README; or
- a finished investigation.

Artifacts belong in a visible **Build Cabinet** with the code, tests, evidence, and evolution of the work. They are more meaningful than a numerical level.

## 3. Reward hierarchy

```text
Moment reward
  subtle response to a useful action

Mission reward
  XP, capability evidence, and an artifact update

Case reward
  evolving badge, case completion, and a meaningful unlock

Phase reward
  checkride evidence, portfolio artifact, and a new tool tier

Journey reward
  growing independence and movement into real-world environments
```

Routine success should receive a quick acknowledgment. Major independent or delayed achievements may receive a richer but still brief reveal.

## 4. Experience points version 1

XP should be transparent and small enough that the numbers remain legible.

An initial experimental schedule:

| Evidence-producing action | Example XP | Notes |
|---|---:|---|
| Thoughtful prediction submitted | 2 | Award attempt, not correctness alone |
| Prediction correct with explanation | +2 | Explanation may be selected or written |
| First successful code modification | 5 | Once per authored interaction |
| Diagnosed defect before editing | 6 | Requires a marked line or assumption |
| Repaired defect | 6 | No unchanged rerun farming |
| Independent mission act | 10 | No solution-level hints |
| Delayed retrieval | 12 | Requires configured delay |
| Transfer task | 15 | Changed context or representation |
| Case checkride | 25 | Evidence-based, not all-or-nothing identity judgment |
| Portfolio artifact completed | 30 | Must satisfy its project contract |

These values are placeholders for testing. They do not control prerequisite advancement.

### Anti-farming rules

- one authored XP award per interaction purpose;
- duplicate unchanged executions give no additional XP;
- repeated easy practice receives diminishing or no XP after the skill is stable;
- solution reveal changes the action classification;
- invalid rapid guessing does not become an efficient point strategy;
- hidden anti-abuse logic may protect the economy but cannot secretly alter mastery;
- the learner can inspect why XP was or was not awarded.

## 5. Levels without false expertise

A global level can create narrative momentum, but it must not imply that one number represents Python competence.

Use a thematic **Journey Rank** as a cosmetic summary:

```text
Initiate
Signal Reader
Code Navigator
Pattern Investigator
Evidence Builder
Systems Analyst
Independent Engineer
```

Rank may depend on a mixture of completed case milestones and earned XP. It never unlocks a concept whose prerequisites are not demonstrated.

The interface always prioritizes the capability map over the global rank.

## 6. Evolving capability badges

A badge should evolve as the evidence becomes stronger.

```text
Discovered
  → Practiced
  → Proven
  → Durable
  → Transferred
  → Integrated
```

The badge visually changes, but its detail view shows the actual evidence.

### Example: State Tracker

```text
STATE TRACKER

Proven
✓ predicted variable state in two fresh examples
✓ traced a changing value through a loop
○ delayed check scheduled
○ transfer into transaction analysis not yet attempted
```

### Initial badge families

#### Prediction Pilot

Predicts output, next line, state, or error from code rather than guessing blindly.

#### Console Navigator

Distinguishes source code, execution, output, and error channels.

#### State Tracker

Explains how names and values change during execution.

#### Bug Cartographer

Locates defects and broken assumptions using evidence before random editing.

#### Recovery Engineer

Uses an error or failed test to repair behavior and preserve working code.

#### Loop Wrangler

Traces and writes repetition with correct state across iterations.

#### Function Architect

Defines clear inputs, outputs, responsibilities, and tests.

#### Evidence Cleaner

Normalizes malformed or inconsistent records without destroying provenance.

#### Test Builder

Writes examples and edge cases that expose incorrect behavior.

#### Independent Builder

Completes bounded work without solution-level assistance.

#### Transfer Agent

Recognizes and applies a known pattern in a changed domain.

#### Field Ready

Completes work in a local editor, terminal, test runner, and Git workflow.

## 7. Badge evidence rules

Every badge definition includes:

- capability identifier;
- evidence types;
- minimum novelty;
- allowed support level;
- delay requirements where relevant;
- transfer requirements where relevant;
- deterministic checks or review rubric;
- badge stages;
- learner-facing explanation;
- accessibility representation; and
- version.

A badge cannot be awarded solely by the AI tutor.

When a badge definition materially changes, existing awards remain attached to their original version and the learner sees what changed.

## 8. Unlock design

A good unlock changes what the learner can meaningfully do.

### Tool unlocks

- Live Lab after the learner understands manual Run;
- Execution Scrubber after the first prediction;
- Value Map after assignment is introduced;
- Test Console after the first behavioral contract;
- Debug Lens after the first intentional error;
- Multi-file Workspace after functions and modules;
- Pro Workspace after files and tests;
- Field Lab after local environment readiness.

### Content unlocks

- cyber route;
- financial-forensics route;
- general automation route;
- bug-hunt side quests;
- edge-case challenges;
- alternate solution debates;
- historical or under-the-hood notes; and
- optional boss-style synthesis cases.

### Cosmetic unlocks

- workspace themes;
- console accents;
- badge display frames;
- case-file cover styles;
- optional sound packs; and
- callsign or profile-card customization.

Cosmetics may use XP or keys. Core learning access must never depend on random rewards or payment within the initial product.

## 9. The unlock rule

Each unlock declares one of three gates:

```text
Capability gate
  requires specific mastery evidence

Milestone gate
  requires a case or phase outcome

Choice gate
  available immediately as learner preference
```

Avoid arbitrary gates such as “reach 2,000 XP to learn functions.”

Example:

```yaml
unlock: live-lab
kind: capability-gated
requirements:
  all:
    - skill: python.execution.manual-run
      state_at_least: independent
    - skill: interface.code-versus-output
      state_at_least: guided
reason: >-
  Live execution becomes available after the learner can explain that editing and
  running are distinct events.
```

## 10. Progress map

The primary progress surface is a living capability constellation.

```text
[First Run: Durable] ── [Values: Independent]
                              │
                  [Variables: Guided]
                    /                   \
       [Strings: Introduced]       [Decisions: Locked]
```

Each node shows:

- current state in text and shape;
- strongest recent evidence;
- what remains to strengthen it;
- related artifact;
- next review;
- why neighboring nodes are ready or not ready; and
- optional routes.

Locked nodes should tease the capability without creating anxiety:

> Decisions opens after one fresh variable mission. You are one independent use away.

## 11. The live journey snapshot

The dashboard should feel like a helpful map, not a report card.

### “Ready now”

One recommended mission based on prerequisites, recent evidence, challenge level, and available time.

### “Wake up”

Two to five compact review items most useful for the next mission.

### “Growing”

Skills that are guided or independent but not yet durable.

### “Strong”

Durable and transferable capabilities with linked evidence.

### “Built”

Recent artifacts and how they improved.

### “Explore”

Optional side quests, themes, cases, and under-the-hood content.

The learner may override the recommended route within safe prerequisite boundaries.

## 12. Momentum without punishment

The platform should support rhythm without making missed days feel like loss.

Use:

- recent learning days as neutral history;
- a weekly momentum ring that can be resumed rather than broken;
- self-selected learning rhythm;
- compact return missions;
- “welcome back” language;
- preserved XP, badges, and mastery;
- a pause or vacation setting; and
- celebration for successful retrieval after absence.

Do not use:

- broken flames;
- loss of earned rewards;
- escalating guilt notifications;
- artificial deadlines;
- negative ranks for absence; or
- review debt presented as a moral failure.

An optional private daily streak may be tested later only when Sophia explicitly prefers it. It cannot control access or erase rewards.

## 13. Surprise and variable content without variable-ratio traps

Surprise can enrich learning when it comes from the material:

- an unexpected edge case;
- a hidden but fair test category;
- an alternate valid solution;
- a visual reaction to a creative message;
- a second route through a case;
- a small easter egg triggered by experimentation; or
- an under-the-hood insight.

Avoid variable-ratio reward systems such as loot boxes, randomized rare drops, artificial scarcity, or mystery rewards engineered to prolong use.

The platform should never obscure the relationship between a learning action and its reward.

## 14. Celebration design

### Micro celebration

For predictions, repairs, and useful experiments:

- a short state pulse;
- a gentle sound when enabled;
- one sentence naming the action;
- no modal interruption.

Example:

> Repaired from evidence. The closing quote restored valid Python.

### Mission celebration

- capability evidence card;
- XP summary;
- artifact preview;
- one newly available choice;
- a clean Stop or Continue decision.

### Case celebration

- evolving badge reveal;
- finished case artifact;
- a visual path showing combined skills;
- meaningful tool or mission unlock;
- optional share card without grades or private analytics.

Celebration intensity should match the difficulty and independence of the act.

## 15. Failure and retry behavior

Failure never removes XP, badges, access, or dignity.

The system may record that independent evidence was not yet produced. It then offers:

- the smallest discrepancy;
- a hint ladder;
- a different representation;
- a code-ordering fallback;
- a simpler parallel example;
- a direct explanation; or
- a clean pause.

A later success can be more rewarding because the learner repaired the path. The interface should name persistence and strategy specifically, not assign a fixed identity such as “genius.”

## 16. Social and mentor rewards

The initial product avoids public leaderboards.

Optional learner-controlled social moments include:

- sharing a finished artifact;
- inviting a mentor to a checkride debrief;
- showing an earned badge and its evidence;
- comparing two anonymous solution strategies;
- pair-debugging a synthetic case; and
- contributing a safe creative variant later.

Mentor messages should focus on capability and curiosity:

> Ask Sophia how she used the failed test to narrow the problem.

They should not expose tutor conversations or every attempt.

## 17. Reward data model

```typescript
export type RewardEvent = {
  id: string;
  occurredAt: string;
  learnerId?: string;
  lessonVersion: string;
  sourceEvidenceIds: string[];
  kind: "xp" | "badge-stage" | "unlock" | "artifact" | "cosmetic";
  definitionId: string;
  definitionVersion: number;
  amount?: number;
  reasonCode: string;
};
```

Reward events are derived from validated evidence and remain inspectable.

### Important separation

```text
Evidence ledger
      ↓
Mastery state machine
      ↓
Readiness router

Evidence ledger
      ↓
Reward rules
      ↓
XP, badges, unlocks, artifacts
```

Rewards do not write mastery directly.

## 18. Experiments for the first case

Test one variable at a time where practical.

### Badge timing

- immediate small badge fragment after first evidence;
- versus badge reveal only at case completion.

### XP visibility

- visible after every meaningful beat;
- versus summarized at mission end.

### Map presentation

- capability constellation;
- versus a clearer linear route with branches.

### Unlock presentation

- new tool introduced as a consequence of capability;
- versus shown from the beginning but marked not ready.

### Celebration intensity

- subtle state transition;
- versus richer mission completion card.

Measure enjoyment together with prediction, independent performance, delayed retrieval, and voluntary continuation.

## 19. Acceptance bar for a reward mechanic

A mechanic enters the product only when it defines:

1. the learner behavior it intends to support;
2. the motivational mechanism;
3. the learning mechanism;
4. its evidence source;
5. how it could be farmed or distort behavior;
6. accessibility and reduced-motion behavior;
7. privacy implications;
8. immediate experience measure;
9. delayed learning measure; and
10. a removal or revision condition.

## 20. Initial recommendation

For the first five-mission case, implement only:

- transparent XP for meaningful actions;
- three evolving capability badges;
- one tool unlock, Live Lab;
- one route unlock, cyber or finance variant;
- an artifact cabinet containing the learner's case program;
- a streakless weekly momentum view; and
- an evidence-linked capability map.

Do not build shops, currencies, loot, public ranks, avatar economies, or complex social systems.

The best early reward is simple and potent:

> “That code works because you understood it, and now you can use the idea somewhere new.”
