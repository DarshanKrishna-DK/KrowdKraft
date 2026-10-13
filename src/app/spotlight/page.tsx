import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";
import { PageShell } from "@/components/page-shell";
import { ProductSubmission } from "@/components/forms/product-submission";
import { SpotlightStage } from "@/components/spotlight-stage";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { getSpotlights } from "@/server/community";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Builder spotlight | KrowdKraft",
  "Share a hackathon result, an open-source milestone, or a builder achievement for KrowdKraft's community showcase.",
  "/spotlight",
);
export default async function SpotlightPage() {
  const { records, available, configured } = await getSpotlights();
  return (
    <PageShell className="spotlight-page nomination-page">
      <div className="container">
        <Link className="back-link" href="/marketplace#builders">
          <Icon name="arrow" style={{ transform: "rotate(180deg)" }} /> Back to
          the community showcase
        </Link>
        <section className="nomination-masthead" data-guide-section>
          <div className="page-intro">
            <h1>
              The work is yours.
              <br />
              <span className="serif-word">The applause is ours.</span>
            </h1>
            <p>
              A hackathon win, a meaningful contribution, or something you
              refused to give up on. Tell us the story and the people behind it.
            </p>
            <a className="button primary" href="#nominate">
              Nominate a builder <Icon name="star" />
            </a>
            <DuckDock
              id="spotlight-intro"
              mood="celebrate"
              tip="You don’t need a trophy to belong here. Evidence of doing the work will do."
              href="#nominate"
              label="Share the story"
            />
          </div>
          {configured && !available ? (
            <p className="notice" role="alert">
              The spotlight couldn’t load. Please refresh.
            </p>
          ) : (
            <SpotlightStage entries={records} />
          )}
        </section>
        <section
          className="submission-layout nomination-desk"
          id="nominate"
          data-guide-section
        >
          <div>
            <h2>
              Let’s hear
              <br />
              <span className="serif-word">your story.</span>
            </h2>
            <p>
              Nominate a friend, a team, or yourself. A public link helps us
              verify the achievement. Add up to three public profiles so the
              community can connect.
            </p>
            <div className="nomination-note">
              <Icon name="star" size={26} />
              <p>
                We review every nomination and confirm publication with the
                builder. Your contact email is never shown publicly.
              </p>
            </div>
            <DuckDock
              id="nominate"
              mood="curious"
              tip="Self-nominations count. Humility is nice. A working demo is nicer."
            />
          </div>
          <ProductSubmission kind="nomination" />
        </section>
      </div>
    </PageShell>
  );
}
