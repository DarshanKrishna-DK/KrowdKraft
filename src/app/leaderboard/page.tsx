import Link from 'next/link';
import type { Metadata } from 'next';
import { LeaderboardRows } from '@/components/leaderboard';
import { getLeaderboard, currentMonth, monthLabel } from '@/lib/leaderboard';
import { DirectoryArt } from '@/components/directory-art';
import { LeaderboardMonth } from '@/components/directory-filters';
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
  title: 'Monthly developer leaderboard',
  description: 'Public commits and pull requests from opt-in KrowdKraft developers.',
};

export default async function Leaderboard({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const input = (await searchParams).month;
  const current = currentMonth();
  const month =
    input && /^20\d{2}-(0[1-9]|1[0-2])$/.test(input) && input <= current.slice(0, 7)
      ? input + '-01'
      : current;
  const { rows } = await getLeaderboard(month);
  return (
    <>
      <section className="directory-hero wrap">
        <div className="directory-hero-copy">
          <h1>
            Every commit
            <br />
            is a start.
          </h1>
          <p>
            A monthly view of the community’s public GitHub activity. Connect your GitHub and choose to take
            part.
          </p>
          <Link className="button" href="/connect">
            <Icon name="github" size={18} /> Connect your GitHub
          </Link>
        </div>
        <DirectoryArt kind="leaderboard" />
      </section>
      <section className="wrap directory-body directory-leaderboard-layout">
        <div className="directory-ranking-panel">
          <div className="directory-ranking-heading">
            <div>
              <span className="directory-small-label">Monthly leaderboard</span>
              <h2>{monthLabel(month)}</h2>
            </div>
            <LeaderboardMonth month={month.slice(0, 7)} current={current.slice(0, 7)} />
          </div>
          {rows.length ? (
            <LeaderboardRows rows={rows} />
          ) : (
            <div className="directory-ranking-empty">
              <div className="directory-empty-icon">
                <Icon name="github" size={36} />
              </div>
              <h3>No synced entries for this month yet.</h3>
              <p>
                Only people who choose to participate appear here. Your public contributions appear after the
                first successful sync.
              </p>
              <Link className="button" href="/connect">
                Join the leaderboard <Icon name="diagonal" size={17} />
              </Link>
            </div>
          )}
          <div className="directory-ranking-footnote">
            <Icon name="people" size={17} />
            <p>Participation is optional. Equal scores share a rank.</p>
          </div>
        </div>
        <aside className="directory-scoring" aria-labelledby="directory-scoring-heading">
          <h2 id="directory-scoring-heading">What counts</h2>
          <div className="directory-score-rule">
            <Icon name="code" size={22} />
            <div>
              <h3>Public commit</h3>
              <p>Authored during the selected month</p>
            </div>
            <strong>
              +1<span>point</span>
            </strong>
          </div>
          <div className="directory-score-rule">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="6" cy="5" r="2" />
              <circle cx="6" cy="19" r="2" />
              <circle cx="18" cy="19" r="2" />
              <path d="M6 7v10M18 17V8a3 3 0 0 0-3-3h-3m3-3-3 3 3 3" />
            </svg>
            <div>
              <h3>Public pull request</h3>
              <p>Opened during the selected month</p>
            </div>
            <strong>
              +1<span>point</span>
            </strong>
          </div>
          <p>
            GitHub-indexed public commits and opened pull requests each count once. Commit search covers
            default branches. Calendar months use UTC.
          </p>
          <details className="directory-sync-details">
            <summary>
              Updates and limitations <Icon name="plus" size={16} />
            </summary>
            <div>
              <p>
                Scores count activity, not code quality. GitHub indexing and rate limits can delay updates.
                Incomplete responses never replace a verified score.
              </p>
              <p>The current month refreshes daily. Previous months show their last saved snapshot.</p>
              {rows.length > 0 && (
                <p>
                  Latest update:{' '}
                  {new Intl.DateTimeFormat('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata',
                  }).format(
                    new Date(rows.reduce((a, b) => (a.synced_at > b.synced_at ? a : b)).synced_at),
                  )}{' '}
                  IST. Individual entries can have older snapshots.
                </p>
              )}
            </div>
          </details>
          <a
            className="button"
            href="https://docs.github.com/en/search-github/searching-on-github/searching-commits"
            target="_blank"
            rel="noreferrer"
          >
            GitHub’s search rules <Icon name="diagonal" size={16} />
          </a>
        </aside>
      </section>
    </>
  );
}
