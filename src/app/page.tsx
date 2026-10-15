import Link from 'next/link';
import { DateRefresh } from '@/components/date-refresh';
import { ShareProjectLink } from '@/components/share-project-link';
import { getArticles, getCommunity, getEvents, getProjects } from '@/lib/data';
import { dateLabel, eventState, registrationState, timeLabel, officialEventUrl } from '@/lib/events';
import { ComputerFigure, PrinterFigure, ArcadeFigure } from '@/components/figures/art';
import { Icon } from '@/components/icon';
import { SocialRail } from '@/components/social-rail';
import { SectionHeading } from '@/components/shell';
import { ArticleList, EventCard, ProjectCard } from '@/components/content-cards';
import { CommunityTabs } from '@/components/community-tabs';
import { LeaderboardPreview } from '@/components/leaderboard';
import { PartnerTapes } from '@/components/partner-tapes';
export default async function Home() {
  const [community, events, articles, projects] = await Promise.all([
    getCommunity(),
    getEvents(),
    getArticles(),
    getProjects(),
  ]);
  const upcoming = events
    .filter((e) => ['Upcoming', 'Happening now'].includes(eventState(e)))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const past = events.filter((e) => eventState(e) === 'Past event');
  return (
    <>
      <DateRefresh />
      <section className="hero wrap">
        <div className="hero-copy">
          <h1>
            Where <span className="quote-phrase">“what is”</span>
            <br />
            becomes
            <br />
            <em>“look what I made”</em>
          </h1>
          <p className="hero-description">
            A community for people who learn together, build in public, and share what works.
          </p>
          <Link href="/events" className="button">
            Explore events
            <Icon name="diagonal" size={18} />
          </Link>
        </div>
        <ComputerFigure />
        <SocialRail links={community.links} />
      </section>
      <section id="community" className="section wrap">
        <SectionHeading label="" title="About KrowdKraft." />
        <p className="about-intro">
          We are a developer community in Bengaluru. We host workshops and hackathons, build in public, and
          help each other turn ideas into things that work.
        </p>
        <dl className="community-stats">
          {community.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
        <CommunityTabs />
      </section>
      <section id="past-events" className="section wrap">
        <section id="next-event" className="upcoming-ticket" aria-label="Next community event">
          {upcoming ? (
            <article className="event-ticket">
              {upcoming.image && (
                <a href={officialEventUrl(upcoming)} target="_blank" rel="noreferrer">
                  <img
                    className="ticket-poster"
                    src={upcoming.image}
                    alt={upcoming.title + ' official poster'}
                    width="400"
                    height="400"
                    loading="lazy"
                  />
                </a>
              )}
              <div className="ticket-copy">
                <span className="ticket-imprint">KrowdKraft / In person</span>
                <time className="ticket-date" dateTime={upcoming.date}>
                  {dateLabel(upcoming.date)}
                </time>
                <h2>{upcoming.title}</h2>
                <p>
                  {upcoming.venue}, {upcoming.city}
                  {upcoming.starts_at ? ' · ' + timeLabel(upcoming.starts_at) + ' IST' : ''}
                </p>
                <div className="ticket-actions">
                  <a href={officialEventUrl(upcoming)} className="button" target="_blank" rel="noreferrer">
                    Event details
                    <Icon name="diagonal" size={17} />
                  </a>
                  <span className="ticket-status">{registrationState(upcoming)}</span>
                </div>
              </div>
              <div className="ticket-stub">
                <span className="stub-label">Save the date</span>
                <PrinterFigure event={upcoming} />
                <span className="ticket-perforation" aria-hidden="true" />
              </div>
            </article>
          ) : (
            <div className="empty-state">
              <h2>The next gathering is in the works.</h2>
              <p>Announcements go to the community channel.</p>
              <a href={community.links.whatsapp} className="button" target="_blank" rel="noreferrer">
                Follow the channel
                <Icon name="whatsapp" />
              </a>
            </div>
          )}
        </section>
        <SectionHeading label="" title="Good things happened here.">
          <Link className="text-link" href="/events?when=past">
            All past events
            <Icon name="diagonal" />
          </Link>
        </SectionHeading>
        {past.length ? (
          <div className="history-grid">
            {past.slice(0, 4).map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        ) : (
          <p>Our past gatherings will appear here.</p>
        )}
      </section>
      <section className="section wrap" id="leaderboard">
        <div className="leaderboard-preview">
          <div>
            <SectionHeading label="" title="A little progress, every day." />
            <p>Public commits. Pull requests. A monthly record of what our community is making.</p>
            <div className="button-row">
              <Link className="button" href="/connect">
                <Icon name="github" size={18} />
                Connect your GitHub
                <Icon name="diagonal" size={17} />
              </Link>
              <Link className="text-link" href="/leaderboard">
                See the leaderboard
                <Icon name="diagonal" />
              </Link>
            </div>
          </div>
          <LeaderboardPreview />
        </div>
      </section>
      <section id="builds" className="section wrap">
        <SectionHeading label="" title="Built by the community.">
          <Link className="text-link" href="/builds">
            All projects
            <Icon name="diagonal" />
          </Link>
        </SectionHeading>
        {projects.length ? (
          <div className="project-grid">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="build-invitation">
            <ArcadeFigure />
            <div>
              <h3>
                Made something?
                <br />
                Put it on the board.
              </h3>
              <p>Share a repository, a working demo, or an experiment you want feedback on.</p>
              <ShareProjectLink className="button">
                Share your project
                <Icon name="diagonal" size={18} />
              </ShareProjectLink>
            </div>
          </div>
        )}
      </section>
      <section className="section wrap" id="blogs">
        <SectionHeading label="" title="Blogs to read." />
        <ArticleList articles={articles.slice(0, 3)} />
      </section>
      <section className="section wrap people-section" id="people">
        <SectionHeading label="" title="The people behind it." />
        <div className="people-grid">
          {community.organizers.map((person, i) => (
            <article className="person" key={person.name}>
              <div className={'person-monogram monogram-' + i} aria-hidden="true">
                <span>{person.initial}</span>
              </div>
              <div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
              <div className="person-socials">
                {(['linkedin', 'x'] as const).map((s) =>
                  person[s] ? (
                    <a
                      key={s}
                      href={person[s]}
                      aria-label={person.name + ' on ' + (s === 'x' ? 'X' : 'LinkedIn')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name={s} size={17} />
                    </a>
                  ) : null,
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <PartnerTapes partners={community.partners} />
      <section className="join-section wrap">
        <div>
          <h2>See you at the next one.</h2>
          <p>Event announcements and community updates, in one place.</p>
        </div>
        <a href={community.links.whatsapp} className="button" target="_blank" rel="noreferrer">
          <Icon name="whatsapp" />
          Community channel
          <Icon name="diagonal" size={18} />
        </a>
      </section>
    </>
  );
}
