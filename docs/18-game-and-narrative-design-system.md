# Game and Narrative Design System

**Status:** canonical supporting authority  
**Date:** 2026-09-01  
**Parent vision:** `VISION.md`

## 1. Purpose

This document defines how mystery, investigation, Python, evidence, progression, and learning operate as one system.

The governing rule is:

> The learner does not complete Python exercises to earn access to a separate game. Real Python is the instrument through which the learner investigates and changes the game world.

## 2. Player fantasy

The learner fantasy is not “pretend to be a wizard who occasionally answers programming questions.” It is:

> I am becoming an investigator who can make computers examine evidence, expose patterns, test rules, and build tools I did not possess before.

The fantasy matures with capability:

```text
Curious novice
  → console operator
  → pattern investigator
  → evidence analyst
  → tool builder
  → systems investigator
  → independent engineer
```

The learner herself is the investigator. An avatar may exist later as optional expression, but no fictional protagonist should displace her agency.

## 3. World structure

### Operations Center

The Operations Center is the persistent hub between missions. It shows only useful state:

- active and available cases;
- current recommended mission and its reason;
- capability map;
- available investigative tools;
- evolving badges;
- review signals;
- Case Archive artifacts;
- learner-controlled settings and accessibility; and
- a clean way to stop or resume.

It begins sparse and becomes richer as capability grows. Its visible development represents real learner growth.

### Cases

A Case is a coherent mystery spanning four to seven Missions. It should culminate in an artifact or defensible conclusion.

A case contains:

- an initiating question;
- synthetic or controlled evidence;
- several plausible hypotheses;
- capabilities introduced only when the evidence creates a reason for them;
- complications and malformed or surprising inputs;
- a final Field Test or synthesis mission;
- a completed artifact; and
- a debrief that distinguishes evidence from conclusion.

### Missions

A Mission is a focused twelve-to-twenty-five-minute learning experience with one primary capability.

A mission normally includes:

```text
Re-entry retrieval
      ↓
Cold open or new evidence
      ↓
One clear investigative question
      ↓
Compact mental model
      ↓
Prediction or theory
      ↓
Code action
      ↓
Real execution and visible consequence
      ↓
Complication, bug, or edge case
      ↓
Investigation and repair
      ↓
Reduced-support application
      ↓
Debrief, evidence, reward, and choice
```

### Encounters

An Encounter is one meaningful action inside a mission:

- inspect evidence;
- predict output;
- change a value;
- arrange code;
- mark a suspicious line;
- run a program;
- step through state;
- repair a defect;
- write a small solution;
- explain a finding; or
- choose a route.

Navigation clicks do not count as encounters.

## 4. Game state derives from code state

The application maintains a semantic case model separate from presentation.

```text
Python source
   ↓
Execution result
   ↓
Deterministic evaluator
   ↓
Case event
   ↓
Case state
   ↓
Presentation effects
```

Example case events:

```text
investigation_console_online
investigator_identity_stored
late_badge_scan_classified
failed_attempts_counted
malformed_timestamp_detected
suspicious_vendor_grouped
report_generated
```

A case event may trigger several coordinated effects:

```text
late_badge_scan_classified
  → move record to review lane
  → illuminate the rule that fired
  → update case timeline
  → add evidence to mastery ledger
  → evolve the relevant badge when warranted
  → reveal the next question
```

The effect is never the source of truth. The evaluator is.

## 5. Declarative game integration

Mission content should eventually define semantic effects rather than hard-code story behavior into UI components.

Illustrative direction:

```yaml
case: midnight-badge
mission: access-rule

objectives:
  - id: classify-late-scan
    capability: python.conditionals.basic

success_conditions:
  - test: late_scan_routes_to_review
    emit: late_badge_scan_classified
    effects:
      - target: evidence-board.scan-8841
        action: move-to-review
      - target: rule-panel
        action: reveal-trigger
      - target: case-timeline
        action: append-finding

failure_conditions:
  - code: condition-reversed
    emit: access_rule_reversed
    feedback: condition-direction
```

This format is a hypothesis. The mission and case domain model must be prototyped before the existing lesson schema is expanded.

## 6. Python capability to investigative mechanic

| Learning target | Mystery-game mechanic | Common evidence form |
|---|---|---|
| Code and output | Activate and communicate through a console | message, finding |
| Strings and numbers | Represent facts | names, IDs, amounts, times |
| Variables | Tag and preserve evidence | case metadata |
| Booleans | Express yes/no propositions | rule result |
| Conditionals | Route an event based on evidence | approve, review, reject |
| Loops | Inspect repeated records | access attempts, transactions |
| Lists | Store ordered evidence | timeline, batch |
| Sets | Identify unique entities | accounts, devices, vendors |
| Dictionaries | Index and count evidence | frequency table, profile |
| Functions | Build reusable investigative instruments | parser, classifier |
| Files | Receive and preserve evidence packages | logs, ledgers |
| CSV and JSON | Decode common evidence formats | transactions, events |
| Regular expressions | Extract structured clues from text | indicators, IDs |
| Exceptions | Recover from bad evidence | malformed row handling |
| Tests | Prove a tool behaves as claimed | regression evidence |
| Classes and dataclasses | Model case entities | transaction, event, subject |
| SQL | Ask structured questions of large evidence | joins, aggregates |
| APIs | Enrich evidence from approved sources | vendor or threat metadata |
| Visualization | Reveal patterns and communicate findings | charts, timelines, graphs |
| Async and concurrency | Coordinate independent lookups or files | enrichment pipeline |
| Git | Preserve a reproducible decision and code history | commits, reviews |

The mechanic should make the abstraction feel inevitable. The learner meets the problem before the formal name whenever practical.

## 7. Case genres

The product can vary tone without fragmenting the learning graph.

### Cyber investigation

- suspicious authentication;
- access-control anomalies;
- unusual device or file activity;
- defensive indicator extraction;
- incident timeline reconstruction;
- integrity verification; and
- controlled threat-intelligence enrichment.

### Financial forensic investigation

- duplicate payments;
- vendor normalization;
- unusual timing or amounts;
- invoice gaps;
- reimbursement anomalies;
- related-entity analysis;
- journal-entry screening; and
- reproducible reporting.

### Mixed investigation

- insider-risk cases combining badge, login, file, and transaction evidence;
- account compromise followed by suspicious purchases;
- vendor fraud involving identity and access evidence;
- data exfiltration connected to expense or payment behavior.

### Neutral or everyday missions

The same concepts may also appear through schedules, collections, household automation, games, or creative tools. A learner should not need to love every investigation theme to learn Python.

## 8. Evidence ethics

A mature investigator does not confuse unusual with guilty.

Every case distinguishes:

```text
Fact
Observation
Pattern or anomaly
Hypothesis
Supporting evidence
Conflicting evidence
Conclusion
Confidence and limitation
```

Narrative language must avoid declaring fraud, malicious intent, or identity from a weak signal. Advanced cases should include false positives, incomplete records, and competing explanations.

Cyber cases remain synthetic, authorized, and defensive. Financial cases use synthetic records and teach that screening identifies items for review rather than proving misconduct.

## 9. The first case arc

# Case 001: The Midnight Badge

### Initiating mystery

A badge was used at an unusual hour. The record alone does not establish wrongdoing. The learner brings the console online and builds increasingly capable tools to inspect the event and related attempts.

### Mission 001: First Contact

**Capability:** execute Python and distinguish code from output.  
**Game action:** activate the investigation console.  
**Artifact:** first valid Python program.

```python
print("Investigation console online")
```

### Mission 002: Identity Tag

**Capability:** values and assignment.  
**Game action:** store the investigator and case identity.  
**Artifact:** evolving case banner.

```python
investigator = "Sophia"
case_number = 101
```

### Mission 003: Access Rule

**Capability:** comparison, Boolean result, and conditional branch.  
**Game action:** classify one access event for review.  
**Artifact:** first decision rule.

### Mission 004: Repeated Attempts

**Capability:** a bounded loop and changing state.  
**Game action:** scan several access attempts.  
**Artifact:** repeated-event analysis.

### Mission 005: Case Field Test

**Capability:** combine the previous skills with reduced support.  
**Game action:** build a small access-review program and summarize what it found.  
**Artifact:** first complete case tool in the Case Archive.

### Case ending

The ending should not reveal a dramatic criminal mastermind. It should reward disciplined reasoning:

- which events the program flagged;
- why they met the authored rule;
- what the data does not establish;
- which additional evidence would help; and
- what Python capability made the analysis possible.

## 10. Persistent tools and unlocks

Tools are better rewards than arbitrary currencies because they change future play.

Potential tools:

- **Live Lab:** safe bounded automatic preview after editing;
- **Computer's Mind:** execution time travel;
- **Debugger Lens:** focused state and error inspection;
- **Test Chamber:** run visible tests and inspect failures;
- **Evidence Vault:** open files, CSV, and JSON;
- **Pattern Scanner:** group, count, filter, and visualize records;
- **Relationship Mapper:** explore entity links;
- **Pro Workspace:** multi-file professional editor;
- **Field Kit:** local Python, terminal, Git, and GitHub bridge.

Unlocks require relevant capability evidence. They are not purchased through accumulated XP.

## 11. Operations Center growth

The Operations Center should evolve in legible layers.

### Opening state

- one active case;
- investigation console;
- a small capability strip;
- one locked tool whose requirement is visible.

### Foundation state

- console;
- logic engine;
- Computer's Mind;
- first Case Archive shelf;
- compact review signal.

### Analyst state

- Evidence Vault;
- Pattern Scanner;
- Test Chamber;
- several case routes;
- stronger project artifacts.

### Professional state

- Pro Workspace;
- local Field Kit;
- Git history;
- multi-file projects;
- open-ended case board.

The hub is not a city builder. It does not require resource harvesting, timers, maintenance chores, or decorative rooms without learning purpose.

## 12. Reward mechanics

### Moment response

A brief visual or optional sound response confirms a meaningful action without interrupting thought.

### Mission progress

The mission shows what evidence was produced and how the case artifact changed.

### Evolving badges

Badges represent observable behaviors and advance through evidence stages:

```text
Discovered → Practiced → Proven → Durable → Transferred → Integrated
```

### Case Archive

The archive preserves:

- code;
- tests;
- output;
- report or visualization;
- before-and-after versions;
- supporting capabilities; and
- a short learner reflection.

### Side missions

Optional side missions serve clear purposes:

- repair a recurring misconception;
- retrieve a concept after delay;
- transfer into a new domain;
- solve a harder edge case;
- compare two valid strategies;
- explore under-the-hood behavior; or
- create something freely.

## 13. Narrative writing rules

- Open with a question, evidence item, or visible consequence.
- Keep setup under roughly one hundred words unless reading is itself the skill.
- Give the learner a reason to run code quickly.
- Use precise adult language.
- Let code reveal information instead of narrating every conclusion.
- Use names, times, amounts, and records small enough to trace early.
- Avoid hacker-movie jargon, gratuitous darkness, and procedural-police clichés.
- Use humor lightly and never at the learner's expense.
- Let tension come from uncertainty, not countdown pressure.
- End with a finding, artifact, or next question rather than an arbitrary score screen.

## 14. Pacing and dramatic rhythm

A mission should alternate action and reflection:

```text
Evidence appears
  → learner acts
  → world responds
  → learner interprets
  → complication appears
  → learner acts again
```

Avoid more than thirty to ninety seconds of passive instruction during active play. A longer explanation should be optional, segmented, or followed immediately by a meaningful action.

A case should escalate conceptually rather than only numerically:

```text
one record
  → several records
  → malformed record
  → competing rule
  → reusable tool
  → independent synthesis
```

## 15. Failure and recovery as gameplay

Debugging is investigative play.

The game should ask:

- What did you expect?
- What did Python observe?
- Which line or assumption could explain the difference?
- What small experiment would narrow the possibilities?

A repair can change the world as visibly as an initial success. Errors do not remove lives, points, case access, or prior progress.

## 16. Adaptation as mission direction

The learner model influences the route without creating an invisible judge.

```text
Strong independent evidence
  → next concept, far transfer, or harder route

Heavy support
  → short parallel mission before escalation

Recurring misconception
  → alternate representation and targeted repair

Boredom signal
  → remove scaffolds and increase novelty

Overload signal
  → reduce visible scope and return to one state change

Return after absence
  → compact systems-wake-up mission
```

The Operations Center states why each mission is recommended and permits prerequisite-safe alternatives.

## 17. Presentation technology boundary

The game model must not depend on a particular rendering engine.

Recommended first implementation:

- semantic case state in TypeScript;
- ordinary React components for panels and controls;
- HTML and SVG for evidence boards, timelines, and state diagrams;
- a restrained motion layer for transitions;
- optional Rive experiment for one persistent Operations Center asset.

Do not begin with Phaser, PixiJS, or a 3D engine. They become candidates only if a prototype requires a continuous sprite scene, large animated object count, camera system, or other capability that DOM and SVG cannot provide cleanly.

## 18. Prototype questions

The first design prototypes must answer:

1. Does a persistent Operations Center create anticipation or add navigation friction?
2. Does the case framing make the code matter without slowing the first action?
3. Does the learner understand that real execution changed the scene?
4. Does code-to-world animation improve causal understanding?
5. Which tool unlock feels genuinely desirable?
6. Do badges feel like evidence or generic decoration?
7. Does the learner voluntarily inspect the Case Archive?
8. Does a cyber case feel relevant without requiring domain knowledge?
9. Does the learner distinguish anomaly from conclusion?
10. Does the game remain appealing after the novelty of the first screen?

## 19. Acceptance bar for a mechanic

Every proposed mechanic names:

- learner behavior it is intended to produce;
- motivational mechanism;
- learning mechanism;
- case or tool consequence;
- possible distortion;
- accessibility path;
- immediate evidence;
- delayed and transfer evidence where relevant; and
- the condition under which it will be removed.

A mechanic that increases clicks but reduces code reasoning is a failed mechanic.
