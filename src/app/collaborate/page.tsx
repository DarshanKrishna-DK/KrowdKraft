import Link from 'next/link';
import { currentUser, sessionClient } from '@/lib/supabase';
import { PageIntro } from '@/components/shell';
import { ProposalForm } from '@/components/forms/member-forms';
import { getCommunity } from '@/lib/data';
export const metadata = { title: 'Collaborate', robots: { index: false, follow: false } };
export default async function Collaborate() {
  const [user, community] = await Promise.all([currentUser(), getCommunity()]);
  const proposals = user
    ? await (
        await sessionClient()
      )
        .from('workshop_proposals')
        .select('id,subject,message,status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
    : { data: [], error: null };
  if (proposals.error) throw proposals.error;
  return (
    <>
      <PageIntro
        eyebrow="For organizers and collaborators"
        title="Bring an idea to the table."
        description="A workshop, a talk, a venue, or a partnership. Tell us what you have in mind."
      />
      <section className="wrap page-body share-layout">
        <div className="form-panel">
          {user ? (
            <ProposalForm />
          ) : (
            <>
              <p>Email the organizers, or connect GitHub to keep a private proposal here.</p>
              <div className="button-row">
                <a className="button button-silver" href={'mailto:' + community.email}>
                  Email the organizers
                </a>
                <Link className="button button-quiet" href="/connect?next=%2Fcollaborate">
                  Connect GitHub
                </Link>
              </div>
            </>
          )}
        </div>
        {user && (
          <div className="form-panel">
            <h2>Your proposals</h2>
            {proposals.data?.length ? (
              proposals.data.map((p) => (
                <article key={p.id} className="submission-row">
                  <h3>{p.subject}</h3>
                  <p>{p.status}</p>
                  <p className="proposal-text">{p.message}</p>
                </article>
              ))
            ) : (
              <p>Proposal status will appear here after submission.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
