import { defineConfig } from "@playwright/test";
import { env } from "node:process";

const isCI = Boolean(env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://127.0.0.1:5173",
    headless: true,
  },
  webServer: {
    command: "npm run dev -- --host",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
});
