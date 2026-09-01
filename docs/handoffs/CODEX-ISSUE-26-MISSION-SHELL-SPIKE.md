# Codex Launch Packet: Issue #26, Mission-Shell Technology Spike

## Recommended Codex configuration

- **Model:** GPT-5.6 Sol
- **Intelligence:** Ultra
- **Speed:** Standard. Ultra already gains wall-clock speed through parallel work, so do not also spend extra usage on `/fast` for the initial run.
- **Orchestration:** Ultra with a root integrator and tightly partitioned subagents.
- **Thread mode:** Use `/goal` with the bounded objective below.
- **Branch:** `spike/mission-shell-stack`
- **Workspace:** A separate Codex worktree based on the latest `main` commit.

If Ultra is unavailable or the usage budget is tight, use GPT-5.6 Sol at Max with one agent. Do not downgrade the acceptance criteria.

## Why Ultra is justified here

This issue divides cleanly into independent workstreams that can be measured and integrated:

1. Pyodide worker execution, cancellation, reset, and stale-result handling.
2. Mission state, editor adapter, and explicit flow.
3. Deterministic evaluation, semantic Case state, and local evidence persistence.
4. Tests, accessibility, performance measurement, and failure review.

One root agent must own the contracts and integration. Subagents may investigate and implement isolated slices, but they must not each invent a competing architecture.

## Goal command

```text
/goal Build and measure the smallest complete mission-shell technology spike for issue #26, validate or reject the candidate browser stack and stable seams, then stop with a draft PR and a keep-revise-replace-defer report without turning the spike into the production application.
```

## Full prompt

```text
ROLE

Act as the root technical lead and integrator for a bounded architecture spike. Use Ultra subagents only where work separates cleanly. You own the final contracts, integration, measurements, scope control, and draft PR.

This is a working technical experiment, not a paper architecture review and not the production build.

REPOSITORY

Rainman147/Sophia-Learns-Code

BASELINE

Start from the latest main commit. Record the exact base SHA before changing anything.

GOVERNING ISSUE

GitHub issue #26: Technical spike: Validate the mission-shell stack and stable seams.
Parent Wayfinder map: issue #20.

BRANCH AND ISOLATION

Create or use:

spike/mission-shell-stack

Keep the spike self-contained under:

spikes/mission-shell/

Do not initialize the production application at the repository root. Do not edit canonical vision, decision authorities, curriculum schemas, or unrelated issues. Findings belong in a spike report pending the architecture checkpoint.

READ FIRST

Read these exact authorities before implementation:

1. VISION.md
2. docs/21-project-rebaseline-assessment.md
3. docs/20-prebuild-architecture-and-research-gates.md
4. docs/22-rebaseline-decisions.md
5. docs/08-technical-architecture.md
6. docs/12-risks-and-guardrails.md
7. docs/15-platform-stack-and-rust-strategy.md
8. docs/17-vertical-slice-build-plan.md
9. docs/handoffs/CODEX-PREBUILD-EXPERIENCE-REBASELINE.md
10. content/examples/phase-0/001-first-contact.yaml
11. GitHub issue #26

When an older document conflicts with VISION.md or docs/22-rebaseline-decisions.md, the rebaseline governs. Record meaningful contradictions instead of silently resolving them.

OBJECTIVE

Determine whether the leading browser stack can support the first Python Investigator Mission with:

- fast and truthful Python response;
- explicit and testable learner flow;
- a quiet guided editor;
- deterministic evaluation;
- semantic code-to-Case events;
- recoverable execution;
- local evidence persistence;
- accessibility;
- replaceable infrastructure; and
- acceptable performance on representative student hardware.

LEADING HYPOTHESIS TO TEST

- responsive browser application
- React and strict TypeScript
- Next.js App Router as application shell
- XState 5 or a smaller explicit statechart alternative
- CodeMirror 6 behind EditorAdapter
- pinned Pyodide inside a module Web Worker behind ExecutionRuntime
- deterministic MissionEvaluator
- semantic CaseState and SceneRenderer
- IndexedDB behind EvidenceStore
- no backend
- no custom Rust

Treat every item as a candidate. The output must say keep, revise, replace, or defer.

SUBAGENT PARTITION

Use up to four workstreams. The root agent defines the shared types and integration rules first.

WORKSTREAM A: PYTHON EXECUTION

Own only:

- pinned Pyodide loading in a module Web Worker
- typed run request and run result
- stdout and stderr capture
- normalized syntax and runtime errors
- source revision identity
- stale-result rejection support
- timeout, cancellation, worker termination, replacement, and reset
- cold and warm timing instrumentation
- repeated-run memory observations

WORKSTREAM B: MISSION FLOW AND EDITOR

Own only:

- one explicit Mission actor or statechart
- one guided editor through EditorAdapter
- manual Learn-mode Run
- focus, diagnostics, decorations, and source-change events
- a documented comparison of XState with a smaller explicit alternative
- keyboard behavior

WORKSTREAM C: TRUTH, CASE STATE, AND PERSISTENCE

Own only:

- MissionDefinition specimen
- deterministic MissionEvaluator
- one TaskResult
- one semantic CaseEvent
- CaseState transition
- SceneRenderer contract and one accessible consequence
- one Evidence event
- IndexedDB or equivalent local persistence behind EvidenceStore
- reload, resume, export, and reset behavior

WORKSTREAM D: VERIFICATION

Own only:

- contract and integration tests
- browser end-to-end tests
- accessibility checks
- performance harness and measurements
- failure-mode review
- dependency and license ledger
- review of whether each proposed seam is deep enough to justify existing

The root agent integrates all work. Do not allow subagents to modify the same core contract files concurrently. Prefer reports, isolated modules, or staged commits over merge-conflict roulette.

REQUIRED DOMAIN SEAMS

Prototype the smallest useful contracts for:

```text
MissionDefinition
MissionActor
EditorAdapter
ExecutionRuntime
MissionEvaluator
CaseState
SceneRenderer
EvidenceStore
```

Each seam must protect one identified domain or replacement risk. Do not create a generic plugin platform, service locator, event bus, dependency-injection framework, or broad extension system.

MINIMUM WORKING SLICE

Build one small shell that can:

1. Load a First Contact Mission definition.
2. Display a guided editable Python surface.
3. Run a scripted route for deterministic UI testing.
4. Run real print("Hello, Sophia!") code through Pyodide in a worker.
5. Capture and display stdout.
6. Produce a normalized unmatched-quote error.
7. Preserve source when execution fails.
8. Attach a source revision to every request and result.
9. Ignore a stale result after newer source has run.
10. Cancel or terminate an intentionally non-terminating run.
11. Replace the worker and run valid code again.
12. Evaluate one deterministic task result.
13. Emit one semantic Case event such as console_activated.
14. Update one CaseState value.
15. Render one accessible visual consequence plus a text and reduced-motion equivalent.
16. Record one local evidence event.
17. Reload and resume the saved state.
18. Export and fully reset local prototype state.

IMPLEMENTATION BOUNDARIES

- Keep the UI minimal, clear, and accessible. This is not the visual-identity prototype.
- Keep all high-frequency mission interaction client-side.
- Do not put learner execution behind a server route.
- Do not run Python on the UI thread.
- Do not expose application secrets or privileged APIs to learner code.
- Bound output, trace size, run time, and worker lifetime.
- Prefer worker replacement over pretending a poisoned runtime is safe.
- Make stale results impossible to display as current truth.
- Keep semantic Case events independent of React components and animation callbacks.
- Keep deterministic evaluation independent of AI.
- Use a local storage adapter, not a cloud account.

CANDIDATE COMPARISONS

Perform only comparisons that materially affect this spike:

1. XState 5 versus a smaller explicit statechart or reducer.
2. CodeMirror 6 versus a minimal temporary editor if CodeMirror blocks the first useful interaction.
3. Motion for React versus native CSS or View Transitions for the single consequence.
4. Worker initialization and caching approaches.
5. IndexedDB access directly versus a small library, if the library meaningfully improves reliability.

Do not expand into a frontend-framework bake-off, full editor survey, database survey, or game-engine evaluation.

TESTING

At minimum, add deterministic coverage for:

- typed execution contract
- valid print output
- normalized unmatched-quote error
- source preservation after error
- source revision propagation
- stale-result rejection
- timeout or cancellation
- worker replacement and recovery
- reset behavior
- Mission state transitions
- deterministic evaluator result
- semantic Case event and CaseState update
- EvidenceStore persistence
- reload and resume
- full reset
- keyboard completion
- screen-reader status announcement timing
- reduced-motion consequence
- no dead-end Mission state

Use a real browser end-to-end runner. Do not claim behavior based only on mocked worker tests.

MEASUREMENTS

Record actual observations for:

- time to first useful interface
- editor input latency or qualitative responsiveness with method stated
- Pyodide cold initialization
- warm execution
- repeated warm execution distribution
- cancellation or termination latency
- worker replacement latency
- stale-result behavior
- memory before and after repeated runs, with method and caveats
- bundle size
- Pyodide asset size and caching behavior
- idle CPU behavior where practical
- keyboard path
- screen-reader status behavior
- reduced-motion parity
- code preservation through every failure path

Test on at least two representative browser or hardware combinations if available. If only one environment is available, state the limitation rather than fabricating coverage.

ACCESSIBILITY

The minimum slice must include:

- keyboard-only completion
- visible focus
- semantic editor and output labels
- live status that does not become a screen-reader firehose
- non-color-only state and error communication
- reduced-motion presentation
- a text equivalent for the visual consequence
- no essential hover-only behavior

DEPENDENCIES AND SECURITY

- Pin versions.
- Record every direct dependency and license.
- Review Pyodide loading and content security implications.
- Do not enable arbitrary package installation.
- Do not enable outbound learner-controlled networking.
- Do not add analytics.
- Do not commit secrets or real learner data.

REQUIRED REPORT

Create:

docs/experiments/issue-26-mission-shell-spike.md

For each candidate and seam, record:

- question
- implementation used
- evidence and measurements
- accessibility result
- security or privacy implication
- maintainability result
- known limitation
- decision: keep, revise, replace, or defer
- exact revisit trigger

Also record:

- exact base and head SHA
- prototype status
- architecture diagram of the implemented slice
- shared contract definitions
- test matrix
- performance table
- failure matrix
- dependency and license ledger
- what should survive to the architecture checkpoint
- what should be discarded
- unresolved risks that do not block the next decision

DELIVERABLES

1. Runnable self-contained mission-shell spike.
2. One scripted execution path.
3. One real Pyodide worker path.
4. All required domain seams in minimal form.
5. Deterministic evaluator and semantic Case event.
6. Local persistence, export, resume, and reset.
7. Automated tests and measurement harness.
8. Architecture and findings report.
9. Setup and run instructions.
10. Draft PR linked to issue #26 and Wayfinder map #20.

NON-GOALS

Do not add:

- production backend
- authentication or accounts
- production AI tutor
- remote execution
- arbitrary package management
- generalized curriculum renderer
- final Case or Mission schema
- polished Operations Center
- full graphics pipeline
- broad reward economy
- tutorial video system
- game engine
- native shell or Tauri
- custom Rust
- microservices
- deployment infrastructure beyond what is necessary to run and inspect the spike

GIT AND PR RULES

- Commit only on spike/mission-shell-stack.
- Keep implementation inside spikes/mission-shell except the experiment report.
- Do not merge.
- Open a draft PR against main.
- Link issue #26 and map #20.
- Explain the subagent partition and root integration.
- Mark the code as an architecture spike, not production foundation.
- Do not close issue #26. Human review and the architecture checkpoint own that decision.

STOP CONDITIONS

Stop after the minimum slice works, required failure paths are tested, measurements are recorded, every candidate has a keep-revise-replace-defer recommendation, and a draft PR is open.

Do not:

- migrate the prototype to a production app
- build First Contact as a polished learner experience
- add the second Mission
- finalize the content schema
- rewrite canonical ADRs
- start a backend
- optimize unmeasured code
- add custom Rust

FINAL REPORT

Return:

- branch and exact head SHA
- draft PR link
- local run command
- test commands and results
- measurement commands and results
- implemented seams
- subagent work split and integration notes
- candidate decisions: keep, revise, replace, or defer
- accessibility findings
- security findings
- known limitations
- exact artifacts created
- explicit confirmation that no production architecture was declared and no non-goal was added
```

## Root-agent rule

Ultra is useful only if the root agent preserves one architecture. The root must reject duplicated frameworks, competing types, and speculative abstractions even when a subagent proposes them.