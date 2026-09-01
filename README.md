# Sophia Learns Code

> A beautiful, adaptive mystery-investigation game in which real Python is how the learner examines evidence, tests theories, repairs tools, and solves cyber and financial-forensics cases from absolute zero through advanced engineering.

**Status:** canonical product rebaseline and pre-build discovery  
**Initial learner:** a college-aged Python beginner studying cybersecurity and financial forensic analysis  
**Working experience identity:** **Python Investigator**  
**Canonical vision:** [`VISION.md`](VISION.md)

## The idea

Sophia Learns Code is not a course with game decorations and not a mystery game interrupted by quizzes.

Python is the game control system:

```text
Case presents evidence
        ↓
Learner predicts, writes, or repairs Python
        ↓
Real Python executes
        ↓
The investigation world changes from the result
        ↓
Learner inspects what happened
        ↓
The case advances or reveals a new question
        ↓
Capability, rewards, tools, and future cases evolve
```

The platform succeeds when the learner can work without it.

## Experience structure

```text
Journey
└── Phase
    └── Case
        └── Mission
            └── Encounter
```

The persistent hub is the **Operations Center**. The learner codes in the **Investigation Console**, inspects execution in **Computer's Mind**, completes reduced-support **Field Tests**, sees progress through a transparent **Capability Map**, and preserves real work in the **Case Archive**.

## Learning loop

```text
Curious question
  → concrete mental model
  → prediction
  → real execution
  → visible consequence
  → investigation and repair
  → independent application
  → explanation
  → changed-context transfer
  → delayed retrieval
  → durable capability
```

Lessons are designed around action rather than passive pages. Important concepts move through worked examples, prediction, code ordering, debugging, modification, independent generation, transfer, and review after time has passed.

## Game progression

Four systems remain deliberately separate:

- **XP** records meaningful momentum.
- **Mastery** records capability evidence.
- **Unlocks** open tools, routes, and new possibilities.
- **Artifacts** preserve what the learner actually built.

XP never grants mastery. Badges evolve from discovered to practiced, proven, durable, transferred, and integrated, with inspectable evidence behind every stage.

The best rewards are new powers:

- Live Lab;
- execution time travel;
- Debugger Lens;
- Test Chamber;
- Evidence Vault;
- Pattern Scanner;
- Pro Workspace; and
- the eventual local Field Kit for terminal, Git, and GitHub work.

There are no loot boxes, energy systems, lost progress, streak shame, public ranking pressure, or XP farming.

## First case

# Case 001: The Midnight Badge

A synthetic badge event occurred at an unusual hour. The record alone does not prove wrongdoing. The learner brings the console online and builds tools to inspect what happened.

| Mission | Python capability | Case contribution |
|---|---|---|
| First Contact | `print()`, strings, code versus output | activate the console |
| Identity Tag | values and assignment | store case facts |
| Access Rule | comparisons and `if`/`else` | classify one event |
| Repeated Attempts | `for`, `range`, changing state | inspect several attempts |
| Case Field Test | combined foundation skills | build a small review program |

The finished program enters the Case Archive. Delayed and changed-context tasks test whether the ideas remained usable.

## Product promise

```text
Assume nothing.
Make invisible execution visible.
Let the learner act every few moments.
Make errors useful and emotionally safe.
Reward demonstrated capability, not button pressing.
Make the story respond to actual Python.
Gradually remove help until independent work feels normal.
Teach the platform's own exit into professional tools.
```

## Creative direction

The experience should feel polished, precise, lightly cinematic, adult, warm, and futuristic without falling into hacker clichés.

UI, graphics, motion, sound, writing, badges, videos, and progress must share one identity. Motion is used to explain causality, preserve context, acknowledge actions, and mark meaningful achievements. Every instructional animation has a reduced-motion and semantic text alternative.

The initial rendering direction favors accessible React UI, HTML, CSS, SVG, and one general motion system. Rive, GSAP, PixiJS, Phaser, Remotion, and other specialized tools must clear explicit prototype gates before adoption.

## Architecture posture

The leading hypothesis is:

```text
Responsive web application
  → React + strict TypeScript + Next.js candidate
  → explicit mission state machine
  → guided editor behind an adapter
  → Pyodide inside a Web Worker
  → deterministic evaluator and bounded trace
  → semantic case events and accessible scene rendering
  → local-first evidence store
```

The project stabilizes domain contracts before selecting replaceable libraries. There is no production backend, full game engine, native shell, or custom Rust in the first validated case.

Rust may enter later only at a measured stable boundary, such as a Tauri professional companion, profiled WebAssembly computation, a distributable CLI, or sandbox supervision.

## Current build sequence

The project is intentionally pausing before production implementation to clear a bounded set of design and architecture decisions.

```text
R0  Canonical project rebaseline
R1  Visual and verbal identity
R2  Mission-only versus Operations Center prototype
R3  Motion and graphics pipeline
R4  Tutorial-media pipeline
R5  Mission-shell technology spike
R6  Architecture checkpoint
    ↓
Production First Contact
    ↓
Identity Tag proves reuse
    ↓
The Midnight Badge proves the first case
    ↓
Immediate, delayed, and transfer validation
    ↓
Curriculum expansion decision
```

Narrow prototypes should still be beautiful and high quality. They are allowed to be throwaway, transferable, or production candidates, but they must declare which.

## Documentation

Start here:

1. [`VISION.md`](VISION.md)
2. [`docs/21-project-rebaseline-assessment.md`](docs/21-project-rebaseline-assessment.md)
3. [`docs/18-game-and-narrative-design-system.md`](docs/18-game-and-narrative-design-system.md)
4. [`docs/19-experience-identity-and-media-system.md`](docs/19-experience-identity-and-media-system.md)
5. [`docs/20-prebuild-architecture-and-research-gates.md`](docs/20-prebuild-architecture-and-research-gates.md)
6. [`docs/22-rebaseline-decisions.md`](docs/22-rebaseline-decisions.md)
7. [`docs/handoffs/CODEX-PREBUILD-EXPERIENCE-REBASELINE.md`](docs/handoffs/CODEX-PREBUILD-EXPERIENCE-REBASELINE.md)
8. [`docs/README.md`](docs/README.md) for the complete map

## North-star outcome

**Independent success on a delayed, unfamiliar transfer task.**

The project also measures whether learners understand the interface, experience truthful and fast cause and effect, predict and explain behavior, recover from errors, understand their progress, value the rewards, and voluntarily return without coercion.

## Guardrails

- Real learner data never enters this public repository.
- Real Python and deterministic tests remain executable truth.
- AI coaching cannot override runtime evidence or secretly create mastery.
- An anomaly is not presented as proof of fraud or malicious intent.
- Cybersecurity cases use synthetic, authorized, defensive contexts.
- Accessibility is part of every core interaction.
- The game never manipulates return through lost rewards or artificial pressure.
- A technology or mechanic must improve a learner-visible behavior or a measured stable boundary.
- Broad curriculum production waits until the first case proves the experience.
