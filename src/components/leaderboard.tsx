'use client';
import { useId, useState } from 'react';
import { Icon } from './icon';
import { activitiesFor, quarterLabel, tracks, type Standing, type Track } from '@/lib/scoring';

export function QuarterBoard({
  quarter,
  boards,
  limit,
  points = true,
}: {
  quarter: string;
  boards: Record<Track, Standing[]>;
  limit?: number;
  points?: boolean;
}) {
  const [track, setTrack] = useState<Track>('developers');
  const id = useId();
  const rows = limit ? boards[track].slice(0, limit) : boards[track];
  const current = tracks.find((item) => item.id === track)!;
  return (
    <div className="quarter-board">
      <div className="quarter-board-head">
        <span className="quarter-label">{quarterLabel(quarter)}</span>
        <div className="quarter-tabs" role="tablist" aria-label="Leaderboard track">
          {tracks.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${id}-${item.id}`}
              aria-selected={track === item.id}
              aria-controls={`${id}-panel`}
              onClick={() => setTrack(item.id)}
            >
              <Icon name={item.id === 'developers' ? 'code' : 'mic'} size={15} />
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${track}`}>
        {rows.length ? (
          <ol className="quarter-rows">
            {rows.map((row) => (
              <li
                key={row.member}
                className={row.rank <= 3 ? `quarter-row is-top-${row.rank}` : 'quarter-row'}
              >
                <span className="quarter-rank">{row.rank}</span>
                <span className="quarter-name">
                  {row.member}
                  <small>
                    {row.activities} {row.activities === 1 ? 'activity' : 'activities'}
                    {row.wins > 0 && ` · ${row.wins} ${row.wins === 1 ? 'win' : 'wins'}`}
                  </small>
                </span>
                <strong>
                  {row.points}
                  <small>pts</small>
                </strong>
              </li>
            ))}
          </ol>
        ) : (
          <div className="quarter-empty">
            <h3>The {current.name.toLowerCase()} board opens this quarter.</h3>
            <p>{current.summary} Every verified activity earns points toward the quarter.</p>
          </div>
        )}
        {points && <PointsTable track={track} />}
      </div>
    </div>
  );
}

export function PointsTable({ track }: { track: Track }) {
  return (
    <ul className="points-table" aria-label="Points per activity">
      {activitiesFor(track).map(([kind, activity]) => (
        <li key={kind}>
          <span>{activity.label}</span>
          <strong>+{activity.points}</strong>
        </li>
      ))}
    </ul>
  );
}
