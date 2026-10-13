import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events, kolkataToday } from "@/data/events";
import { EventDetail } from "@/components/events/event-detail";
import { pageMetadata } from "@/lib/page-metadata";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  return event
    ? pageMetadata(
        `${event.title} | KrowdKraft`,
        event.description.slice(0, 180),
        `/events/${event.slug}`,
        `/events/${event.slug}/share`,
      )
    : { title: "Event not found | KrowdKraft" };
}
export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();
  return <EventDetail event={event} today={kolkataToday()} />;
}
