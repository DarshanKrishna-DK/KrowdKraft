import Link from "next/link";
import { communityEmail } from "@/data/community";
import { links } from "@/data/links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-compact">
        <div className="footer-heading">
          <Link href="/" className="footer-wordmark">
            KrowdKraft<span>.</span>
          </Link>
          <a className="footer-email" href={"mailto:" + communityEmail}>
            {communityEmail}
          </a>
        </div>
        <nav className="footer-destinations" aria-label="On this site">
          <Link href="/events">Events</Link>
          <Link href="/#about">About</Link>
          <Link href="/#people">People</Link>
          <Link href="/account">Member account</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/spotlight">Spotlight</Link>
          <Link href="/leaderboard">Activity</Link>
          <Link href="/journal">Journal</Link>
        </nav>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KrowdKraft</p>
          <nav className="footer-socials" aria-label="Follow KrowdKraft">
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={links.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={links.luma} target="_blank" rel="noreferrer">
              Luma
            </a>
            <a href={links.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={links.x} target="_blank" rel="noreferrer">
              X
            </a>
          </nav>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
