import { readFile } from "node:fs/promises";
import { eventsSchema } from "../../src/data/event-schema";
try {
  const events = eventsSchema.parse(JSON.parse(await readFile(new URL("../../src/data/events.json", import.meta.url), "utf8")));
  console.log(`Metadata validated: ${events.length} event(s).`);
} catch (error) {
  console.error("Event validation failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
