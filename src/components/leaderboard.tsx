import Link from 'next/link';
import { Icon } from './icon';
import { getLeaderboard, monthLabel } from '@/lib/leaderboard';
export async function LeaderboardPreview() {
  const { rows, month } = await getLeaderboard();
  return (
    <div className="leaderboard-panel">
      <h3>{monthLabel(month)}</h3>
      {rows.length ? (
        <LeaderboardRows rows={rows.slice(0, 5)} />
      ) : (
        <div className="leaderboard-empty">
          <Icon name="github" size={34} />
          <h3>The month starts with you.</h3>
          <p>
            Connect GitHub and choose to join. Your public activity will appear here after its first sync.
          </p>
        </div>
      )}
      <Link className="text-link" href="/leaderboard">
        How the scores work
        <Icon name="diagonal" size={16} />
      </Link>
    </div>
  );
}
export function LeaderboardRows({
  rows,
}: {
  rows: {
    login: string;
    github_id: string;
    commits: number;
    pull_requests: number;
    score: number;
    rank: number;
    synced_at: string;
  }[];
}) {
  return (
    <ol className="leaderboard-list">
      {rows.map((row) => (
        <li className="leaderboard-row" key={row.github_id}>
          <span className="leaderboard-rank">{row.rank}</span>
          <img
            src={'https://avatars.githubusercontent.com/u/' + row.github_id + '?s=80'}
            alt=""
            width="40"
            height="40"
          />
          <div>
            <a href={'https://github.com/' + row.login} target="_blank" rel="noreferrer">
              {row.login}
            </a>
            <small>
              {row.commits} commits · {row.pull_requests} pull requests
            </small>
            <small>
              <time dateTime={row.synced_at}>
                Updated{' '}
                {new Intl.DateTimeFormat('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: 'Asia/Kolkata',
                }).format(new Date(row.synced_at))}{' '}
                IST
              </time>
            </small>
          </div>
          <strong>
            {row.score}
            <small>points</small>
          </strong>
        </li>
      ))}
    </ol>
  );
}
