import { describe, expect, expectTypeOf, it } from "vitest";
import type { RunRequest, RunResult } from "../../src/contracts";
import {
  EXECUTION_LIMITS,
  isCurrentExecutionResult,
  nextSourceRevision,
} from "../../src/contracts";
import { runRequest, successfulRun, unmatchedQuoteRun } from "./fixtures";

describe("root execution contracts", () => {
  it("keeps every request identity and bound explicit", () => {
    const request = runRequest();

    expectTypeOf(request).toMatchTypeOf<RunRequest>();
    expect(request).toEqual({
      requestId: "request-1",
      missionId: "phase-0.first-contact",
      missionVersion: "spike-1",
      taskId: "first-run",
      runtimeMode: "scripted",
      source: 'print("Hello, Sophia!")',
      sourceRevision: 1,
      timeoutMs: 4_000,
      maxOutputBytes: 16_384,
    });
    expect(request.timeoutMs).toBeLessThanOrEqual(EXECUTION_LIMITS.maximumTimeoutMs);
    expect(new TextEncoder().encode(request.source)).toHaveLength(
      new TextEncoder().encode('print("Hello, Sophia!")').length,
    );
  });

  it("keeps result identity, normalized streams, status, and metrics explicit", () => {
    const result = successfulRun();

    expectTypeOf(result).toMatchTypeOf<RunResult>();
    expect(result.requestId).toBe("request-1");
    expect(result.sourceRevision).toBe(1);
    expect(result.taskId).toBe("first-run");
    expect(result.runtimeMode).toBe("scripted");
    expect(result.status).toBe("success");
    expect(result.stdout).toBe("Hello, Sophia!\n");
    expect(result.stderr).toBe("");
    expect(result.metrics.outputBytes).toBeGreaterThan(0);
  });

  it("represents the authored syntax clue as a normalized error", () => {
    const result = unmatchedQuoteRun();

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({
      category: "syntax",
      code: "unmatched-quote",
      line: 1,
      exceptionType: "SyntaxError",
    });
    expect(result.error?.learnerMessage).toMatch(/quotation mark/i);
  });

  it("accepts only the result for the currently edited source revision", () => {
    const result = successfulRun({ sourceRevision: 7 });

    expect(isCurrentExecutionResult(result, 7)).toBe(true);
    expect(isCurrentExecutionResult(result, 8)).toBe(false);
  });

  it("increments non-negative safe revisions and rejects invalid counters", () => {
    expect(nextSourceRevision(0)).toBe(1);
    expect(nextSourceRevision(41)).toBe(42);
    expect(() => nextSourceRevision(-1)).toThrow(RangeError);
    expect(() => nextSourceRevision(Number.MAX_SAFE_INTEGER)).toThrow(RangeError);
    expect(() => nextSourceRevision(0.5)).toThrow(RangeError);
  });
});
