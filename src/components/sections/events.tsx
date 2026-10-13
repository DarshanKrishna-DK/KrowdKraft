import { events, kolkataToday } from "@/data/events";
import { Timeline } from "@/components/events/timeline";
export function Events() {
  return (
    <section
      id="events"
      className="section container"
      aria-labelledby="events-title"
    >
      <div className="events-intro">
        <div>
          <h2 id="events-title">
            The Krowd Map<span className="title-dot">.</span>
          </h2>
          <p className="body-copy">
            A timeline of places where the Krowd came together.
          </p>
        </div>
        <div
          data-figure="route"
          className="small-figure-placeholder"
          aria-hidden="true"
        />
      </div>
      <Timeline events={events} today={kolkataToday()} />
    </section>
  );
}
