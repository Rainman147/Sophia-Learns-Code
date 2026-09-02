import type { NormalizedExecutionError } from "@/src/contracts";

const UNMATCHED_QUOTE_PATTERN =
  /unterminated (?:triple-quoted )?string literal|eol while scanning string literal/i;

function errorText(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }

  return typeof error === "string" ? error : "Unknown execution failure";
}

function sourceLine(error: string): number | undefined {
  const detectedLine = /detected at line (\d+)/i.exec(error)?.[1];
  const tracebackLine = /\bline (\d+)\b/i.exec(error)?.[1];
  const line = Number(detectedLine ?? tracebackLine);
  return Number.isSafeInteger(line) && line > 0 ? line : undefined;
}

function exceptionType(error: string): string | undefined {
  return /(?:^|\n)([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception)):/m.exec(error)?.[1];
}

export function createPolicyError(message: string): NormalizedExecutionError {
  return {
    category: "policy",
    code: "source-policy-rejected",
    message,
    learnerMessage:
      "This First Contact spike runs only one or two print statements containing text. Imports, files, networking, packages, and other Python features stay unavailable here.",
  };
}

export function createWorkerFailureError(message: string): NormalizedExecutionError {
  return {
    category: "internal",
    code: "worker-failure",
    message,
    learnerMessage:
      "The Python workspace could not finish that run. Your code is still here, and the workspace can be reset safely.",
  };
}

export function createOutputLimitError(maximumBytes: number): NormalizedExecutionError {
  return {
    category: "runtime",
    code: "output-limit",
    message: `Execution output exceeded the ${maximumBytes}-byte request limit.`,
    learnerMessage:
      "That run produced more output than this small workspace allows. Shorten the printed message, then run it again.",
  };
}

export function createUnmatchedQuoteError(rawMessage: string, line = 1): NormalizedExecutionError {
  return {
    category: "syntax",
    code: "unmatched-quote",
    message: rawMessage,
    learnerMessage:
      "Python found an opening quotation mark without a matching closing quotation mark. Add the closing quote, then run again.",
    line,
    exceptionType: "SyntaxError",
  };
}

export function normalizeExecutionError(error: unknown): NormalizedExecutionError {
  const message = errorText(error);
  const line = sourceLine(message);
  const type = exceptionType(message);

  if (UNMATCHED_QUOTE_PATTERN.test(message)) {
    return createUnmatchedQuoteError(message, line ?? 1);
  }

  if (type === "SyntaxError" || /\bSyntaxError\b/.test(message)) {
    return {
      category: "syntax",
      code: "syntax-error",
      message,
      learnerMessage:
        "Python could not read that instruction yet. Check the punctuation around the print statement, then try again.",
      ...(line === undefined ? {} : { line }),
      exceptionType: type ?? "SyntaxError",
    };
  }

  return {
    category: "runtime",
    code: "runtime-error",
    message,
    learnerMessage:
      "Python read the instruction but could not complete it. The error details are preserved as evidence for the next change.",
    ...(line === undefined ? {} : { line }),
    ...(type === undefined ? {} : { exceptionType: type }),
  };
}

export function executionErrorText(error: unknown): string {
  return errorText(error);
}
