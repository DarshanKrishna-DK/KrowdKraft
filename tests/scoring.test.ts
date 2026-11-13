import { describe, expect, it } from 'vitest';
import { previousQuarters, quarterLabel, quarterOf, standings, type LedgerEntry } from '../src/lib/scoring';

const entry = (member: string, kind: LedgerEntry['kind'], track: LedgerEntry['track'] = 'developers') => ({
  member,
  kind,
  track,
  date: '2026-11-02T10:00:00+05:30',
});

describe('quarterly scoring', () => {
  it('places dates in IST quarters', () => {
    expect(quarterOf('2026-09-30T19:00:00Z')).toBe('2026-Q4');
    expect(quarterOf('2026-09-30T18:00:00Z')).toBe('2026-Q3');
    expect(quarterLabel('2026-Q4')).toBe('Q4 2026 · Oct – Dec');
    expect(previousQuarters('2026-Q1', 3)).toEqual(['2026-Q1', '2025-Q4', '2025-Q3']);
  });

  it('adds designated points per activity and keeps tracks separate', () => {
    const rows = standings(
      [
        entry('Asha', 'hackathon-participated'),
        entry('Asha', 'hackathon-won'),
        entry('Ravi', 'hackathon-finalist'),
        entry('Meera', 'article-published', 'creators'),
      ],
      'developers',
      '2026-Q4',
    );
    expect(rows.map((row) => [row.member, row.points, row.rank, row.wins])).toEqual([
      ['Asha', 50, 1, 1],
      ['Ravi', 20, 2, 0],
    ]);
    expect(
      standings([entry('Meera', 'article-published', 'creators')], 'creators', '2026-Q4')[0].points,
    ).toBe(10);
  });

  it('shares ranks on equal points and ignores activities outside the track or quarter', () => {
    const rows = standings(
      [
        entry('A', 'talk-delivered'),
        entry('B', 'talk-delivered'),
        entry('C', 'event-attended'),
        entry('D', 'article-published'),
        { ...entry('E', 'hackathon-won'), date: '2026-06-01' },
      ],
      'developers',
      '2026-Q4',
    );
    expect(rows.map((row) => [row.member, row.rank])).toEqual([
      ['A', 1],
      ['B', 1],
      ['C', 3],
    ]);
  });
});
