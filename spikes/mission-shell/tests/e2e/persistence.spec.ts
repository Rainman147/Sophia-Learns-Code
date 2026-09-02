import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import {
  currentSource,
  editor,
  expectStage,
  openMission,
  output,
  setSource,
  shell,
  type Variant,
} from "./mission-shell";

for (const variant of ["direct", "operations"] as const satisfies readonly Variant[]) {
  test(`${variant} reloads and resumes the exact source revision`, async ({ page }) => {
    await openMission(page, variant, "scripted");
    await page.getByRole("button", { name: /^Begin Mission$/i }).click();
    await expectStage(page, "first-run");

    const savedSource = 'print("Resume this exact signal")';
    await setSource(page, savedSource);
    const savedRevision = await shell(page).getAttribute("data-source-revision");
    expect(savedRevision).toMatch(/^\d+$/);
    await expect(page.getByTestId("mission-live-status")).toContainText(/Source updated/i);

    await page.reload({ waitUntil: "domcontentloaded" });
    const resume = page.getByRole("button", { name: /Resume Mission/i });
    if (await resume.isVisible().catch(() => false)) await resume.click();

    await expect(shell(page)).toBeVisible();
    await expectStage(page, "first-run");
    await expect(editor(page)).toHaveText(savedSource);
    await expect(shell(page)).toHaveAttribute("data-source-revision", savedRevision ?? "");
  });
}

test("local evidence exports as synthetic data and full reset removes resumable state", async ({ page }) => {
  await openMission(page, "direct", "scripted");
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "first-result");
  await expect(output(page)).toContainText("Hello, Sophia!");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /^Export$/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/evidence.*\.json$/i);
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  const exported = JSON.parse(await readFile(downloadPath ?? "", "utf8")) as {
    description?: unknown;
    snapshot?: { events?: unknown[]; session?: { source?: unknown; sourceRevision?: unknown } | null };
  };
  expect(exported.description).toBe("Synthetic local mission-shell spike evidence");
  expect(exported.snapshot?.events?.length).toBeGreaterThanOrEqual(1);
  expect(exported.snapshot?.session).toMatchObject({
    source: 'print("Hello, Sophia!")',
    sourceRevision: expect.any(Number),
  });

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /^Reset$/i }).click();
  await expectStage(page, "briefing");
  await expect(page.getByTestId("case-scene")).toHaveAttribute("data-state", "offline");
  expect(await currentSource(page)).toContain('print("Hello, Sophia!")');

  await page.reload({ waitUntil: "domcontentloaded" });
  await expectStage(page, "briefing");
  await expect(page.getByTestId("case-scene")).toHaveAttribute("data-state", "offline");
});

test("Stop is a clean resumable boundary and never autoplays the next Mission", async ({ page }) => {
  await openMission(page, "direct", "scripted");
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await setSource(page, 'print("Safe stopping point")');
  await page.getByRole("button", { name: /^Stop$/i }).click();

  await expect(page.getByTestId("paused-state")).toContainText(/source code is preserved/i);
  await page.getByRole("button", { name: "Resume Mission" }).click();
  await expectStage(page, "first-run");
  await expect(editor(page)).toHaveText('print("Safe stopping point")');
  await expect(page.getByRole("heading", { name: /Mission 001 · First Contact/i })).toBeVisible();
  await expect(page.getByText(/Mission 002/i)).toHaveCount(0);
});
