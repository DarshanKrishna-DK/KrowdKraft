import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { Icon } from "./icon";
import { JournalCover } from "./art/scenes";
import { DuckDock } from "./duck/duck-dock";
import { CollaborationForm } from "./forms/collaboration-trigger";
import { communityStats, people } from "@/data/community";
import { events, kolkataToday } from "@/data/events";
import {
  featuredEvents,
  formatEventDate,
  eventWeekday,
  eventWhen,
  eventMapUrl,
  registrationOpen,
} from "@/data/event-utils";
import { DateRefresh } from "./events/date-refresh";
import { CommunityRibbon } from "./community-ribbon";
import { CodeSculpture } from "./art/code-sculpture";
import { journal } from "@/data/journal";
import { links } from "@/data/links";
import { EventTicket } from "./events/event-ticket";
import { CommunityExhibition } from "./community-exhibition";
import { getProducts, getSpotlights } from "@/server/community";

async function HomeExhibition() {
  const [products, spotlights] = await Promise.all([
    getProducts(),
    getSpotlights(),
  ]);
  return (
    <CommunityExhibition
      products={products.records}
      spotlights={spotlights.records}
      productsUnavailable={products.configured && !products.available}
      spotlightsUnavailable={spotlights.configured && !spotlights.available}
    />
  );
}

export function Home() {
  const today = kolkataToday(),
    { next, recent } = featuredEvents(events, today);
  return (
    <>
      <SiteNav />
      <DateRefresh today={today} />
      <main id="main">
        <section className="hero-section" id="top">
          <div className="hero-atmosphere" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <h1>
                Good things
                <br />
                happen in
                <br />a <span className="word-krowd">Krowd.</span>
              </h1>
              <p className="hero-description">
                Your people. Your next big idea.
                <br />
                Hack days, workshops, and a community of Bengaluru’s developers
                learning and building together.
              </p>
              <div className="actions">
                <Link
                  className="button primary"
                  href={next ? "/events/" + next.slug : "/events"}
                >
                  {next && next.date === today
                    ? "See today’s event"
                    : next && eventWhen(next, today).startsWith("This ")
                      ? "See " +
                        eventWeekday(next) +
                        "’s " +
                        (next.type === "hackathon" ? "hack day" : "event")
                      : "Explore events"}{" "}
                  <Icon name="diagonal" size={18} />
                </Link>
                <a
                  className="button quiet"
                  href={links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  Join the Krowd <Icon name="arrow" size={18} />
                </a>
              </div>
              <p className="hero-next">
                {next ? (
                  <>
                    <time dateTime={next.date}>
                      {eventWeekday(next)}, {formatEventDate(next.date)}
                    </time>
                    <span>
                      {next.title} · {next.venue}
                    </span>
                    <strong>
                      {registrationOpen(next, today)
                        ? "Registration open"
                        : next.registrationDeadline
                          ? "Registration closed · Confirmed participants welcome"
                          : "Details on the event page"}
                    </strong>
                  </>
                ) : (
                  <>
                    Next event coming soon. Follow our calendar for the
                    announcement.
                  </>
                )}
              </p>
            </div>
            <div className="hero-art-zone">
              <CodeSculpture />
              <DuckDock
                id="hello"
                mood="wave"
                tip="I'm Krafty. Rubber duck, zero debugging qualifications. Shall we?"
                href="/events"
                label="Show me around"
                align="end"
              />
            </div>
          </div>
        </section>

        <CommunityRibbon
          phrases={[
            `${communityStats.members} community members`,
            `${communityStats.events} events hosted`,
            `${communityStats.developersReached} developers reached`,
            `${events.length} events on the public calendar`,
          ]}
        />

        <section className="section events-home" id="happening">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <h2>
                  {next ? (
                    <>
                      See you at
                      <br />
                      <span className="serif-word">the next one.</span>
                    </>
                  ) : (
                    <>
                      Good things
                      <br />
                      <span className="serif-word">are brewing.</span>
                    </>
                  )}
                </h2>
              </div>
              <div className="heading-aside">
                <p>Dates, venues, and everything you need before you arrive.</p>
                <Link href="/events" className="text-link">
                  The whole calendar <Icon name="diagonal" size={18} />
                </Link>
              </div>
            </div>
            {next ? (
              <EventTicket event={next} today={today} />
            ) : (
              <div className="next-empty glass">
                <h3>The next gathering is taking shape.</h3>
                <p>Follow our calendar for the next date.</p>
                <a href={links.luma} className="button primary">
                  Follow on Luma <Icon name="diagonal" />
                </a>
              </div>
            )}
            {recent && (
              <div className="recent-event-strip">
                <span className="eyebrow">Last time we got together</span>
                <Link href={`/events/${recent.slug}`}>
                  <span className="event-mini-symbol">
                    <Icon name="calendar" />
                  </span>
                  <span>
                    <strong>{recent.title}</strong>
                    <small>
                      {formatEventDate(recent.date)} · {recent.venue}
                    </small>
                  </span>
                  <Icon name="diagonal" />
                </Link>
              </div>
            )}
            <DuckDock
              id="event"
              mood="thinking"
              tip="Laptop? Check. Charger? Please, for the love of open source."
              href={next ? `/events/${next.slug}` : "/events"}
              label="Event details"
              align="end"
            />
          </div>
        </section>

        <Suspense
          fallback={
            <CommunityExhibition products={[]} spotlights={[]} loading />
          }
        >
          <HomeExhibition />
        </Suspense>

        <section className="section about-home" id="about">
          <div className="container about-layout">
            <div className="photo-story" data-reveal="photo" data-parallax>
              <div className="photo-tape" aria-hidden="true" />
              <figure className="community-photo">
                <Image
                  src="/events/ai-verse-2025.webp"
                  alt="Developers gathered at MSRIT for Into the AI-Verse, photographed from the speaker's desk"
                  width={1400}
                  height={933}
                  sizes="(max-width: 767px) 90vw, 50vw"
                />
                <figcaption>
                  Into the AI-Verse, MSRIT <span>May ’25</span>
                </figcaption>
              </figure>
              <div className="photo-note">
                less “let&apos;s connect”
                <br />
                <span>more “let&apos;s build.”</span>
                <svg viewBox="0 0 110 45" aria-hidden="true">
                  <path d="M105 5Q70 50 5 18m0 0 15-6M5 18l9 13" />
                </svg>
              </div>
            </div>
            <div className="about-copy" data-reveal="slide">
              <p className="eyebrow">The people make the place</p>
              <h2>
                You don’t have
                <br />
                to build <span className="serif-word">alone.</span>
              </h2>
              <p>
                We’re developers, students, designers and wonderfully curious
                humans. Some of us are writing our first line of code. Some have
                been shipping for years.
              </p>
              <p>
                What brings us together? The belief that learning gets better
                when you share it. So we make room for workshops, late-night
                ideas, hackathon teams and the occasional very good question.
              </p>
              <div className="about-values">
                <span>
                  <Icon name="code" /> Learn by building
                </span>
                <span>
                  <Icon name="people" /> Find your collaborators
                </span>
                <span>
                  <Icon name="branch" /> Give back to open source
                </span>
              </div>
              <Link href="#join" className="text-link">
                There’s a place for you here <Icon name="diagonal" />
              </Link>
              <DuckDock
                id="about"
                mood="happy"
                tip="Networking, minus the part where everyone pretends to remember names."
                href="#join"
                label="Meet your people"
              />
            </div>
          </div>
          <div className="container city-strip">
            <div className="city-mark">
              <Icon name="pin" size={30} />
              <div>
                <strong>Namma Bengaluru.</strong>
                <span>Our home, our starting point.</span>
              </div>
            </div>
            <p>
              From college classrooms to Startup Park.
              <br />
              Different backgrounds. The same builder energy.
            </p>
            {next && (
              <a
                className="text-link"
                href={eventMapUrl(next)}
                target="_blank"
                rel="noreferrer"
              >
                Next venue: {next.venue} <Icon name="diagonal" />
              </a>
            )}
          </div>
        </section>

        <section className="section collaboration-home" id="collaborate">
          <div className="container collaboration-layout">
            <div data-reveal="rise">
              <p className="eyebrow">For communities, colleges, and teams</p>
              <h2>
                Host or co-host
                <br />
                <span className="serif-word">with the Krowd.</span>
              </h2>
            </div>
            <div className="collaboration-copy">
              <p>
                Co-host a hackathon, run a college session, give a technical
                talk, or cross-post an event. Bring your idea; we’ll work out
                the format together.
              </p>
              <p className="page-note">
                We don’t charge simply to collaborate. Production needs,
                responsibilities, and any costs are agreed before we begin.
              </p>
              <CollaborationForm />
              <DuckDock
                id="collaborate"
                mood="thinking"
                tip="Bring an idea. We’ll bring people who ask surprisingly good questions."
                href="mailto:krowdkraft.official@gmail.com"
                label="Talk to the team"
              />
            </div>
          </div>
        </section>

        <section className="people-home" id="people">
          <div className="container">
            <div className="community-impact">
              <p>
                <strong>{communityStats.members}</strong>
                <span>community members</span>
              </p>
              <p>
                <strong>{communityStats.events}</strong>
                <span>events hosted</span>
              </p>
              <p>
                <strong>{communityStats.developersReached}</strong>
                <span>developers reached</span>
              </p>
            </div>
            <p className="archive-context">
              {events.length} documented events on the public calendar.{" "}
              {communityStats.events} hosted across our community’s history;
              we’re restoring the archive.
            </p>
            <div className="people-lineup">
              <div className="people-heading" data-reveal="slide">
                <p className="eyebrow">Organizers</p>
                <h2>
                  People behind
                  <br />
                  <span className="serif-word">the Krowd.</span>
                </h2>
                <p>
                  The people making room for your next idea, your first event,
                  and a few new friends.
                </p>
              </div>
              <ul className="organizer-sheets">
                {people.map((person, index) => (
                  <li
                    key={person.name}
                    className={`organizer-sheet organizer-${index}`}
                    data-reveal="card"
                    data-reveal-delay={index * 90}
                  >
                    <div className="organizer-art" aria-hidden="true">
                      <span className="organizer-letter">{person.name[0]}</span>
                      <span className="organizer-loop" />
                      <span className="organizer-pin" />
                    </div>
                    <div className="organizer-name">
                      <h3>{person.name}</h3>
                    </div>
                  </li>
                ))}
              </ul>
              <DuckDock
                id="people"
                mood="wave"
                tip="The humans behind the chaos. I supervise. They dispute this."
              />
            </div>
          </div>
        </section>

        <section className="section journal-home" id="journal">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">Notes from Darshan</p>
                <h2>
                  A little food
                  <br />
                  for <span className="serif-word">thought.</span>
                </h2>
              </div>
              <Link className="text-link" href="/journal">
                Open the journal <Icon name="diagonal" />
              </Link>
            </div>
            <div className="journal-grid">
              {journal.map((article, index) => (
                <a
                  key={article.slug}
                  className="article-card"
                  href={article.href}
                  target="_blank"
                  rel="noreferrer"
                  data-reveal="rise"
                  data-reveal-delay={index * 90}
                >
                  <JournalCover src={article.cover} />
                  <div className="article-meta">
                    <span>{article.topic}</span>
                    <span>
                      On Medium <Icon name="diagonal" size={14} />
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.subtitle}</p>
                </a>
              ))}
            </div>
            <DuckDock
              id="journal"
              mood="curious"
              tip="A few good reads. Your 47 open tabs can make room for one more."
              href="/journal"
              label="Open the journal"
            />
          </div>
        </section>

        <section className="join-home" id="join">
          <div className="container join-layout">
            <div className="join-scribble" aria-hidden="true">
              hello, you.
            </div>
            <p className="eyebrow">
              WhatsApp for announcements. Luma for the calendar.
            </p>
            <h2 data-reveal="scale">
              Your kind
              <br />
              of <span className="serif-word">people.</span>
            </h2>
            <p>
              Come curious. Leave with a new idea,
              <br />a collaborator, or just a really good conversation.
            </p>
            <div className="actions join-actions">
              <a
                className="button primary"
                href={links.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                Follow on WhatsApp <Icon name="diagonal" />
              </a>
              <a
                className="button quiet"
                href={links.luma}
                target="_blank"
                rel="noreferrer"
              >
                Follow our events <Icon name="calendar" size={18} />
              </a>
            </div>
            <nav
              className="join-socials"
              aria-label="Community social accounts"
            >
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={links.instagram} target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
              <a href={links.x} target="_blank" rel="noreferrer">
                X ↗
              </a>
            </nav>
            <DuckDock
              id="join"
              mood="wave"
              tip="You made it. I brought absolutely no networking small talk."
              href={links.whatsapp}
              label="Come say hello"
            />
            <div className="join-orbit orbit-left" aria-hidden="true" />
            <div className="join-orbit orbit-right" aria-hidden="true" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
