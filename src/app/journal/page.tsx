import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { JournalCover } from "@/components/art/scenes";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { journal } from "@/data/journal";
import { formatEventDate } from "@/data/event-utils";
export const metadata: Metadata = {
  title: "The journal | KrowdKraft",
  description:
    "Thoughts on building, learning and finding your way. Read the KrowdKraft community's original writing on Medium.",
};
export default function JournalPage() {
  return (
    <PageShell className="journal-page">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">The KrowdKraft journal</p>
          <h1>
            Things we’re learning.
            <br />
            <span className="serif-word">Things worth sharing.</span>
          </h1>
          <p>
            Career detours, developer dilemmas and ideas that deserve a little
            more room. Original writing from the people behind the Krowd.
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
              <JournalCover variant={article.cover} />
              <div className="article-meta">
                <span>{article.topic}</span>
                <span>
                  Medium <Icon name="diagonal" size={14} />
                </span>
              </div>
              <h2
                style={{
                  fontSize: 28,
                  lineHeight: 1.2,
                  letterSpacing: "-.04em",
                }}
              >
                {article.title}
              </h2>
              <p>{article.description}</p>
              <p className="page-note">
                {article.author}
                <br />
                <time dateTime={article.date}>
                  {formatEventDate(article.date)}
                </time>
              </p>
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
