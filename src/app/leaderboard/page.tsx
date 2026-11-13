import type { Metadata } from 'next';
import { PointsTable, QuarterBoard } from '@/components/leaderboard';
import { currentQuarter, getLeaderboard } from '@/lib/leaderboard';
import { isQuarter, previousQuarters, tracks } from '@/lib/scoring';
import { DirectoryArt } from '@/components/directory-art';
import { LeaderboardQuarter } from '@/components/directory-filters';
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
  title: 'Quarterly leaderboard',
  description: 'Separate quarterly leaderboards for KrowdKraft developers and content creators.',
};

export default async function Leaderboard({ searchParams }: { searchParams: Promise<{ quarter?: string }> }) {
  const input = (await searchParams).quarter;
  const current = currentQuarter();
  const options = previousQuarters(current, 4);
  const quarter = isQuarter(input) && options.includes(input) ? input : current;
  const board = await getLeaderboard(quarter);
  return (
    <>
      <section className="directory-hero wrap">
        <div className="directory-hero-copy">
          <h1>
            Two boards.
            <br />
            Every quarter.
          </h1>
          <p>
            Developers and content creators climb separate leaderboards that reset each quarter. Every point
            comes from an activity an organizer has verified.
          </p>
        </div>
        <DirectoryArt kind="leaderboard" />
      </section>
      <section className="wrap directory-body directory-leaderboard-layout">
        <div className="directory-ranking-panel">
          <div className="directory-ranking-heading">
            <div>
              <span className="directory-small-label">Quarterly leaderboard</span>
              <h2>Standings</h2>
            </div>
            <LeaderboardQuarter quarter={quarter} options={options} />
          </div>
          <QuarterBoard quarter={quarter} boards={board} points={false} />
          <div className="directory-ranking-footnote">
            <Icon name="people" size={17} />
            <p>Equal points share a rank. Quarters follow IST: Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec.</p>
          </div>
        </div>
        <aside className="directory-scoring" aria-labelledby="directory-scoring-heading">
          <h2 id="directory-scoring-heading">What counts</h2>
          {tracks.map((track) => (
            <div className="scoring-track" key={track.id}>
              <h3>
                <Icon name={track.id === 'developers' ? 'code' : 'mic'} size={18} />
                {track.name}
              </h3>
              <PointsTable track={track.id} />
            </div>
          ))}
          <details className="directory-sync-details">
            <summary>
              How points are verified <Icon name="plus" size={16} />
            </summary>
            <div>
              <p>
                Each activity needs public proof: a hackathon results page, the published article or video, or
                the event listing. Organizers check it before the points are added.
              </p>
              <p>
                Talks, volunteering and attendance count on whichever track you compete in. Hackathon bonuses
                stack on the submission, so a win is worth 50 points and a finalist place 30.
              </p>
            </div>
          </details>
        </aside>
      </section>
    </>
  );
}
