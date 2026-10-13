import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events, kolkataToday } from "@/data/events";
import { EventContent } from "@/components/events/event-content";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
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
  return (
    <>
      <Nav detail />
      <main id="main" className="container event-page">
        <Link className="text-link" href="/#events">
          ← Back to the Krowd Map
        </Link>
        <h1>{event.title}</h1>
        <div className="event-details clay">
          <EventContent event={event} today={kolkataToday()} />
        </div>
      </main>
      <Footer />
    </>
  );
}
