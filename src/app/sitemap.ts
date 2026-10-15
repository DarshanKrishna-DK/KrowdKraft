import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/data';
import { publicClient, siteUrl } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, { data: projects, error }] = await Promise.all([
    getArticles(),
    publicClient().from('workshop_projects').select('id,updated_at').eq('status', 'approved').limit(1000),
  ]);
  if (error) throw error;
  return [
    ...['', '/events', '/builds', '/journal', '/join', '/leaderboard', '/privacy'].map((path) => ({
      url: siteUrl() + path,
    })),
    ...(projects || []).map((p) => ({ url: `${siteUrl()}/builds/${p.id}`, lastModified: p.updated_at })),
    ...(articles.length ? [{ url: `${siteUrl()}/journal`, lastModified: articles[0].updated_at }] : []),
  ].filter((v, i, all) => all.findIndex((x) => x.url === v.url) === i);
}
