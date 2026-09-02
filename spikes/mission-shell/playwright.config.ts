import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.MISSION_SHELL_BASE_URL ?? "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  expect: {
    timeout: 10_000,
  },
  timeout: 45_000,
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-laptop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "firefox-laptop",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "chromium-narrow",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "firefox-narrow",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 120_000,
  },
});
