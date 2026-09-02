import { expect, test } from "@playwright/test";
import {
  AUTHORED_STAGE_SEQUENCE,
  completeFirstContact,
  editor,
  expectStage,
  openMission,
  output,
  setSource,
  type Variant,
} from "./mission-shell";

for (const variant of ["direct", "operations"] as const satisfies readonly Variant[]) {
  test(`${variant} completes the matched happy and designed error-recovery path`, async ({ page }) => {
    const observation = await completeFirstContact(page, variant);

    expect(observation.stages).toEqual(AUTHORED_STAGE_SEQUENCE);
    expect(observation.firstOutput).toContain("Hello, Sophia!");
    expect(observation.personalizedOutput).toContain("Signal personalized");
    expect(observation.errorFeedback).toMatch(/matching closing quotation mark/i);
    expect(observation.rewardText).toMatch(/not a claim of durable mastery/i);
  });
}

test("an incorrect valid result stays editable and can recover without a dead end", async ({ page }) => {
  await openMission(page, "direct", "scripted");
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await setSource(page, 'print("Wrong signal")');
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();

  await expectStage(page, "first-result");
  await expect(output(page)).toContainText("Wrong signal");
  await expect(editor(page)).toHaveAttribute("aria-readonly", "false");
  await expect(editor(page)).toHaveAttribute("contenteditable", "true");

  await setSource(page, 'print("Hello, Sophia!")');
  await expectStage(page, "first-run");
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "first-result");
  await expect(page.getByRole("button", { name: /^Continue$/i })).toBeEnabled();
});

test("controlled variants preserve Mission content and outcomes while changing only the boundary", async ({
  browser,
}, testInfo) => {
  test.skip(!testInfo.project.name.endsWith("laptop"), "Parity is asserted once per laptop browser engine.");
  const viewport = { width: 1366, height: 768 };
  const directContext = await browser.newContext({ viewport });
  const operationsContext = await browser.newContext({ viewport });
  const directPage = await directContext.newPage();
  const operationsPage = await operationsContext.newPage();

  try {
    const direct = await completeFirstContact(directPage, "direct");
    const operations = await completeFirstContact(operationsPage, "operations");

    expect(operations.stages).toEqual(direct.stages);
    expect(operations.objectiveHeadings).toEqual(direct.objectiveHeadings);
    expect(operations.firstOutput).toBe(direct.firstOutput);
    expect(operations.personalizedOutput).toBe(direct.personalizedOutput);
    expect(operations.errorFeedback).toBe(direct.errorFeedback);
    expect(operations.rewardText).toBe(direct.rewardText);
    expect(operations.boundaryText).not.toBe(direct.boundaryText);
  } finally {
    await directContext.close();
    await operationsContext.close();
  }
});
