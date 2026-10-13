/* eslint-disable @next/next/no-img-element -- Organizer-approved remote images avoid an arbitrary-host server proxy. */
import {
  formatEventDate,
  relationshipLabels,
  typeLabels,
  isUpcoming,
  type KrowdEvent,
} from "@/data/event-utils";
export function EventContent({
  event,
  today,
}: {
  event: KrowdEvent;
  today: string;
}) {
  return (
    <>
      {event.image && (
        <div className="event-image">
          <img
            src={event.image}
            width={960}
            height={540}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="event-badges">
        <span className="badge">{relationshipLabels[event.relationship]}</span>
        <span className="event-status">
          {isUpcoming(event, today) ? "Upcoming" : "Past event"}
        </span>
      </div>
      <dl className="event-facts">
        <div>
          <dt>When</dt>
          <dd>
            <time dateTime={event.date}>{formatEventDate(event.date)}</time>
            {event.endDate && event.endDate !== event.date && (
              <>
                {" "}
                to{" "}
                <time dateTime={event.endDate}>
                  {formatEventDate(event.endDate)}
                </time>
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>
            {event.venue}, {event.city}
          </dd>
        </div>
        <div>
          <dt>Format</dt>
          <dd>{typeLabels[event.type]}</dd>
        </div>
      </dl>
      <p className="body-copy event-description">{event.description}</p>
      <div className="actions">
        {event.registrationUrl && isUpcoming(event, today) && (
          <a
            className="button primary"
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Register <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {event.sourceUrl && (
          <a
            className="button"
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Event source <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </>
  );
}
