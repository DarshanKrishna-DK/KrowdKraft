import { pageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProductSubmission } from "@/components/forms/product-submission";
import { MarketplaceDirectory } from "@/components/marketplace-directory";
import { ProjectInvitation } from "@/components/community-exhibition";
import { SpotlightStage } from "@/components/spotlight-stage";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { getProducts, getSpotlights } from "@/server/community";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Community showcase | KrowdKraft",
  "Discover projects built by KrowdKraft members and the builders behind them. Try a product, connect with its maker, or share your own work.",
  "/marketplace",
);
export default async function MarketplacePage() {
  const [products, spotlights] = await Promise.all([
    getProducts(),
    getSpotlights(),
  ]);
  return (
    <PageShell className="marketplace-page exhibition-page">
      <div className="container">
        <section className="exhibition-masthead" data-guide-section>
          <div className="page-intro">
            <h1>
              Made by our people.
              <br />
              <span className="serif-word">Made to be used.</span>
            </h1>
            <p>
              A community exhibition of useful tools, bold experiments, and the
              humans building them. Try their work. Share a little feedback.
              Help a good idea find its people.
            </p>
            <div className="actions">
              <a className="button primary" href="#submit">
                List your project <Icon name="plus" />
              </a>
              <a className="button quiet" href="#builders">
                Meet the builders <Icon name="people" />
              </a>
            </div>
          </div>
          <div className="exhibition-lettering" aria-hidden="true">
            <span>build.</span>
            <span>share.</span>
            <span>repeat.</span>
          </div>
          <DuckDock
            id="showcase-intro"
            mood="happy"
            tip="Welcome to the exhibition. Touch the projects. That’s literally the point."
            href="#projects"
            label="Explore the work"
          />
        </section>
        <nav className="exhibition-tabs" aria-label="Showcase sections">
          <a href="#projects">Community projects</a>
          <a href="#builders">Builder spotlight</a>
          <a href="#submit">
            Submit your work <Icon name="plus" size={15} />
          </a>
        </nav>
        <section
          className="showcase-collection"
          id="projects"
          data-guide-section
        >
          <div className="subsection-heading">
            <h2>
              Fresh from the <span className="serif-word">workbench.</span>
            </h2>
            <p>Working projects. Real people. Direct links to try them.</p>
          </div>
          {products.configured && !products.available ? (
            <p className="notice" role="alert">
              This collection couldn’t load. Please refresh to try again.
            </p>
          ) : products.records.length ? (
            <MarketplaceDirectory products={products.records} />
          ) : (
            <ProjectInvitation compact />
          )}
          <DuckDock
            id="showcase-projects"
            mood="curious"
            tip="Your side project called. It would like to stop being a secret."
            href="#submit"
            label="List your project"
          />
        </section>
        <section className="showcase-builders" id="builders" data-guide-section>
          <div className="spotlight-home-copy">
            <h2>
              Meet the people
              <br />
              <span className="serif-word">making things happen.</span>
            </h2>
            <p>
              A stage for hackathon wins, meaningful contributions, and the kind
              of persistence that deserves an audience.
            </p>
            <Link href="/spotlight#nominate" className="text-link">
              Share an achievement <Icon name="diagonal" />
            </Link>
            <p className="page-note">
              One community. Room for more than one spotlight.
            </p>
            <DuckDock
              id="showcase-builders"
              mood="celebrate"
              tip="A small win is still a win. I celebrate opening a jar. No hands, remember?"
              href="/spotlight#nominate"
              label="Nominate a builder"
            />
          </div>
          {spotlights.configured && !spotlights.available ? (
            <p className="notice" role="alert">
              Builder stories couldn’t load. Please refresh.
            </p>
          ) : (
            <SpotlightStage entries={spotlights.records} />
          )}
        </section>
        <section
          className="submission-layout submission-desk"
          id="submit"
          data-guide-section
        >
          <div>
            <h2>
              Give your project
              <br />
              <span className="serif-word">a public home.</span>
            </h2>
            <p>
              A working link, a clear description, and the people behind it.
              That’s a good start.
            </p>
            <ol className="submission-steps">
              <li>
                <strong>Share the work</strong>
                <span>
                  Tools, open-source projects and working prototypes are
                  welcome.
                </span>
              </li>
              <li>
                <strong>A human takes a look</strong>
                <span>
                  We check the link, credit, and fit before anything goes
                  public.
                </span>
              </li>
              <li>
                <strong>Let people try it</strong>
                <span>
                  Your listing links straight to the product and your public
                  profiles.
                </span>
              </li>
            </ol>
            <p className="page-note">
              Your contact email stays private. Listing a project is free.
            </p>
            <DuckDock
              id="submit-product"
              mood="thinking"
              tip="A working link beats a 42-slide pitch deck. You’re already ahead."
            />
          </div>
          <ProductSubmission />
        </section>
      </div>
    </PageShell>
  );
}
