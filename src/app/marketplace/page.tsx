import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { OrbitScene } from "@/components/art/scenes";
import { ProductSubmission } from "@/components/forms/product-submission";
import { MarketplaceDirectory } from "@/components/marketplace-directory";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { getProducts } from "@/server/community";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Community marketplace | KrowdKraft",
  description:
    "A home for products, tools and ideas built by the KrowdKraft community. Submit your project for the community showcase.",
};
export default async function MarketplacePage() {
  const { records, available, configured } = await getProducts();
  return (
    <PageShell>
      <div className="container">
        <div className="page-intro-with-art">
          <div className="page-intro">
            <p className="eyebrow">The community marketplace</p>
            <h1>
              Someone here
              <br />
              <span className="serif-word">built that.</span>
            </h1>
            <p>
              Discover useful little tools, ambitious experiments and products
              made by people in the Krowd. A place to share what you’ve shipped
              and find your first few fans.
            </p>
            <div className="actions">
              <a href="#submit" className="button primary">
                List your product <Icon name="plus" size={18} />
              </a>
            </div>
          </div>
          <OrbitScene />
        </div>
        {configured && !available ? (
          <p className="notice" role="alert">
            This collection couldn’t be loaded right now. Please refresh to try
            again.
          </p>
        ) : records.length ? (
          <MarketplaceDirectory products={records} />
        ) : (
          <div className="empty-showcase">
            <div>
              <span className="eyebrow">Coming soon</span>
              <h2>
                The shelves are open.
                <br />
                The first products are on their way.
              </h2>
              <p>
                We’re putting together our first collection. Have a product,
                open-source tool or working prototype? You could be part of the
                opening lineup.
              </p>
              <a href="#submit" className="button light">
                Put your work out there <Icon name="diagonal" />
              </a>
            </div>
            <div className="empty-orbit-mark" aria-hidden="true">
              <Icon name="plus" size={57} />
            </div>
          </div>
        )}
        <div className="subsection">
          <h2>A little less launch anxiety.</h2>
          <div className="process-list">
            <div>
              <span className="mono">01</span>
              <h3>Show us the thing.</h3>
              <p>
                A link, the problem it solves, and who built it. Working
                prototypes and open-source projects are welcome.
              </p>
            </div>
            <div>
              <span className="mono">02</span>
              <h3>We give it a look.</h3>
              <p>
                The team checks that it works, belongs here, and has clear
                attribution. Every listing gets a human review.
              </p>
            </div>
            <div>
              <span className="mono">03</span>
              <h3>Find your first fans.</h3>
              <p>
                Approved projects get a public home in the community directory,
                with a link straight to your work.
              </p>
            </div>
          </div>
        </div>
        <div className="submission-layout" id="submit">
          <div>
            <p className="eyebrow">Let’s get it out of that folder</p>
            <h2>List your product.</h2>
            <p>
              Tell us what you’ve built. We’ll use your email only to follow up
              on your submission. It will never appear on your public listing.
            </p>
            <DuckDock
              id="submit-product"
              mood="curious"
              tip="Yes, the project you keep calling 'just a little thing' counts."
            />
          </div>
          <ProductSubmission />
        </div>
      </div>
    </PageShell>
  );
}
