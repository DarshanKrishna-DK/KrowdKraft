import type { EventRecord } from './types';
export function officialEventUrl(event: EventRecord) {
  // Retained repository records are provenance, not public event destinations.
  const source =
    event.source_url && !/^https:\/\/github\.com\/.+\/blob\//.test(event.source_url)
      ? event.source_url
      : null;
  return source || event.registration_url || 'https://luma.com/krowdkraft_community?period=past';
}
export function googleCalendarUrl(event: EventRecord) {
  const stamp = (s: string) =>
    new Date(s)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const start = event.starts_at ? stamp(event.starts_at) : event.date.replaceAll('-', '');
  const end = event.ends_at
    ? stamp(event.ends_at)
    : event.starts_at
      ? start
      : new Date(Date.parse(event.date + 'T00:00:00Z') + 86400000)
          .toISOString()
          .slice(0, 10)
          .replaceAll('-', '');
  return (
    'https://calendar.google.com/calendar/render?' +
    new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: start + '/' + end,
      details: event.description + '\n' + officialEventUrl(event),
      location: event.venue + ', ' + event.city,
      ctz: 'Asia/Kolkata',
    })
  );
}
export const indiaDate = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
export function eventState(event: EventRecord, now = new Date()) {
  if (event.lifecycle === 'cancelled') return 'Cancelled';
  if (
    event.lifecycle === 'completed' ||
    (event.ends_at ? new Date(event.ends_at) <= now : event.date < indiaDate(now))
  )
    return 'Past event';
  if (event.starts_at && new Date(event.starts_at) <= now) return 'Happening now';
  return 'Upcoming';
}
export function registrationState(event: EventRecord, now = new Date()) {
  if (['Cancelled', 'Past event'].includes(eventState(event, now))) return 'Registration closed';
  if (event.registration_deadline && event.registration_deadline < indiaDate(now))
    return 'Registration closed';
  return {
    open: 'Registration open',
    closed: 'Registration closed',
    waitlist: 'Waitlist',
    unknown: 'See official details',
    'not-applicable': 'No registration',
  }[event.registration_status];
}
export function dateLabel(date: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
    ...options,
  }).format(new Date(`${date}T12:00:00+05:30`));
}
export function timeLabel(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(date));
}
export const eventType = (type: string) =>
  ({ hackathon: 'Hack day', workshop: 'Workshop', meetup: 'Meetup', 'technical-session': 'Tech session' })[
    type
  ] || type;
export function calendar(event: EventRecord) {
  const escape = (s: string) =>
    s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const stamp = (s: string) =>
    new Date(s)
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const start = event.starts_at
    ? `DTSTART:${stamp(event.starts_at)}`
    : `DTSTART;VALUE=DATE:${event.date.replaceAll('-', '')}`;
  const nextDay = new Date(Date.parse(`${event.date}T00:00:00Z`) + 86400000)
    .toISOString()
    .slice(0, 10)
    .replaceAll('-', '');
  const end = event.ends_at
    ? `DTEND:${stamp(event.ends_at)}`
    : !event.starts_at
      ? `DTEND;VALUE=DATE:${nextDay}`
      : '';
  const fold = (line: string) => {
    let part = '',
      bytes = 0;
    const parts: string[] = [];
    for (const character of line) {
      const length = new TextEncoder().encode(character).length;
      if (bytes + length > 75) {
        parts.push(part);
        part = ' ';
        bytes = 1;
      }
      part += character;
      bytes += length;
    }
    parts.push(part);
    return parts.join('\r\n');
  };
  return (
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KrowdKraft//Community events//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${event.slug}@krowdkraft`,
      `DTSTAMP:${stamp(new Date().toISOString())}`,
      start,
      end,
      `SUMMARY:${escape(event.title)}`,
      `DESCRIPTION:${escape(event.description)}`,
      `LOCATION:${escape(event.venue + ', ' + event.city)}`,
      `URL:${event.source_url}`,
      `STATUS:${event.lifecycle === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ]
      .filter(Boolean)
      .map(fold)
      .join('\r\n') + '\r\n'
  );
}
