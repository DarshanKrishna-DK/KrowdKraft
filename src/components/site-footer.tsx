import Link from "next/link";
import { communityEmail } from "@/data/community";
import { links } from "@/data/links";
import { Icon } from "./icon";
import { MotionToggle } from "./motion";
import { DuckSettings } from "./duck/duck-settings";
import { AnalyticsPreferences } from "./analytics";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-intro">
          <Link href="/" className="footer-wordmark">
            KrowdKraft<span>.</span>
          </Link>
          <p>
            Good people. Bold ideas.
            <br />A very Bengaluru kind of thing.
          </p>
          <a className="footer-email" href={`mailto:${communityEmail}`}>
            {communityEmail}
            <Icon name="diagonal" size={17} />
          </a>
        </div>
        <nav aria-label="Explore the community">
          <span className="eyebrow">Find your corner</span>
          <Link href="/events">Events</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/spotlight">Builder spotlight</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/journal">Journal</Link>
        </nav>
        <nav aria-label="Follow KrowdKraft">
          <span className="eyebrow">Around the internet</span>
          <a href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={links.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
          <a href={links.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={links.luma} target="_blank" rel="noreferrer">
            Luma ↗
          </a>
          <a href={links.x} target="_blank" rel="noreferrer">
            X ↗
          </a>
        </nav>
      </div>
      <div className="container footer-settings">
        <div className="footer-preferences">
          <MotionToggle />
          <DuckSettings />
          <AnalyticsPreferences />
        </div>
        <Link href="/privacy">Privacy & your data</Link>
      </div>
      <div className="container footer-base">
        <p>© {new Date().getFullYear()} KrowdKraft</p>
        <p>
          Made with curiosity in Bengaluru <span className="footer-dot" />
        </p>
        <Link href="/leaderboard#contributors">
          Built by the community <Icon name="branch" size={14} />
        </Link>
      </div>
    </footer>
  );
}
