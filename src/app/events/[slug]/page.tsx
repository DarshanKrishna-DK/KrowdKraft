import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getEvent } from '@/lib/data';
import { dateLabel, officialEventUrl, timeLabel } from '@/lib/events';
import { isShareCrawlerUa } from '@/lib/share-crawler';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return { title: 'Event' };
  const when = dateLabel(event.date) + (event.starts_at ? ` · ${timeLabel(event.starts_at)} IST` : '');
  const description = `${when} at ${event.venue}, ${event.city}.`;
  return {
    title: event.title,
    description,
    openGraph: { title: event.title, description },
    twitter: { card: 'summary_large_image', title: event.title, description },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();
  const destination = officialEventUrl(event);
  if (!isShareCrawlerUa((await headers()).get('user-agent') ?? '')) redirect(destination);
  return (
    <article className="wrap page-body">
      <h1>{event.title}</h1>
      <p>
        {dateLabel(event.date)}
        {event.starts_at ? ` · ${timeLabel(event.starts_at)} IST` : ''} · {event.venue}, {event.city}
      </p>
      <p>{event.description}</p>
      <a className="button" href={destination}>
        Event details
      </a>
    </article>
  );
}
