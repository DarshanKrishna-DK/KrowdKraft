import { connection } from 'next/server';
import { getArticles } from '@/lib/data';
import { dateLabel } from '@/lib/events';
import { ogCard, ogSize } from '@/lib/og-card';
export const alt = 'Blogs to read on KrowdKraft';
export const size = ogSize;
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';
export default async function Image() {
  await connection();
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles();
  } catch {
    articles = [];
  }
  const [latest] = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  return ogCard({
    eyebrow: latest ? `Latest read · ${dateLabel(latest.date)}` : 'Blogs to read',
    title: latest?.title ?? 'Notes on learning, building and finding your next opportunity.',
    details: latest?.subtitle
      ? [latest.subtitle.length > 110 ? latest.subtitle.slice(0, 107) + '…' : latest.subtitle]
      : [],
    footer: 'krowd-kraft.vercel.app/journal',
    poster: latest?.image,
  });
}
