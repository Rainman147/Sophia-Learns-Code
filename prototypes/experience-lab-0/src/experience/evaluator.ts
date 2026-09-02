import type { PrototypeExecution } from "./model";

const PRINT_LINE = /^\s*print\(\s*(["'])(.*?)\1\s*\)\s*$/;

export function evaluatePrototypeSource(source: string): PrototypeExecution {
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      status: "error",
      output: [],
      errorCode: "empty-source",
      message: "The scripted evaluator did not receive a line to inspect.",
    };
  }

  const doubleQuotes = [...source].filter((character) => character === '"').length;
  const singleQuotes = [...source].filter((character) => character === "'").length;

  if (doubleQuotes % 2 !== 0 || singleQuotes % 2 !== 0) {
    return {
      status: "error",
      output: [],
      errorCode: "unmatched-quote",
      message: "Unmatched quotation mark detected.",
    };
  }

  const output: string[] = [];
  for (const line of lines) {
    const match = line.match(PRINT_LINE);
    if (!match) {
      return {
        status: "error",
        output: [],
        errorCode: "unsupported-source",
        message:
          "This bounded prototype recognizes simple print calls only. It is not a Python runtime.",
      };
    }
    output.push(match[2]);
  }

  return { status: "success", output };
}
