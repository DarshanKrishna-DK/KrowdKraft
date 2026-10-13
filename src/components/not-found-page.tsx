import Link from "next/link";
import { PageShell } from "./page-shell";
import { DuckDock } from "./duck/duck-dock";
import { Icon } from "./icon";
export function MissingPage() {
  return (
    <PageShell>
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">404 · A small detour</p>
          <h1>
            Well, this is
            <br />
            <span className="serif-word">a little awkward.</span>
          </h1>
          <p>That page isn’t here. The community still is.</p>
          <div className="actions">
            <Link className="button primary" href="/">
              Back to the Krowd <Icon name="arrow" />
            </Link>
            <Link className="text-link" href="/events">
              Find an event <Icon name="diagonal" />
            </Link>
          </div>
          <DuckDock
            id="lost"
            mood="concerned"
            tip="I may have taken a wrong turn. In my defence, I have webbed feet."
            href="/"
            label="Let’s head home"
          />
        </div>
      </div>
    </PageShell>
  );
}
