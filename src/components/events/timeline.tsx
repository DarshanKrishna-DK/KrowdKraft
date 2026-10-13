"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  formatEventDate,
  isUpcoming,
  relationshipLabels,
  type KrowdEvent,
} from "@/data/events";
import { ClayNodes } from "@/components/clay";
import { Dialog } from "@/components/dialog";
import { EventContent } from "./event-content";
const filters = [
  { id: "hosted", label: "Hosted by us" },
  { id: "community", label: "With the community" },
  { id: "next", label: "What's next" },
] as const;
type Filter = (typeof filters)[number]["id"];
export function Timeline({
  events,
  today,
}: {
  events: KrowdEvent[];
  today: string;
}) {
  const [filter, setFilter] = useState<Filter>(
    events.some((event) => isUpcoming(event, today)) ? "next" : "hosted",
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [dialog, setDialog] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: false });
  const visible = events
    .filter((event) =>
      filter === "next"
        ? isUpcoming(event, today)
        : filter === "hosted"
          ? ["hosted", "co-hosted"].includes(event.relationship)
          : ["community-partner", "community-support"].includes(
              event.relationship,
            ),
    )
    .toSorted((a, b) =>
      filter === "next"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );
  const current = visible.find((event) => event.id === selected) ?? visible[0];
  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!direction && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? visible.length - 1
          : (index + direction + visible.length) % visible.length;
    setSelected(visible[next].id);
    track.current?.querySelectorAll<HTMLButtonElement>("button")[next].focus();
  }
  return (
    <div className="timeline-area">
      <div className="filter-pills" role="group" aria-label="Filter events">
        {filters.map((item) => (
          <button
            key={item.id}
            className={`button ${filter === item.id ? "selected" : ""}`}
            aria-pressed={filter === item.id}
            onClick={() => {
              setFilter(item.id);
              setSelected(null);
              setDialog(false);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {visible.length ? (
        <>
          <div
            className="timeline-track clay"
            ref={track}
            role="region"
            aria-label="Event timeline. Use left and right arrow keys to move between events."
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse" || event.button !== 0) return;
              drag.current = {
                down: true,
                startX: event.clientX,
                scroll: event.currentTarget.scrollLeft,
                moved: false,
              };
            }}
            onPointerMove={(event) => {
              if (!drag.current.down) return;
              const dx = event.clientX - drag.current.startX;
              if (Math.abs(dx) > 6) {
                drag.current.moved = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                event.currentTarget.scrollLeft = drag.current.scroll - dx;
              }
            }}
            onPointerUp={() => {
              drag.current.down = false;
            }}
            onPointerCancel={() => {
              drag.current.down = false;
            }}
            onClickCapture={(event) => {
              if (drag.current.moved) {
                event.preventDefault();
                event.stopPropagation();
                drag.current.moved = false;
              }
            }}
          >
            {visible.map((event, i) => (
              <button
                type="button"
                key={event.id}
                className={`timeline-point ${current?.id === event.id ? "active" : ""}`}
                aria-label={`${event.title}, ${formatEventDate(event.date)}`}
                aria-haspopup="dialog"
                onKeyDown={(e) => moveFocus(e, i)}
                onClick={() => {
                  setSelected(event.id);
                  setDialog(true);
                }}
              >
                <time dateTime={event.date}>{formatEventDate(event.date)}</time>
                <span className="track-node" aria-hidden="true" />
                <strong>{event.title}</strong>
                {event.featured && (
                  <span className="featured-label">Featured</span>
                )}
              </button>
            ))}
          </div>
          {current && (
            <article className="clay event-preview">
              <div>
                <span className="eyebrow">
                  {relationshipLabels[current.relationship]}
                </span>
                <h3>{current.title}</h3>
                <p className="body-copy">
                  {formatEventDate(current.date)} · {current.venue}
                </p>
              </div>
              <button className="button" onClick={() => setDialog(true)}>
                View event <span aria-hidden="true">↗</span>
              </button>
            </article>
          )}
          <Dialog
            open={dialog && !!current}
            onClose={() => setDialog(false)}
            titleId="event-dialog-title"
            className="event-dialog"
          >
            {current && (
              <>
                <h2 id="event-dialog-title">{current.title}</h2>
                <EventContent event={current} today={today} />
                <Link href={`/events/${current.slug}`} className="text-link">
                  Open shareable event page <span aria-hidden="true">↗</span>
                </Link>
              </>
            )}
          </Dialog>
        </>
      ) : (
        <div className="clay event-empty" role="status">
          <ClayNodes />
          <div>
            {filter === "next" ? (
              <>
                <h3>
                  We&apos;re krafting
                  <br />
                  the next one.
                </h3>
                <p>Join the community to hear about it first.</p>
              </>
            ) : (
              <>
                <h3>Nothing on this track yet.</h3>
                <p>Join the community to hear about it first.</p>
              </>
            )}
            <a className="button" href="#join">
              Join the Krowd <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
