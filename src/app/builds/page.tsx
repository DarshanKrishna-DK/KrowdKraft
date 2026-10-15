import Link from 'next/link';
import type { Metadata } from 'next';
import { ShareProjectLink } from '@/components/share-project-link';
import { getProjects } from '@/lib/data';
import { ProjectCard } from '@/components/content-cards';
import { DirectoryArt } from '@/components/directory-art';
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
  title: 'The builders’ board',
  description: 'Projects and experiments made by the KrowdKraft community.',
};

export default async function Builds({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.floor(Math.max(1, Math.min(10000, Number((await searchParams).page) || 1)));
  const projects = await getProjects(page);
  return (
    <>
      <section className="directory-hero wrap">
        <div className="directory-hero-copy">
          <h1>
            The builders’
            <br />
            board.
          </h1>
          <p>
            Side projects, useful tools and experiments from the community. A place to show what you made and
            meet the people behind it.
          </p>
          <ShareProjectLink className="button">
            Share your project <Icon name="plus" size={17} />
          </ShareProjectLink>
        </div>
        <DirectoryArt kind="builds" />
      </section>
      <section className="wrap directory-body">
        <div className="directory-section-heading">
          <h2>Made by Krafters</h2>
          {page > 1 && <span>Page {page}</span>}
        </div>
        {projects.length ? (
          <div className="directory-project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="directory-build-empty">
            <div className="directory-open-slot" aria-hidden="true">
              <div>
                <Icon name="code" size={44} />
                <span>Your next project</span>
                <i />
                <i />
                <i />
              </div>
              <span className="directory-slot-pin" />
            </div>
            <div>
              <h2>{page > 1 ? 'You have reached the end.' : 'The first spot is open.'}</h2>
              <p>
                {page > 1
                  ? 'Head back to explore the community’s published projects.'
                  : 'Built a tool, a game, an app or a weekend experiment? Share the repository and tell us what it does. We review submissions before they appear here.'}
              </p>
              {page > 1 ? (
                <Link className="button" href="/builds">
                  Back to the board <Icon name="diagonal" size={17} />
                </Link>
              ) : (
                <ShareProjectLink className="button">
                  Share your project <Icon name="diagonal" size={17} />
                </ShareProjectLink>
              )}
            </div>
          </div>
        )}
        {(page > 1 || projects.length === 24) && (
          <nav className="pagination directory-pagination" aria-label="Project pages">
            {page > 1 && (
              <Link className="button" href={`/builds?page=${page - 1}`}>
                <Icon name="back" size={16} /> Previous
              </Link>
            )}
            {projects.length === 24 && (
              <Link className="button" href={`/builds?page=${page + 1}`}>
                Next projects <Icon name="diagonal" size={16} />
              </Link>
            )}
          </nav>
        )}
        <div className="directory-build-guidelines">
          <div>
            <Icon name="code" size={22} />
            <h3>Show the work</h3>
            <p>Link the repository, add a screenshot and share a working demo if you have one.</p>
          </div>
          <div>
            <Icon name="people" size={22} />
            <h3>Tell us about it</h3>
            <p>What does it do? What did you learn? A short, honest description is enough.</p>
          </div>
          <div>
            <Icon name="check" size={22} />
            <h3>Make it yours</h3>
            <p>Submit work you made. Projects are reviewed for publication, not security or endorsement.</p>
          </div>
        </div>
      </section>
    </>
  );
}
