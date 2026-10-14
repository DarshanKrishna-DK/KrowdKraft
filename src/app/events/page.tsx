import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { EventArchive } from "@/components/events/event-archive";
import { DuckDock } from "@/components/duck/duck-dock";
import { events, kolkataToday } from "@/data/events";
import { DateRefresh } from "@/components/events/date-refresh";
import { featuredEvents } from "@/data/event-utils";
import { links } from "@/data/links";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Events & gatherings | KrowdKraft",
  description:
    "Hack days, workshops and good company. Explore upcoming KrowdKraft events and revisit our Bengaluru community archive.",
};
export default function EventsPage() {
  const today = kolkataToday(),
    { next } = featuredEvents(events, today);
  return (
    <PageShell className="events-page">
      <DateRefresh today={today} />
      <div className="container">
        <div className="events-masthead">
          <div className="page-intro">
            <p className="eyebrow">IRL beats another group chat</p>
            <h1>
              Good people.
              <br />
              <span className="serif-word">Great gatherings.</span>
            </h1>
            <p>
              Come for the workshop. Stay for the people. Every event is another
              reason to get curious, try something new and build together.
            </p>
            <DuckDock
              id="events-page"
              mood="wave"
              tip="All the good reasons to close a few tabs and leave the house."
              href={links.luma}
              label="Follow our Luma calendar"
            />
          </div>
          <div className="calendar-sculpture" aria-hidden="true">
            <div className="calendar-rings">
              <i />
              <i />
            </div>
            <span>
              {next
                ? new Intl.DateTimeFormat("en", {
                    month: "long",
                    timeZone: "UTC",
                  }).format(new Date(next.date))
                : "On the calendar"}
            </span>
            <strong>{next ? next.date.slice(-2) : "Soon"}</strong>
            <small>
              {next
                ? "Next gathering · Bengaluru"
                : "A new reason to get together"}
            </small>
          </div>
        </div>
        <EventArchive events={events} today={today} />
        <p className="page-note">
          More dates as they’re announced.{" "}
          <a href={links.luma} target="_blank" rel="noreferrer">
            Follow KrowdKraft on Luma ↗
          </a>
          <br />
          Historical listings are restored from our community archive. Each
          event links to its original source.
        </p>
      </div>
    </PageShell>
  );
}
