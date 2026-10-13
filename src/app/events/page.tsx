import { pageMetadata } from "@/lib/page-metadata";
import { PageShell } from "@/components/page-shell";
import { EventArchive } from "@/components/events/event-archive";
import { DuckDock } from "@/components/duck/duck-dock";
import { events, kolkataToday } from "@/data/events";
import { DateRefresh } from "@/components/events/date-refresh";
import { featuredEvents } from "@/data/event-utils";
import { links } from "@/data/links";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Events & gatherings | KrowdKraft",
  "Hack days, workshops and good company. Explore upcoming KrowdKraft events and revisit our Bengaluru community archive.",
  "/events",
);
export default function EventsPage() {
  const today = kolkataToday(),
    { next } = featuredEvents(events, today);
  return (
    <PageShell className="events-page">
      <DateRefresh today={today} />
      <div className="container">
        <div className="events-masthead">
          <div className="page-intro">
            <h1>
              Hack days, workshops,
              <br />
              <span className="serif-word">and meetups.</span>
            </h1>
            <p>
              In Bengaluru, with developers who learn by building. Find a date,
              check the details, and join us.
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
          <br />7 documented events from more than 30 gatherings across our
          community’s history. Historical entries are restored from our archive;
          original organizer links are included where available.
        </p>
      </div>
    </PageShell>
  );
}
