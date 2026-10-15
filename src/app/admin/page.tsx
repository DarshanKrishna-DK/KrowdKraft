import Link from 'next/link';
import { organizerPageContext } from '@/lib/organizer-page';
import { PageIntro } from '@/components/shell';
import { Icon } from '@/components/icon';
import { dateLabel } from '@/lib/events';
import { ReviewForm, ProposalStatusForm } from '@/components/forms/organizer-forms';
import type { Project, Proposal } from '@/lib/types';
const tabs = [
  ['events', 'Events'],
  ['articles', 'Journal'],
  ['projects', 'Project reviews'],
  ['proposals', 'Collaborations'],
  ['audit', 'Activity'],
] as const;
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const tab = tabs.some((t) => t[0] === params.tab) ? params.tab! : 'events';
  const page = Math.max(1, Math.floor(Math.min(1000, Number(params.page) || 1)));
  const status = ['pending', 'approved', 'rejected', 'withdrawn'].includes(params.status || '')
    ? params.status!
    : 'pending';
  const { db } = await organizerPageContext();
  const table = {
    events: 'workshop_events',
    articles: 'workshop_articles',
    projects: 'workshop_projects',
    proposals: 'workshop_proposals',
    audit: 'workshop_audit_log',
  }[tab]!;
  const order = ['events', 'articles'].includes(tab) ? 'date' : 'created_at';
  let query = db.from(table).select('*', { count: 'exact' }).order(order, { ascending: false });
  if (tab === 'projects') query = query.eq('status', status);
  const { data, error, count } = await query.range((page - 1) * 25, page * 25 - 1);
  if (error) throw new Error('Organizer records are temporarily unavailable.');
  const projects =
    tab === 'projects'
      ? await Promise.all(
          ((data || []) as Project[]).map(async (p) => {
            if (!p.image_path) return p;
            const { data: image } = await db.storage
              .from('workshop-project-images')
              .createSignedUrl(p.image_path, 300);
            return { ...p, image_url: image?.signedUrl };
          }),
        )
      : [];
  return (
    <>
      <PageIntro
        eyebrow="The organizer desk"
        title="Good gatherings take a little care."
        description="Keep the community’s events, stories, and shared projects up to date."
      />
      <section className="wrap page-body">
        <nav className="admin-tabs" aria-label="Organizer sections">
          {tabs.map(([key, label]) => (
            <Link key={key} href={`/admin?tab=${key}`} aria-current={tab === key ? 'page' : undefined}>
              {label}
            </Link>
          ))}
          <Link href="/admin/settings">Community settings</Link>
          <Link href="/connect">GitHub connection</Link>
        </nav>
        <div className="form-panel">
          <div className="admin-heading">
            <h2>
              {tabs.find((t) => t[0] === tab)![1]} <span className="count-label">{count || 0}</span>
            </h2>
            {['events', 'articles'].includes(tab) && (
              <Link className="button button-silver" href={`/admin/${tab}/new`}>
                Create {tab === 'events' ? 'event' : 'article'}
                <Icon name="plus" size={16} />
              </Link>
            )}
          </div>
          {tab === 'projects' && (
            <nav className="admin-tabs" aria-label="Project status">
              {['pending', 'approved', 'rejected', 'withdrawn'].map((s) => (
                <Link
                  key={s}
                  href={`/admin?tab=projects&status=${s}`}
                  aria-current={s === status ? 'page' : undefined}
                >
                  {s === 'pending' ? 'Awaiting review' : s.charAt(0).toUpperCase() + s.slice(1)}
                </Link>
              ))}
            </nav>
          )}
          {!data?.length && (
            <p>
              {tab === 'projects'
                ? status === 'pending'
                  ? 'The review queue is clear. New member projects will appear here.'
                  : 'There are no projects in this state.'
                : tab === 'proposals'
                  ? 'New collaboration proposals will appear here.'
                  : 'No records here yet.'}
            </p>
          )}
          {['events', 'articles'].includes(tab) &&
            data?.map((row) => (
              <article className="admin-row" key={row.slug}>
                <div>
                  <h3>{row.title}</h3>
                  <p>
                    {dateLabel(row.date)} · {row.published ? 'Published' : 'Draft'}
                    {row.registration_status ? ` · Registration: ${row.registration_status}` : ''}
                  </p>
                </div>
                <Link className="button button-quiet" href={`/admin/${tab}/${row.slug}`}>
                  Edit
                  <Icon name="arrow" size={15} />
                </Link>
              </article>
            ))}
          {projects.map((p) => (
            <article className="submission-row review-project" key={p.id}>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              {p.image_url && (
                <img src={p.image_url} alt={`${p.title} submitted screenshot`} width={800} height={500} />
              )}
              <p className="proposal-text">{p.description}</p>
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="button-row">
                <a className="text-link" href={p.repository_url} target="_blank" rel="noreferrer ugc">
                  Review repository <Icon name="diagonal" size={16} />
                </a>
                {p.demo_url && (
                  <a className="text-link" href={p.demo_url} target="_blank" rel="noreferrer ugc">
                    View demo <Icon name="diagonal" size={16} />
                  </a>
                )}
              </div>
              {['pending', 'approved'].includes(p.status) && (
                <ReviewForm id={p.id} published={p.status === 'approved'} />
              )}
            </article>
          ))}
          {tab === 'proposals' &&
            ((data as Proposal[]) || []).map((p) => (
              <article className="submission-row" key={p.id}>
                <div className="submission-header">
                  <h3>{p.subject}</h3>
                  <span className="pill">{p.status}</span>
                </div>
                <p className="proposal-text">{p.message}</p>
                <p>{dateLabel(p.created_at.slice(0, 10))}</p>
                <ProposalStatusForm proposal={p} />
              </article>
            ))}
          {tab === 'audit' && !!data?.length && (
            <div className="table-scroll">
              <table className="audit-table">
                <caption className="sr-only">Community content changes, newest first</caption>
                <thead>
                  <tr>
                    <th>Date (IST)</th>
                    <th>Action</th>
                    <th>Record</th>
                    <th>Account</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td>
                        {new Date(row.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </td>
                      <td>{row.action}</td>
                      <td>
                        {row.entity.replace('workshop_', '')}
                        <br />
                        {row.entity_id}
                      </td>
                      <td>{row.actor_id ? row.actor_id.slice(0, 8) : 'System setup'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {(count || 0) > 25 && (
          <nav className="pagination" aria-label="Organizer record pages">
            {page > 1 && (
              <Link
                className="button button-quiet"
                href={`/admin?tab=${tab}&status=${status}&page=${page - 1}`}
              >
                <Icon name="back" size={16} /> Previous
              </Link>
            )}
            <span>
              Page {page} of {Math.ceil((count || 0) / 25)}
            </span>
            {page * 25 < (count || 0) && (
              <Link
                className="button button-quiet"
                href={`/admin?tab=${tab}&status=${status}&page=${page + 1}`}
              >
                Next <Icon name="arrow" size={16} />
              </Link>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
