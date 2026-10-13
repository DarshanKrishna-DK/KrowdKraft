import Link from "next/link";
import type { KrowdEvent } from "@/data/events";
import {
  registrationOpen,
  formatEventDate,
  formatEventTime,
} from "@/data/event-utils";
import { Icon } from "@/components/icon";
export function EventTicket({
  event,
  today,
}: {
  event: KrowdEvent;
  today: string;
}) {
  const [year, month, day] = event.date.split("-");
  const monthName = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${year}-${month}-01T00:00:00Z`));
  return (
    <article className="event-ticket" data-reveal>
      <div className="ticket-main">
        <div className="ticket-top">
          <span className="ticket-kicker">
            <span className="live-dot" /> Up next in Bengaluru
          </span>
          <span className="mono ticket-edition">KK / {year}</span>
        </div>
        <div className="ticket-content">
          <div className="ticket-title">
            <span className="ticket-format">OPEN SOURCE · OPEN MINDS</span>
            <h3>{event.title}</h3>
            <p>
              <Icon name="pin" size={17} /> {event.venue}, {event.city}
            </p>
            <p>
              <Icon name="calendar" size={17} /> {formatEventDate(event.date)}
              {event.startsAt && ` · ${formatEventTime(event)}`}
            </p>
          </div>
          <div className="ticket-code" aria-hidden="true">
            <span>&lt;</span>
            <i>/</i>
            <span>&gt;</span>
            <div className="ticket-code-shadow" />
          </div>
        </div>
        <div className="ticket-bottom">
          <span>
            {registrationOpen(event, today)
              ? "Registration open"
              : "Registration closed · Details for participants below"}
          </span>
          <Link href={`/events/${event.slug}`} className="button dark">
            Event details <Icon name="diagonal" size={18} />
          </Link>
        </div>
      </div>
      <div className="ticket-stub">
        <span className="mono">SAVE THE DATE</span>
        <strong>{day}</strong>
        <span className="stub-month">
          {monthName.toUpperCase()} ’{year.slice(2)}
        </span>
        <div className="ticket-barcode" aria-hidden="true" />
        <span className="mono">BENGALURU / IN PERSON</span>
      </div>
    </article>
  );
}
