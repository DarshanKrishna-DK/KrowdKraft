import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { events, kolkataToday } from "@/data/events";
import { EventDetail } from "@/components/events/event-detail";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  return event
    ? {
        title: `${event.title} | KrowdKraft`,
        description: event.description.slice(0, 180),
      }
    : { title: "Event not found | KrowdKraft" };
}
export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();
  return <EventDetail event={event} today={kolkataToday()} />;
}
