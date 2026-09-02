import { describe, expect, it } from "vitest";
import { evaluatePrototypeSource } from "../src/experience/evaluator";

describe("bounded evaluator", () => {
  it("preserves source revision and exact multi-line output", () => {
    expect(
      evaluatePrototypeSource('print("one")\nprint("two")', 7),
    ).toEqual({
      status: "success",
      output: ["one", "two"],
      sourceRevision: 7,
    });
  });

  it("normalizes the authored unmatched quotation mark", () => {
    expect(evaluatePrototypeSource('print("Case folder ready)', 3)).toMatchObject({
      status: "error",
      output: [],
      errorCode: "unmatched-quote",
      sourceRevision: 3,
    });
  });
});
