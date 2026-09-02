# Workstream C: truth, Case state, semantic events, and persistence

Base contract commit: `f176e8dc36cb0e0c70fd6d96844a3ec9e098c7b1`

This workstream imports the root-owned contracts unchanged. It adds no UI, event bus, service locator, backend, analytics, learner-controlled networking, or alternate domain types.

## Implemented behavior

### Deterministic mission evaluation

`createMissionEvaluator` evaluates every task kind in the First Contact specimen from a normalized `RunResult`:

| Task kind | Deterministic rule | Evidence level |
| --- | --- | --- |
| `run` | Successful execution and exact authored stdout | introduced |
| `personalize` | Successful execution with exactly one non-empty newline-terminated output line that differs from the starter greeting | guided |
| `predict` | Successful scripted result with the two authored print lines in source order | introduced |
| `trace` | Successful scripted result with the two authored print lines in source order | guided |
| `break` | Normalized `unmatched-quote` error from an error result | guided |
| `repair` | Successful execution and exact authored repaired stdout | guided |
| `field-test` | Successful execution and exact authored no-hint stdout | independent |

Line endings are canonicalized to `\n`; whitespace and extra output are not hidden. A task/result identity mismatch is an incomplete execution, not evidence. Error, timeout, cancellation, and rejection outcomes cannot accidentally pass. The evaluator has no AI, React, browser, or persistence dependency. Its clock is injectable for deterministic tests.

Only a passing `run` execution emits `console_activated`. Its versioned identity is derived from mission id, mission version, event type, and task id, so reevaluating or rerunning the activation step cannot create a second semantic activation. The timestamp is deliberately not part of identity.

### Case transition and scene projection

`applyCaseEvents` is a pure fold. It rejects duplicate effects by event id, never mutates its inputs, promotes capability evidence from `unseen` to `introduced` without downgrading stronger evidence, and returns the same object when every supplied event is already represented.

`createSceneRenderer` maps semantic state to plain data. The projection includes explicit offline/online wording, a changed-state label, the Case message, available tool, capability evidence, locked possibility, and a complete text equivalent. Full motion may request `console-activation`; reduced motion requests `none` and explicitly describes the immediate state change. There are no React imports or animation callbacks.

### Evidence persistence

The IndexedDB adapter uses schema version 1 and two object stores:

- `evidence-events`, keyed by stable event id, with a compound chronological index on `occurredAt` and `id`;
- `mission-session`, with one bounded `active` session record.

Append is idempotent: the first record for an id wins, and later appends with that id do not overwrite it. A read/write transaction serializes the existence check and add. `load` returns event history plus the resumable session; `saveSession` atomically replaces the active session; `export` returns a plain JSON-ready object with a fixed human-readable description; `reset` clears both stores in one transaction; and `close` releases or closes a pending connection and makes the adapter unusable.

All data is decoded and projected at the boundary. Unknown fields are discarded. Invalid schema values, non-local privacy labels, malformed revisions, or malformed nested Case and task data fail explicitly instead of becoming application truth. `createMemoryEvidenceStore` uses the same codecs and first-id-wins behavior, returns defensive copies, supports seeded state and an injectable clock, and is intended for deterministic unit/non-browser use—not as a silent production fallback.

## Direct IndexedDB versus `idb` 8.0.3

| Consideration | Direct IndexedDB | `idb` 8.0.3 |
| --- | --- | --- |
| Dependency | No additional package | One pinned ISC-licensed wrapper already selected by the root |
| Control | Full access to native requests and events | Preserves native schema, transactions, cursors, and lifecycle callbacks |
| Failure handling | Requires manual request, transaction-completion, abort, and exception wiring | Promise rejection plus `transaction.done` makes commit/failure boundaries explicit |
| Type safety | Substantial local wrappers are needed for typed stores and indexes | `DBSchema` types store names, keys, values, and indexes without a new domain abstraction |
| Code size and review surface | More adapter code and more callback interleavings | Small adapter; business logic remains visible and replaceable |
| Lock-in | None | Low: only this adapter imports `idb`; the domain depends on `EvidenceStore` |

Decision: **keep** `idb` for this spike. It materially reduces transaction and typing mistakes while remaining behind a meaningful replacement seam. Revisit if bundle measurement shows material cost, a target browser exposes lifecycle incompatibility, the dependency becomes unmaintained, or production needs storage behavior its native-shaped API cannot express.

## Failure, migration, and privacy behavior

| Condition | Behavior | Recovery / limitation |
| --- | --- | --- |
| IndexedDB unavailable | Method rejects with a clear instruction to use the memory adapter for non-browser execution | UI must present a local-storage failure state; there is no silent downgrade that could imply persistence |
| Quota, transaction abort, or browser storage denial | Native/idb rejection propagates | Caller keeps in-memory mission state and can retry, export if possible, or reset; Workstream D must exercise the browser-specific path |
| Duplicate evidence id | Existing event remains unchanged | Idempotent by design; conflicting payloads do not rewrite history |
| Malformed persisted value | Boundary decoder throws `EvidenceDataError` | Do not partially trust the snapshot; offer full reset and retain the error for diagnostics without analytics |
| Fresh database (`oldVersion === 0`) | Creates the complete v1 schema | Supported path |
| Any upgrade from a nonzero older schema | Fails because no migration has been approved | Add an explicit, tested migration before incrementing the version |
| Database newer than adapter v1 | Open fails with a version-specific error | Reload with compatible code; never downgrade or reinterpret newer records |
| Another tab requests a newer version | This connection closes and is invalidated | Reload; an older tab must not keep writing against obsolete assumptions |
| Multiple current-version tabs save sessions | Atomic last-commit-wins session updates | No cross-tab conflict policy in the spike; revisit before accounts or multi-window support |
| Full reset | Clears evidence and active session in one transaction | Schema remains installed; all prototype learner state is removed |
| Closed store | Further operations fail | Construct a new adapter to resume access |

Privacy classification is fixed to `local-synthetic`; any other value is rejected. Persistence retains only fields present in the root `EvidenceEvent` and `PersistedMissionSession` contracts. The session necessarily includes current source because resume requires it; personalized text therefore remains browser-local. There is no network call, cloud sync, analytics hook, secret, account identifier, or arbitrary metadata bag. Export creates data in memory only—the root UI owns an explicit learner-initiated download. Production review must still decide retention duration, browser clearing language, shared-device guidance, and whether source belongs in durable evidence versus only resumable session state.

## Seam-depth decisions and revisit triggers

| Candidate / seam | Decision | Why now | Exact revisit trigger |
| --- | --- | --- | --- |
| `MissionEvaluator` for execution-backed tasks | **keep** | It centralizes deterministic truth and normalized failure handling without UI/runtime coupling | Replace or deepen if a second runtime requires task-specific logic outside `RunResult` |
| `MissionEvaluator` for prediction and trace | **revise** | The fixed contract can validate a scripted normalized reveal, but cannot prove the learner's selected prediction or trace-step completion | Introduce a typed task-observation input if the production evaluator becomes responsible for non-execution interactions |
| Personalization rule | **revise** | It proves the authored output conditions but `RunResult` contains no source, so it cannot prove that only text inside quotes changed | Add source or a bounded source-analysis observation if that source-shape claim becomes mastery evidence |
| Stable `CaseEvent` plus pure `applyCaseEvents` | **keep** | This is a deep boundary between verified mission truth and Case consequences; stable ids make replay safe | Revisit identity scope if one task may intentionally activate multiple distinct consoles or mission versions share event history |
| `SceneRenderer` | **keep** | It keeps accessibility and reduced-motion semantics independent of React and animation libraries | Revise to accept transition context if presentation must distinguish first activation from an already-online resumed state |
| `EvidenceStore` | **keep** | It protects schema, persistence, reset, export, browser failure, and replacement risk | Revisit when multiple profiles, multiple active missions, synchronization, or retention policy enters scope |
| `idb` adapter | **keep** | Thin, typed, reliable transaction handling with low lock-in | Reconsider on measured bundle/browser cost or maintenance/security concern |
| Memory adapter | **keep** | Deterministic contract testing without browser globals and no hidden persistence claim | Remove if tests can use real IndexedDB cheaply everywhere; never promote it as an automatic durability fallback |
| v1 evidence schema as final product schema | **defer** | The spike needs a version boundary, not a canonical learner-data model | Decide only at the architecture checkpoint with retention, profile, migration, and product evidence requirements |

## Known limitations

- `RunResult` cannot carry the learner's prediction choice, trace advancement, support-use history, or source text. The evaluator therefore validates scripted normalized outcomes for prediction/trace and output-level personalization only.
- The database stores one active mission session. There is no profile partition, multi-mission index, cross-tab merge, expiry, encryption layer, or cloud synchronization.
- Event ordering is chronological by authored ISO timestamp and then id; trustworthy clock provenance is not part of this spike.
- The renderer describes current semantic state. It cannot infer whether an online state was just activated or restored without transition context.
- The IndexedDB smoke check used `fake-indexeddb`; real browser persistence, storage denial, blocked upgrades, and accessibility behavior belong to Workstream D.

## Verification at handoff

- Isolated strict TypeScript check over `src/truth`, `src/case`, and `src/evidence`: passed.
- Runtime smoke covering all seven First Contact task kinds, failed-run event suppression, and stable event identity: passed through Vite module loading.
- Runtime smoke covering pure/idempotent Case transition, reduced-motion projection, memory-store duplicate append, IndexedDB duplicate append, close/reopen/resume, human-readable export, and full reset: passed with `fake-indexeddb`.
- Workstream D contract suites `tests/unit/truth-case.test.ts` and `tests/unit/evidence.test.ts`: 13 tests passed.
- Workstream D mission integration suite `tests/unit/mission.test.ts`: 6 tests passed, including the evaluator in the complete happy path and deterministic failure gate.
- Full `npm test`: 23 of 24 tests passed. The only failure is outside this write set: root-owned `nextSourceRevision(Number.MAX_SAFE_INTEGER)` currently returns an unsafe value while `tests/unit/contracts.test.ts` expects a `RangeError`.
- Whole-spike `npm run typecheck`: currently blocked by three disjoint Workstream A errors in `src/execution/runtime-status.ts`, `src/execution/pyodide-runtime.ts`, and `src/execution/scripted-runtime.ts`. No Workstream C type errors appeared, and the isolated strict check passes.
- Focused ESLint invocation cannot start because the pinned ESLint stack rejects the root-owned TypeScript 7.0.2 version. No config or dependency was changed from this lane.
