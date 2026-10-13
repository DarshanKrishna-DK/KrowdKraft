import Image from "next/image";
import Link from "next/link";
import { communityEmail } from "@/data/community";
export function Footer() {
  return (
    <footer className="footer clay">
      <div className="container footer-top">
        <div>
          <Link className="brand" href="/#top">
            <Image src="/brand/logo.webp" width={44} height={44} alt="" />
            <span>KrowdKraft.</span>
          </Link>
          <p>Bengaluru developer community</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/#about">About</Link>
          <Link href="/#events">Events</Link>
          <Link href="/#collaborate">Collaborate</Link>
          <Link href="/#join">Community</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <a href={`mailto:${communityEmail}`}>
          {communityEmail} <span aria-hidden="true">↗</span>
        </a>
        <p>© {new Date().getFullYear()} KrowdKraft</p>
      </div>
    </footer>
  );
}
