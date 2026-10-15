import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { z } from 'zod';
import { getProject } from '@/lib/data';
import { PageIntro } from '@/components/shell';
import { Icon } from '@/components/icon';
import { dateLabel } from '@/lib/events';
async function find(id: string) {
  if (!z.uuid().safeParse(id).success) return null;
  return getProject(id);
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await find((await params).id);
  return { title: p?.title || 'Project not found', description: p?.summary };
}
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await find((await params).id);
  if (!p) notFound();
  return (
    <>
      <PageIntro eyebrow="From the builders’ board" title={p.title} description={p.summary} />
      <section className="wrap page-body detail-grid">
        <div className="detail-main">
          {p.image_url && <img src={p.image_url} alt={`${p.title} screenshot`} width={1200} height={750} />}
          <h2>Behind the build</h2>
          <p>{p.description}</p>
          <div className="detail-source">
            <Link href="/builds" className="text-link">
              <Icon name="back" size={16} /> Back to the board
            </Link>
            <p className="fine-print">Updated {dateLabel(p.updated_at.slice(0, 10))}</p>
          </div>
        </div>
        <aside className="detail-sidebar">
          <p className="eyebrow">Made by</p>
          <h2>{p.author?.name || 'A Krafter'}</h2>
          {p.author?.bio && <p className="fine-print">{p.author.bio}</p>}
          {p.author?.website && (
            <a href={p.author.website} target="_blank" rel="noreferrer ugc" className="text-link">
              Maker’s website
              <Icon name="diagonal" size={15} />
            </a>
          )}
          <div className="tag-row">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <a className="button button-silver" href={p.repository_url} target="_blank" rel="noreferrer ugc">
            View on GitHub
            <Icon name="github" size={16} />
          </a>
          {p.demo_url && (
            <a className="button button-quiet" href={p.demo_url} target="_blank" rel="noreferrer ugc">
              Try the demo
              <Icon name="diagonal" size={16} />
            </a>
          )}
          <p className="fine-print">
            This project belongs to its maker. External links open independent websites.
          </p>
        </aside>
      </section>
    </>
  );
}
