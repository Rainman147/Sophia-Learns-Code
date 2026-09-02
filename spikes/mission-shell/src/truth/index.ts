import type {
  CaseEvent,
  EvaluationOutcome,
  MissionEvaluator,
  TaskResult,
} from "../contracts/case";
import type { RunResult } from "../contracts/execution";
import type {
  MissionDefinition,
  MissionTaskDefinition,
  MissionTaskKind,
} from "../contracts/mission";
import type { IsoTimestamp } from "../contracts/shared";

export interface MissionEvaluatorOptions {
  readonly now?: () => IsoTimestamp;
}

type EvaluationRuleResult = Pick<
  TaskResult,
  "passed" | "feedbackCode" | "goal" | "clue" | "nextAction"
>;

const EVIDENCE_LEVEL_BY_KIND: Readonly<
  Record<MissionTaskKind, TaskResult["evidenceLevel"]>
> = {
  run: "introduced",
  personalize: "guided",
  predict: "introduced",
  trace: "guided",
  break: "guided",
  repair: "guided",
  "field-test": "independent",
};

const OUTPUT_PREVIEW_LIMIT = 240;

export function createMissionEvaluator(
  options: MissionEvaluatorOptions = {},
): MissionEvaluator {
  const now = options.now ?? (() => new Date().toISOString());

  return {
    evaluate(definition, taskId, result) {
      const task = definition.tasks.find((candidate) => candidate.id === taskId);

      if (!task) {
        throw new RangeError(
          `Mission ${definition.id} does not define task ${taskId}.`,
        );
      }

      const ruleResult = evaluateTask(definition, task, result);
      const taskResult: TaskResult = {
        taskId: task.id,
        passed: ruleResult.passed,
        evidenceLevel: EVIDENCE_LEVEL_BY_KIND[task.kind],
        feedbackCode: ruleResult.feedbackCode,
        goal: ruleResult.goal,
        observed: describeObservedResult(result),
        clue: ruleResult.clue,
        nextAction: ruleResult.nextAction,
      };

      return {
        taskResult,
        caseEvents: createCaseEvents(definition, task, result, taskResult, now),
      } satisfies EvaluationOutcome;
    },
  };
}

function evaluateTask(
  definition: MissionDefinition,
  task: MissionTaskDefinition,
  result: RunResult,
): EvaluationRuleResult {
  if (result.taskId !== task.id) {
    return incomplete(
      `Use the execution result for ${task.title}.`,
      `The result belongs to task ${result.taskId}, not ${task.id}.`,
      "Run this task again before continuing.",
    );
  }

  switch (task.kind) {
    case "run":
      return evaluateExactOutput(
        result,
        task.expectedStdout,
        "Run the starter program and verify its exact console message.",
      );
    case "personalize":
      return evaluatePersonalizedOutput(definition, result);
    case "predict":
      return evaluateStaticPrintTask(
        task,
        result,
        "Reveal two output lines with Console online first.",
      );
    case "trace":
      return evaluateStaticPrintTask(
        task,
        result,
        "Complete the two-line trace in source order.",
      );
    case "break":
      return evaluateExpectedError(task, result);
    case "repair":
      return evaluateExactOutput(
        result,
        task.expectedStdout,
        "Repair the unmatched quote and print Case ready exactly.",
      );
    case "field-test":
      return evaluateExactOutput(
        result,
        task.expectedStdout,
        "Independently print Investigation started exactly once.",
      );
    default:
      return assertNever(task.kind);
  }
}

function evaluateExactOutput(
  result: RunResult,
  expectedStdout: string | undefined,
  goal: string,
): EvaluationRuleResult {
  if (result.status !== "success") {
    return failedExecution(result, goal);
  }

  if (expectedStdout === undefined) {
    return incomplete(
      goal,
      "This task has no authored expected output.",
      "Ask the mission author to supply a deterministic expectedStdout value.",
    );
  }

  if (normalizeLineEndings(result.stdout) !== normalizeLineEndings(expectedStdout)) {
    return mismatch(
      goal,
      `Expected ${formatOutput(expectedStdout)}, but the console produced ${formatOutput(result.stdout)}.`,
      "Adjust the text passed to print, then run again.",
    );
  }

  return passed(
    goal,
    "The successful execution produced the authored console output exactly.",
  );
}

function evaluatePersonalizedOutput(
  definition: MissionDefinition,
  result: RunResult,
): EvaluationRuleResult {
  const goal =
    "Produce exactly one non-empty output line that differs from the starter greeting.";

  if (result.status !== "success") {
    return failedExecution(result, goal);
  }

  const stdout = normalizeLineEndings(result.stdout);
  const firstRunOutput = definition.tasks.find(
    (task) => task.kind === "run" && task.expectedStdout !== undefined,
  )?.expectedStdout;
  const starterOutput = firstRunOutput
    ? normalizeLineEndings(firstRunOutput)
    : staticPrintOutput(definition.starterSource);
  const outputWithoutFinalNewline = stdout.endsWith("\n")
    ? stdout.slice(0, -1)
    : stdout;
  const isOneTerminatedLine =
    stdout.endsWith("\n") &&
    !outputWithoutFinalNewline.includes("\n") &&
    outputWithoutFinalNewline.trim().length > 0;

  if (!isOneTerminatedLine) {
    return mismatch(
      goal,
      "The console must contain exactly one non-empty line followed by its newline.",
      "Keep one print call and put a non-empty message between its quotation marks.",
    );
  }

  if (starterOutput !== undefined && stdout === starterOutput) {
    return mismatch(
      goal,
      "The output still matches the starter greeting.",
      "Change the message between the quotation marks, then run again.",
    );
  }

  return passed(
    goal,
    "The program produced one non-empty line different from the starter greeting.",
  );
}

function evaluateStaticPrintTask(
  task: MissionTaskDefinition,
  result: RunResult,
  goal: string,
): EvaluationRuleResult {
  if (result.status !== "success") {
    return failedExecution(result, goal);
  }

  const expectedOutput = task.expectedStdout ?? staticPrintOutput(task.source);

  if (expectedOutput === undefined) {
    return incomplete(
      goal,
      "The authored source is not a supported static print-only specimen.",
      "Provide deterministic expectedStdout for this task before evaluating it.",
    );
  }

  if (normalizeLineEndings(result.stdout) !== normalizeLineEndings(expectedOutput)) {
    return mismatch(
      goal,
      `Expected ${formatOutput(expectedOutput)}, but observed ${formatOutput(result.stdout)}.`,
      "Inspect the two lines in source order and try the task again.",
    );
  }

  return passed(
    goal,
    "The normalized result preserves the authored top-to-bottom output order.",
  );
}

function evaluateExpectedError(
  task: MissionTaskDefinition,
  result: RunResult,
): EvaluationRuleResult {
  const goal = "Produce and inspect the authored unmatched-quote clue.";

  if (task.expectedErrorCode === undefined) {
    return incomplete(
      goal,
      "This controlled-error task has no authored expected error code.",
      "Ask the mission author to supply expectedErrorCode before evaluating it.",
    );
  }

  if (
    result.status === "error" &&
    result.error?.code === task.expectedErrorCode
  ) {
    return {
      passed: true,
      feedbackCode: "unmatched-quote",
      goal,
      clue: "Python reported the intended missing closing quotation mark.",
      nextAction: "Use the clue to restore the matching quotation mark.",
    };
  }

  if (result.status === "success") {
    return mismatch(
      goal,
      "The program completed, so the intended syntax clue was not created.",
      "Remove only the final quotation mark and run again.",
    );
  }

  return failedExecution(result, goal);
}

function failedExecution(
  result: RunResult,
  goal: string,
): EvaluationRuleResult {
  if (result.error?.code === "unmatched-quote") {
    return {
      passed: false,
      feedbackCode: "unmatched-quote",
      goal,
      clue: result.error.learnerMessage,
      nextAction: "Find the quotation mark without a matching partner, repair it, and run again.",
    };
  }

  return incomplete(
    goal,
    result.error?.learnerMessage ??
      `Execution ended with status ${result.status} before the task could be verified.`,
    "Recover the runtime if needed, preserve the source, and run this task again.",
  );
}

function passed(goal: string, clue: string): EvaluationRuleResult {
  return {
    passed: true,
    feedbackCode: "runtime-success",
    goal,
    clue,
    nextAction: "Continue to the next mission step.",
  };
}

function mismatch(
  goal: string,
  clue: string,
  nextAction: string,
): EvaluationRuleResult {
  return {
    passed: false,
    feedbackCode: "output-mismatch",
    goal,
    clue,
    nextAction,
  };
}

function incomplete(
  goal: string,
  clue: string,
  nextAction: string,
): EvaluationRuleResult {
  return {
    passed: false,
    feedbackCode: "execution-incomplete",
    goal,
    clue,
    nextAction,
  };
}

function createCaseEvents(
  definition: MissionDefinition,
  task: MissionTaskDefinition,
  result: RunResult,
  taskResult: TaskResult,
  now: () => IsoTimestamp,
): readonly CaseEvent[] {
  if (
    task.kind !== "run" ||
    !taskResult.passed ||
    result.status !== "success" ||
    result.taskId !== task.id
  ) {
    return [];
  }

  return [
    {
      id: [
        "case-event-v1",
        "console_activated",
        definition.id,
        definition.version,
        task.id,
      ].join(":"),
      type: "console_activated",
      occurredAt: now(),
      missionId: definition.id,
      taskId: task.id,
      sourceRevision: result.sourceRevision,
      message: "Investigation Console online. First verified Python result received.",
    },
  ];
}

function staticPrintOutput(source: string): string | undefined {
  const normalizedSource = normalizeLineEndings(source).replace(/\n$/, "");

  if (normalizedSource.length === 0) {
    return undefined;
  }

  const output: string[] = [];

  for (const line of normalizedSource.split("\n")) {
    const match = /^\s*print\((['"])([^'"\\]*)\1\)\s*$/.exec(line);

    if (!match || match[2] === undefined) {
      return undefined;
    }

    output.push(match[2]);
  }

  return `${output.join("\n")}\n`;
}

function describeObservedResult(result: RunResult): string {
  const output = normalizeLineEndings(result.stdout);

  if (result.status === "success") {
    return output.length === 0
      ? "Execution succeeded with no console output."
      : `Execution succeeded with stdout ${formatOutput(output)}.`;
  }

  if (result.error) {
    return `Execution ended with ${result.status}: ${truncate(result.error.learnerMessage)} (${result.error.code}).`;
  }

  return `Execution ended with ${result.status} and no normalized error detail.`;
}

function formatOutput(output: string): string {
  return truncate(JSON.stringify(normalizeLineEndings(output)));
}

function truncate(value: string): string {
  if (value.length <= OUTPUT_PREVIEW_LIMIT) {
    return value;
  }

  return `${value.slice(0, OUTPUT_PREVIEW_LIMIT - 1)}…`;
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}

function assertNever(value: never): never {
  throw new Error(`Unsupported mission task kind: ${String(value)}`);
}
