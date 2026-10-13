import { readFile, writeFile, open, rm, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { eventsSchema } from "../src/data/event-schema";
import { kolkataToday } from "../src/data/event-utils";
const require = createRequire(import.meta.url), root = fileURLToPath(new URL("../", import.meta.url));
const path = fileURLToPath(new URL("../src/data/events.json", import.meta.url));
const backup = fileURLToPath(new URL("../.artifacts/event-browser-original.json", import.meta.url));
const original = await readFile(path, "utf8"); eventsSchema.parse(JSON.parse(original));
const records = eventsSchema.parse(Array.from({ length: 11 }, (_, index) => ({
  id: `fixture-${index+1}`, slug: `fixture-event-${index+1}`, title: `Fixture event ${index+1}`,
  description: "Temporary browser-test data. This record is never committed or published.",
  date: kolkataToday(new Date(Date.now() + (index < 3 ? 365+index : -365-index) * 86400000)), endDate: null,
  venue: "Fixture venue", city: "Bengaluru", type: "meetup", relationship: index === 2 ? "community-partner" : "hosted",
  image: null, sourceUrl: "https://example.com/source", registrationUrl: "https://example.com/register", featured: index === 0,
})));
const fixture = JSON.stringify(records, null, 2) + "\n";
async function run(entry: string, args: string[]) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [require.resolve(entry), ...args], { cwd: root, stdio: "inherit", windowsHide: true });
    child.on("error", reject); child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${entry} exited ${code}`)));
  });
}
const lock = await open(`${path}.lock`, "wx");
let installed = false, restored = false;
try {
  if (await readFile(path, "utf8") !== original) throw new Error("Event data changed before the test. Retry with the current data.");
  await mkdir(new URL("../.artifacts/", import.meta.url), { recursive: true });
  try { await writeFile(backup, original, { flag: "wx" }); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error(`A previous test backup exists at ${backup}. Follow README.md's interrupted-test recovery instructions before retrying. No event data was changed.`);
    throw error;
  }
  installed = true;
  await writeFile(path, fixture);
  await run("next/dist/bin/next", ["build"]);
  await run("@playwright/test/cli", ["test", "--config=playwright.events.config.ts"]);
} finally {
  try {
    if (installed) {
      if (await readFile(path, "utf8") !== fixture) throw new Error(`Event data changed during the test. Preserve the current data and inspect the original backup at ${backup} before restoring.`);
      await writeFile(path, original); restored = true;
      console.log("Temporary browser events removed. Rebuilding the original data.");
      await run("next/dist/bin/next", ["build"]);
    }
  } finally {
    try { await lock.close(); }
    finally { await rm(`${path}.lock`, { force: true }); if (restored) await rm(backup, { force: true }); }
  }
}
