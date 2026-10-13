import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: "browser.spec.ts", fullyParallel: false, workers: 1,
  use: { baseURL: "http://127.0.0.1:3180", viewport: { width: 1440, height: 900 }, trace: "retain-on-failure" },
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3180", url: "http://127.0.0.1:3180", reuseExistingServer: !process.env.CI, timeout: 60000 },
});
