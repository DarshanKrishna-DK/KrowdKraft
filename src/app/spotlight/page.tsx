import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SpotlightScene } from "@/components/art/scenes";
import { ProductSubmission } from "@/components/forms/product-submission";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { getSpotlights } from "@/server/community";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Builder spotlight | KrowdKraft",
  description:
    "The builders, teams and stories worth celebrating. Nominate someone for the KrowdKraft community spotlight.",
};
export default async function SpotlightPage() {
  const { records, available, configured } = await getSpotlights();
  return (
    <PageShell className="spotlight-page">
      <div className="container">
        <div className="page-intro-with-art spotlight-masthead">
          <div className="page-intro">
            <span className="edition-label">
              The people. The process. The possibility.
            </span>
            <p className="eyebrow">The builder spotlight</p>
            <h1>
              Behind the work,
              <br />
              <span className="serif-word">a human.</span>
            </h1>
            <p>
              Hackathon wins are worth celebrating. So is the persistence behind
              a first contribution, an unexpectedly useful tool, or a team that
              helped everyone else get there.
            </p>
            <a className="text-link" style={{ marginTop: 20 }} href="#nominate">
              Know someone like that? <Icon name="diagonal" />
            </a>
          </div>
          <SpotlightScene />
        </div>
        {configured && !available ? (
          <p className="notice" role="alert">
            This collection couldn’t be loaded right now. Please refresh to try
            again.
          </p>
        ) : records.length ? (
          <div className="spotlight-editions">
            {records.map((entry, index) => (
              <article className="empty-showcase" key={entry.id}>
                <div>
                  <p className="eyebrow">
                    {index === 0
                      ? "Latest edition"
                      : "From the spotlight archive"}{" "}
                    ·{" "}
                    {new Intl.DateTimeFormat("en", {
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(`${entry.month}-01T00:00:00Z`))}
                  </p>
                  <h2>{entry.name}</h2>
                  <p style={{ color: "var(--lime)", marginBottom: 16 }}>
                    {entry.builder}
                  </p>
                  <p>{entry.description}</p>
                  <a
                    className="text-link"
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Meet the work <Icon name="diagonal" />
                  </a>
                </div>
                <div className="empty-orbit-mark" aria-hidden="true">
                  <Icon name="star" size={60} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-showcase edition-opening">
            <div>
              <p className="eyebrow">First edition coming soon</p>
              <h2>
                The spotlight is ready.
                <br />
                The next story could be yours.
              </h2>
              <p>
                We’re curating our first builder feature. Each monthly edition
                will introduce a different person or team, the work they’re
                proud of, and what the rest of us can learn from it.
              </p>
            </div>
            <div className="edition-stamp">
              <span>YOUR</span>
              <span>STORY</span>
              <span>NEXT?</span>
            </div>
          </div>
        )}
        <div className="subsection">
          <h2>Good stories come in many forms.</h2>
          <div className="process-list editorial-criteria">
            <div>
              <span className="mono">The breakthrough</span>
              <h3>Something worth sharing.</h3>
              <p>
                A hackathon result, a project launch or an open-source
                contribution. Give us a link to the actual work.
              </p>
            </div>
            <div>
              <span className="mono">The people</span>
              <h3>Credit where it belongs.</h3>
              <p>
                Teams count. So do the people helping behind the scenes. Tell us
                who made the difference.
              </p>
            </div>
            <div>
              <span className="mono">The next edition</span>
              <h3>Selected with care.</h3>
              <p>
                Organizers review nominations, verify the story and get in touch
                before publishing a new spotlight.
              </p>
            </div>
          </div>
        </div>
        <div className="submission-layout nomination-desk" id="nominate">
          <div>
            <p className="eyebrow">Pass the mic</p>
            <h2>Nominate a builder.</h2>
            <p>
              A friend, a teammate, or yourself. Share a public link and tell us
              why this story should be heard. We’ll follow up by email.
            </p>
            <DuckDock
              id="nominate"
              autoTip={false}
              mood="celebrate"
              tip="Self-nominations count. Humility is nice. A working demo is nicer."
            />
          </div>
          <ProductSubmission kind="nomination" />
        </div>
      </div>
    </PageShell>
  );
}
