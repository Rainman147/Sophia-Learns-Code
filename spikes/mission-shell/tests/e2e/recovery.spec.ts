import { expect, test } from "@playwright/test";
import {
  currentSource,
  expectStage,
  openMission,
  output,
  runtimeStatus,
  setSource,
  shell,
} from "./mission-shell";

test("@real-runtime real Pyodide output, cancellation, replacement, stale rejection, and recovery", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.endsWith("laptop"), "One real-runtime run per laptop browser engine is sufficient.");
  test.setTimeout(180_000);

  await openMission(page, "direct", "pyodide", { measurement: "1" });
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await expectStage(page, "first-run");
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "first-result", 120_000);
  await expect(output(page)).toContainText("Hello, Sophia!", { timeout: 120_000 });
  await expect(output(page)).toHaveAttribute("data-execution-status", "success");
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-mode", "pyodide");
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-phase", "ready");
  const coldGeneration = Number(await runtimeStatus(page).getAttribute("data-worker-generation"));
  expect(coldGeneration).toBeGreaterThanOrEqual(1);
  expect(await output(page).getAttribute("data-source-revision")).toBe(
    await shell(page).getAttribute("data-source-revision"),
  );

  await page.getByRole("button", { name: /^Continue$/i }).click();
  await expectStage(page, "personalize");

  const unmatchedQuoteSource = 'print("Real Python clue)';
  await setSource(page, unmatchedQuoteSource);
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "personalize-result", 60_000);
  await expect(output(page)).toHaveAttribute("data-execution-status", "error");
  await expect(
    page.getByText(/opening quotation mark without a matching closing quotation mark/i).first(),
  ).toBeVisible();
  expect(await currentSource(page)).toBe(unmatchedQuoteSource);

  const infiniteSource = "while True: pass";
  await setSource(page, infiniteSource);
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-phase", "running", {
    timeout: 15_000,
  });
  const cancel = page.getByRole("button", { name: /Cancel run|Cancel|Terminate/i });
  await expect(cancel).toBeVisible();
  expect(await currentSource(page)).toBe(infiniteSource);
  await cancel.click();
  await expect(output(page)).toHaveAttribute("data-execution-status", "cancelled");
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-phase", "ready", {
    timeout: 120_000,
  });
  expect(await currentSource(page)).toBe(infiniteSource);
  const replacementGeneration = Number(
    await runtimeStatus(page).getAttribute("data-worker-generation"),
  );
  expect(replacementGeneration).toBeGreaterThan(coldGeneration);

  await setSource(page, 'print("Recovered in real Python")');
  await expectStage(page, "personalize");
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "personalize-result");
  await expect(output(page)).toContainText("Recovered in real Python", { timeout: 60_000 });
  await expect(output(page)).toHaveAttribute("data-execution-status", "success");

  await setSource(page, infiniteSource);
  await expectStage(page, "personalize");
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-phase", "running", {
    timeout: 15_000,
  });
  await setSource(page, 'print("CURRENT REVISION")');
  const currentRevision = await shell(page).getAttribute("data-source-revision");
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-phase", "ready", {
    timeout: 120_000,
  });
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expect(output(page)).toContainText("CURRENT REVISION", { timeout: 60_000 });
  await page.waitForTimeout(500);

  await expect(output(page)).not.toContainText("Python is evaluating this revision");
  await expect(output(page)).toHaveAttribute("data-source-revision", currentRevision ?? "");
  expect(await shell(page).getAttribute("data-source-revision")).toBe(currentRevision);
  await expect(runtimeStatus(page)).toHaveAttribute("data-runtime-phase", "ready");
  expect(Number(await runtimeStatus(page).getAttribute("data-worker-generation"))).toBeGreaterThan(
    replacementGeneration,
  );
});
