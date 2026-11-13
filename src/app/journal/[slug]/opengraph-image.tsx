import { connection } from 'next/server';
import { getArticles } from '@/lib/data';
import { dateLabel } from '@/lib/events';
import { ogCard, ogSize } from '@/lib/og-card';

export const alt = 'KrowdKraft blog';
export const size = ogSize;
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const article = await getArticles()
    .then((articles) => articles.find((item) => item.slug === slug) ?? null)
    .catch(() => null);
  if (!article) {
    return ogCard({
      eyebrow: 'Blogs to read',
      title: 'Notes for builders.',
      footer: 'krowd-kraft.vercel.app/journal',
    });
  }
  const blurb = (article.subtitle || article.description).replace(/\s+/g, ' ').trim();
  const clipped = blurb.length > 110 ? blurb.slice(0, 109).replace(/\s+\S*$/, '') + '…' : blurb;
  return ogCard({
    eyebrow: `Blog · ${dateLabel(article.date)}`,
    title: article.title,
    details: clipped ? [clipped] : [],
    footer: 'krowd-kraft.vercel.app/journal',
    poster: article.image,
  });
}
