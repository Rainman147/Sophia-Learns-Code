import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = ["/direct", "/hub-first", "/earned-hub"] as const;

async function fresh(page: Page, route: string, causality = "c") {
  await page.goto(`${route}?causality=${causality}`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function pressButton(page: Page, name: RegExp) {
  const button = page.getByRole("button", { name });
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
}

async function typeSource(page: Page, source: string) {
  const sourceBox = page.getByRole("textbox", { name: "Python source" });
  await sourceBox.focus();
  await page.keyboard.press("Control+A");
  await page.keyboard.type(source);
}

async function expectNoSeriousAxeFindings(page: Page) {
  const findings = await new AxeBuilder({ page }).analyze();
  expect(
    findings.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    ),
  ).toEqual([]);
}

test.describe("entry geometry and accessibility", () => {
  for (const route of routes) {
    test(`${route} has one runnable entry, five visible beats in Mission, and no serious axe findings`, async ({ page }) => {
      await fresh(page, route);
      const primary = page.locator("[data-primary-action]").first();
      await expect(primary).toBeEnabled();
      await expectNoSeriousAxeFindings(page);

      if (route !== "/direct") await pressButton(page, /begin first contact/i);
      await expect(page.getByRole("heading", { name: /mission 001 · first contact/i })).toBeVisible();
      await expect(page.getByTestId("mission-beat")).toHaveCount(5);
      await expectNoSeriousAxeFindings(page);
    });
  }
});

test("full browser keyboard path reaches the Field Test boundary without autoplay", async ({ page }) => {
  await fresh(page, "/direct");
  await pressButton(page, /run first message/i);
  await typeSource(page, 'print("Signal received")');
  await pressButton(page, /run changed message/i);
  await pressButton(page, /continue to predict/i);

  const prediction = page.getByRole("radio", { name: /console online appears first/i });
  await prediction.focus();
  await page.keyboard.press("Space");
  await pressButton(page, /lock prediction and trace/i);
  await pressButton(page, /trace line 1/i);
  await pressButton(page, /trace line 2/i);
  await pressButton(page, /continue to investigate/i);

  await typeSource(page, 'print("Case folder ready)');
  await pressButton(page, /run the clue/i);
  await expect(page.getByRole("heading", { name: /what python noticed/i })).toBeVisible();
  await typeSource(page, 'print("Case folder ready")');
  await pressButton(page, /run repaired line/i);
  await pressButton(page, /begin the field test/i);
  await typeSource(page, 'print("Investigation console online")');
  await pressButton(page, /submit field test/i);

  await expect(page.getByRole("heading", { name: /first contact is complete/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /mission 002 · identity tag/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /begin identity tag/i })).toHaveCount(0);
  await expect(page).toHaveURL(/\/direct/);
  await expectNoSeriousAxeFindings(page);
});

test("earned hub is absent before success and revealed by the successful Field Test", async ({ page }) => {
  await fresh(page, "/earned-hub");
  await expect(page.getByRole("heading", { name: /badge event arrived at 00:43/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /operations center brought online/i })).toHaveCount(0);

  await pressButton(page, /begin first contact/i);
  await pressButton(page, /run first message/i);
  await typeSource(page, 'print("Signal received")');
  await pressButton(page, /run changed message/i);
  await pressButton(page, /continue to predict/i);
  await page.getByRole("radio", { name: /console online appears first/i }).check();
  await pressButton(page, /lock prediction and trace/i);
  await pressButton(page, /trace line 1/i);
  await pressButton(page, /trace line 2/i);
  await pressButton(page, /continue to investigate/i);
  await typeSource(page, 'print("Case folder ready)');
  await pressButton(page, /run the clue/i);
  await typeSource(page, 'print("Case folder ready")');
  await pressButton(page, /run repaired line/i);
  await pressButton(page, /begin the field test/i);
  await typeSource(page, 'print("Investigation console online")');
  await pressButton(page, /submit field test/i);

  await expect(page.getByRole("heading", { name: /operations center brought online/i })).toBeVisible();
  await expect(page.getByText(/your field test printed the requested message/i)).toBeVisible();
  await expectNoSeriousAxeFindings(page);
});

test("causality A, B, and C keep the same output while changing only presentation", async ({ page }) => {
  await fresh(page, "/direct", "a");
  await pressButton(page, /run first message/i);
  const output = page.getByRole("region", { name: /output/i }).locator("pre");
  await expect(output).toContainText("Hello, Sophia!");
  await expect(page.locator("[data-folder-state]")).toHaveCount(0);

  await page.getByRole("radio", { name: "B" }).check();
  await expect(output).toContainText("Hello, Sophia!");
  await expect(page.locator("[data-folder-state='open']")).toBeVisible();

  await page.getByRole("radio", { name: "C" }).check();
  await expect(output).toContainText("Hello, Sophia!");
  await expect(page.getByLabel(/four-part causal explanation/i)).toBeVisible();
  await expect(page.locator("[data-semantic-result]")).toContainText("First Contact file");
});

test("reduced motion preserves the ordered causal text and changed Case state", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fresh(page, "/direct", "c");
  await expect(page.locator("[data-motion='reduced']")).toBeVisible();
  await pressButton(page, /run first message/i);
  await expect(page.getByText(/ordered static explanation/i)).toBeVisible();
  await expect(page.locator("[data-folder-state='open']")).toBeVisible();
  await expect(page.locator("[data-semantic-result]")).toContainText("Hello, Sophia!");
  if (testInfo.project.name.includes("laptop")) {
    await page.getByRole("heading", { name: "Make the message yours" }).focus();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: "artifacts/screenshots/reduced-motion-state.png",
      fullPage: true,
    });
  }
  await expectNoSeriousAxeFindings(page);
});

test.describe("responsive behavior", () => {
  for (const route of routes) {
    test(`${route} has no document overflow and keeps the primary action within the narrow layout`, async ({ page }, testInfo) => {
      test.skip(!testInfo.project.name.includes("narrow"), "Narrow-only assertion");
      await fresh(page, route);
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

      const primary = page.locator("[data-primary-action]").first();
      await primary.scrollIntoViewIfNeeded();
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      await expect(primary).toBeVisible();
    });
  }
});
