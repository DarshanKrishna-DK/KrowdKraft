import type { KrowdEvent } from "./event-schema";
export type { KrowdEvent, EventType, EventRelationship } from "./event-schema";
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
  const get = (type: Intl.DateTimeFormatPartTypes) => {
    const part = parts.find((item) => item.type === type);
    if (!part) throw new RangeError(`Missing ${type} in calendar date`);
    return part.value;
  };
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function isUpcoming(event: KrowdEvent, today = kolkataToday()): boolean {
  return (event.endDate || event.date) >= today;
}
export function featuredEvents(events: KrowdEvent[], today = kolkataToday()) {
  return {
    next: events
      .filter((event) => isUpcoming(event, today))
      .sort((a, b) => a.date.localeCompare(b.date))[0],
    recent: events
      .filter((event) => !isUpcoming(event, today))
      .sort((a, b) =>
        (b.endDate || b.date).localeCompare(a.endDate || a.date),
      )[0],
  };
}
export function registrationOpen(
  event: KrowdEvent,
  today = kolkataToday(),
): boolean {
  return Boolean(
    event.registrationUrl &&
    isUpcoming(event, today) &&
    (!event.registrationDeadline || today <= event.registrationDeadline),
  );
}
export function formatEventDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${date}T00:00:00+05:30`));
}
export function formatEventTime(event: KrowdEvent): string | null {
  if (!event.startsAt) return null;
  const format = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  return `${format.format(new Date(event.startsAt))}${event.endsAt ? ` – ${format.format(new Date(event.endsAt))}` : ""} IST`;
}
export function formatEventVenue(event: KrowdEvent): string {
  return event.venue.toLowerCase() === event.city.toLowerCase()
    ? event.city
    : `${event.venue}, ${event.city}`;
}
export function eventWeekday(event: KrowdEvent): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${event.date}T12:00:00+05:30`));
}
export function eventWhen(event: KrowdEvent, today: string): string {
  const days = Math.round(
    (Date.parse(event.date) - Date.parse(today)) / 86_400_000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1 && days < 7) return `This ${eventWeekday(event)}`;
  return formatEventDate(event.date);
}
export function eventMapUrl(event: KrowdEvent): string {
  if (event.venue === "Startup Park")
    return "https://www.google.com/maps/search/?api=1&query=12.9218575%2C77.6201801&query_place_id=ChIJAV-3WAAVrjsRImMeww6Vt9M";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatEventVenue(event))}`;
}
