'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'About', id: 'community' },
  { name: 'Events', id: 'past-events', route: '/events' },
  { name: 'Builds', id: 'builds', route: '/builds' },
  { name: 'Leaderboard', id: 'leaderboard', route: '/leaderboard' },
  { name: 'Blogs', id: 'blogs' },
  { name: 'People', id: 'people' },
];
export function Navigation() {
  const path = usePathname();
  const [active, setActive] = useState('');
  useEffect(() => {
    if (path !== '/') {
      setActive(links.find((link) => link.route === path)?.id || '');
      return;
    }
    const update = () => {
      const line = Math.min(window.innerHeight * 0.35, 250);
      const candidates = links
        .map((link) => ({ id: link.id, top: document.getElementById(link.id)?.getBoundingClientRect().top }))
        .filter((entry) => entry.top !== undefined && entry.top <= line)
        .sort((a, b) => b.top! - a.top!);
      setActive(candidates[0]?.id || '');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [path]);
  return (
    <div className="navigation-bar">
      <nav className="section-nav" aria-label="Main navigation">
        {links.map(({ name, id }) => (
          <Link
            key={id}
            href={'/#' + id}
            aria-current={active === id ? 'location' : undefined}
            onClick={(event) => {
              if (path !== '/' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              const section = document.getElementById(id);
              if (!section) return;
              event.preventDefault();
              history.pushState(null, '', '/#' + id);
              section.scrollIntoView({
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                block: 'start',
              });
              section.setAttribute('tabindex', '-1');
              section.focus({ preventScroll: true });
            }}
          >
            {name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
