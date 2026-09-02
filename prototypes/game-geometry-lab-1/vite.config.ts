import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  base: "/",
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    css: true,
    exclude: [...configDefaults.exclude, "tests/e2e/**"],
  },
});
