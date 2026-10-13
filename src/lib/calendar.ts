import type { KrowdEvent } from "@/data/event-schema";
const escape = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
const timestamp = (value: string) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
// RFC 5545 folds at 75 octets; count UTF-8 bytes instead of JavaScript characters.
function fold(line: string) {
  let current = "",
    bytes = 0;
  const lines: string[] = [];
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > 75) {
      lines.push(current);
      current = " ";
      bytes = 1;
    }
    current += char;
    bytes += size;
  }
  lines.push(current);
  return lines.join("\r\n");
}
export function eventCalendar(event: KrowdEvent, now = new Date()): string {
  const end = new Date(`${event.endDate || event.date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const endLine = event.startsAt
    ? event.endsAt
      ? [`DTEND:${timestamp(event.endsAt)}`]
      : []
    : [
        `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replaceAll("-", "")}`,
      ];
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//KrowdKraft//Community Calendar//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${event.id}@krowdkraft`,
      `DTSTAMP:${timestamp(now.toISOString())}`,
      event.startsAt
        ? `DTSTART:${timestamp(event.startsAt)}`
        : `DTSTART;VALUE=DATE:${event.date.replaceAll("-", "")}`,
      ...endLine,
      `SUMMARY:${escape(event.title)}`,
      `DESCRIPTION:${escape(event.description)}`,
      `LOCATION:${escape(`${event.venue}, ${event.city}`)}`,
      ...(event.sourceUrl ? [`URL:${escape(event.sourceUrl)}`] : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}
