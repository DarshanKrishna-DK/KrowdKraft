import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getArticles } from '@/lib/data';
import { dateLabel } from '@/lib/events';
import { isShareCrawlerUa } from '@/lib/share-crawler';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getArticles()).find((item) => item.slug === slug) ?? null;
  if (!article) return { title: 'Blog' };
  const description = (article.subtitle || article.description).slice(0, 200);
  return {
    title: article.title,
    description,
    openGraph: { title: article.title, description },
    twitter: { card: 'summary_large_image', title: article.title, description },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = (await getArticles()).find((item) => item.slug === slug) ?? null;
  if (!article) notFound();
  if (!isShareCrawlerUa((await headers()).get('user-agent') ?? '')) redirect(article.href);
  return (
    <article className="wrap page-body">
      <p className="eyebrow">{dateLabel(article.date)}</p>
      <h1>{article.title}</h1>
      <p>{article.subtitle || article.description}</p>
      <a className="button" href={article.href}>
        Read the article
      </a>
    </article>
  );
}
