import records from "./events.json";
import { eventsSchema, type KrowdEvent } from "./event-schema";
export type { KrowdEvent, EventType, EventRelationship } from "./event-schema";
export const events = eventsSchema.parse(records);
export const relationshipLabels = {
  hosted: "Hosted by KrowdKraft",
  "co-hosted": "Co-hosted",
  "community-partner": "Community partner",
  "community-support": "Community support",
} as const;
export const typeLabels = {
  hackathon: "Hackathon",
  meetup: "Meetup",
  workshop: "Workshop",
  conference: "Conference",
  "technical-session": "Technical session",
  "community-event": "Community event",
  other: "Other",
} as const;
export function kolkataToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function isUpcoming(event: KrowdEvent, today = kolkataToday()): boolean {
  return event.date >= today;
}
export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T00:00:00+05:30`));
}
