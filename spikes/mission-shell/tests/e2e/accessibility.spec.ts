import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  editor,
  expectStage,
  openMission,
  output,
  setSource,
  shell,
  stageUrl,
  type Variant,
} from "./mission-shell";

interface FocusInfo {
  readonly name: string;
  readonly tag: string;
  readonly visibleIndicator: boolean;
}

async function focusedControl(page: Page): Promise<FocusInfo> {
  return page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element) return { name: "", tag: "", visibleIndicator: false };
    const isInteractive = element.matches(
      "a[href], button, input, textarea, select, [tabindex], [contenteditable='true']",
    );
    if (!isInteractive) {
      return { name: "", tag: element.tagName.toLowerCase(), visibleIndicator: false };
    }
    const labelledControl = element as HTMLElement & { labels?: NodeListOf<HTMLLabelElement> };
    const labelText = Array.from(labelledControl.labels ?? [])
      .map((label) => label.textContent ?? "")
      .join(" ");
    const name = [
      element.getAttribute("aria-label") ?? "",
      element.getAttribute("title") ?? "",
      labelText,
      element.textContent ?? "",
      element.getAttribute("value") ?? "",
    ]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const style = getComputedStyle(element);
    const visibleIndicator =
      (style.outlineStyle !== "none" && style.outlineWidth !== "0px") ||
      (style.boxShadow !== "none" && style.boxShadow !== "");
    return { name, tag: element.tagName.toLowerCase(), visibleIndicator };
  });
}

async function tabTo(page: Page, accessibleName: RegExp, limit = 80): Promise<FocusInfo> {
  for (let index = 0; index < limit; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await focusedControl(page);
    if (accessibleName.test(focus.name)) return focus;
  }
  throw new Error(`Keyboard focus never reached ${String(accessibleName)}.`);
}

async function keyboardActivate(page: Page, accessibleName: RegExp): Promise<FocusInfo> {
  const focus = await tabTo(page, accessibleName);
  await page.keyboard.press("Enter");
  return focus;
}

async function keyboardReplaceEditor(page: Page, source: string): Promise<void> {
  const focus = await tabTo(page, /Investigation Console Python editor/i);
  expect(focus.tag).toBe("div");
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.insertText(source);
  await expect(editor(page)).toHaveText(source);
}

async function enterByKeyboard(page: Page, variant: Variant): Promise<void> {
  await page.goto(stageUrl(variant, "scripted"), { waitUntil: "domcontentloaded" });
  if (variant === "operations") {
    const entryFocus = await keyboardActivate(page, /Begin First Contact/i);
    expect(entryFocus.visibleIndicator).toBe(true);
  }
  await expect(shell(page)).toBeVisible();
  await expectStage(page, "briefing");
}

for (const variant of ["direct", "operations"] as const satisfies readonly Variant[]) {
  test(`@accessibility ${variant} supports keyboard-only completion with visible focus`, async ({ page }) => {
    await enterByKeyboard(page, variant);

    const beginFocus = await keyboardActivate(page, /^Begin Mission$/i);
    expect(beginFocus.visibleIndicator).toBe(true);
    await expectStage(page, "first-run");

    await keyboardActivate(page, /^Run(?: Python| code)?$/i);
    await expectStage(page, "first-result");
    await expect(output(page)).toContainText("Hello, Sophia!");
    await keyboardActivate(page, /^Continue$/i);

    await expectStage(page, "personalize");
    await keyboardReplaceEditor(page, 'print("Keyboard signal")');
    await keyboardActivate(page, /^Run(?: Python| code)?$/i);
    await expectStage(page, "personalize-result");
    await keyboardActivate(page, /^Continue$/i);

    await expectStage(page, "prediction");
    await tabTo(page, /Two lines.*Console online.*first/i);
    await page.keyboard.press("Space");
    await keyboardActivate(page, /Lock prediction/i);

    await expectStage(page, "trace");
    await keyboardActivate(page, /Step forward/i);
    await expect(page.getByText(/Step 1 of 2\. Python reads line 1/i)).toBeVisible();
    await keyboardActivate(page, /Step forward/i);
    await expect(page.getByText(/Step 2 of 2\. Python reads line 2/i)).toBeVisible();
    await keyboardActivate(page, /Continue to the controlled clue/i);

    await expectStage(page, "create-error");
    await keyboardActivate(page, /^Run(?: Python| code)?$/i);
    await expectStage(page, "error-feedback");
    await expect(
      page.getByText(/opening quotation mark without a matching closing quotation mark/i).first(),
    ).toBeVisible();
    await keyboardActivate(page, /^Continue$/i);

    await expectStage(page, "repair");
    await keyboardReplaceEditor(page, 'print("Case ready")');
    await keyboardActivate(page, /^Run(?: Python| code)?$/i);
    await expectStage(page, "repair-result");
    await keyboardActivate(page, /^Continue$/i);

    await expectStage(page, "field-test");
    await keyboardReplaceEditor(page, 'print("Investigation started")');
    await keyboardActivate(page, /^Run(?: Python| code)?$/i);
    await expectStage(page, "field-result");
    await keyboardActivate(page, /^Continue$/i);
    await expectStage(page, "debrief");
    await keyboardActivate(page, /^Continue$/i);
    await expectStage(page, "reward");
    await keyboardActivate(page, /^Continue$/i);

    const boundary =
      variant === "direct" ? page.getByTestId("direct-completion") : page.getByTestId("operations-center");
    await expect(boundary).toBeVisible();
    await expect(page.getByText(/Mission 002/i)).toHaveCount(0);
  });
}

test("@accessibility live status is polite, atomic, bounded, and settles after a run", async ({ page }) => {
  await openMission(page, "direct", "scripted");
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await page.evaluate(() => {
    const status = document.querySelector('[data-testid="mission-live-status"]');
    if (!(status instanceof HTMLElement)) throw new Error("Mission live status was not found.");
    const state = { records: [] as { text: string; at: number }[] };
    (window as unknown as { __missionStatusMutations: typeof state }).__missionStatusMutations = state;
    new MutationObserver(() => {
      state.records.push({ text: status.textContent?.trim() ?? "", at: performance.now() });
    }).observe(status, { childList: true, characterData: true, subtree: true });
  });

  const live = page.getByTestId("mission-live-status");
  await expect(live).toHaveAttribute("role", "status");
  await expect(live).toHaveAttribute("aria-live", "polite");
  await expect(live).toHaveAttribute("aria-atomic", "true");
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "first-result");
  await expect(output(page)).toContainText("Hello, Sophia!");
  await page.waitForTimeout(250);

  const records = await page.evaluate(
    () =>
      (window as unknown as {
        __missionStatusMutations: { records: { text: string; at: number }[] };
      }).__missionStatusMutations.records,
  );
  expect(records.length).toBeGreaterThanOrEqual(1);
  expect(records.length).toBeLessThanOrEqual(5);
  expect(records.every((record) => record.text.length > 0)).toBe(true);
  expect(records.map((record) => record.text)).toEqual([
    ...new Set(records.map((record) => record.text)),
  ]);
  expect(records.at(-1)?.text).toMatch(/Execution succeeded|Run complete|Hello, Sophia/i);

  const countAfterSettle = records.length;
  await page.waitForTimeout(250);
  const finalCount = await page.evaluate(
    () =>
      (window as unknown as {
        __missionStatusMutations: { records: unknown[] };
      }).__missionStatusMutations.records.length,
  );
  expect(finalCount).toBe(countAfterSettle);
});

test("@accessibility reduced motion preserves the same Case consequence and text equivalent", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openMission(page, "direct", "scripted");
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "first-result");

  const scene = page.getByTestId("case-scene");
  await expect(scene).toHaveAttribute("data-state", "online");
  await expect(scene.getByText(/Text equivalent/i)).toBeVisible();
  await expect(scene).toContainText(/Investigation Console status: online/i);
  await expect(output(page)).toContainText("Hello, Sophia!");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);

  const longestMotionSeconds = await scene.evaluate((root) => {
    const durations = [root, ...root.querySelectorAll("*")].flatMap((element) => {
      const style = getComputedStyle(element);
      const values = `${style.animationDuration},${style.transitionDuration}`.split(",");
      return values.map((value) => {
        const trimmed = value.trim();
        return trimmed.endsWith("ms")
          ? Number.parseFloat(trimmed) / 1_000
          : Number.parseFloat(trimmed) || 0;
      });
    });
    return Math.max(...durations, 0);
  });
  expect(longestMotionSeconds).toBeLessThanOrEqual(0.01);
});

test("@accessibility axe baseline passes key Operations, editor, and calm-error states", async ({ page }) => {
  await page.goto(stageUrl("operations", "scripted"), { waitUntil: "domcontentloaded" });
  const operationsResults = await new AxeBuilder({ page }).analyze();
  expect(operationsResults.violations, JSON.stringify(operationsResults.violations, null, 2)).toEqual([]);

  await page.getByRole("button", { name: /Begin First Contact/i }).click();
  await expect(shell(page)).toBeVisible();
  const editorResults = await new AxeBuilder({ page }).analyze();
  expect(editorResults.violations, JSON.stringify(editorResults.violations, null, 2)).toEqual([]);

  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await setSource(page, 'print("Broken signal)');
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
  await expectStage(page, "first-result");
  await expect(
    page.getByText(/opening quotation mark without a matching closing quotation mark/i).first(),
  ).toBeVisible();
  const errorResults = await new AxeBuilder({ page }).analyze();
  expect(errorResults.violations, JSON.stringify(errorResults.violations, null, 2)).toEqual([]);
});

test("@accessibility narrow layout exposes every essential action without hover", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.endsWith("narrow"), "This assertion targets narrow projects.");
  await page.mouse.move(0, 0);
  await openMission(page, "direct", "scripted");

  await expect(page.getByRole("button", { name: /^Begin Mission$/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Export$/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Reset$/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Stop$/i })).toBeVisible();
  await expect(editor(page)).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
