import Link from "next/link";
import type { KrowdEvent } from "@/data/events";
import {
  registrationOpen,
  formatEventDate,
  formatEventTime,
  formatEventVenue,
  eventWeekday,
  eventWhen,
  typeLabels,
  relationshipLabels,
} from "@/data/event-utils";
import { Icon } from "@/components/icon";
export function EventTicket({
  event,
  today,
}: {
  event: KrowdEvent;
  today: string;
}) {
  const open = registrationOpen(event, today);
  const month = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(event.date));
  return (
    <article className="event-ticket" data-reveal>
      <div className="ticket-main">
        <div className="ticket-top">
          <span className="ticket-kicker">
            {eventWhen(event, today)} · {event.venue}
          </span>
          <span className="badge">
            {open
              ? "Registration open"
              : event.registrationDeadline
                ? "Registration closed"
                : "Event information"}
          </span>
        </div>
        <div className="ticket-content">
          <div className="ticket-title">
            <span className="ticket-format">
              {typeLabels[event.type]} ·{" "}
              {relationshipLabels[event.relationship]}
            </span>
            <h3>{event.title}</h3>
            <p>
              <Icon name="pin" size={17} /> {formatEventVenue(event)}
            </p>
            <p>
              <Icon name="calendar" size={17} /> {eventWeekday(event)},{" "}
              {formatEventDate(event.date)}
            </p>
            {event.startsAt && (
              <p className="ticket-time">{formatEventTime(event)}</p>
            )}
          </div>
        </div>
        <div className="ticket-bottom">
          <p>
            {open
              ? "Registration is open. Check the event page for entry requirements."
              : event.participantUrl
                ? "Registration closed. Confirmed participants: open the event page for check-in and the participant group."
                : "Open the event page for the latest details."}
          </p>
          <Link href={"/events/" + event.slug} className="button primary">
            Event details <Icon name="diagonal" size={18} />
          </Link>
        </div>
      </div>
      <div className="ticket-stub">
        <span>{eventWeekday(event)}</span>
        <strong>{event.date.slice(-2)}</strong>
        <span className="stub-month">
          {month} {event.date.slice(0, 4)}
        </span>
        {event.id === "hacktoberfest-2026" ? (
          <Link
            href={"/events/" + event.slug + "#schedule"}
            className="button quiet"
          >
            View schedule <Icon name="arrow" size={16} />
          </Link>
        ) : (
          <a
            className="button quiet"
            href={"/events/" + event.slug + "/calendar"}
          >
            Add to calendar <Icon name="calendar" size={16} />
          </a>
        )}
      </div>
    </article>
  );
}
