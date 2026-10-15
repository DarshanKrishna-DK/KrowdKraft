import { describe, it, expect } from 'vitest';
import {
  eventState,
  registrationState,
  indiaDate,
  calendar,
  googleCalendarUrl,
  officialEventUrl,
} from '../src/lib/events';
import type { EventRecord } from '../src/lib/types';
const event = {
  slug: 'hack-day',
  title: 'Hack day',
  description: 'Build things, share ideas; learn together.',
  date: '2026-10-18',
  starts_at: '2026-10-18T03:00:00Z',
  ends_at: '2026-10-18T13:00:00Z',
  venue: 'Startup Park',
  city: 'Bengaluru',
  lifecycle: 'scheduled',
  registration_status: 'open',
  registration_deadline: '2026-10-07',
  source_url: 'https://example.org/hack',
} as EventRecord;
describe('event lifecycle and calendar', () => {
  it('opens the official source and preserves timed or all-day calendar boundaries', () => {
    expect(officialEventUrl(event)).toBe(event.source_url);
    expect(
      officialEventUrl({
        ...event,
        source_url: 'https://github.com/example/community/blob/main/events.ts',
        registration_url: null,
      }),
    ).toBe('https://luma.com/krowdkraft_community?period=past');
    expect(new URL(googleCalendarUrl(event)).searchParams.get('dates')).toBe(
      '20261018T030000Z/20261018T130000Z',
    );
    const allDay = { ...event, starts_at: null, ends_at: null };
    expect(new URL(googleCalendarUrl(allDay)).searchParams.get('dates')).toBe('20261018/20261019');
    expect(new URL(googleCalendarUrl(event)).searchParams.get('text')).toBe(event.title);
  });
  it('keeps an upcoming event with expired registration upcoming', () => {
    const now = new Date('2026-10-15T12:00:00Z');
    expect(eventState(event, now)).toBe('Upcoming');
    expect(registrationState(event, now)).toBe('Registration closed');
  });
  it('uses Indian midnight for deadline and untimed event boundaries', () => {
    expect(indiaDate(new Date('2026-10-07T18:30:00Z'))).toBe('2026-10-08');
    expect(registrationState(event, new Date('2026-10-07T18:29:00Z'))).toBe('Registration open');
    expect(registrationState(event, new Date('2026-10-07T18:30:00Z'))).toBe('Registration closed');
  });
  it('prioritizes cancellation and transitions at actual end time', () => {
    expect(eventState({ ...event, lifecycle: 'cancelled' }, new Date('2026-10-15'))).toBe('Cancelled');
    expect(eventState(event, new Date('2026-10-18T10:00:00Z'))).toBe('Happening now');
    expect(eventState(event, new Date('2026-10-18T13:00:00Z'))).toBe('Past event');
  });
  it('writes escaped standards-compatible calendar records', () => {
    const value = calendar(event);
    expect(value).toContain('DTSTART:20261018T030000Z');
    expect(value).toContain('DTEND:20261018T130000Z');
    expect(value).toContain('DESCRIPTION:Build things\\, share ideas\\; learn together.');
    expect(value.endsWith('\r\n')).toBe(true);
  });
  it('folds long lines without splitting Unicode characters', () => {
    const value = calendar({ ...event, description: 'ಕನ್ನಡ '.repeat(40) });
    for (const line of value.split('\r\n'))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(value.replace(/\r\n /g, '')).toContain('ಕನ್ನಡ '.repeat(40));
  });
});
