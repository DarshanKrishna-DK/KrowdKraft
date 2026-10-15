import Link from 'next/link';
import type { Metadata } from 'next';
import { currentUser, sessionClient } from '@/lib/supabase';
import { safeNext } from '@/lib/validation';
import { PageIntro } from '@/components/shell';
import { Icon } from '@/components/icon';
import { ParticipationForm, RefreshActivityForm } from '@/components/forms/github-forms';
export const metadata: Metadata = { title: 'Connect GitHub', robots: { index: false, follow: false } };
export default async function Connect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams,
    user = await currentUser();
  const next = safeNext(params.next || '/connect');
  const db = await sessionClient();
  const [connection, role] = user
    ? await Promise.all([
        db.from('workshop_github_connections').select('*').eq('user_id', user.id).maybeSingle(),
        db.from('workshop_roles').select('role').eq('user_id', user.id).maybeSingle(),
      ])
    : [
        { data: null, error: null },
        { data: null, error: null },
      ];
  if (connection.error || role.error) throw new Error('The GitHub connection could not be loaded.');
  return (
    <>
      <PageIntro
        eyebrow="Optional GitHub connection"
        title="Let your work show up."
        description="Join the monthly leaderboard with your public commits and pull requests. Everyone can browse the community without signing in."
      />
      <div className="wrap">
        <div className="connection-panel">
          <Icon name="github" size={40} />
          {params.error && (
            <p className="form-message" role="alert">
              GitHub connection did not complete. Please try again.
            </p>
          )}
          {params.notice === 'attribution' && (
            <p className="form-message" role="status">
              GitHub connected, but your project attribution could not be saved. Reconnect before sharing a
              project. Your leaderboard choice is unchanged.
            </p>
          )}
          {!user ? (
            <>
              <h2>Your GitHub. Your choice.</h2>
              <p>
                Connect to verify your identity, then choose whether to appear on the leaderboard. Private
                repositories are never included.
              </p>
              <a className="button button-silver" href={'/auth/github?next=' + encodeURIComponent(next)}>
                Connect GitHub
                <Icon name="diagonal" />
              </a>
            </>
          ) : (
            <>
              <h2>GitHub is connected.</h2>
              <p>
                Participation is optional. Joining makes your GitHub username, avatar and public monthly
                activity visible.
              </p>
              <p className="connection-status">
                {connection.data?.listed
                  ? 'Listed as ' + connection.data.login
                  : 'You are not listed on the leaderboard.'}
              </p>
              <div className="connection-actions">
                <ParticipationForm listed={!!connection.data?.listed} />
                {connection.data?.listed && <RefreshActivityForm />}
              </div>
              {connection.data?.sync_error && (
                <p className="form-message">
                  The last GitHub update did not complete. Any previous score remains unchanged. The scheduled
                  sync will retry.
                </p>
              )}
              <div className="button-row">
                <Link className="text-link" href="/leaderboard">
                  View leaderboard
                  <Icon name="diagonal" />
                </Link>
                {role.data && (
                  <Link className="button button-quiet" href="/admin">
                    Organizer desk
                    <Icon name="diagonal" />
                  </Link>
                )}
              </div>
              <form action="/auth/signout" method="post">
                <button className="text-button" type="submit">
                  Disconnect this browser
                </button>
              </form>
            </>
          )}
          <p className="fine-print">
            One point per indexed public commit and per public pull request opened, within the calendar month
            in UTC. Updates run daily, subject to GitHub's limits. Disconnecting this browser ends your
            session; use Leave the leaderboard to hide your entry.
          </p>
          <Link className="text-link" href="/privacy">
            About your information
          </Link>
        </div>
      </div>
    </>
  );
}
