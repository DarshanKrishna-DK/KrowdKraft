import Link from 'next/link';
import type { Metadata } from 'next';
import { getCommunity } from '@/lib/data';
import { PageIntro } from '@/components/shell';
import { Icon } from '@/components/icon';
export const metadata: Metadata = {
  title: 'Community',
  description: 'Join KrowdKraft for community updates, gatherings, and a place to share what you build.',
};
export default async function Join() {
  const c = await getCommunity();
  return (
    <>
      <PageIntro
        eyebrow="KrowdKraft community"
        title="Meet. Learn. Make."
        description="Follow an announcement, attend a workshop, or share something you built. No membership account required."
      />
      <section className="wrap page-body">
        <div className="join-grid">
          <article className="join-card">
            <div className="join-icon">
              <Icon name="book" size={25} />
            </div>
            <h2>Stay in the loop.</h2>
            <p>
              Community announcements, upcoming gatherings, and useful things we come across. Follow our
              WhatsApp channel.
            </p>
            <a className="button button-silver" href={c.links.whatsapp} target="_blank" rel="noreferrer">
              Follow the channel
              <Icon name="diagonal" size={16} />
            </a>
            <small className="fine-print">
              An announcement channel. Event group chats are shared separately.
            </small>
          </article>
          <article className="join-card">
            <div className="join-icon">
              <Icon name="calendar" size={25} />
            </div>
            <h2>Meet us in person.</h2>
            <p>
              Make your first pull request. Try a new tool. Spend an afternoon around people who like making
              things.
            </p>
            <Link className="button button-silver" href="/events">
              Explore gatherings
              <Icon name="arrow" size={16} />
            </Link>
            <a className="fine-print text-link" href={c.links.luma} target="_blank" rel="noreferrer">
              Follow our Luma calendar <Icon name="diagonal" size={14} />
            </a>
          </article>
          <article className="join-card">
            <div className="join-icon">
              <Icon name="github" size={25} />
            </div>
            <h2>Your work, counted.</h2>
            <p>
              Connect GitHub to take part in the monthly developer leaderboard. Your public commits and pull
              requests count toward your score.
            </p>
            <Link className="button button-silver" href="/connect">
              Connect GitHub
              <Icon name="arrow" size={16} />
            </Link>
            <small className="fine-print">
              Participation is optional. You choose whether your entry is public.
            </small>
          </article>
        </div>
        <div className="form-panel">
          <h2>Have something in mind?</h2>
          <p>
            A hands-on session, a venue, a partnership, or an idea we have not thought of. We would like to
            hear it.
          </p>
          <div className="button-row">
            <Link className="button button-quiet" href="/collaborate">
              Propose a collaboration
              <Icon name="diagonal" size={16} />
            </Link>
            <a className="text-link" href={`mailto:${c.email}`}>
              Email the organizers
              <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
