"use client";
/* eslint-disable @next/next/no-img-element -- Archived images retain organizer-approved source URLs. */
import Link from "next/link";
import { useState } from "react";
import {
  type KrowdEvent,
  isUpcoming,
  formatEventDate,
  typeLabels,
} from "@/data/event-utils";
import { Icon } from "@/components/icon";
const symbols: Record<string, string> = {
  "hacktoberfest-2026": "</>",
  "x402-prehack-2026": "x402",
  "namaste-arbitrum-2025": "arb.",
  "preptember-2025": "{ pr }",
  "blockchain-101-2025": "0x01",
  "github-linkedin-2025": "git+",
};
export function EventPoster({ event }: { event: KrowdEvent }) {
  return (
    <div className={`event-poster poster-${event.id}`}>
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
        <span className="poster-symbol" aria-hidden="true">
          {symbols[event.id] || "&lt;/&gt;"}
        </span>
      )}
      <span className="poster-type">{typeLabels[event.type]} / Bengaluru</span>
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
    [query, setQuery] = useState("");
  const matches = events
    .filter(
      (event) =>
        (filter === "all" ||
          (filter === "upcoming"
            ? isUpcoming(event, today)
            : !isUpcoming(event, today))) &&
        `${event.title} ${event.venue} ${event.description}`
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find your kind of gathering…"
          />
        </label>
      </div>
      <p className="form-hint" role="status" style={{ marginBottom: 20 }}>
        {matches.length} {matches.length === 1 ? "event" : "events"}
        {filter !== "all" &&
          ` · ${filter === "past" ? "From the archive" : "On the calendar"}`}
      </p>
      <div className="event-archive">
        {matches.map((event) => (
          <Link
            href={`/events/${event.slug}`}
            key={event.id}
            className="event-archive-card"
          >
            <EventPoster event={event} />
            <div className="event-archive-content">
              <span
                className={`badge ${isUpcoming(event, today) ? "lime" : ""}`}
              >
                {isUpcoming(event, today) ? "Coming up" : "From the archive"}
              </span>
              <h2>{event.title}</h2>
              <p>
                {event.venue}, {event.city}
              </p>
              <div className="archive-card-bottom">
                <span>
                  {isUpcoming(event, today)
                    ? "Event details"
                    : "Revisit the gathering"}
                </span>
                <Icon name="diagonal" size={19} />
              </div>
            </div>
          </Link>
        ))}
        {!matches.length && (
          <div className="archive-empty">
            <h2>No gatherings in this corner.</h2>
            <p>Try a different search, or browse all events.</p>
            <button
              className="button"
              style={{ marginTop: 22 }}
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Show all events
            </button>
          </div>
        )}
      </div>
    </>
  );
}
