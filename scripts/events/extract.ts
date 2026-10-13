import { Parser } from "htmlparser2";
import { dateSchema, httpUrl } from "../../src/data/event-schema";
import { kolkataToday } from "../../src/data/event-utils";
export type ExtractedEvent = { title: string; description: string; date: string; endDate: string | null; venue: string; city: string; image: string | null; registrationUrl: string | null; organizer: string; warnings: string[] };
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const string = (value: unknown) => typeof value === "string" ? value.trim() : "";
export function plainText(html: string): string {
  let text = "", hidden = 0;
  const parser = new Parser({ onopentag: name => { if (["script", "style"].includes(name)) hidden++; else if (["p", "br", "div", "li"].includes(name)) text += " "; }, ontext: value => { if (!hidden) text += value; }, onclosetag: name => { if (["script", "style"].includes(name)) hidden = Math.max(0, hidden - 1); else if (["p", "div", "li"].includes(name)) text += " "; } }, { decodeEntities: true });
  parser.end(html); return text.replace(/\s+/g, " ").trim();
}
function url(value: unknown, base: string): string | null {
  const item = Array.isArray(value) ? value[0] : value;
  const candidate = string(item) || string(record(item).url) || string(record(item).contentUrl);
  if (!candidate) return null;
  try { const resolved = new URL(candidate, base).href; return httpUrl.safeParse(resolved).success ? resolved : null; } catch { return null; }
}
function date(value: unknown): string {
  const input = string(value);
  if (dateSchema.safeParse(input).success) return input;
  if (!dateSchema.safeParse(input.slice(0, 10)).success) return "";
  if (/T.*(?:Z|[+-]\d{2}:?\d{2})$/i.test(input)) {
    const time = new Date(input); return Number.isFinite(time.getTime()) ? kolkataToday(time) : "";
  }
  const day = input.slice(0, 10); return dateSchema.safeParse(day).success ? day : "";
}
export function extractEvent(html: string, source: string): ExtractedEvent {
  const meta = new Map<string, string>(), scripts: string[] = [], warnings: string[] = [];
  let title = "", inTitle = false, inJson = false, json = "";
  const parser = new Parser({
    onopentag(name, attrs) {
      if (name === "meta") { const key = (attrs.property || attrs.name || "").toLowerCase(); if (attrs.content && !meta.has(key)) meta.set(key, attrs.content); }
      if (name === "title") inTitle = true;
      if (name === "script" && attrs.type?.toLowerCase().split(";")[0] === "application/ld+json") { inJson = true; json = ""; }
    },
    ontext(text) { if (inTitle) title += text; if (inJson) json += text; },
    onclosetag(name) { if (name === "title") inTitle = false; if (name === "script" && inJson) { scripts.push(json); inJson = false; } },
  }, { decodeEntities: true });
  parser.end(html);
  const events: Record<string, unknown>[] = []; let visited = 0;
  function walk(value: unknown, depth = 0) {
    if (++visited > 2000 || depth > 20) return;
    if (Array.isArray(value)) { value.forEach(item => walk(item, depth + 1)); return; }
    const item = record(value), types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
    if (types.some(type => typeof type === "string" && /(?:^|[/#])\w*Event$/.test(type))) events.push(item);
    for (const child of Object.values(item)) if (child && typeof child === "object") walk(child, depth + 1);
  }
  for (const script of scripts) { try { walk(JSON.parse(script)); } catch { warnings.push("One JSON-LD block could not be parsed; review the extracted fields."); } }
  if (events.length > 1) warnings.push(`${events.length} events found. The first is previewed; verify that it is the intended event.`);
  const event = events[0] ?? {}, location = record(Array.isArray(event.location) ? event.location[0] : event.location), address = record(location.address);
  const offers = record(Array.isArray(event.offers) ? event.offers[0] : event.offers);
  const organizer = Array.isArray(event.organizer) ? event.organizer[0] : event.organizer;
  return {
    title: plainText(string(event.name) || meta.get("og:title") || title).slice(0, 180),
    description: plainText(string(event.description) || meta.get("og:description") || meta.get("description") || "").slice(0, 10000),
    date: date(event.startDate), endDate: date(event.endDate) || null,
    venue: string(location.name) || string(event.location) || string(address.streetAddress),
    city: string(address.addressLocality),
    image: url(event.image, source) || url(meta.get("og:image"), source),
    registrationUrl: url(offers.url, source) || url(event.url, source),
    organizer: string(record(organizer).name) || string(organizer), warnings,
  };
}
