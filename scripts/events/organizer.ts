import { randomUUID } from "node:crypto";
import { mkdir, writeFile, rm, access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { eventSchema, eventsSchema, eventTypes, eventRelationships, type KrowdEvent } from "../../src/data/event-schema";
import { extractEvent } from "./extract";
import { fetchPublic } from "./network";
import { eventStore, uniqueSlug } from "./store";
export type OrganizerIO = { ask: (question: string) => Promise<string>; print: (message: string) => void };
type Dependencies = { io: OrganizerIO; store?: ReturnType<typeof eventStore>; request?: typeof fetchPublic; imageDirectory?: string };
const yes = (answer: string) => /^y(?:es)?$/i.test(answer.trim());
const fields: (keyof KrowdEvent)[] = ["id", "title", "slug", "description", "date", "endDate", "venue", "city", "type", "relationship", "image", "sourceUrl", "registrationUrl", "featured"];
const nullable = new Set(["endDate", "image", "sourceUrl", "registrationUrl"]);
// Remote text is data, never terminal control sequences or executable instructions.
export const terminalText = (value: string) => value.replace(/[\u0000-\u001f\u007f-\u009f]/g, " ");
function show(io: OrganizerIO, value: unknown) { io.print(JSON.stringify(value, null, 2)); }
async function review(draft: Record<string, unknown>, records: KrowdEvent[], adding: boolean, io: OrganizerIO): Promise<KrowdEvent> {
  io.print("Review every field. Enter keeps the shown value; '-' clears an optional field. Dates use YYYY-MM-DD.");
  for (const key of fields) {
    if (key === "slug" && adding) draft.slug = uniqueSlug(String(draft.title), records);
    for (;;) {
      const choices = key === "type" ? ` (${eventTypes.join(", ")})` : key === "relationship" ? ` (${eventRelationships.join(", ")})` : key === "featured" ? " (true/false)" : "";
      const input = (await io.ask(`${key}${choices} [${terminalText(String(draft[key] ?? "missing"))}]: `)).trim();
      let value: unknown = input || draft[key];
      if (nullable.has(key) && input === "-") value = null;
      if (key === "featured" && input) value = input === "true" ? true : input === "false" ? false : input;
      const parsed = eventSchema.shape[key].safeParse(value);
      if (parsed.success) { draft[key] = parsed.data; break; }
      io.print(`${key}: ${parsed.error.issues.map(issue => issue.message).join("; ")}`);
    }
  }
  return eventSchema.parse(draft);
}
export async function runOrganizer(command: string, argument: string | undefined, dependencies: Dependencies): Promise<void> {
  const { io } = dependencies, store = dependencies.store ?? eventStore(), request = dependencies.request ?? fetchPublic;
  const snapshot = await store.read();
  if (command === "list") {
    io.print(snapshot.events.length ? snapshot.events.toSorted((a,b) => a.date.localeCompare(b.date)).map(event => terminalText(`${event.date} | ${event.title} | ${event.relationship} | ${event.slug}`)).join("\n") : "No events yet."); return;
  }
  if (!["add", "edit", "remove"].includes(command)) throw new Error("Use event:add, event:list, event:edit, event:remove or event:validate.");
  let existing: KrowdEvent | undefined;
  if (command !== "add") {
    const slug = argument || (await io.ask("Event slug: ")).trim();
    existing = snapshot.events.find(event => event.slug === slug);
    if (!existing) throw new Error(`No event with slug '${terminalText(slug)}'.`);
    io.print("CURRENT RECORD"); show(io, existing);
    if (command === "remove") {
      if (!yes(await io.ask("Remove event? (y/N) "))) { io.print("Cancelled. Nothing changed."); return; }
      await store.write(snapshot.events.filter(event => event.id !== existing!.id), snapshot.raw);
      io.print(`Event removed: ${existing.slug}\nMetadata validated\nsrc/data/events.json updated\nImages are retained; no asset files were deleted.`); return;
    }
  }
  let draft: Record<string, unknown> = existing ? { ...existing } : { id: randomUUID(), slug: "", title: "", description: "", date: "", endDate: null, venue: "", city: "", type: "other", relationship: "hosted", image: null, sourceUrl: null, registrationUrl: null, featured: false };
  if (command === "add") {
    if (argument) {
      const page = await request(argument);
      if (!/^(?:text\/html|application\/xhtml\+xml)(?:;|$)/i.test(page.contentType)) throw new Error("The URL did not return an HTML event page. Run event:add without a URL for manual entry.");
      const extracted = extractEvent(page.bytes.toString("utf8"), page.url);
      const { organizer, warnings, ...values } = extracted; draft = { ...draft, ...values, sourceUrl: page.url };
      io.print("EVENT FOUND");
      io.print([extracted.title, extracted.date, extracted.venue, extracted.city].map(value => terminalText(value || "missing")).join("\n"));
      for (const key of ["image", "description", "venue", "date"] as const) io.print(`${key.padEnd(14, ".")} ${extracted[key] ? "found" : "missing"}`);
      if (organizer) io.print(`Organizer (source metadata): ${terminalText(organizer)}`);
      warnings.forEach(warning => io.print(warning));
    } else io.print("Manual event entry. No page has been fetched.");
    io.print("How was KrowdKraft involved?\n1. Hosted\n2. Co-hosted\n3. Community partner\n4. Community support");
    for (;;) { const answer = (await io.ask("Choose 1-4: ")).trim(); const relation = eventRelationships[Number(answer) - 1]; if (/^[1-4]$/.test(answer) && relation) { draft.relationship = relation; break; } io.print("Choose a number from 1 to 4."); }
  }
  const otherRecords = snapshot.events.filter(event => event.id !== existing?.id);
  const reviewed = await review(draft, otherRecords, command === "add", io);
  // Cross-field and identity checks happen before any image download or file write.
  eventsSchema.parse([...otherRecords, reviewed]);
  io.print("REVIEWED EVENT"); show(io, reviewed);
  if (!yes(await io.ask(command === "edit" ? "Save changes? (y/N) " : "Save event? (y/N) "))) { io.print("Cancelled. Nothing changed."); return; }
  let createdImage: string | undefined;
  try {
    if (reviewed.image && /^https?:/i.test(reviewed.image)) {
      if (yes(await io.ask("Save image locally? (y/N) "))) {
        const download = await request(reviewed.image, 8_000_000);
        if (!/^image\/(?:png|jpeg|webp|avif|gif)(?:;|$)/i.test(download.contentType)) throw new Error("Only raster event images can be downloaded. Nothing was saved.");
        const bytes = await sharp(download.bytes, { limitInputPixels: 40_000_000, animated: false }).rotate().resize({ width: 1600, height: 1000, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
        const directory = dependencies.imageDirectory ?? fileURLToPath(new URL("../../public/events/", import.meta.url));
        await mkdir(directory, { recursive: true });
        let filename = `${reviewed.slug}.webp`;
        try { await access(join(directory, filename)); filename = `${reviewed.slug}-${randomUUID().slice(0,8)}.webp`; } catch { /* New asset name. */ }
        const destination = join(directory, filename);
        await writeFile(destination, bytes, { flag: "wx" }); createdImage = destination; reviewed.image = `/events/${filename}`;
      } else {
        if ((await io.ask('Image omitted by default. Type "Keep remote URL" to hotlink, or Enter to omit: ')).trim() !== "Keep remote URL") { reviewed.image = null; io.print("Image omitted. A local image can be added later."); }
      }
    }
    const next = existing ? snapshot.events.map(event => event.id === existing.id ? reviewed : event) : [...snapshot.events, reviewed];
    await store.write(next, snapshot.raw);
  } catch (error) { if (createdImage) await rm(createdImage, { force: true }); throw error; }
  io.print(`Event ${command === "add" ? "added" : "updated"}: ${reviewed.slug}\nMetadata validated\nsrc/data/events.json updated`);
}
