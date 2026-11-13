import { getEvent } from '@/lib/data';
import { dateLabel, eventType, timeLabel } from '@/lib/events';
import { ogCard, ogSize } from '@/lib/og-card';

export const alt = 'KrowdKraft event';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) {
    return ogCard({
      eyebrow: 'Event',
      title: 'A KrowdKraft gathering.',
      footer: 'krowd-kraft.vercel.app/events',
    });
  }
  return ogCard({
    eyebrow: eventType(event.type),
    title: event.title,
    details: [
      dateLabel(event.date) + (event.starts_at ? ` · ${timeLabel(event.starts_at)} IST` : ''),
      `${event.venue}, ${event.city}`,
    ],
    footer: 'krowd-kraft.vercel.app/events',
    poster: event.image,
  });
}
