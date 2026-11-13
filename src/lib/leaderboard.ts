import 'server-only';
import { publicClient } from './supabase';
import { activities, quarterOf, quarterRange, standings, type LedgerEntry, type Track } from './scoring';

export const currentQuarter = () => quarterOf(new Date());

async function entriesFor(quarter: string): Promise<LedgerEntry[]> {
  const [start, end] = quarterRange(quarter);
  const { data, error } = await publicClient()
    .from('workshop_leaderboard_entries')
    .select('member,track,kind,date')
    .gte('date', start)
    .lt('date', end);
  if (error) return [];
  return (data as LedgerEntry[]).filter((entry) => entry.kind in activities);
}

export async function getLeaderboard(quarter = currentQuarter()) {
  const entries = await entriesFor(quarter);
  return {
    quarter,
    developers: standings(entries, 'developers', quarter),
    creators: standings(entries, 'creators', quarter),
  } satisfies { quarter: string } & Record<Track, unknown>;
}
