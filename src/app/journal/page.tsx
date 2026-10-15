import type { Metadata } from 'next';
import { getArticles } from '@/lib/data';
import { PageIntro } from '@/components/shell';
import { ArticleList } from '@/components/content-cards';
export const metadata: Metadata = {
  title: 'Blogs to read',
  description: 'Practical notes on learning, building, and finding your next opportunity.',
};
export default async function Journal() {
  const articles = await getArticles();
  return (
    <>
      <PageIntro
        eyebrow="From Darshan's Medium"
        title="Blogs to read."
        description="Writing on development, learning, and opportunities for builders. New posts appear here automatically."
      />
      <section className="wrap page-body">
        {articles.length ? (
          <ArticleList articles={articles} />
        ) : (
          <div className="empty-state">
            <h2>New writing is on the way.</h2>
            <p>Published articles appear here after the next feed update.</p>
          </div>
        )}
        <p className="fine-print">
          Articles open at their original publication. Dates refer to the original publication date.
        </p>
      </section>
    </>
  );
}
