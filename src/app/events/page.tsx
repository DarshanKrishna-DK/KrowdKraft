import { DateRefresh } from '@/components/date-refresh';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getEvents } from '@/lib/data';
import { eventState } from '@/lib/events';
import { EventCard } from '@/components/content-cards';
import { DirectoryArt } from '@/components/directory-art';
import { EventFilters } from '@/components/directory-filters';
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Hackathons, workshops and meetups with the KrowdKraft community in Bengaluru.',
};

export default async function Events({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const events = await getEvents();
  const q = typeof params.q === 'string' ? params.q.slice(0, 120).trim() : '';
  const when = ['upcoming', 'past'].includes(params.when || '') ? params.when! : 'all';
  const type = ['hackathon', 'workshop', 'meetup', 'technical-session'].includes(params.type || '')
    ? params.type!
    : '';
  const years = [...new Set(events.map((event) => event.date.slice(0, 4)))].sort().reverse();
  const year = years.includes(params.year || '') ? params.year! : '';
  const filtered = events
    .filter(
      (event) =>
        (!q ||
          `${event.title} ${event.description} ${event.venue}`.toLowerCase().includes(q.toLowerCase())) &&
        (!type || event.type === type) &&
        (!year || event.date.startsWith(year)) &&
        (when === 'all' ||
          (when === 'past'
            ? eventState(event) === 'Past event'
            : ['Upcoming', 'Happening now'].includes(eventState(event)))),
    )
    .sort((a, b) => {
      const active = (event: typeof a) => ['Upcoming', 'Happening now'].includes(eventState(event));
      if (active(a) !== active(b)) return active(a) ? -1 : 1;
      return active(a) ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
  const hasFilters = !!(q || type || year || when !== 'all');
  const hackathons = filtered.filter((event) => event.type === 'hackathon');
  const otherEvents = filtered.filter((event) => event.type !== 'hackathon');

  return (
    <>
      <DateRefresh />
      <section className="directory-hero wrap">
        <div className="directory-hero-copy">
          <h1>
            Meet. Make.
            <br />
            Do it again.
          </h1>
          <p>
            Hackathons, workshops and conversations with people who like making things. Find your next
            gathering, or revisit a past one.
          </p>
          <div className="directory-hero-note">
            <Icon name="pin" size={16} />
            <span>Bengaluru, and wherever we build next</span>
          </div>
        </div>
        <DirectoryArt kind="events" />
      </section>
      <section className="wrap directory-body">
        <EventFilters value={{ q, when, type, year }} years={years} />
        <div
          id="directory-event-results"
          className="directory-results"
          aria-live="polite"
          aria-atomic="false"
        >
          {filtered.length ? (
            hasFilters ? (
              <section className="directory-collection" aria-labelledby="directory-results-heading">
                <div className="directory-section-heading">
                  <h2 id="directory-results-heading">{q ? `Results for “${q}”` : 'Your selection'}</h2>
                  <span>
                    {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
                  </span>
                </div>
                <div className="directory-event-grid">
                  {filtered.map((event) => (
                    <EventCard key={event.slug} event={event} />
                  ))}
                </div>
              </section>
            ) : (
              <>
                {hackathons.length > 0 && (
                  <section className="directory-collection" aria-labelledby="directory-featured-heading">
                    <div className="directory-section-heading">
                      <div>
                        <h2 id="directory-featured-heading">Hackathons &amp; hack days</h2>
                        <p>A little more time to make something together.</p>
                      </div>
                      <span>
                        {hackathons.length} featured {hackathons.length === 1 ? 'event' : 'events'}
                      </span>
                    </div>
                    <div className="directory-event-grid directory-featured-grid">
                      {hackathons.map((event) => (
                        <EventCard key={event.slug} event={event} />
                      ))}
                    </div>
                  </section>
                )}
                {otherEvents.length > 0 && (
                  <section className="directory-collection" aria-labelledby="directory-other-heading">
                    <div className="directory-section-heading">
                      <div>
                        <h2 id="directory-other-heading">More ways to meet</h2>
                        <p>Workshops, meetups and technical sessions.</p>
                      </div>
                      <span>
                        {otherEvents.length} {otherEvents.length === 1 ? 'event' : 'events'}
                      </span>
                    </div>
                    <div className="directory-event-grid">
                      {otherEvents.map((event) => (
                        <EventCard key={event.slug} event={event} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )
          ) : (
            <div className="directory-empty">
              <span className="directory-empty-icon">
                <Icon name="calendar" size={30} />
              </span>
              <h2>No events match this selection.</h2>
              <p>Try a different topic, time or format to explore the archive.</p>
              <Link className="button" href="/events" scroll={false}>
                See all events <Icon name="diagonal" size={17} />
              </Link>
            </div>
          )}
        </div>
        <div className="directory-bottom-note">
          <div className="directory-bottom-message">
            <Icon name="calendar" size={20} />
            <p>Want the next invitation? Follow the community for announcements.</p>
          </div>
          <Link className="button" href="/join">
            Get event updates <Icon name="diagonal" size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
