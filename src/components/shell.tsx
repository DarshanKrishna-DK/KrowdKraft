import Link from 'next/link';
import { Navigation } from './navigation';
import { Icon } from './icon';
import { getCommunity } from '@/lib/data';
export async function Header() {
  const community = await getCommunity();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${community.name} home`}>
          <img src="/brand/mark.png" width="38" height="38" alt="" />
          <span>{community.name}</span>
        </Link>
        <Navigation />
        <a className="button header-join" href={community.links.whatsapp} target="_blank" rel="noreferrer">
          Be a Krafter
        </a>
      </div>
    </header>
  );
}
export async function Footer() {
  const community = await getCommunity();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <Link href="/" className="brand">
            <img src="/brand/mark.png" width="36" height="36" alt="" />
            {community.name}
          </Link>
          <p>
            Workshops, hack days, and shared projects.
            <br />
            {community.city}, India.
          </p>
          <a className="text-link" href={`mailto:${community.email}`}>
            Say hello
            <Icon name="diagonal" size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {community.name}
          </span>
          <div>
            {['github', 'linkedin', 'instagram', 'x'].map((key) => (
              <a key={key} href={community.links[key]} target="_blank" rel="noreferrer">
                {{ github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram', x: 'X' }[key]}
              </a>
            ))}
            <Link href="/privacy">Privacy</Link>
            <a href="/licenses/anatomy.txt">Art license</a>
            <a href="/licenses/hairline.txt">Hairline license</a>
            <a href="/licenses/tabler.txt">Icon license</a>
            <a href="/licenses/jaini-ofl.txt">Font license</a>
            <Link href="/admin">Organizer desk</Link>
          </div>
        </div>
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
