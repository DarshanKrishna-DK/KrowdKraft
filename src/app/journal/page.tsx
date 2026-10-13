import { pageMetadata } from "@/lib/page-metadata";
import { PageShell } from "@/components/page-shell";
import { JournalCover } from "@/components/art/scenes";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { journal } from "@/data/journal";
import { formatEventDate } from "@/data/event-utils";
export const metadata = pageMetadata(
  "The journal | KrowdKraft",
  "Thoughts on building, learning and finding your way. Read notes from Darshan Krishna N on Medium.",
  "/journal",
);
export default function JournalPage() {
  return (
    <PageShell className="journal-page">
      <div className="container">
        <div className="page-intro journal-masthead">
          <p className="eyebrow">Notes from Darshan</p>
          <h1>
            Open notebooks.
            <br />
            <span className="serif-word">Fresh perspectives.</span>
          </h1>
          <p>
            Career detours, developer dilemmas and ideas that deserve a little
            more room. Essays by Darshan Krishna N, originally published on
            Medium.
          </p>
          <DuckDock
            id="journal-page"
            mood="thinking"
            tip="One good read. Then back to the 47 tabs you already have open."
          />
        </div>
        <div className="journal-grid">
          {journal.map((article) => (
            <a
              className="article-card"
              key={article.slug}
              href={article.href}
              target="_blank"
              rel="noreferrer"
            >
              <JournalCover src={article.cover} />
              <div className="article-body">
                <div className="article-meta">
                  <span>{article.topic}</span>
                  <span>
                    Medium <Icon name="diagonal" size={14} />
                  </span>
                </div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <p className="page-note">
                  {article.author}
                  <br />
                  <time dateTime={article.date}>
                    {formatEventDate(article.date)}
                  </time>
                </p>
                <span className="text-link">
                  Read the story <Icon name="diagonal" size={18} />
                </span>
              </div>
            </a>
          ))}
        </div>
        <p className="page-note" style={{ marginTop: 35 }}>
          These articles open on Medium, where you can read the full piece and
          follow the author.
        </p>
      </div>
    </PageShell>
  );
}
