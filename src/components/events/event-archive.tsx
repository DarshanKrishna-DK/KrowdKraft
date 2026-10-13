"use client";
/* eslint-disable @next/next/no-img-element -- Organizer-approved local event covers. */
import Link from "next/link";
import { useState } from "react";
import {
  type KrowdEvent,
  isUpcoming,
  formatEventDate,
  formatEventVenue,
  typeLabels,
  relationshipLabels,
  registrationOpen,
} from "@/data/event-utils";
import { Icon } from "@/components/icon";
export function EventPoster({ event }: { event: KrowdEvent }) {
  return (
    <div className={"event-poster poster-" + event.id}>
      <span className="poster-date">{formatEventDate(event.date)}</span>
      {event.image ? (
        <img
          src={event.image}
          alt=""
          width={600}
          height={400}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="poster-lettering" aria-hidden="true">
          <strong>{typeLabels[event.type]}</strong>
          <span>{event.venue}</span>
        </div>
      )}
      <span className="poster-type">{event.city}</span>
    </div>
  );
}
export function EventArchive({
  events,
  today,
}: {
  events: KrowdEvent[];
  today: string;
}) {
  const [filter, setFilter] = useState("all"),
    [query, setQuery] = useState(""),
    [type, setType] = useState("all"),
    [venue, setVenue] = useState("all");
  const upcoming = events.filter((e) => isUpcoming(e, today)).length;
  const types = [...new Set(events.map((e) => e.type))];
  const venues = [...new Set(events.map((e) => e.venue))];
  const reset = () => {
    setFilter("all");
    setQuery("");
    setType("all");
    setVenue("all");
  };
  const matches = events
    .filter(
      (e) =>
        (filter === "all" ||
          (filter === "upcoming"
            ? isUpcoming(e, today)
            : !isUpcoming(e, today))) &&
        (type === "all" || e.type === type) &&
        (venue === "all" || e.venue === venue) &&
        [
          e.title,
          e.venue,
          e.description,
          typeLabels[e.type],
          ...(e.partners ?? []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <div className="filter-bar">
        <div className="filter-tabs" role="group" aria-label="Filter events">
          {[
            ["all", "All events"],
            ["upcoming", "Coming up"],
            ["past", "Past events"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="filter-search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search events</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, topic or collaborator"
          />
        </label>
      </div>
      <div className="event-refinements">
        <label>
          <span id="event-type-label">Event type</span>
          <select
            aria-labelledby="event-type-label"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All types</option>
            {types.map((t) => (
              <option value={t} key={t}>
                {typeLabels[t]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span id="event-venue-label">Venue</span>
          <select
            aria-labelledby="event-venue-label"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          >
            <option value="all">All venues</option>
            {venues.map((v) => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <p className="page-note">
          {events.length} documented events · {upcoming} upcoming ·{" "}
          {events.length - upcoming} past
        </p>
      </div>
      <p className="form-hint" role="status" style={{ marginBottom: 20 }}>
        {matches.length} {matches.length === 1 ? "event" : "events"} shown
      </p>
      <div className="event-archive">
        {matches.map((event) => (
          <Link
            href={"/events/" + event.slug}
            key={event.id}
            className="event-archive-card"
          >
            <EventPoster event={event} />
            <div className="event-archive-content">
              <span className="badge">
                {isUpcoming(event, today)
                  ? registrationOpen(event, today)
                    ? "Registration open"
                    : event.registrationDeadline
                      ? "Registration closed"
                      : "Coming up"
                  : "Past event"}
              </span>
              <h2>{event.title}</h2>
              <p>{formatEventVenue(event)}</p>
              <p className="event-role">
                {typeLabels[event.type]} ·{" "}
                {relationshipLabels[event.relationship]}
              </p>
              <div className="archive-card-bottom">
                <span>
                  {isUpcoming(event, today)
                    ? "Event details"
                    : "Read event notes"}
                </span>
                <Icon name="diagonal" size={19} />
              </div>
            </div>
          </Link>
        ))}
        {!matches.length && (
          <div className="archive-empty">
            <h2>No events match these filters.</h2>
            <p>Try another topic or venue.</p>
            <button
              type="button"
              className="button"
              style={{ marginTop: 22 }}
              onClick={reset}
            >
              Show all events
            </button>
          </div>
        )}
      </div>
    </>
  );
}
