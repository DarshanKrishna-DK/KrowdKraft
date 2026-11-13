export type Track = 'developers' | 'creators';

export const tracks: { id: Track; name: string; summary: string }[] = [
  { id: 'developers', name: 'Developers', summary: 'Hackathons, talks and things shipped.' },
  { id: 'creators', name: 'Content creators', summary: 'Writing, videos, coverage and live sessions.' },
];

export const activities = {
  'hackathon-participated': { label: 'Hackathon submission', points: 10, tracks: ['developers'] },
  'hackathon-finalist': { label: 'Hackathon finalist bonus', points: 20, tracks: ['developers'] },
  'hackathon-won': { label: 'Hackathon winner bonus', points: 40, tracks: ['developers'] },
  'project-shipped': { label: 'Project shipped on Builds', points: 10, tracks: ['developers'] },
  'open-source-merged': { label: 'Open-source contribution merged', points: 5, tracks: ['developers'] },
  'article-published': { label: 'Article or blog published', points: 10, tracks: ['creators'] },
  'video-published': { label: 'Video or tutorial published', points: 10, tracks: ['creators'] },
  'event-coverage': { label: 'Event coverage', points: 15, tracks: ['creators'] },
  'featured-by-krowdkraft': { label: 'Featured by KrowdKraft', points: 20, tracks: ['creators'] },
  'talk-delivered': { label: 'Talk, workshop or livestream', points: 25, tracks: ['developers', 'creators'] },
  'event-volunteered': { label: 'Volunteered at an event', points: 15, tracks: ['developers', 'creators'] },
  'event-attended': { label: 'Attended a KrowdKraft event', points: 20, tracks: ['developers', 'creators'] },
} as const satisfies Record<string, { label: string; points: number; tracks: readonly Track[] }>;

export type ActivityKind = keyof typeof activities;

export type LedgerEntry = {
  member: string;
  track: Track;
  kind: ActivityKind;
  date: string;
  evidence?: string;
};

export type Standing = {
  member: string;
  points: number;
  rank: number;
  activities: number;
  wins: number;
};

export const activitiesFor = (track: Track) =>
  (Object.entries(activities) as [ActivityKind, (typeof activities)[ActivityKind]][]).filter(([, activity]) =>
    (activity.tracks as readonly Track[]).includes(track),
  );

const IST_OFFSET_MS = 330 * 60 * 1000;

export function quarterOf(date: Date | string) {
  const ist = new Date(new Date(date).getTime() + IST_OFFSET_MS);
  return `${ist.getUTCFullYear()}-Q${Math.floor(ist.getUTCMonth() / 3) + 1}`;
}

export function isQuarter(value: string | undefined): value is string {
  return !!value && /^20\d{2}-Q[1-4]$/.test(value);
}

export function quarterLabel(quarter: string) {
  const [year, q] = quarter.split('-Q').map(Number);
  const months = ['Jan – Mar', 'Apr – Jun', 'Jul – Sep', 'Oct – Dec'][q - 1];
  return `Q${q} ${year} · ${months}`;
}

export function quarterRange(quarter: string): [string, string] {
  const [year, q] = quarter.split('-Q').map(Number);
  const start = `${year}-${String((q - 1) * 3 + 1).padStart(2, '0')}-01`;
  const end = q === 4 ? `${year + 1}-01-01` : `${year}-${String(q * 3 + 1).padStart(2, '0')}-01`;
  return [start, end];
}

export function previousQuarters(current: string, count: number) {
  const [year, q] = current.split('-Q').map(Number);
  return Array.from({ length: count }, (_, index) => {
    const step = year * 4 + (q - 1) - index;
    return `${Math.floor(step / 4)}-Q${(step % 4) + 1}`;
  });
}

export function standings(entries: LedgerEntry[], track: Track, quarter: string): Standing[] {
  const totals = new Map<string, Omit<Standing, 'rank'>>();
  for (const entry of entries) {
    const activity = activities[entry.kind];
    if (entry.track !== track || quarterOf(entry.date) !== quarter) continue;
    if (!(activity.tracks as readonly Track[]).includes(track)) continue;
    const current = totals.get(entry.member) || { member: entry.member, points: 0, activities: 0, wins: 0 };
    current.points += activity.points;
    current.activities += 1;
    if (entry.kind === 'hackathon-won') current.wins += 1;
    totals.set(entry.member, current);
  }
  const sorted = [...totals.values()].sort(
    (a, b) => b.points - a.points || b.wins - a.wins || a.member.localeCompare(b.member),
  );
  const ranked: Standing[] = [];
  sorted.forEach((row, index) => {
    const previous = ranked[index - 1];
    ranked.push({ ...row, rank: previous && previous.points === row.points ? previous.rank : index + 1 });
  });
  return ranked;
}
