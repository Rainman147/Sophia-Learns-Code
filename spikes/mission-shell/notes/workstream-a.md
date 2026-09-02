# Workstream A: Python execution and recovery

## Scope and contract

- Base contract commit: `f176e8dc36cb0e0c70fd6d96844a3ec9e098c7b1`.
- Implemented only under `src/execution/**` plus the bounded asset-copy script and this note.
- The implementation imports `RunRequest`, `RunResult`, `RuntimeStatus`, `RuntimeRecovery`, limits, and `ExecutionRuntime` from the root-owned contracts. `protocol.ts` derives worker payloads from those types; it does not introduce a competing public execution contract.
- The facade exports `createPyodideExecutionRuntime` and `createScriptedExecutionRuntime` from `src/execution/index.ts`.

## Implemented behavior

### Real runtime

- Creates only a module Web Worker via `new Worker(new URL(...), { type: "module" })`; Pyodide never runs on the UI thread.
- Loads pinned Pyodide `314.0.6` from root-relative `/pyodide/` assets and verifies the module and initialized runtime versions.
- Captures bounded stdout and stderr at UTF-8 code-point boundaries.
- Preserves request ID, task ID, runtime mode, and exact source revision on every result, including rejection, syntax failure, timeout, cancellation, and worker failure.
- Normalizes Python's unterminated-string `SyntaxError` to the contract's calm `unmatched-quote` result. Other syntax, runtime, policy, output-limit, and worker errors remain distinct.
- Terminates the worker for cancellation and timeout, resolves the interrupted request as `cancelled` or `timeout`, starts a new generation, and allows a later valid run. `reset()` performs the same replacement deliberately. There is no claim of in-process Python cancellation.
- Treats a protocol identity mismatch, malformed metrics, worker error, or message decode error as a worker failure and replaces the worker.
- Uses one active run per worker. A concurrent run is rejected truthfully instead of being silently queued or executed against ambiguous state.

### Source policy

The facade and worker independently enforce the same intentionally tiny policy:

- one or two `print(...)` statements;
- one literal string argument per statement;
- only a small, explicit escape set (`\\`, escaped quotes, `\n`, `\r`, `\t`);
- no imports, names, attribute access, additional arguments, comments, semicolons outside the literal, package loading, files, JavaScript bridge access, or learner-controlled networking;
- maximum source, output, and execution-time values from the root contract; and
- the exact `while True: pass` source only when `taskId` is `runtime-cancellation-fixture`, solely so termination can be tested.

The unmatched-quote specimen is admitted as a safe syntax candidate so real Python can produce the error. A second non-print line still causes policy rejection, so the syntax exception cannot be used to append executable code.

This whitelist is suitable only for this spike. A Web Worker and empty `jsglobals` reduce exposure but do not turn unrestricted Pyodide into a security boundary.

### Scripted runtime

- Mirrors the same contract, policy, lifecycle phases, generation replacement, cancellation, timeout, reset, output bounding, normalized error, and identity propagation without loading Python.
- Accepts a fixed delay or a deterministic per-request delay function. The shell can edit to a newer source revision while an older delayed request is pending and verify stale-result rejection at the integration layer.
- Leaves the stale/current decision outside execution; the runtime faithfully returns the submitted revision.

## Timing and observation

`RunResult.metrics` records:

- worker generation and runtime version;
- whether initialization occurred while that run was waiting;
- cold `initializeMs` when the first run initializes lazily;
- facade `queueMs` (including a cold wait);
- worker `executeMs`;
- end-to-end `totalMs`; and
- combined UTF-8 output bytes.

`RuntimeRecovery` records terminated and replacement generations plus replacement-ready time. `getStatus()`, `subscribe()`, and the optional read-only `statusObserver` expose lifecycle and generation changes. If the caller explicitly prewarms with `initialize()`, cold time must be measured around that call because the root `RuntimeStatus` contract has no timing field; later runs correctly report `initializedThisRun: false`.

## Loading and caching approaches

| Approach | Spike support | Tradeoff |
|---|---|---|
| Lazy load on first real run | Implemented by calling `run()` before `initialize()` | Fast useful shell, but the first Run pays the full cold cost and exposes `initializeMs`. |
| Explicit prewarm | Implemented through `initialize()` | Can move cold cost after the interface is useful; measure externally because status has no timing field. |
| Reuse one warm worker | Implemented | Lowest repeat latency; memory remains resident until reset, recovery, or dispose. |
| Terminate and replace | Implemented for timeout, cancellation, reset, and worker failure | Truthful recovery and bounded poisoned state; pays another cold load and discards Python state. |
| Browser HTTP cache of same-origin static assets | Compatible, not measured here | Avoids another network transfer when headers permit, but each replacement still instantiates Wasm and Python. Development cache headers are not representative. |
| CDN runtime, package auto-loading, service worker, snapshot, or shared worker | Not implemented | Cross-origin supply-chain surface, broader policy, caching complexity, or lifecycle coupling is outside this bounded spike. |

The copy script verifies the installed version and overwrites the five required files without recursively deleting `public/pyodide`. It intentionally does not copy source maps or optional console pages. Versioned/cache-busted output paths and production cache headers remain an architecture-checkpoint concern.

## Observed installed asset sizes

Measured from `node_modules/pyodide` in this checkout before copying:

| Required asset | Bytes |
|---|---:|
| `pyodide.mjs` | 17,931 |
| `pyodide.asm.mjs` | 1,250,344 |
| `pyodide.asm.wasm` | 9,598,218 |
| `python_stdlib.zip` | 2,545,564 |
| `pyodide-lock.json` | 114,440 |
| **Required raw total** | **13,526,497 (12.900 MiB)** |

The full installed package is 13,874,244 bytes (13.232 MiB) across 14 top-level files. Transfer-compressed size, browser cache hits, Wasm compile cache behavior, and resident memory require Workstream D's real-browser measurements.

## Failure and security analysis

| Condition | Returned truth | Worker action |
|---|---|---|
| Source/request policy violation | `rejected`, `source-policy-rejected` | No execution; current worker remains usable. |
| Unmatched quote | `error`, `unmatched-quote`, bounded raw stderr | Worker remains warm. |
| Other Python exception | `error`, normalized syntax/runtime error | Worker remains warm unless the worker itself fails. |
| Output limit | `error`, `output-limit`, UTF-8-safe truncated streams | Worker remains warm. |
| Timeout | `timeout` with original identity | Terminate generation and create replacement. |
| Learner/superseded cancellation | `cancelled` with original identity | Terminate generation and create replacement. |
| Reset | Active run becomes `cancelled`; reset reports `reason: reset` | Terminate generation and create replacement. |
| Worker/protocol failure | `error`, `worker-failure` | Terminate generation and attempt replacement. |
| Missing/mismatched assets, CSP/Wasm block, or initialization failure | Runtime phase `failed`; run receives `worker-failure` | A later initialize/run can make a fresh generation attempt. |

Security posture:

- all runtime files are pinned, local, and version-checked;
- `packages: []`, a local package base, and empty frozen `jsglobals` are supplied;
- source policy blocks Python imports and every path to package, file, JS, or network APIs before execution and is repeated inside the worker;
- source and output are byte-bounded, execution is time-bounded after dispatch, and non-terminating execution is recovered only by worker termination;
- no backend, secrets, analytics, learner data, or production architecture is introduced; and
- deployment still needs a CSP that permits the same-origin module worker and WebAssembly while denying unintended outbound connections. CSP configuration is root-owned and was not changed here.

## Verification and limitations

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npx vitest run tests/unit/execution.test.ts`: 8 tests passed, covering valid output, identity, unmatched quote, policy rejection, UTF-8 output bounds, cancellation/recovery, timeout/replacement, single-flight rejection, reset, and dispose.
- `node --check scripts/copy-pyodide-assets.mjs`: passed.
- Focused `git diff --check`: passed.
- The asset-copy script was syntax-checked but not executed by this workstream because generated `public/pyodide/**` is outside its allowed write set. Root integration must run `npm run runtime:assets` before build/browser tests.
- Workstream A did not add or edit tests. The execution tests were supplied by Workstream D and run read-only.
- Real-browser Pyodide loading, CSP behavior, cold/warm distributions, cancellation latency, replacement latency, cache transfer behavior, memory across repeated runs, and second-device coverage are not claimed here; Workstream D owns those measurements.
- Initialization itself has caller-controlled abort for waiting and explicit `reset()` for worker replacement; the per-request timeout starts after dispatch so a slow first Wasm load is measured rather than repeatedly killed by the learner-code timeout.
- Worker replacement intentionally loses Python heap and filesystem state. That is appropriate for this stateless First Contact subset and must be revisited before any mission relies on runtime-resident state.
