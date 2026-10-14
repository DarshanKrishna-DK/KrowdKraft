import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { Icon } from "./icon";
import {
  OrbitScene,
  SpotlightScene,
  JournalCover,
  ContributionGarden,
} from "./art/scenes";
import { DuckDock } from "./duck/duck-dock";
import { CollaborationForm } from "./forms/collaboration-trigger";
import { communityStats, people } from "@/data/community";
import { events, kolkataToday } from "@/data/events";
import { featuredEvents, formatEventDate } from "@/data/event-utils";
import { DateRefresh } from "./events/date-refresh";
import { CommunityRibbon } from "./community-ribbon";
import { BuilderScene } from "./art/builder-scene";
import { journal } from "@/data/journal";
import { links } from "@/data/links";
import { EventTicket } from "./events/event-ticket";

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
                <br />a{" "}
                <span className="word-krowd">
                  Krowd
                  <svg viewBox="0 0 420 28" aria-hidden="true">
                    <path d="M5 21C110 1 270 3 412 15" />
                  </svg>
                </span>
                <span className="hero-period">.</span>
              </h1>
              <p className="hero-description">
                Your people. Your next big idea.
                <br />A community for developers who learn out loud,
                <br className="desktop-break" /> build together, and show up for
                each other.
              </p>
              <div className="actions">
                <Link className="button primary" href="#join">
                  Find your people <Icon name="diagonal" size={18} />
                </Link>
                <Link className="button quiet" href="/events">
                  Explore events <Icon name="arrow" size={18} />
                </Link>
              </div>
            </div>
            <div className="hero-art-zone">
              <BuilderScene />
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

        <CommunityRibbon />

        <section className="section events-home" id="happening">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">Get out. Plug in.</p>
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
                <p>
                  A room full of builders.
                  <br />
                  One conversation could change everything.
                </p>
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

        <section className="section about-home" id="about">
          <div className="container about-layout">
            <div className="photo-story" data-reveal>
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
            <div className="about-copy" data-reveal>
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
            <span className="city-coordinate mono">
              12°58′ N<br />
              77°35′ E
            </span>
          </div>
        </section>

        <section className="people-home" id="people">
          <div className="container">
            <div className="community-impact">
              <p className="eyebrow">
                A few things we’ve
                <br />
                made happen, together.
              </p>
              <p>
                <strong>{communityStats.events}</strong>
                <span>events & gatherings</span>
              </p>
              <p>
                <strong>{communityStats.developersReached}</strong>
                <span>developers reached</span>
              </p>
            </div>
            <div className="people-lineup">
              <div className="people-heading">
                <p className="eyebrow">The humans behind the hello</p>
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
                  >
                    <div className="organizer-art" aria-hidden="true">
                      <span className="organizer-letter">{person.name[0]}</span>
                      <span className="organizer-loop" />
                      <span className="organizer-pin" />
                    </div>
                    <div className="organizer-name">
                      <h3>{person.name}</h3>
                      <span>KrowdKraft</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section marketplace-home" id="made-here">
          <div className="container split-layout">
            <div data-reveal>
              <p className="eyebrow">The community marketplace</p>
              <h2>
                Built here.
                <br />
                <span className="serif-word">Going places.</span>
              </h2>
              <p className="section-copy">
                Side projects that grew legs. Tools that solve a real problem.
                That “what if” someone actually built.
              </p>
              <p className="section-copy">
                Our community showcase is coming soon. Got something people
                should try? Give it a home here.
              </p>
              <div className="actions">
                <Link href="/marketplace#submit" className="button primary">
                  List your product <Icon name="plus" size={18} />
                </Link>
                <Link href="/marketplace" className="text-link">
                  Explore the space <Icon name="diagonal" />
                </Link>
              </div>
              <DuckDock
                id="products"
                mood="curious"
                tip="That side project deserves more than a folder called final_v7."
                href="/marketplace#submit"
                label="Give it a home"
              />
            </div>
            <OrbitScene />
          </div>
        </section>

        <section className="section spotlight-home" id="builders">
          <div className="container spotlight-layout">
            <SpotlightScene />
            <div data-reveal>
              <p className="eyebrow">A little deserved attention</p>
              <h2>
                Big ideas.
                <br />
                <span className="serif-word">Brilliant humans.</span>
              </h2>
              <p className="section-copy">
                The first-time contributor. The team that kept going. The
                builder whose weekend project became everyone’s favourite tool.
              </p>
              <p className="section-copy">
                Our builder spotlight is coming soon. Each edition will put a
                different story at the centre.
              </p>
              <Link href="/spotlight" className="button light">
                Meet the spotlight <Icon name="diagonal" />
              </Link>
              <DuckDock
                id="spotlight"
                mood="celebrate"
                tip="Main character energy. But with a README."
                href="/spotlight#nominate"
                label="Nominate a builder"
                align="end"
              />
            </div>
          </div>
        </section>

        <section className="section activity-home" id="activity">
          <div className="container activity-layout">
            <div data-reveal>
              <p className="eyebrow">Small commits. Shared momentum.</p>
              <h2>
                Keep showing up.
                <br />
                <span className="serif-word">It adds up.</span>
              </h2>
              <p className="section-copy">
                Connect your GitHub, choose to share your public activity, and
                find other people making steady progress. Contributions come in
                many forms. This is one window into them.
              </p>
              <div className="actions">
                <Link className="button primary" href="/account">
                  <Icon name="github" size={20} /> Connect GitHub
                </Link>
                <Link className="text-link" href="/leaderboard">
                  Community activity <Icon name="diagonal" />
                </Link>
              </div>
            </div>
            <ContributionGarden />
          </div>
        </section>

        <section className="section journal-home" id="journal">
          <div className="container">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">Notes from the journey</p>
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
              {journal.map((article) => (
                <a
                  key={article.slug}
                  className="article-card"
                  href={article.href}
                  target="_blank"
                  rel="noreferrer"
                  data-reveal
                >
                  <JournalCover variant={article.cover} />
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
          </div>
        </section>

        <section className="section collaboration-home" id="collaborate">
          <div className="container collaboration-layout">
            <div>
              <p className="eyebrow">Good company makes great things</p>
              <h2>
                Have an idea?
                <br />
                <span className="serif-word">Pull up a chair.</span>
              </h2>
            </div>
            <div className="collaboration-copy">
              <p>
                Host a workshop. Support a hackathon. Bring a new perspective.
                If it helps developers learn and build, we’d love to hear it.
              </p>
              <CollaborationForm />
              <div className="collab-tags">
                <span>Communities</span>
                <span>Colleges</span>
                <span>Companies</span>
                <span>You</span>
              </div>
            </div>
          </div>
        </section>

        <section className="join-home" id="join">
          <div className="container join-layout">
            <div className="join-scribble" aria-hidden="true">
              hello, you.
            </div>
            <p className="eyebrow">No perfect portfolio required</p>
            <h2>
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
                Join the community <Icon name="diagonal" />
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
