'use client';
import { useEffect, useRef, useState } from 'react';

const DURATION = 1400;

export function CountUp({ value }: { value: string }) {
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const [shown, setShown] = useState(value);
  const node = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = node.current;
    if (!match || !element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (element.getBoundingClientRect().top < innerHeight) return;
    const target = Number(match[1]);
    const decimals = match[1].split('.')[1]?.length ?? 0;
    const format = (n: number) => (decimals ? n.toFixed(decimals) : String(Math.round(n))) + match[2];
    let raf = 0;
    setShown(format(0));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setShown(format(target * (1 - (1 - t) ** 3)));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={node} className="count-up" aria-hidden="true">
        {shown}
      </span>
    </>
  );
}
