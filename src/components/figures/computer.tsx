'use client';
import { useEffect, useRef } from 'react';
import meta from './computer-meta.json';
export function Computer({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const phrase = 'hello, krafters';
    const animations = new Set<Animation>();
    let visible = false,
      index = 0,
      timer: ReturnType<typeof setTimeout> | undefined;
    const text = root.current?.querySelector('[data-part="text"]');
    const cursor = root.current?.querySelector('[data-part="cursor"]');
    const render = (line: string) => {
      if (text) text.textContent = '> ' + line;
      if (cursor && text)
        cursor.setAttribute('x', String(meta.textX + (text as SVGTextElement).getComputedTextLength() + 1));
    };
    const paused = () => mq.matches || document.hidden || !visible;
    const tick = () => {
      clearTimeout(timer);
      if (paused()) {
        if (mq.matches) render(phrase);
        return;
      }
      if (index > phrase.length) {
        index = 0;
        render('');
        timer = setTimeout(tick, 380);
        return;
      }
      render(phrase.slice(0, index));
      const key = meta.keys.indexOf(phrase[index - 1]?.toLowerCase());
      const node = root.current?.querySelector('[data-key="' + key + '"]');
      if (node && index > 0) {
        const a = node.animate(
          [
            { transform: 'translate(0,0)' },
            { transform: 'translate(' + meta.down[0] + 'px,' + meta.down[1] + 'px)' },
            { transform: 'translate(0,0)' },
          ],
          { duration: 200, easing: 'ease-out' },
        );
        animations.add(a);
        a.onfinish = () => animations.delete(a);
      }
      index++;
      timer = setTimeout(tick, index > phrase.length ? 2500 : 130);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      tick();
    });
    if (root.current) observer.observe(root.current);
    mq.addEventListener('change', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mq.removeEventListener('change', tick);
      document.removeEventListener('visibilitychange', tick);
      animations.forEach((a) => a.cancel());
    };
  }, []);
  return (
    <div className="computer-figure" ref={root}>
      <div className="computer-aura" aria-hidden="true" />
      <div className="iso computer-art">{children}</div>
    </div>
  );
}
