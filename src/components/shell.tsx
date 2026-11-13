import Link from 'next/link';
import { Navigation } from './navigation';
import { Icon } from './icon';
import { JoinCommunity } from './join-community';
import { FooterSkyline } from './footer-skyline';
import { getCommunity } from '@/lib/data';

const socials = [
  ['github', 'GitHub'],
  ['linkedin', 'LinkedIn'],
  ['instagram', 'Instagram'],
  ['x', 'X'],
  ['whatsapp', 'WhatsApp'],
] as const;
const footerLinks = [
  ['/', 'Home'],
  ['/#circles', 'Community'],
  ['/#blogs', 'Blogs'],
] as const;

export async function Header() {
  const community = await getCommunity();
  return (
    <header className="site-header" style={{ viewTransitionName: 'site-header' }}>
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${community.name} home`}>
          <img src="/brand/mark.png" width="38" height="38" alt="" />
          <span>{community.name}</span>
        </Link>
        <Navigation />
        <JoinCommunity whatsapp={community.links.whatsapp} />
      </div>
    </header>
  );
}
export async function Footer() {
  const community = await getCommunity();
  return (
    <footer className="site-footer">
      <div className="footer-card">
        <img className="footer-mark" src="/brand/mark.png" width="384" height="384" alt="" />
        <div className="footer-head">
          <Link href="/" className="footer-brand">
            <img src="/brand/mark.png" width="26" height="26" alt="" />
            {community.name}
          </Link>
          <nav className="footer-links" aria-label="Footer">
            {footerLinks.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <span className="footer-divider" aria-hidden="true" />
            {socials.map(([key, label]) => (
              <a key={key} href={community.links[key]} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon name={key} size={18} />
              </a>
            ))}
          </nav>
        </div>
        <p className="footer-tagline">
          Crafted by the <span>krowd</span>
        </p>
        <p className="footer-about">{community.description}</p>
        <FooterSkyline />
      </div>
      <div className="footer-legal">
        <p>
          {community.name} © {new Date().getFullYear()} · {community.city}
        </p>
        <p>
          <a href={community.links.luma} target="_blank" rel="noreferrer">
            Luma
          </a>
          <span aria-hidden="true">·</span>
          <a href={community.links.medium} target="_blank" rel="noreferrer">
            Medium
          </a>
          <span aria-hidden="true">·</span>
          <Link href="/events">Events</Link>
          <span aria-hidden="true">·</span>
          <Link href="/#people">People</Link>
        </p>
      </div>
    </footer>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro wrap">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{description}</p>
      {children}
    </section>
  );
}
export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {label && <p className="eyebrow">{label}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
