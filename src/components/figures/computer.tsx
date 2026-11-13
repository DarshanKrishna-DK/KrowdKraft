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
  useEffect(() => {
    const figure = root.current;
    const hero = figure?.closest<HTMLElement>('.hero');
    if (!figure || !hero) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(pointer: fine)');
    const frames = { move: 0, scroll: 0 };
    const schedule = (kind: keyof typeof frames, update: () => void) => {
      cancelAnimationFrame(frames[kind]);
      frames[kind] = requestAnimationFrame(update);
    };
    const onMove = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches) return;
      schedule('move', () => {
        const box = figure.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
        const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
        figure.style.setProperty('--light-x', `${((x - 0.5) * box.width).toFixed(1)}px`);
        figure.style.setProperty('--light-y', `${((y - 0.5) * box.height).toFixed(1)}px`);
        figure.style.setProperty('--tilt-x', `${((0.5 - y) * 5).toFixed(2)}deg`);
        figure.style.setProperty('--tilt-y', `${((x - 0.5) * 7).toFixed(2)}deg`);
        figure.classList.add('is-lit');
      });
    };
    const onLeave = () => {
      figure.classList.remove('is-lit');
      figure.style.setProperty('--tilt-x', '0deg');
      figure.style.setProperty('--tilt-y', '0deg');
    };
    const onScroll = () => {
      if (reduced.matches) return;
      schedule('scroll', () => {
        const rise = Math.min(scrollY, hero.offsetHeight) * -0.12;
        figure.style.setProperty('--rise', `${rise.toFixed(1)}px`);
      });
    };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frames.move);
      cancelAnimationFrame(frames.scroll);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      removeEventListener('scroll', onScroll);
    };
  }, []);
  return (
    <div className="computer-figure" ref={root}>
      <div className="computer-aura" aria-hidden="true" />
      <div className="computer-light" aria-hidden="true" />
      <div className="iso computer-art">{children}</div>
    </div>
  );
}
