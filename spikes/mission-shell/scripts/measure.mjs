#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { chromium, firefox } from "@playwright/test";

const DEFAULTS = {
  baseUrl: "http://127.0.0.1:3100",
  browser: "chromium",
  output: "artifacts/measurements/mission-shell.json",
  route: "/direct/",
  warmRuns: 12,
};

const SELECTORS = {
  shell: '[data-testid="mission-shell"]',
  editor: '[data-testid="source-editor"]',
  output: '[data-testid="console-output"]',
  runtimeStatus: '[data-testid="runtime-status"]',
};

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--base-url" && value) options.baseUrl = value;
    else if (argument === "--browser" && value) options.browser = value;
    else if (argument === "--output" && value) options.output = value;
    else if (argument === "--route" && value) options.route = value;
    else if (argument === "--warm-runs" && value) options.warmRuns = Number(value);
    else if (argument === "--help") {
      process.stdout.write(
        [
          "Usage: node scripts/measure.mjs [options]",
          "  --base-url <url>       Running spike URL (default http://127.0.0.1:3100)",
          "  --browser <name>       chromium or firefox (default chromium)",
          "  --route <path>         Variant route (default /direct/)",
          "  --warm-runs <count>    Warm-run sample count (default 12)",
          "  --output <path>        JSON output path",
          "",
        ].join("\n"),
      );
      process.exit(0);
    }
  }

  if (!Number.isSafeInteger(options.warmRuns) || options.warmRuns < 3 || options.warmRuns > 100) {
    throw new RangeError("--warm-runs must be an integer from 3 through 100.");
  }
  if (!(options.browser in { chromium: true, firefox: true })) {
    throw new TypeError("--browser must be chromium or firefox.");
  }
  if (!options.route.startsWith("/")) {
    throw new TypeError("--route must be an absolute URL path.");
  }
  return options;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function distribution(samples) {
  if (samples.length === 0) return null;
  const sorted = [...samples].sort((left, right) => left - right);
  const percentile = (fraction) => {
    const position = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
    return sorted[position];
  };
  const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  return {
    count: sorted.length,
    minMs: round(sorted[0]),
    medianMs: round(percentile(0.5)),
    p95Ms: round(percentile(0.95)),
    maxMs: round(sorted.at(-1)),
    meanMs: round(mean),
    samplesMs: samples.map(round),
  };
}

function unavailable(reason, method) {
  return { status: "not-measured", reason, method };
}

async function observed(method, operation) {
  try {
    const value = await operation();
    return { status: "measured", method, ...value };
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error), method);
  }
}

function urlFor(baseUrl, route, runtimeMode) {
  const url = new URL(route, baseUrl);
  url.searchParams.set("runtime", runtimeMode);
  url.searchParams.set("measurement", "1");
  return url.toString();
}

async function findEditor(page) {
  const labelledEditor = page.getByRole("textbox", { name: /investigation console|code editor|code area/i });
  if (await labelledEditor.count()) return labelledEditor.first();

  const contentEditable = page.locator(`${SELECTORS.editor} [contenteditable="true"]`);
  if (await contentEditable.count()) return contentEditable.first();

  const directEditor = page.locator(`${SELECTORS.editor}[contenteditable="true"], textarea${SELECTORS.editor}`);
  if (await directEditor.count()) return directEditor.first();
  throw new Error("No labelled editor or source-editor contenteditable hook was found.");
}

async function findRunButton(page) {
  const run = page
    .getByRole("button", { name: /^run(?: python| code| mission)?$/i })
    .first();
  await run.waitFor({ state: "visible", timeout: 15_000 });
  return run;
}

async function enterRunnableMission(page) {
  const missionShell = page.locator(SELECTORS.shell);
  await page
    .locator(`${SELECTORS.shell}, [data-testid="operations-center"]`)
    .first()
    .waitFor({ state: "visible", timeout: 15_000 });
  if (!(await missionShell.isVisible())) {
    const entry = page.getByRole("button", {
      name: /begin first contact|resume first contact|open mission|enter mission|start mission/i,
    });
    await entry.first().click();
    await missionShell.waitFor({ state: "visible", timeout: 15_000 });
  }

  const begin = page.getByRole("button", { name: /^begin mission$/i });
  if (await begin.isVisible()) await begin.click();

  await page.locator(SELECTORS.editor).waitFor({ state: "visible", timeout: 15_000 });
  const run = await findRunButton(page);
  await run.waitFor({ state: "visible" });
  if (!(await run.isEnabled())) throw new Error("Run is present but is not enabled at first useful interface.");
}

async function setSource(page, source) {
  const editor = await findEditor(page);
  await editor.focus();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.insertText(source);
  if ((await editor.textContent()) !== source) {
    throw new Error("The editor did not contain the exact replacement source after keyboard input.");
  }
  return editor;
}

async function waitForOutput(page, expected, timeout = 20_000) {
  await page.waitForFunction(
    ({ selector, text }) => document.querySelector(selector)?.textContent?.includes(text),
    { selector: SELECTORS.output, text: expected },
    { timeout },
  );
}

async function outputMetadata(page) {
  return page.locator(SELECTORS.output).evaluate((element) => {
    const numericAttribute = (name) => {
      const raw = element.getAttribute(name);
      if (raw === null) return null;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    };
    return {
      sourceRevision: element.getAttribute("data-source-revision"),
      requestId: element.getAttribute("data-request-id"),
      initializeMs: numericAttribute("data-initialize-ms"),
      executeMs: numericAttribute("data-execute-ms"),
      totalMs: numericAttribute("data-total-ms"),
      workerGeneration: numericAttribute("data-worker-generation"),
      text: element.textContent ?? "",
    };
  });
}

async function runSource(page, source, expected, timeout = 20_000) {
  await setSource(page, source);
  const run = await findRunButton(page);
  const startedAt = performance.now();
  await run.click();
  await waitForOutput(page, expected, timeout);
  const wallMs = performance.now() - startedAt;
  return { wallMs, metadata: await outputMetadata(page) };
}

async function resetForAnotherRun(page) {
  const again = page.getByRole("button", { name: /run again|try another|edit again|back to code/i });
  if (await again.count()) {
    await again.first().click();
    return;
  }

  const sourceEditor = await findEditor(page);
  await sourceEditor.waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForFunction(
    (element) =>
      element.getAttribute("aria-readonly") === "false" &&
      element.getAttribute("contenteditable") !== "false",
    await sourceEditor.elementHandle(),
    { timeout: 15_000 },
  );
  if (await sourceEditor.isEditable()) return;
  throw new Error(
    "The measurement route did not restore an editable source surface for the next warm sample.",
  );
}

async function readCdpMetrics(cdp) {
  const response = await cdp.send("Performance.getMetrics");
  return Object.fromEntries(response.metrics.map(({ name, value }) => [name, value]));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const browserType = options.browser === "firefox" ? firefox : chromium;
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  const pyodideResponses = [];

  page.on("response", async (response) => {
    if (!/pyodide|python_stdlib|\.whl(?:$|\?)/i.test(response.url())) return;
    const headers = await response.allHeaders();
    pyodideResponses.push({
      url: response.url(),
      status: response.status(),
      cacheControl: headers["cache-control"] ?? null,
      contentLength: Number(headers["content-length"]) || null,
      fromServiceWorker: response.fromServiceWorker(),
    });
  });

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "complete-with-explicit-gaps",
    configuration: options,
    environment: {
      os: `${os.platform()} ${os.release()} ${os.arch()}`,
      logicalCpuCount: os.cpus().length,
      totalHostMemoryBytes: os.totalmem(),
      nodeVersion: process.version,
      browserName: options.browser,
      browserVersion: browser.version(),
      viewport: { width: 1366, height: 768 },
    },
    observations: {},
    caveats: [
      "Playwright wall time includes automation and rendering overhead; compare like-for-like runs, not absolute input latency.",
      "Chromium JS heap metrics omit Web Worker and WebAssembly linear memory, so they cannot establish Pyodide's total memory use.",
      "Idle TaskDuration is a coarse browser-process proxy, not a battery or power measurement.",
      "A screen reader and representative learner hardware still require manual observation.",
    ],
  };

  let cdp = null;
  let repeatedRunHeap = null;
  if (options.browser === "chromium") {
    cdp = await context.newCDPSession(page);
    await cdp.send("Performance.enable");
  }

  const navigationStarted = performance.now();
  const navigationResponse = await page.goto(urlFor(options.baseUrl, options.route, "scripted"), {
    waitUntil: "domcontentloaded",
  });
  report.observations.navigationAndFui = await observed(
    "Wall clock from navigation start until the labelled editor and enabled Run control are available.",
    async () => {
      if (!navigationResponse?.ok()) throw new Error(`Navigation returned ${navigationResponse?.status() ?? "no response"}.`);
      await enterRunnableMission(page);
      const fuiMs = performance.now() - navigationStarted;
      const navigationTiming = await page.evaluate(() => {
        const entry = performance.getEntriesByType("navigation")[0];
        if (!(entry instanceof PerformanceNavigationTiming)) return null;
        return {
          domContentLoadedMs: entry.domContentLoadedEventEnd,
          loadEventMs: entry.loadEventEnd,
          responseEndMs: entry.responseEnd,
          transferSize: entry.transferSize,
          encodedBodySize: entry.encodedBodySize,
        };
      });
      return { firstUsefulInterfaceMs: round(fuiMs), navigationTiming };
    },
  );

  report.observations.editorInput = await observed(
    "Per-character wall time through Playwright insertText followed by one animation frame; this is a responsiveness proxy.",
    async () => {
      const editor = await findEditor(page);
      await editor.focus();
      await editor.focus();
      await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
      await page.keyboard.insertText('print("Latency: ');
      const samples = [];
      for (const character of "responsive") {
        const startedAt = performance.now();
        await page.keyboard.insertText(character);
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
        samples.push(performance.now() - startedAt);
      }
      await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
      await page.keyboard.insertText('print("Hello, Sophia!")');
      return { distribution: distribution(samples) };
    },
  );

  report.observations.scriptedWarm = await observed(
    "Repeated valid executions through the rendered shell using the scripted ExecutionRuntime.",
    async () => {
      const samples = [];
      for (let index = 0; index < options.warmRuns; index += 1) {
        if (index > 0) await resetForAnotherRun(page);
        const expected = `Warm scripted ${index}`;
        const observation = await runSource(page, `print("${expected}")`, expected);
        samples.push(observation.wallMs);
      }
      return { distribution: distribution(samples) };
    },
  );

  report.observations.realRuntime = await observed(
    "Cold and repeated warm executions through the real Pyodide worker selected by the runtime query parameter.",
    async () => {
      await page.goto(urlFor(options.baseUrl, options.route, "pyodide"), { waitUntil: "domcontentloaded" });
      await enterRunnableMission(page);
      const cold = await runSource(page, 'print("Real cold")', "Real cold", 90_000);
      const heapBefore = cdp ? await readCdpMetrics(cdp) : null;
      const warmSamples = [];
      for (let index = 0; index < options.warmRuns; index += 1) {
        await resetForAnotherRun(page);
        const expected = `Real warm ${index}`;
        const warm = await runSource(page, `print("${expected}")`, expected, 30_000);
        warmSamples.push(warm.wallMs);
      }
      const heapAfter = cdp ? await readCdpMetrics(cdp) : null;
      if (heapBefore && heapAfter) {
        repeatedRunHeap = {
          jsHeapUsedBytesBefore: heapBefore.JSHeapUsedSize ?? null,
          jsHeapUsedBytesAfter: heapAfter.JSHeapUsedSize ?? null,
          jsHeapUsedDeltaBytes:
            typeof heapBefore.JSHeapUsedSize === "number" && typeof heapAfter.JSHeapUsedSize === "number"
              ? heapAfter.JSHeapUsedSize - heapBefore.JSHeapUsedSize
              : null,
          jsHeapTotalBytesBefore: heapBefore.JSHeapTotalSize ?? null,
          jsHeapTotalBytesAfter: heapAfter.JSHeapTotalSize ?? null,
        };
      }
      return {
        coldWallMs: round(cold.wallMs),
        coldRuntimeMetrics: cold.metadata,
        warmDistribution: distribution(warmSamples),
      };
    },
  );

  report.observations.cancellationAndReplacement = await observed(
    "Cancel a non-terminating real run, wait for replacement readiness, then execute valid source.",
    async () => {
      await resetForAnotherRun(page);
      const source = "while True: pass";
      await setSource(page, source);
      await (await findRunButton(page)).click();
      const cancel = page.getByRole("button", { name: /cancel|stop run|terminate/i });
      await cancel.waitFor({ state: "visible", timeout: 10_000 });
      const cancellationStartedAt = performance.now();
      await cancel.click();
      await page.waitForFunction(
        (selector) => ["ready", "idle"].includes(document.querySelector(selector)?.getAttribute("data-runtime-phase") ?? ""),
        SELECTORS.runtimeStatus,
        { timeout: 30_000 },
      );
      const cancellationMs = performance.now() - cancellationStartedAt;
      const preservedSource = await (await findEditor(page)).textContent();
      const recovery = await runSource(page, 'print("Recovered")', "Recovered", 60_000);
      return {
        cancellationMs: round(cancellationMs),
        replacementAndValidRunMs: round(recovery.wallMs),
        sourcePreservedUntilReplacement: preservedSource?.includes("while True") ?? false,
        recoveryRuntimeMetrics: recovery.metadata,
      };
    },
  );

  report.observations.staleDisplay = await observed(
    "Start a delayed real run, supersede it with a newer revision, and inspect the final rendered revision and text.",
    async () => {
      await resetForAnotherRun(page);
      await setSource(page, "while True: pass");
      await (await findRunButton(page)).click();
      await setSource(page, 'print("CURRENT RESULT")');
      await page.waitForFunction(
        (selector) => ["ready", "idle"].includes(document.querySelector(selector)?.getAttribute("data-runtime-phase") ?? ""),
        SELECTORS.runtimeStatus,
        { timeout: 60_000 },
      );
      const run = await findRunButton(page);
      if (!(await run.isEnabled())) throw new Error("Run is disabled while an older revision executes; supersession was not observable.");
      await run.click();
      await waitForOutput(page, "CURRENT RESULT", 60_000);
      await page.waitForTimeout(750);
      const metadata = await outputMetadata(page);
      const shellRevision = await page.locator(SELECTORS.shell).getAttribute("data-source-revision");
      return {
        currentOutputDisplayed: metadata.text.includes("CURRENT RESULT"),
        staleOutputAbsent: !metadata.text.includes("STALE RESULT"),
        displayedRevision: metadata.sourceRevision,
        currentSourceRevision: shellRevision,
        revisionsMatch: Boolean(shellRevision) && metadata.sourceRevision === shellRevision,
      };
    },
  );

  report.observations.memory = cdp
    ? repeatedRunHeap
      ? {
          status: "measured",
          method: "Chromium Performance domain JSHeapUsedSize before and after the real repeated-run sequence.",
          ...repeatedRunHeap,
          limitation: "Does not include Worker or WebAssembly linear memory and therefore undercounts Pyodide.",
        }
      : unavailable(
          "The real repeated-run phase did not complete, so comparable before/after heap snapshots were unavailable.",
          "Chromium Performance domain JS heap proxy.",
        )
    : unavailable("Firefox does not expose Chromium DevTools Protocol heap metrics.", "Browser-process JS heap proxy.");

  report.observations.idleCpuProxy = cdp
    ? await observed(
        "Difference in Chromium Performance TaskDuration across a two-second no-interaction window.",
        async () => {
          const before = await readCdpMetrics(cdp);
          const idleStartedAt = performance.now();
          await page.waitForTimeout(2_000);
          const after = await readCdpMetrics(cdp);
          const elapsedMs = performance.now() - idleStartedAt;
          const taskDurationMs = ((after.TaskDuration ?? 0) - (before.TaskDuration ?? 0)) * 1_000;
          return {
            windowMs: round(elapsedMs),
            taskDurationMs: round(taskDurationMs),
            taskDurationShare: round(taskDurationMs / elapsedMs),
          };
        },
      )
    : unavailable("Firefox does not expose Chromium DevTools Protocol TaskDuration.", "Browser-process idle CPU proxy.");

  report.observations.pyodideAssetResponses = {
    status: pyodideResponses.length ? "observed" : "not-observed",
    method: "Network response headers captured during the real-runtime phase.",
    responses: pyodideResponses,
    limitation: "A warm browser-cache run must be repeated separately to establish transfer-cache behavior.",
  };

  await browser.close();
  await mkdir(path.dirname(options.output), { recursive: true });
  await writeFile(options.output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  const failure = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "failed",
    error: error instanceof Error ? error.message : String(error),
  };
  process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
  process.exitCode = 1;
});
