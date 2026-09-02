import {
  EXECUTION_LIMITS,
  type NormalizedExecutionError,
  type RunRequest,
  type RuntimeMode,
} from "@/src/contracts";

import {
  RUNTIME_CANCELLATION_FIXTURE_SOURCE,
  RUNTIME_CANCELLATION_FIXTURE_TASK_ID,
} from "./constants";
import { createPolicyError } from "./errors";
import { utf8ByteLength } from "./output";

const MAXIMUM_ID_LENGTH = 256;
const MAXIMUM_PRINT_STATEMENTS = 2;

type SourcePolicyResult =
  | { readonly accepted: true; readonly kind: "print-program"; readonly scriptedStdout: string }
  | { readonly accepted: true; readonly kind: "syntax-candidate" }
  | { readonly accepted: true; readonly kind: "cancellation-fixture" }
  | { readonly accepted: false; readonly error: NormalizedExecutionError };

type PrintLineResult =
  | { readonly kind: "valid"; readonly value: string }
  | { readonly kind: "unmatched-quote" }
  | { readonly kind: "invalid" };

function invalid(message: string): SourcePolicyResult {
  return { accepted: false, error: createPolicyError(message) };
}

function validIdentifier(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= MAXIMUM_ID_LENGTH;
}

function skipHorizontalWhitespace(line: string, start: number): number {
  let position = start;
  while (line[position] === " " || line[position] === "\t") {
    position += 1;
  }
  return position;
}

function parsePrintLine(line: string): PrintLineResult {
  let position = skipHorizontalWhitespace(line, 0);

  if (!line.startsWith("print", position)) {
    return { kind: "invalid" };
  }
  position += "print".length;
  position = skipHorizontalWhitespace(line, position);

  if (line[position] !== "(") {
    return { kind: "invalid" };
  }
  position += 1;
  position = skipHorizontalWhitespace(line, position);

  const quote = line[position];
  if (quote !== '"' && quote !== "'") {
    return { kind: "invalid" };
  }
  position += 1;

  let value = "";
  while (position < line.length) {
    const character = line[position];

    if (character === quote) {
      position += 1;
      position = skipHorizontalWhitespace(line, position);
      if (line[position] !== ")") {
        return { kind: "invalid" };
      }
      position += 1;
      position = skipHorizontalWhitespace(line, position);
      return position === line.length ? { kind: "valid", value } : { kind: "invalid" };
    }

    if (character === "\\") {
      const escaped = line[position + 1];
      if (escaped === undefined) {
        return { kind: "invalid" };
      }

      const escapes: Readonly<Record<string, string>> = {
        "\\": "\\",
        '"': '"',
        "'": "'",
        n: "\n",
        r: "\r",
        t: "\t",
      };
      const decoded = escapes[escaped];
      if (decoded === undefined) {
        return { kind: "invalid" };
      }
      value += decoded;
      position += 2;
      continue;
    }

    if (character === undefined || character.charCodeAt(0) === 0) {
      return { kind: "invalid" };
    }

    value += character;
    position += 1;
  }

  return { kind: "unmatched-quote" };
}

function isCancellationFixture(request: RunRequest): boolean {
  return (
    request.taskId === RUNTIME_CANCELLATION_FIXTURE_TASK_ID &&
    (request.source === RUNTIME_CANCELLATION_FIXTURE_SOURCE ||
      request.source === `${RUNTIME_CANCELLATION_FIXTURE_SOURCE}\n` ||
      request.source === `${RUNTIME_CANCELLATION_FIXTURE_SOURCE}\r\n`)
  );
}

export function validateRunRequest(
  request: RunRequest,
  expectedRuntimeMode: RuntimeMode,
): SourcePolicyResult {
  if (
    !validIdentifier(request.requestId) ||
    !validIdentifier(request.missionId) ||
    !validIdentifier(request.missionVersion) ||
    !validIdentifier(request.taskId)
  ) {
    return invalid("Execution identifiers must be non-empty strings of at most 256 characters.");
  }

  if (!Number.isSafeInteger(request.sourceRevision) || request.sourceRevision < 0) {
    return invalid("Source revision must be a non-negative safe integer.");
  }

  if (request.runtimeMode !== expectedRuntimeMode) {
    return invalid(
      `The ${expectedRuntimeMode} runtime cannot execute a ${String(request.runtimeMode)} request.`,
    );
  }

  if (
    !Number.isSafeInteger(request.timeoutMs) ||
    request.timeoutMs <= 0 ||
    request.timeoutMs > EXECUTION_LIMITS.maximumTimeoutMs
  ) {
    return invalid(
      `Timeout must be between 1 and ${EXECUTION_LIMITS.maximumTimeoutMs} milliseconds.`,
    );
  }

  if (
    !Number.isSafeInteger(request.maxOutputBytes) ||
    request.maxOutputBytes <= 0 ||
    request.maxOutputBytes > EXECUTION_LIMITS.maxOutputBytes
  ) {
    return invalid(
      `Output limit must be between 1 and ${EXECUTION_LIMITS.maxOutputBytes} bytes.`,
    );
  }

  if (typeof request.source !== "string") {
    return invalid("Source must be text.");
  }

  const sourceBytes = utf8ByteLength(request.source);
  if (sourceBytes > EXECUTION_LIMITS.maximumSourceBytes) {
    return invalid(
      `Source is ${sourceBytes} bytes; the spike limit is ${EXECUTION_LIMITS.maximumSourceBytes} bytes.`,
    );
  }

  if (isCancellationFixture(request)) {
    return { accepted: true, kind: "cancellation-fixture" };
  }

  const lines = request.source.replaceAll("\r\n", "\n").split("\n");
  if (lines.at(-1) === "") {
    lines.pop();
  }

  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0 || nonEmptyLines.length > MAXIMUM_PRINT_STATEMENTS) {
    return invalid(`The First Contact subset permits one or two print statements.`);
  }

  const parsedLines = nonEmptyLines.map(parsePrintLine);
  if (parsedLines.some((line) => line.kind === "invalid")) {
    return invalid("Source is outside the literal-string print subset.");
  }

  if (parsedLines.some((line) => line.kind === "unmatched-quote")) {
    return { accepted: true, kind: "syntax-candidate" };
  }

  const scriptedStdout = parsedLines
    .map((line) => (line.kind === "valid" ? `${line.value}\n` : ""))
    .join("");
  return { accepted: true, kind: "print-program", scriptedStdout };
}
