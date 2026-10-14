import Link from "next/link";
import type { Product, Spotlight } from "@/server/community";
import { Icon } from "./icon";
import { DuckDock } from "./duck/duck-dock";
import { SpotlightStage } from "./spotlight-stage";

export function ExhibitionObject() {
  return (
    <div className="exhibition-object" aria-hidden="true" data-reveal="card">
      <div className="exhibit-halo" />
      <div className="exhibit-folder">
        <span className="folder-tab" />
        <span className="folder-sheet sheet-back" />
        <span className="folder-sheet sheet-front">
          <span />
          <span />
          <span />
        </span>
        <span className="folder-face">
          <Icon name="branch" size={56} />
          <span>Made here.</span>
        </span>
      </div>
      <div className="exhibit-shelf" />
    </div>
  );
}
export function ProjectInvitation({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`project-invitation ${compact ? "invitation-compact" : ""}`}
    >
      <ExhibitionObject />
      <div className="invitation-copy">
        <span className="collection-status">First collection coming soon</span>
        <h3>
          From your laptop.
          <br />
          Into someone’s hands.
        </h3>
        <p>
          Your project deserves more than a forgotten browser tab. Share a tool,
          an open-source project, or a working prototype the community can
          actually try.
        </p>
        <Link href="/marketplace#submit" className="button light">
          List your project <Icon name="plus" size={18} />
        </Link>
        <span className="invitation-note">
          Built by members. Reviewed by people. Free to explore.
        </span>
      </div>
    </div>
  );
}
export function CommunityExhibition({
  products,
  spotlights,
  productsUnavailable = false,
  spotlightsUnavailable = false,
  loading = false,
}: {
  products: Product[];
  spotlights: Spotlight[];
  productsUnavailable?: boolean;
  spotlightsUnavailable?: boolean;
  loading?: boolean;
}) {
  return (
    <>
      <section className="section exhibition-home" id="made-here">
        <div className="container">
          <div className="section-heading" data-reveal="rise">
            <div>
              <h2>
                Built by the Krowd.
                <br />
                <span className="serif-word">Tried by you.</span>
              </h2>
            </div>
            <div className="heading-aside">
              <p>
                Meet the projects our community is making. Try something useful,
                give thoughtful feedback, and find the people behind it.
              </p>
              <Link href="/marketplace" className="text-link">
                Explore the showcase <Icon name="diagonal" />
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="collection-loading" role="status">
              Loading community projects…
            </div>
          ) : productsUnavailable ? (
            <p className="notice">
              The collection couldn’t load.{" "}
              <Link href="/marketplace">Open the showcase to try again.</Link>
            </p>
          ) : products.length ? (
            <div className="home-projects">
              {products.slice(0, 3).map((product) => (
                <article className="home-project" key={product.id}>
                  <span className="badge">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <span className="product-byline">By {product.builder}</span>
                  <a
                    className="button light"
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Try the project <Icon name="diagonal" />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <ProjectInvitation />
          )}
          <DuckDock
            id="projects"
            mood="curious"
            tip="A project nobody sees is just a very elaborate folder. Let’s fix that."
            href="/marketplace#submit"
            label="Show your work"
          />
        </div>
      </section>
      <section className="section spotlight-home" id="spotlights">
        <div className="container spotlight-home-layout">
          <div className="spotlight-home-copy" data-reveal="slide">
            <h2>
              Good work.
              <br />
              <span className="serif-word">Great humans.</span>
            </h2>
            <p>
              The builders behind the breakthroughs. Hackathon wins, open-source
              milestones, and the work that makes the rest of us want to start.
            </p>
            <Link className="text-link" href="/spotlight#nominate">
              Nominate a builder <Icon name="star" size={18} />
            </Link>
            <p className="page-note">
              Yourself counts. Every story is reviewed before it goes live.
            </p>
            <DuckDock
              id="spotlight"
              mood="celebrate"
              tip="Yes, you can nominate yourself. Your imposter syndrome does not get a vote."
              href="/spotlight#nominate"
              label="Take the spotlight"
            />
          </div>
          {loading ? (
            <div className="collection-loading spotlight-loading" role="status">
              Loading builder stories…
            </div>
          ) : spotlightsUnavailable ? (
            <p className="notice">
              Builder stories couldn’t load.{" "}
              <Link href="/marketplace#builders">Try the showcase again.</Link>
            </p>
          ) : (
            <SpotlightStage entries={spotlights} />
          )}
        </div>
      </section>
    </>
  );
}
