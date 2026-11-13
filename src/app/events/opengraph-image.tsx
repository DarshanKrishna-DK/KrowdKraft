import { getEvents } from '@/lib/data';
import { dateLabel, eventState, timeLabel } from '@/lib/events';
import { ogCard, ogSize } from '@/lib/og-card';
export const alt = 'KrowdKraft events';
export const size = ogSize;
export const contentType = 'image/png';
export default async function Image() {
  const events = await getEvents();
  const upcoming = events
    .filter((e) => ['Upcoming', 'Happening now'].includes(eventState(e)))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const next =
    upcoming ??
    events.filter((e) => eventState(e) === 'Past event').sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!next) {
    return ogCard({
      eyebrow: 'Events',
      title: 'Workshops, hack days and meetups.',
      footer: 'krowd-kraft.vercel.app/events',
    });
  }
  return ogCard({
    eyebrow: `${upcoming ? 'Next up' : 'Latest event'} · ${next.type.replace('-', ' ')}`,
    title: next.title,
    details: [
      dateLabel(next.date) + (next.starts_at ? ` · ${timeLabel(next.starts_at)} IST` : ''),
      `${next.venue}, ${next.city}`,
    ],
    footer: 'krowd-kraft.vercel.app/events',
    poster: next.image,
  });
}
