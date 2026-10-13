import { readFile, writeFile, rename, open, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { eventsSchema, type KrowdEvent } from "../../src/data/event-schema";
export const dataFile = new URL("../../src/data/events.json", import.meta.url);
export function eventStore(file: string | URL = dataFile) {
  return {
    async read() { const raw = await readFile(file, "utf8"); return { raw, events: eventsSchema.parse(JSON.parse(raw)) }; },
    async write(events: KrowdEvent[], expected: string) {
      const valid = eventsSchema.parse(events);
      const path = file instanceof URL ? fileURLToPath(file) : file;
      const lockPath = `${path}.lock`;
      const temp = `${path}.${randomUUID()}.tmp`;
      let held;
      try { held = await open(lockPath, "wx"); } catch { throw new Error("Another event edit is in progress. Retry after it finishes."); }
      try {
        if (await readFile(file, "utf8") !== expected) throw new Error("Events changed while you were reviewing. Reload and review again; nothing was overwritten.");
        await writeFile(temp, JSON.stringify(valid, null, 2) + "\n", { flag: "wx" });
        await rename(temp, path);
      } finally { await rm(temp, { force: true }); await held.close(); await rm(lockPath, { force: true }); }
    },
  };
}
export function uniqueSlug(title: string, events: KrowdEvent[]): string {
  const base = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140).replace(/-$/g, "") || "community-event";
  let candidate = base, suffix = 2;
  while (events.some(event => event.slug === candidate)) candidate = `${base}-${suffix++}`;
  return candidate;
}
