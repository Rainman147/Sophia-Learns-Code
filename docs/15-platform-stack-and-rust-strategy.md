# Platform, Stack, and Rust Strategy

**Status:** proposed technical authority for the first playable build  
**Date:** 2026-09-01  
**Scope:** delivery platform, learner workspace, execution runtime, persistence, backend staging, and the measured role of Rust

## 1. Executive recommendation

Build Sophia Learns Code first as a **laptop-first, browser-delivered application that can later become an installable PWA**.

Use a modern TypeScript web stack for the product experience, run foundational Python inside a dedicated browser worker, store the first prototype's progress locally, and defer accounts, servers, native shells, and custom Rust until a tested learner experience proves they are needed.

```text
Next.js + React + strict TypeScript
              ↓
Focus-first learner workspace
              ↓
CodeMirror guided editor behind an adapter
              ↓
Pyodide inside a module Web Worker
              ↓
Deterministic grader + bounded trace
              ↓
Local evidence and mastery state
```

The first engineering target is not architectural grandeur. It is a first mission that feels immediate, understandable, beautiful, and worth continuing.

## 2. Platform decision

### Primary platform: responsive web application

The primary coding experience should run in a modern desktop or laptop browser.

Advantages:

- no Python installation before the first lesson;
- one URL for every pilot build;
- rapid Codex iteration and deployment;
- browser-native access to workers, storage, audio, motion, and accessibility APIs;
- easy feature flags and experiment variants;
- straightforward sharing with Sophia and other novice testers; and
- a clean path to an installable PWA after offline and caching behavior are justified.

### Mobile role

Phones and small tablets should initially support:

- retrieval practice;
- predict-the-output tasks;
- execution tracing;
- short explanations and video;
- progress and badges;
- review scheduling; and
- mentor summaries.

They should not be treated as the primary multi-line coding surface in the first product.

### Desktop companion later

A Tauri shell may become valuable when the product needs controlled access to:

- local files and folders;
- a real terminal;
- local Python environments;
- Git and GitHub workflows;
- offline project work;
- native notifications; or
- a bridge between guided learning and professional development.

Tauri is therefore a **professional-transition candidate**, not an MVP dependency.

### Notebook mode later

JupyterLite or a related notebook experience may support exploratory data and investigation work after the learner understands execution state, files, and cells. It should not be the opening interface.

## 3. Recommended first-slice stack

### Application framework

- Next.js App Router
- React
- TypeScript in strict mode
- a package manager and workspace layout selected once and pinned

Why:

- fast product iteration;
- mature routing and deployment options;
- strong support for client-side interactive islands;
- broad component and testing ecosystem; and
- a simple path from static prototype to authenticated application.

Do not place Python execution or high-frequency learner interaction behind unnecessary server rendering. The learner workspace is an intentionally client-heavy application surface.

### Styling and interface primitives

- Tailwind CSS or an equivalent utility approach;
- accessible unstyled primitives such as Radix-style components;
- a small project-owned design-token layer;
- semantic HTML and SVG before canvas where practical; and
- restrained motion through a small animation library or native CSS.

The visual system should support:

- dark and light themes;
- high contrast;
- reduced motion;
- scalable typography;
- non-color-only mastery states;
- consistent focus rings; and
- calm error presentation.

### Lesson flow state

Use **XState 5 or an equivalent explicit state-machine library** for mission flow.

A mission is not a simple next-page sequence. It contains predictions, executions, retries, hints, recovery branches, checkrides, and clean stopping points. Those transitions should be inspectable and testable rather than scattered across component booleans.

Illustrative states:

```text
loading
  → briefing
  → editing
  → awaiting_prediction
  → executing
  → inspecting_result
  → repairing
  → independent_check
  → debrief
  → reward_reveal
  → complete

Any active state
  → paused
  → recovered
  → stopped_cleanly
```

Lesson content declares allowed transitions and evidence events. The UI renders them.

## 4. Editor strategy: guided first, professional later

### Guided Editor

Use CodeMirror 6 as the leading first-slice candidate behind a project-owned `EditorAdapter`.

The guided editor should expose only what the current learner needs:

- syntax highlighting;
- line numbers when useful;
- matching-punctuation cues;
- selected error underlines;
- keyboard support;
- controlled editable ranges where a lesson requires them;
- stable cursor and selection behavior;
- programmatic focus and source-line highlighting; and
- no intimidating wall of IDE controls.

The product can progressively reveal autocomplete, multiple files, refactoring tools, and richer diagnostics.

### Pro Workspace

Monaco remains a strong later candidate for the professional workspace because it closely resembles VS Code. It should unlock when files, tests, Git, and project organization become relevant.

```text
Guided Editor
  → fuller single-file editor
  → multi-file workspace
  → Monaco-style Pro Workspace
  → local VS Code or preferred editor
```

### Adapter contract

```typescript
export interface EditorAdapter {
  getValue(): string;
  setValue(code: string): void;
  focus(): void;
  revealLine(line: number): void;
  setReadOnly(readOnly: boolean): void;
  setEditableRanges?(ranges: SourceRange[]): void;
  setDiagnostics(diagnostics: EditorDiagnostic[]): void;
  onChange(listener: (revision: EditorRevision) => void): () => void;
}
```

The product should be able to compare CodeMirror and Monaco without rewriting mission logic.

## 5. Python execution architecture

### Initial runtime

Use Pyodide in a dedicated module Web Worker for the first browser-runtime spike.

Never execute learner Python on the UI thread.

### Execution flow

```text
Editor revision
      ↓
Run policy decides manual or live execution
      ↓
Typed request sent to worker
      ↓
Pinned Pyodide runtime executes bounded code
      ↓
stdout + stderr + exception + trace + tests
      ↓
Normalized result packet
      ↓
Deterministic feedback and evidence update
```

### Request contract

```typescript
export type ExecutionMode = "learn" | "live-lab" | "checkride" | "project";

export type RunRequest = {
  requestId: string;
  revisionId: number;
  lessonVersion: string;
  mode: ExecutionMode;
  code: string;
  files?: Record<string, string>;
  stdin?: string[];
  timeoutMs: number;
  tracePolicy: TracePolicy;
  testPlan?: TestPlan;
};
```

### Result contract

```typescript
export type RunResult = {
  requestId: string;
  revisionId: number;
  status: "passed" | "failed" | "error" | "timeout" | "cancelled";
  stdout: string;
  stderr: string;
  exception?: NormalizedException;
  trace?: TraceSnapshot[];
  tests?: TestResult[];
  feedbackCodes: string[];
  metrics: {
    initializeMs?: number;
    executeMs: number;
    traceSnapshots: number;
    outputBytes: number;
  };
};
```

Every result is associated with the editor revision that produced it. A stale result never overwrites a newer workspace state.

## 6. Four execution policies

### Learn mode

- explicit Run;
- optional prediction gate;
- trace and explanation;
- reset to authored starter state;
- no automatic success-to-next transition.

### Live Lab mode

- short debounce after a valid editor change;
- latest revision wins;
- stale pending work is cancelled or ignored;
- strict time, output, and trace limits;
- no hidden tests used as constant surveillance;
- visible live/manual toggle;
- only safe, side-effect-free tasks qualify.

### Checkride mode

- explicit Run and Test;
- no live tutor nudges;
- no solution reveal before submission;
- exact evidence conditions visible in advance.

### Project mode

- explicit execution;
- background syntax and lint diagnostics permitted;
- multiple files and tests;
- behavior approaches a professional workflow.

The product should not teach that ordinary Python always executes on every keystroke. Live response is a laboratory affordance, not a false model of the language.

## 7. Cancellation and resource safety

The worker layer must support:

- timeout enforcement;
- maximum stdout and stderr size;
- maximum trace steps and object depth;
- cancellation on newer live revisions;
- full worker replacement after runaway or corrupted execution;
- learner-code preservation during reset;
- package allowlists;
- no application secrets in worker scope;
- deterministic runtime versioning; and
- clear recovery messages.

For the first slice, worker termination and replacement is preferable to building an elaborate in-process interrupt system unless measurement proves otherwise.

## 8. Execution tracing

The first visualizer should support only the syntax used by the vertical slice:

- `print()`;
- primitive values;
- assignment;
- comparisons;
- `if` and `else`;
- small `for` loops;
- output progression; and
- syntax and selected runtime exceptions.

Trace capture may begin with Python tracing hooks and narrow instrumentation. It must produce a normalized representation independent of the UI.

```typescript
export type TraceSnapshot = {
  step: number;
  event: "line" | "call" | "return" | "exception";
  line: number;
  frames: FrameSnapshot[];
  objects: Record<string, ObjectSnapshot>;
  stdout: string;
  changedPaths: string[];
};
```

The visualizer should emphasize changed state, not dump interpreter internals. Every snapshot requires a text equivalent.

## 9. Local-first persistence for the first slice

The first playable vertical slice should require no account or backend.

Use IndexedDB through a small repository-owned persistence interface for:

- lesson version;
- attempts;
- predictions;
- execution summaries;
- hint levels;
- deterministic evidence;
- mastery snapshots;
- earned rewards;
- review candidates;
- learner preferences; and
- unfinished code.

### Why local first

- reduces implementation surface;
- protects the first prototype from premature identity work;
- supports rapid deploy-and-test cycles;
- makes resets and test accounts simple; and
- focuses attention on the learner loop.

### Required controls

- export a human-readable pilot evidence packet;
- reset all local prototype data;
- show what is stored;
- separate synthetic product telemetry from personal notes; and
- never commit learner data to the repository.

## 10. Backend staging

Add a backend only after the first learner loop is valuable.

### Stage 1: no backend

Static content bundle, worker execution, IndexedDB evidence.

### Stage 2: protected pilot backend

A modular FastAPI application with PostgreSQL for:

- authentication;
- consent;
- cross-device progress;
- immutable lesson versions;
- mastery and review persistence;
- tutor gateway;
- mentor share grants; and
- export and deletion.

### Stage 3: project infrastructure

Add object storage and isolated remote execution for notebooks, multi-file artifacts, unsupported packages, and controlled OS-level work.

Do not split into microservices until security, ownership, scaling, or reliability provides a concrete reason.

## 11. Content toolchain

Lesson content remains schema-validated repository data.

Recommended flow:

```text
YAML source
  → schema validation
  → prerequisite and identifier validation
  → reference-solution execution
  → misconception fixtures
  → accessibility and safety checks
  → generated TypeScript contracts
  → immutable lesson bundle
```

Use ordinary TypeScript or Python for the first validator unless profiling proves it is a material bottleneck.

## 12. Where Rust belongs

Rust is valuable when it creates a measurable product advantage at a stable boundary. It is not a decorative ingredient.

### Good future Rust candidates

#### Tauri professional companion

Use Rust-backed native commands for tightly scoped local capabilities such as file access, environment detection, terminal mediation, and Git integration.

#### Trace or state-diff core compiled to WebAssembly

Consider Rust/WASM only if large traces, object graphs, compression, or state diffs become a measured browser bottleneck.

#### Content and artifact CLI

A later CLI could validate lesson bundles, synchronize missions, or package student projects when startup speed and single-binary distribution matter.

#### Remote sandbox supervisor

A narrowly privileged Rust service could eventually supervise processes or resource limits at an isolation boundary. This requires a separate threat model.

#### Existing Rust-based tools

Use mature tools such as Ruff and uv where they improve the development or professional-learning workflow without requiring custom Rust code.

### Poor first uses of Rust

Do not initially build:

- the web UI in a Rust frontend framework;
- a custom Python interpreter;
- a custom database layer;
- a Rust microservice that only wraps CRUD;
- a WebAssembly module for trivial state transitions; or
- a native desktop shell before browser testing.

Those choices would slow iteration around the product's least-settled layer: the learner experience.

## 13. Rust entry gates

Custom Rust enters only when all of the following are true:

1. A specific bottleneck or capability gap is measured.
2. The boundary has a written contract and tests.
3. TypeScript, Python, browser APIs, or an existing tool cannot solve it simply enough.
4. The learner benefit is explicit.
5. Build, debugging, deployment, and contributor costs are understood.
6. A rollback or replacement path exists.

### Example gate

```text
Observed problem:
Trace diffing blocks interaction for more than the accepted threshold.

Evidence:
Profile on representative devices with realistic trace sizes.

Candidate:
Rust/WASM trace-diff package behind `TraceDiffAdapter`.

Acceptance:
Meaningful latency reduction without accessibility, bundle, or maintenance regression.
```

## 14. RustPython decision

Do not use RustPython as the primary execution runtime for the first product.

It is worth monitoring and may support experiments, but the initial requirement is reliable Python semantics, packages, trace behavior, and beginner feedback. Pyodide is the more conservative first candidate for that contract.

The execution adapter keeps future alternatives possible.

## 15. Suggested first repository shape

```text
apps/
└── web/
    ├── app/
    ├── components/
    ├── features/
    │   ├── mission/
    │   ├── workspace/
    │   ├── execution/
    │   ├── feedback/
    │   ├── mastery/
    │   └── rewards/
    ├── workers/
    └── styles/

packages/
├── contracts/
├── lesson-engine/
├── execution-runtime/
├── trace-model/
├── grader/
├── mastery-model/
├── reward-model/
└── ui/

content/
├── schema/
├── lessons/
├── cases/
├── misconceptions/
└── examples/

evals/
├── lessons/
├── runtime/
├── feedback/
└── accessibility/
```

For the first mission, a simpler single-app layout is acceptable. Extract packages only after the second mission proves a boundary is reused.

## 16. Testing strategy

### Unit and contract tests

- mission state transitions;
- worker request and result schemas;
- stale-revision rejection;
- grader behavior;
- misconception matching;
- mastery transitions;
- reward eligibility; and
- local persistence migrations.

### Runtime tests

- correct stdout and errors;
- timeout and cancellation;
- reset and worker replacement;
- golden traces;
- reference and misconception programs; and
- deterministic behavior under pinned runtime versions.

### Browser tests

- keyboard-only mission completion;
- screen-reader status announcements;
- reduced-motion path;
- responsive layout;
- code preservation during failures;
- local resume; and
- the complete First Contact happy and recovery paths.

### Learner tests

Automated tests prove system contracts. They do not prove that a novice understands the screen. Every vertical increment needs observation.

## 17. Performance budgets

The first slice should establish and measure budgets for:

- initial page interaction;
- editor readiness;
- worker initialization;
- first run;
- warm run;
- live-lab update;
- cancellation;
- trace stepping;
- route transition;
- local resume; and
- low-end representative devices.

Do not choose impressive-looking numbers without measurement. The qualitative target is that changing and running a tiny program feels immediate and that worker startup does not block the interface.

## 18. Observability without surveillance

Record only product-use events needed for learning or debugging:

- mission and lesson version;
- prediction submitted;
- run started and completed;
- execution status and timing;
- feedback code;
- hint level;
- evidence transition;
- reward earned;
- self-reported challenge;
- clean stop or continuation; and
- technical failure.

Do not record raw keystrokes, mouse trails, or private text by default.

## 19. Deployment strategy

For the first slice:

- preview deployment for every product PR;
- one stable pilot environment;
- immutable content version embedded in each build;
- feature flags for meaningful experiment variants;
- no production learner secrets in preview environments; and
- easy rollback to the prior validated experience.

Select the hosting provider based on simple preview deployment, worker asset delivery, headers required by the chosen execution runtime, and cost. Keep provider-specific APIs outside the product core.

## 20. Decision summary

```text
Primary product: browser application
Primary device: laptop or desktop
Opening editor: CodeMirror candidate behind adapter
Later editor: Monaco Pro Workspace
Python runtime: Pyodide Web Worker candidate
Mission orchestration: explicit state machine
First persistence: IndexedDB
First backend: none
Later backend: FastAPI modular monolith + PostgreSQL
Desktop future: Tauri professional companion
Custom Rust now: no
Custom Rust later: only at measured stable boundaries
```

This stack is modern because it shortens the path from an idea to a tested experience. Technology becomes valuable when Sophia notices the result, not when the dependency list looks fashionable.
