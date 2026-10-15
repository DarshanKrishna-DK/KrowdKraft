import 'server-only';
import { publicClient } from './supabase';
export const currentMonth = () => new Date().toISOString().slice(0, 7) + '-01';
export const monthLabel = (month: string) =>
  new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(month));
export async function getLeaderboard(month = currentMonth()) {
  const { data, error } = await publicClient().rpc('workshop_leaderboard', { target_month: month });
  if (error) throw new Error('The leaderboard is temporarily unavailable.');
  return {
    month,
    rows: (data || []) as {
      login: string;
      github_id: string;
      commits: number;
      pull_requests: number;
      score: number;
      rank: number;
      synced_at: string;
    }[],
  };
}
