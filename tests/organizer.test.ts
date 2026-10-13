import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { extractEvent } from "../scripts/events/extract";
import { eventStore, uniqueSlug } from "../scripts/events/store";
import { runOrganizer, terminalText, type OrganizerIO } from "../scripts/events/organizer";
import { publicAddress, fetchPublic } from "../scripts/events/network";
import type { KrowdEvent } from "../src/data/events";

const html = `<title>Fallback title</title><meta property="og:title" content="OG title"><meta property="og:image" content="/poster.png"><script type="application/ld+json">${JSON.stringify({ "@graph": [{ "@type": "Event", name: "Fixture developer meetup", description: "<p>Learn &amp; build together.</p>", startDate: "2030-01-01T22:00:00Z", endDate: "2030-01-03", location: { name: "Fixture venue", address: { addressLocality: "Bengaluru" } }, organizer: { name: "Fixture organizer" }, offers: { url: "/register" } }] })}</script>`;
const page = { bytes: Buffer.from(html), url: "https://example.com/event", contentType: "text/html; charset=utf-8" };
function ioFor(overrides: Record<string, string> = {}): OrganizerIO & { output: string[] } {
  const output: string[] = [];
  return { output, print: value => output.push(value), ask: async question => {
    output.push(question);
    if (question.startsWith("Choose 1-4")) return "2";
    const match = Object.keys(overrides).find(key => question.startsWith(key));
    return match ? overrides[match] : "";
  } };
}
async function sandbox() {
  const directory = await mkdtemp(join(tmpdir(), "krowdkraft-events-")), file = join(directory, "events.json");
  await writeFile(file, "[]\n"); return { directory, file, store: eventStore(file) };
}
test("extracts graph Event metadata, Kolkata dates, relative URLs and honest missing values", () => {
  const event = extractEvent(html, page.url);
  assert.equal(event.title, "Fixture developer meetup"); assert.equal(event.date, "2030-01-02");
  assert.equal(event.description, "Learn & build together."); assert.equal(event.venue, "Fixture venue");
  assert.equal(event.image, "https://example.com/poster.png"); assert.equal(event.registrationUrl, "https://example.com/register");
  assert.equal(event.organizer, "Fixture organizer");
  const missing = extractEvent('<title>Only a title</title><meta name="description" content="A &amp; B"><script type="application/ld+json">broken</script>', page.url);
  assert.equal(missing.title, "Only a title"); assert.equal(missing.description, "A & B"); assert.equal(missing.date, ""); assert.equal(missing.venue, ""); assert.equal(missing.warnings.length, 1);
  assert.equal(extractEvent(html.replace("2030-01-01T22:00:00Z", "2030-02-30T22:00:00Z"), page.url).date, "");
});
test("preview and default-no confirmation never write or download an image", async () => {
  const box = await sandbox(); let requests = 0; const io = ioFor();
  try {
    await runOrganizer("add", page.url, { io, store: box.store, request: async () => { requests++; return page; } });
    assert.equal(await readFile(box.file, "utf8"), "[]\n"); assert.equal(requests, 1);
    assert.ok(io.output.includes("EVENT FOUND")); assert.ok(io.output.some(line => line.startsWith("image") && line.includes("found")));
    assert.ok(io.output.includes("Cancelled. Nothing changed."));
  } finally { await rm(box.directory, { recursive: true, force: true }); }
});
test("add, unique slugs, edit and remove require approval and preserve empty final data", async () => {
  const box = await sandbox(); const request = async () => page;
  try {
    for (let i=0;i<2;i++) await runOrganizer("add", page.url, { io: ioFor({ "Save event?": "y" }), store: box.store, request });
    let saved = await box.store.read(); assert.equal(saved.events.length, 2);
    assert.deepEqual(saved.events.map(event => event.slug), ["fixture-developer-meetup", "fixture-developer-meetup-2"]);
    assert.equal(saved.events[0].image, null); assert.equal(saved.events[0].relationship, "co-hosted");
    const first = saved.events[0];
    await runOrganizer("edit", first.slug, { io: ioFor({ title: "Changed title" }), store: box.store });
    assert.equal((await box.store.read()).events[0].title, first.title);
    await runOrganizer("edit", first.slug, { io: ioFor({ title: "Changed title", "Save changes?": "yes" }), store: box.store });
    assert.equal((await box.store.read()).events[0].title, "Changed title");
    await runOrganizer("remove", first.slug, { io: ioFor(), store: box.store });
    assert.equal((await box.store.read()).events.length, 2);
    saved = await box.store.read();
    for (const event of saved.events) await runOrganizer("remove", event.slug, { io: ioFor({ "Remove event?": "y" }), store: box.store });
    assert.deepEqual((await box.store.read()).events, []);
  } finally { await rm(box.directory, { recursive: true, force: true }); }
});
test("image download requires separate approval, converts WebP and keeps remote URLs only explicitly", async () => {
  const box = await sandbox(); let downloads = 0;
  const png = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#888888" } }).png().toBuffer();
  const request = async (url: string) => { if (url.endsWith(".png")) { downloads++; return { bytes: png, url, contentType: "image/png" }; } return page; };
  try {
    await runOrganizer("add", page.url, { io: ioFor({ "Save event?": "y", "Save image locally?": "y" }), store: box.store, request, imageDirectory: box.directory });
    const first = (await box.store.read()).events[0]; assert.match(first.image!, /^\/events\/.+\.webp$/); assert.equal(downloads, 1);
    assert.equal((await sharp(await readFile(join(box.directory, first.image!.split("/").at(-1)!))).metadata()).format, "webp");
    await runOrganizer("add", page.url, { io: ioFor({ "Save event?": "y", "Image omitted": "Keep remote URL" }), store: box.store, request });
    assert.equal((await box.store.read()).events[1].image, "https://example.com/poster.png"); assert.equal(downloads, 1);
  } finally { await rm(box.directory, { recursive: true, force: true }); }
});
test("concurrent edits fail without overwriting data or leaving a lock", async () => {
  const box = await sandbox();
  try { const snapshot = await box.store.read(); await writeFile(box.file, "[ ]\n"); await assert.rejects(box.store.write([], snapshot.raw), /changed while/); assert.equal(await readFile(box.file, "utf8"), "[ ]\n"); assert.deepEqual(await readdir(box.directory), ["events.json"]); }
  finally { await rm(box.directory, { recursive: true, force: true }); }
});
test("network rejects local destinations and terminal previews strip controls", async () => {
  for (const address of ["127.0.0.1", "10.0.0.1", "172.16.0.1", "169.254.169.254", "192.168.1.1", "::1", "::ffff:127.0.0.1", "fc00::1"]) assert.equal(publicAddress(address), false);
  assert.equal(publicAddress("8.8.8.8"), true); assert.equal(publicAddress("2606:4700:4700::1111"), true);
  await assert.rejects(fetchPublic("http://127.0.0.1/private"), /Private/);
  assert.ok(!terminalText("\u001b[31mtext").includes("\u001b"));
  assert.equal(uniqueSlug("!!!", []), "community-event");
  assert.equal(uniqueSlug("Hello world", [{ slug: "hello-world" }] as KrowdEvent[]), "hello-world-2");
});
