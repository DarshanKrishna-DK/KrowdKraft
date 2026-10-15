'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from './icon';
export function BackToTop() {
  const path = usePathname();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('.hero, .directory-hero, .page-intro');
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 96;
      const threshold = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY - headerHeight - 24
        : window.innerHeight * 0.75;
      setVisible(window.scrollY >= Math.max(200, threshold));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [path]);
  if (!visible) return null;
  return (
    <button
      type="button"
      className="back-to-top icon-button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
        document.querySelector<HTMLElement>('.brand')?.focus({ preventScroll: true });
      }}
    >
      <Icon name="arrow" size={20} />
    </button>
  );
}
