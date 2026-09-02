import { expect, type Locator, type Page } from "@playwright/test";

export type Variant = "direct" | "operations";
export type Runtime = "scripted" | "pyodide";

export const AUTHORED_STAGE_SEQUENCE = [
  "briefing",
  "first-run",
  "first-result",
  "personalize",
  "personalize-result",
  "prediction",
  "trace",
  "create-error",
  "error-feedback",
  "repair",
  "repair-result",
  "field-test",
  "field-result",
  "debrief",
  "reward",
  "complete",
] as const;

export interface CompletedMissionObservation {
  readonly variant: Variant;
  readonly stages: readonly string[];
  readonly objectiveHeadings: readonly string[];
  readonly firstOutput: string;
  readonly personalizedOutput: string;
  readonly errorFeedback: string;
  readonly rewardText: string;
  readonly boundaryText: string;
}

export function shell(page: Page): Locator {
  return page.getByTestId("mission-shell");
}

export function editor(page: Page): Locator {
  return page.getByRole("textbox", { name: /Investigation Console Python editor/i });
}

export function output(page: Page): Locator {
  return page.getByTestId("console-output");
}

export function runtimeStatus(page: Page): Locator {
  return page.getByTestId("runtime-status");
}

export function stageUrl(
  variant: Variant,
  runtime: Runtime = "scripted",
  parameters: Readonly<Record<string, string>> = {},
): string {
  const search = new URLSearchParams({ runtime, ...parameters });
  return `/${variant}/?${search.toString()}`;
}

export async function expectStage(
  page: Page,
  stage: string,
  timeout = 10_000,
): Promise<void> {
  await expect(shell(page)).toHaveAttribute("data-stage", stage, { timeout });
}

export async function currentSource(page: Page): Promise<string> {
  return (await editor(page).textContent()) ?? "";
}

export async function setSource(page: Page, source: string): Promise<void> {
  const code = editor(page);
  await code.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.insertText(source);
  await expect(code).toHaveText(source);
}

export async function openMission(
  page: Page,
  variant: Variant,
  runtime: Runtime = "scripted",
  parameters: Readonly<Record<string, string>> = {},
): Promise<void> {
  await page.goto(stageUrl(variant, runtime, parameters), { waitUntil: "domcontentloaded" });

  if (variant === "operations") {
    await expect(page.getByRole("heading", { name: "Operations Center" })).toBeVisible();
    await page.getByRole("button", { name: /Begin First Contact|Resume First Contact/i }).click();
  }

  await expect(shell(page)).toBeVisible();
  await expect(shell(page)).toHaveAttribute("data-variant", variant);
  await expect(shell(page)).toHaveAttribute("data-runtime-mode", runtime);
  await expectStage(page, "briefing");
  await expect(page.getByRole("heading", { name: /Mission 001 · First Contact/i })).toBeVisible();
}

async function recordStage(
  page: Page,
  stages: string[],
  objectiveHeadings: string[],
  expectedStage: string,
): Promise<void> {
  await expectStage(page, expectedStage);
  stages.push(expectedStage);
  const heading = page.locator("#current-objective-heading");
  if (await heading.count()) objectiveHeadings.push((await heading.innerText()).trim());
}

async function clickRun(page: Page): Promise<void> {
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
}

async function clickContinue(page: Page): Promise<void> {
  await page.getByRole("button", { name: /^Continue$/i }).click();
}

export async function completeFirstContact(
  page: Page,
  variant: Variant,
): Promise<CompletedMissionObservation> {
  const stages: string[] = [];
  const objectiveHeadings: string[] = [];

  await openMission(page, variant, "scripted");
  await recordStage(page, stages, objectiveHeadings, "briefing");
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();

  await recordStage(page, stages, objectiveHeadings, "first-run");
  const starter = await currentSource(page);
  expect(starter).toContain('print("Hello, Sophia!")');
  await clickRun(page);
  await recordStage(page, stages, objectiveHeadings, "first-result");
  await expect(output(page)).toContainText("Hello, Sophia!");
  expect(await currentSource(page)).toBe(starter);
  const firstOutput = (await output(page).innerText()).trim();
  const firstResultRevision = await shell(page).getAttribute("data-source-revision");
  if (firstResultRevision === null) {
    throw new Error("Mission shell did not expose the current source revision.");
  }
  await expect(output(page)).toHaveAttribute(
    "data-source-revision",
    firstResultRevision,
  );
  await clickContinue(page);

  await recordStage(page, stages, objectiveHeadings, "personalize");
  await setSource(page, 'print("Signal personalized")');
  await clickRun(page);
  await recordStage(page, stages, objectiveHeadings, "personalize-result");
  await expect(output(page)).toContainText("Signal personalized");
  const personalizedOutput = (await output(page).innerText()).trim();
  await clickContinue(page);

  await recordStage(page, stages, objectiveHeadings, "prediction");
  await page.getByRole("radio", { name: /Two lines.*Console online.*first/i }).check();
  await page.getByRole("button", { name: "Lock prediction" }).click();

  await recordStage(page, stages, objectiveHeadings, "trace");
  const traceStatus = page.getByText(/Step 0 of 2|Ready\. No source line has executed/i).first();
  await expect(traceStatus).toBeVisible();
  await page.getByRole("button", { name: "Step forward" }).click();
  await expect(page.getByText(/Step 1 of 2\. Python reads line 1/i)).toBeVisible();
  await page.getByRole("button", { name: "Step forward" }).click();
  await expect(page.getByText(/Step 2 of 2\. Python reads line 2/i)).toBeVisible();
  await page
    .getByRole("button", { name: /Continue to the controlled clue/i })
    .click();

  await recordStage(page, stages, objectiveHeadings, "create-error");
  const brokenSource = await currentSource(page);
  expect(brokenSource).toContain('print("Case ready)');
  await clickRun(page);
  await recordStage(page, stages, objectiveHeadings, "error-feedback");
  await expect(
    page.getByText(/opening quotation mark without a matching closing quotation mark/i).first(),
  ).toBeVisible();
  await expect(page.getByTestId("feedback-packet")).toContainText(/Goal|Observed|Clue|Next action/);
  expect(await currentSource(page)).toBe(brokenSource);
  const errorFeedback = (await page.getByTestId("feedback-packet").innerText()).trim();
  await clickContinue(page);

  await recordStage(page, stages, objectiveHeadings, "repair");
  expect(await currentSource(page)).toBe(brokenSource);
  await setSource(page, 'print("Case ready")');
  await clickRun(page);
  await recordStage(page, stages, objectiveHeadings, "repair-result");
  await expect(output(page)).toContainText("Case ready");
  await clickContinue(page);

  await recordStage(page, stages, objectiveHeadings, "field-test");
  await setSource(page, 'print("Investigation started")');
  await clickRun(page);
  await recordStage(page, stages, objectiveHeadings, "field-result");
  await expect(output(page)).toContainText("Investigation started");
  await expect(page.getByText(/independent/i).first()).toBeVisible();
  await clickContinue(page);

  await recordStage(page, stages, objectiveHeadings, "debrief");
  await clickContinue(page);
  await recordStage(page, stages, objectiveHeadings, "reward");
  const reward = page.getByTestId("reward-panel");
  await expect(reward).toContainText("First Python signal");
  const rewardText = (await reward.innerText()).trim();
  await clickContinue(page);
  stages.push("complete");

  let boundary: Locator;
  if (variant === "direct") {
    boundary = page.getByTestId("direct-completion");
    await expect(boundary).toContainText("Investigation Console is online");
  } else {
    boundary = page.getByTestId("operations-center");
    await expect(boundary).toHaveAttribute("data-state", "after");
    await expect(boundary).toContainText("Signal verified");
  }

  return {
    variant,
    stages,
    objectiveHeadings,
    firstOutput,
    personalizedOutput,
    errorFeedback,
    rewardText,
    boundaryText: (await boundary.innerText()).trim(),
  };
}
