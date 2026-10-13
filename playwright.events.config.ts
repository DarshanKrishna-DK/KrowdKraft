import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({ ...base, testMatch: "event-browser.spec.ts", webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3180", url: "http://127.0.0.1:3180", reuseExistingServer: false, timeout: 60000 } });
