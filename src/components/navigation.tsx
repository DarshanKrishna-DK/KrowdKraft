'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/icon';

const links = [
  { name: 'About', id: 'community' },
  { name: 'Events', id: 'past-events', route: '/events' },
  { name: 'Community', id: 'circles' },
  { name: 'Leaderboard', id: 'leaderboard', route: '/leaderboard' },
  { name: 'Builds', id: 'builds', route: '/builds' },
  { name: 'Blogs', id: 'blogs' },
  { name: 'People', id: 'people' },
];
export function Navigation() {
  const path = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
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
  useEffect(() => {
    const element = nav.current;
    if (!element) return;
    const indicator = element.querySelector<HTMLElement>('.nav-indicator');
    if (!indicator) return;
    const place = () => {
      const current = element.querySelector<HTMLElement>('[aria-current="location"]');
      if (!current || getComputedStyle(element).display === 'none') {
        indicator.style.opacity = '0';
        return;
      }
      const parent = element.getBoundingClientRect();
      const box = current.getBoundingClientRect();
      indicator.style.opacity = '1';
      indicator.style.width = `${box.width}px`;
      indicator.style.height = `${box.height}px`;
      indicator.style.transform = `translate(${box.left - parent.left}px, ${box.top - parent.top}px)`;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(element);
    window.addEventListener('resize', place);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [active, path, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!bar.current?.contains(event.target as Node)) setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1100) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);
  return (
    <div className={open ? 'navigation-bar is-open' : 'navigation-bar'} ref={bar}>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? 'close' : 'menu'} size={18} />
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>
      <nav className="section-nav" id="site-menu" ref={nav} aria-label="Main navigation">
        <span className="nav-indicator" aria-hidden="true" />
        {links.map(({ name, id }) => (
          <Link
            key={id}
            href={'/#' + id}
            aria-current={active === id ? 'location' : undefined}
            onClick={(event) => {
              setOpen(false);
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
        <button
          type="button"
          className="button nav-join"
          onClick={() => {
            setOpen(false);
            window.dispatchEvent(new Event('krowdkraft:join'));
          }}
        >
          <Icon name="people" size={18} />
          Be a Krafter
        </button>
      </nav>
    </div>
  );
}
