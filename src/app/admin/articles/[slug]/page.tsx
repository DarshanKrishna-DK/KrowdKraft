import Link from 'next/link';
import { notFound } from 'next/navigation';
import { organizerPageContext } from '@/lib/organizer-page';
import { Icon } from '@/components/icon';
import { PageIntro } from '@/components/shell';
import { ArticleForm } from '@/components/forms/organizer-forms';
import type { ArticleRecord } from '@/lib/types';
export default async function EditArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { db } = await organizerPageContext();
  let article: ArticleRecord | undefined;
  if (slug !== 'new') {
    const { data, error } = await db.from('workshop_articles').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    if (!data) notFound();
    article = data;
  }
  return (
    <>
      <PageIntro
        eyebrow="Organizer desk · Journal"
        title={article ? 'A note worth keeping current.' : 'Pass something useful on.'}
        description="Introduce an article and link to its original publication. Give the author and original publication date their place."
      />
      <section className="wrap page-body editor-wrap">
        <Link className="back-link" href="/admin?tab=articles">
          <Icon name="back" size={16} /> Back to the journal
        </Link>
        <div className="form-panel">
          <ArticleForm article={article} />
        </div>
      </section>
    </>
  );
}
