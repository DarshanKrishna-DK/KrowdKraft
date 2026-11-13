'use client';
import { useEffect, useRef } from 'react';

export function PassStage({ children }: { children: React.ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches) return;
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--stage-ry', `${(x * 6).toFixed(2)}deg`);
        element.style.setProperty('--stage-rx', `${(-y * 4).toFixed(2)}deg`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(frame);
      element.style.removeProperty('--stage-ry');
      element.style.removeProperty('--stage-rx');
    };
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
    };
  }, []);
  return (
    <div className="pass-stage" ref={stage}>
      <div className="pass-floor" aria-hidden="true" />
      <div className="pass-row">{children}</div>
    </div>
  );
}
