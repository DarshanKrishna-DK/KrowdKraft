import 'server-only';

import Link from 'next/link';
import { PageIntro } from '@/components/shell';
import { currentUser, sessionClient } from '@/lib/supabase';
import { ProjectForm, WithdrawForm } from '@/components/forms/member-forms';
import { Icon } from '@/components/icon';
import type { Project } from '@/lib/types';

export type ShareSearchParams = { edit?: string; page?: string };

/** Both the direct page and intercepted popup use the same owner-scoped data and forms. */
export async function ShareContent({
  searchParams,
  modal = false,
}: {
  searchParams: Promise<ShareSearchParams>;
  modal?: boolean;
}) {
  const [user, params] = await Promise.all([currentUser(), searchParams]);
  const page = Math.max(1, Math.min(1000, Math.floor(Number(params.page) || 1)));
  const description = user
    ? 'A repository, a working demo, and the story behind it. Organizers review submissions before they appear on the board.'
    : 'Connect GitHub to attribute your project and keep control of your submission.';
  const intro = modal ? (
    <div className="project-popup-intro">
      <p className="eyebrow">The builders’ board</p>
      <h3>Show us what you made.</h3>
      <p>{description}</p>
    </div>
  ) : (
    <PageIntro eyebrow="The builders’ board" title="Show us what you made." description={description} />
  );

  if (!user)
    return (
      <>
        {intro}
        <div className={modal ? 'project-popup-connect' : 'wrap page-body'}>
          <Link href="/connect?next=%2Fshare" className="button button-silver">
            <Icon name="github" />
            Connect GitHub to share
          </Link>
          {modal && <p>Your project stays private until an organizer approves it.</p>}
        </div>
      </>
    );

  const db = await sessionClient();
  const { data, error, count } = await db
    .from('workshop_projects')
    .select('*', { count: 'exact' })
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * 20, page * 20 - 1);
  if (error) throw error;
  const projects = (data || []) as Project[];
  const editing = projects.find((project) => project.id === params.edit);
  const reviews = projects.length
    ? await db
        .from('workshop_reviews')
        .select('project_id,note,created_at')
        .in(
          'project_id',
          projects.map((project) => project.id),
        )
        .order('created_at', { ascending: false })
    : { data: [], error: null };
  if (reviews.error) throw reviews.error;

  return (
    <>
      {intro}
      <section className={modal ? 'project-popup-layout' : 'wrap page-body share-layout'}>
        <div className="form-panel project-submit-panel">
          <h2>{editing ? 'Edit your project' : 'Project details'}</h2>
          <ProjectForm key={editing?.id || 'new'} project={editing} modal={modal} />
          {editing && (
            <Link href="/share" className="text-link" replace={modal} scroll={!modal}>
              Finish editing
            </Link>
          )}
        </div>
        <div className="form-panel project-submissions-panel">
          <h2>Your submissions</h2>
          {projects.length ? (
            projects.map((project) => {
              const feedback = reviews.data?.find((review) => review.project_id === project.id)?.note;
              return (
                <article className="submission-row" key={project.id}>
                  <div className="submission-header">
                    <h3>{project.title}</h3>
                    <span className="pill">{project.status}</span>
                  </div>
                  <p>{project.summary}</p>
                  {feedback && <p className="review-note">Organizer feedback: {feedback}</p>}
                  <div className="button-row">
                    <Link
                      className="button button-quiet"
                      href={'/share?page=' + page + '&edit=' + project.id}
                      replace={modal}
                      scroll={!modal}
                    >
                      Edit project
                    </Link>
                    {project.status !== 'withdrawn' && <WithdrawForm id={project.id} />}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="project-submissions-empty">
              <Icon name="code" size={30} />
              <p>After you submit a project, its review status and feedback will appear here.</p>
            </div>
          )}
          {(page > 1 || (count || 0) > page * 20) && (
            <nav className="pagination" aria-label="Submission pages">
              {page > 1 && (
                <Link href={'/share?page=' + (page - 1)} replace={modal} scroll={!modal}>
                  Previous
                </Link>
              )}
              {(count || 0) > page * 20 && (
                <Link href={'/share?page=' + (page + 1)} replace={modal} scroll={!modal}>
                  Next
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
