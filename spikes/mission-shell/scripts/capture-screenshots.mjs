#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const DEFAULT_BASE_URL = "http://127.0.0.1:3100";
const DEFAULT_OUTPUT = "artifacts/screenshots";
const LAPTOP = { width: 1366, height: 768 };
const NARROW = { width: 390, height: 844 };

function parseArgs(argv) {
  const valueAfter = (name, fallback) => {
    const index = argv.indexOf(name);
    return index >= 0 && argv[index + 1] ? argv[index + 1] : fallback;
  };
  if (argv.includes("--help")) {
    process.stdout.write(
      "Usage: node scripts/capture-screenshots.mjs [--base-url <url>] [--output <directory>]\n",
    );
    process.exit(0);
  }
  return {
    baseUrl: valueAfter("--base-url", DEFAULT_BASE_URL),
    output: valueAfter("--output", DEFAULT_OUTPUT),
  };
}

function routeUrl(baseUrl, route) {
  return new URL(`/${route}/?runtime=scripted`, baseUrl).toString();
}

async function waitForFontsAndPaint(page) {
  await page.evaluate(async () => {
    if ("fonts" in document) await document.fonts.ready;
  });
  await page.waitForTimeout(250);
}

async function capture(page, outputDirectory, name, viewport, fullPage = true) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await waitForFontsAndPaint(page);
  const file = path.join(outputDirectory, name);
  await page.screenshot({ path: file, fullPage, animations: "disabled" });
  return { file: name, viewport, fullPage };
}

async function waitStage(page, stage, timeout = 15_000) {
  await page
    .getByTestId("mission-shell")
    .waitFor({ state: "visible", timeout });
  await page.waitForFunction(
    ({ expected }) =>
      document.querySelector('[data-testid="mission-shell"]')?.getAttribute("data-stage") === expected,
    { expected: stage },
    { timeout },
  );
}

function editor(page) {
  return page.getByRole("textbox", { name: /Investigation Console Python editor/i });
}

async function setSource(page, source) {
  const sourceEditor = editor(page);
  await sourceEditor.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.insertText(source);
  if ((await sourceEditor.textContent()) !== source) {
    throw new Error("The editor did not contain the exact replacement source after keyboard input.");
  }
}

async function clickRun(page) {
  await page.getByRole("button", { name: /^Run(?: Python| code)?$/i }).click();
}

async function clickContinue(page) {
  await page.getByRole("button", { name: /^Continue$/i }).click();
}

async function openMission(page, baseUrl, variant) {
  await page.goto(routeUrl(baseUrl, variant), { waitUntil: "domcontentloaded" });
  if (variant === "operations") {
    await page.getByTestId("operations-center").waitFor({ state: "visible" });
    await page.getByRole("button", { name: /Begin First Contact|Resume First Contact/i }).click();
  }
  await waitStage(page, "briefing");
}

async function reachCalmError(page, baseUrl, variant = "direct") {
  await openMission(page, baseUrl, variant);
  await page.getByRole("button", { name: /^Begin Mission$/i }).click();
  await waitStage(page, "first-run");
  await clickRun(page);
  await waitStage(page, "first-result");
  await clickContinue(page);

  await waitStage(page, "personalize");
  await setSource(page, 'print("Signal personalized")');
  await clickRun(page);
  await waitStage(page, "personalize-result");
  await clickContinue(page);

  await waitStage(page, "prediction");
  await page.getByRole("radio", { name: /Two lines.*Console online.*first/i }).check();
  await page.getByRole("button", { name: "Lock prediction" }).click();
  await waitStage(page, "trace");
  await page.getByRole("button", { name: "Step forward" }).click();
  await page.getByRole("button", { name: "Step forward" }).click();
  await page.getByRole("button", { name: /Continue to the controlled clue/i }).click();

  await waitStage(page, "create-error");
  await clickRun(page);
  await waitStage(page, "error-feedback");
}

async function completeMission(page, baseUrl, variant) {
  await reachCalmError(page, baseUrl, variant);
  await clickContinue(page);

  await waitStage(page, "repair");
  await setSource(page, 'print("Case ready")');
  await clickRun(page);
  await waitStage(page, "repair-result");
  await clickContinue(page);

  await waitStage(page, "field-test");
  await setSource(page, 'print("Investigation started")');
  await clickRun(page);
  await waitStage(page, "field-result");
  await clickContinue(page);

  await waitStage(page, "debrief");
  await clickContinue(page);
  await waitStage(page, "reward");
  await clickContinue(page);

  if (variant === "direct") {
    await page.getByTestId("direct-completion").waitFor({ state: "visible" });
  } else {
    const operations = page.getByTestId("operations-center");
    await operations.waitFor({ state: "visible" });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="operations-center"]')?.getAttribute("data-state") === "after",
    );
  }
}

async function withPage(browser, viewport, operation) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  try {
    return await operation(page);
  } finally {
    await context.close();
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await mkdir(options.output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const captures = [];

  try {
    captures.push(
      await withPage(browser, LAPTOP, async (page) => {
        await page.goto(new URL("/", options.baseUrl).toString(), { waitUntil: "domcontentloaded" });
        await page.getByRole("heading", { name: /Same Mission.*Two entry paths/i }).waitFor();
        return capture(page, options.output, "comparison-index-laptop.png", LAPTOP);
      }),
    );

    captures.push(
      await withPage(browser, LAPTOP, async (page) => {
        await page.goto(routeUrl(options.baseUrl, "operations"), { waitUntil: "domcontentloaded" });
        await page.getByTestId("operations-center").waitFor({ state: "visible" });
        return capture(page, options.output, "operations-before-laptop.png", LAPTOP);
      }),
    );

    captures.push(
      await withPage(browser, LAPTOP, async (page) => {
        await openMission(page, options.baseUrl, "direct");
        return capture(page, options.output, "direct-briefing-laptop.png", LAPTOP);
      }),
    );

    captures.push(
      await withPage(browser, LAPTOP, async (page) => {
        await reachCalmError(page, options.baseUrl, "direct");
        return capture(page, options.output, "direct-calm-error-laptop.png", LAPTOP);
      }),
    );

    captures.push(
      await withPage(browser, LAPTOP, async (page) => {
        await completeMission(page, options.baseUrl, "direct");
        return capture(page, options.output, "direct-completion-laptop.png", LAPTOP);
      }),
    );

    captures.push(
      await withPage(browser, LAPTOP, async (page) => {
        await completeMission(page, options.baseUrl, "operations");
        return capture(page, options.output, "operations-after-laptop.png", LAPTOP);
      }),
    );

    captures.push(
      await withPage(browser, NARROW, async (page) => {
        await openMission(page, options.baseUrl, "direct");
        return capture(page, options.output, "direct-briefing-narrow.png", NARROW);
      }),
    );
  } finally {
    await browser.close();
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    baseUrl: options.baseUrl,
    browser: "chromium",
    syntheticDataOnly: true,
    captures,
  };
  await writeFile(path.join(options.output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({ status: "failed", error: error instanceof Error ? error.message : String(error) }, null, 2)}\n`,
  );
  process.exitCode = 1;
});
