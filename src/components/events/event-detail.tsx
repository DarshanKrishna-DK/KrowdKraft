/* eslint-disable @next/next/no-img-element -- Event photographs can be organizer-approved remote URLs. */
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Icon } from "@/components/icon";
import { DuckDock } from "@/components/duck/duck-dock";
import {
  formatEventDate,
  formatEventVenue,
  eventMapUrl,
  relationshipLabels,
  isUpcoming,
  registrationOpen,
  typeLabels,
  type KrowdEvent,
} from "@/data/event-utils";
import { partnerLinks } from "@/data/partners";
import { DateRefresh } from "./date-refresh";
const hackDaySchedule = [
  ["08:30", "Arrival & participant check-in"],
  ["09:00", "Welcome & Hacktoberfest orientation"],
  ["09:30", "Build time begins"],
  ["12:30–13:30", "Lunch break"],
  ["13:30", "Building resumes"],
  ["15:30", "Project submission deadline"],
  ["15:45–17:30", "Project judging"],
  ["17:30–18:00", "Final evaluation"],
  ["18:00", "Winners & closing ceremony"],
  ["18:30", "See you at the next one"],
];
export function EventDetail({
  event,
  today,
}: {
  event: KrowdEvent;
  today: string;
}) {
  const upcoming = isUpcoming(event, today),
    registration = registrationOpen(event, today);
  return (
    <PageShell>
      <DateRefresh today={today} />
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/events">Events</Link>
          <span aria-hidden="true">/</span>
          <span>{upcoming ? "Coming up" : "The archive"}</span>
        </nav>
        <div className="page-intro">
          <p className="eyebrow">
            {typeLabels[event.type]} · {relationshipLabels[event.relationship]}
          </p>
          <h1>
            {event.title}
            <span style={{ color: "var(--lime)" }}>.</span>
          </h1>
        </div>
        <div className="event-detail-layout">
          <div>
            {event.id === "hacktoberfest-2026" && (
              <div className="subsection" id="schedule">
                <h2>Schedule</h2>
                <p className="page-note">
                  18 October 2026 · All times IST. The organizer’s schedule may
                  change.
                </p>
                <div className="schedule">
                  {hackDaySchedule.map(([time, description]) => (
                    <div key={time}>
                      <time>{time}</time>
                      <span>{description}</span>
                    </div>
                  ))}
                </div>
                <p className="page-note">
                  Teams of 1–3. Bring your laptop, charger and a valid ID.
                  Confirmed participants complete OrganizerHQ check-in at the
                  venue. Follow the{" "}
                  <a
                    href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    MLH Code of Conduct
                  </a>{" "}
                  and venue guidance.
                </p>
              </div>
            )}
            <h2 style={{ fontSize: 34, letterSpacing: "-.04em" }}>
              {upcoming ? "Before you arrive" : "Event notes"}
            </h2>
            <p className="event-description">{event.description}</p>
            {event.image && (
              <figure className="event-details-image">
                <img
                  src={event.image}
                  width={1200}
                  height={800}
                  alt={`The community gathered for ${event.title}`}
                  referrerPolicy="no-referrer"
                />
                <figcaption className="page-note">
                  {event.title} · {event.venue} · {formatEventDate(event.date)}
                </figcaption>
              </figure>
            )}
            {event.partners?.length ? (
              <div className="subsection">
                <h2>With our collaborators</h2>
                <p className="page-note">
                  Event collaborators, as listed by the organizers.
                </p>
                <div className="event-partners">
                  {event.partners.map((partner) =>
                    partnerLinks[partner] ? (
                      <a
                        className="badge partner-link"
                        href={partnerLinks[partner]}
                        key={partner}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {partner} ↗
                      </a>
                    ) : (
                      <span className="badge" key={partner}>
                        {partner}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ) : null}
            <DuckDock
              id="event-detail"
              autoTip={false}
              mood={upcoming ? "curious" : "happy"}
              tip={
                upcoming
                  ? "A full day of building. Your charger would like an invitation too."
                  : "Proof that 'we should do something together' can become a very good day."
              }
              href={event.sourceUrl || "/events"}
              label={
                event.sourceUrl ? "Original event listing" : "Browse events"
              }
            />
          </div>
          <aside className="event-sidebar" aria-label="Event essentials">
            <span className={`badge ${upcoming ? "lime" : ""}`}>
              {upcoming ? "On the calendar" : "Past event"}
            </span>
            <dl className="event-facts">
              <div>
                <dt>Date</dt>
                <dd>
                  <time dateTime={event.date}>
                    {formatEventDate(event.date)}
                  </time>
                </dd>
              </div>
              {event.startsAt && (
                <div>
                  <dt>Time · IST</dt>
                  <dd>
                    {new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(event.startsAt))}
                    {event.endsAt && (
                      <>
                        {" "}
                        –{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(event.endsAt))}
                      </>
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt>Meet us at</dt>
                <dd>{formatEventVenue(event)}</dd>
              </div>
            </dl>
            {event.registrationDeadline && upcoming && !registration && (
              <p className="page-note">
                Registration closed on{" "}
                {formatEventDate(event.registrationDeadline)}. This page is for
                event information and confirmed participants.
              </p>
            )}
            {registration && (
              <a
                className="button primary"
                href={event.registrationUrl!}
                target="_blank"
                rel="noreferrer"
              >
                Registration details <Icon name="diagonal" size={17} />
              </a>
            )}
            {event.sourceUrl && (
              <a
                className={`button ${registration ? "" : "primary"}`}
                href={event.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Official event page <Icon name="diagonal" size={17} />
              </a>
            )}
            <a className="button" href={`/events/${event.slug}/calendar`}>
              Add to calendar <Icon name="calendar" size={17} />
            </a>
            {event.participantUrl && upcoming && (
              <a
                className="button"
                href={event.participantUrl}
                target="_blank"
                rel="noreferrer"
              >
                Participant group <Icon name="diagonal" size={17} />
              </a>
            )}
            {event.venue !== event.city && (
              <a
                className="button"
                href={eventMapUrl(event)}
                target="_blank"
                rel="noreferrer"
              >
                Open venue map <Icon name="pin" size={17} />
              </a>
            )}
            <p className="page-note">
              {event.sourceUrl
                ? "Dates and details come from the linked organizer source."
                : "Restored from the community archive. An original public listing is not currently available."}
            </p>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
