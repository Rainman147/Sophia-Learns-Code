import { afterEach, describe, expect, it } from "vitest";
import type { ExecutionRuntime, RuntimeStatus } from "../../src/contracts";
import {
  createScriptedExecutionRuntime,
  RUNTIME_CANCELLATION_FIXTURE_SOURCE,
  RUNTIME_CANCELLATION_FIXTURE_TASK_ID,
} from "../../src/execution";
import { runRequest } from "./fixtures";

const runtimes = new Set<ExecutionRuntime>();

function runtime(options: Parameters<typeof createScriptedExecutionRuntime>[0] = {}): ExecutionRuntime {
  const created = createScriptedExecutionRuntime(options);
  runtimes.add(created);
  return created;
}

afterEach(() => {
  for (const activeRuntime of runtimes) activeRuntime.dispose();
  runtimes.clear();
});

async function waitForPhase(
  activeRuntime: ExecutionRuntime,
  phase: RuntimeStatus["phase"],
  timeoutMs = 1_000,
): Promise<void> {
  const startedAt = performance.now();
  while (activeRuntime.getStatus().phase !== phase) {
    if (performance.now() - startedAt > timeoutMs) {
      throw new Error(
        `Runtime did not reach ${phase}; current phase is ${activeRuntime.getStatus().phase}.`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
}

describe("scripted ExecutionRuntime contract", () => {
  it("initializes once, publishes lifecycle status, and executes valid output", async () => {
    const statuses: RuntimeStatus[] = [];
    const activeRuntime = runtime({
      initializeDelayMs: 2,
      statusObserver: (status) => statuses.push(status),
    });
    const subscribed: RuntimeStatus[] = [];
    const unsubscribe = activeRuntime.subscribe((status) => subscribed.push(status));

    const ready = await activeRuntime.initialize();
    const request = runRequest({ sourceRevision: 7 });
    const result = await activeRuntime.run(request);

    expect(ready).toMatchObject({
      phase: "ready",
      runtimeMode: "scripted",
      workerGeneration: 1,
    });
    expect(result).toMatchObject({
      requestId: request.requestId,
      sourceRevision: 7,
      taskId: request.taskId,
      runtimeMode: "scripted",
      status: "success",
      stdout: "Hello, Sophia!\n",
      stderr: "",
      metrics: {
        runtimeVersion: "scripted/1",
        workerGeneration: 1,
        initializedThisRun: false,
      },
    });
    expect(statuses.map((status) => status.phase)).toEqual(
      expect.arrayContaining(["idle", "initializing", "ready", "running"]),
    );
    expect(subscribed[0]?.phase).toBe("idle");
    unsubscribe();
  });

  it("normalizes the unmatched-quote specimen without changing request identity", async () => {
    const activeRuntime = runtime();
    const request = runRequest({
      requestId: "syntax-1",
      taskId: "create-the-clue",
      sourceRevision: 11,
      source: 'print("Case ready)',
    });
    const result = await activeRuntime.run(request);

    expect(result).toMatchObject({
      requestId: "syntax-1",
      sourceRevision: 11,
      taskId: "create-the-clue",
      status: "error",
      stdout: "",
      error: {
        category: "syntax",
        code: "unmatched-quote",
        line: 1,
        exceptionType: "SyntaxError",
      },
    });
    expect(result.stderr).toMatch(/unterminated string literal/i);
    expect(result.error?.learnerMessage).toMatch(/closing quote/i);
  });

  it("rejects an incompatible runtime mode before execution", async () => {
    const activeRuntime = runtime();
    const result = await activeRuntime.run(
      runRequest({ runtimeMode: "pyodide", requestId: "wrong-mode" }),
    );

    expect(result).toMatchObject({
      requestId: "wrong-mode",
      status: "rejected",
      error: {
        category: "policy",
        code: "source-policy-rejected",
      },
    });
    expect(activeRuntime.getStatus().phase).toBe("idle");
  });

  it("bounds output at a UTF-8 boundary and returns an output-limit error", async () => {
    const activeRuntime = runtime();
    const result = await activeRuntime.run(
      runRequest({
        requestId: "bounded-output",
        source: 'print("ééé")',
        maxOutputBytes: 5,
      }),
    );

    expect(result.status).toBe("error");
    expect(result.error?.code).toBe("output-limit");
    expect(new TextEncoder().encode(result.stdout).byteLength).toBeLessThanOrEqual(5);
    expect(result.metrics.outputBytes).toBe(
      new TextEncoder().encode(result.stdout + result.stderr).byteLength,
    );
  });

  it("cancels a non-terminating run, replaces its generation, and recovers", async () => {
    const activeRuntime = runtime({ replacementDelayMs: 2 });
    const running = activeRuntime.run(
      runRequest({
        requestId: "cancel-me",
        taskId: RUNTIME_CANCELLATION_FIXTURE_TASK_ID,
        source: RUNTIME_CANCELLATION_FIXTURE_SOURCE,
        timeoutMs: 1_000,
      }),
    );
    await waitForPhase(activeRuntime, "running");

    const recovery = await activeRuntime.cancel("learner");
    const cancelled = await running;

    expect(cancelled).toMatchObject({
      requestId: "cancel-me",
      status: "cancelled",
      stdout: "",
    });
    expect(recovery).toMatchObject({
      reason: "cancelled",
      terminatedGeneration: 1,
      replacementGeneration: 2,
    });
    expect(activeRuntime.getStatus()).toMatchObject({
      phase: "ready",
      workerGeneration: 2,
    });

    const recovered = await activeRuntime.run(
      runRequest({ requestId: "after-cancel", sourceRevision: 2 }),
    );
    expect(recovered).toMatchObject({
      status: "success",
      stdout: "Hello, Sophia!\n",
      metrics: { workerGeneration: 2 },
    });
  });

  it("times out, returns promptly, and leaves a ready replacement", async () => {
    const activeRuntime = runtime({ replacementDelayMs: 2 });
    const result = await activeRuntime.run(
      runRequest({
        requestId: "timeout-me",
        taskId: RUNTIME_CANCELLATION_FIXTURE_TASK_ID,
        source: RUNTIME_CANCELLATION_FIXTURE_SOURCE,
        timeoutMs: 5,
      }),
    );

    expect(result.status).toBe("timeout");
    expect(result.sourceRevision).toBe(1);
    await waitForPhase(activeRuntime, "ready");
    expect(activeRuntime.getStatus().workerGeneration).toBe(2);
  });

  it("rejects concurrent work and allows valid work after explicit cancellation", async () => {
    const activeRuntime = runtime({ replacementDelayMs: 1 });
    const first = activeRuntime.run(
      runRequest({
        requestId: "single-flight-1",
        taskId: RUNTIME_CANCELLATION_FIXTURE_TASK_ID,
        source: RUNTIME_CANCELLATION_FIXTURE_SOURCE,
        timeoutMs: 1_000,
      }),
    );
    await waitForPhase(activeRuntime, "running");
    const rejected = await activeRuntime.run(
      runRequest({ requestId: "single-flight-2", sourceRevision: 2 }),
    );

    expect(rejected).toMatchObject({
      status: "rejected",
      error: { code: "source-policy-rejected" },
    });
    await activeRuntime.cancel("superseded");
    await expect(first).resolves.toMatchObject({ status: "cancelled" });
    await expect(
      activeRuntime.run(runRequest({ requestId: "single-flight-3", sourceRevision: 3 })),
    ).resolves.toMatchObject({ status: "success" });
  });

  it("reset replaces an idle generation and dispose rejects later execution", async () => {
    const activeRuntime = runtime({ replacementDelayMs: 1 });
    await activeRuntime.initialize();
    const recovery = await activeRuntime.reset();

    expect(recovery).toMatchObject({
      reason: "reset",
      terminatedGeneration: 1,
      replacementGeneration: 2,
    });
    expect(activeRuntime.getStatus()).toMatchObject({
      phase: "ready",
      workerGeneration: 2,
    });

    activeRuntime.dispose();
    expect(activeRuntime.getStatus().phase).toBe("disposed");
    await expect(
      activeRuntime.run(runRequest({ requestId: "after-dispose" })),
    ).resolves.toMatchObject({
      status: "rejected",
      error: { code: "worker-failure" },
    });
  });
});
