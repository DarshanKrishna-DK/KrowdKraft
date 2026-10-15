'use client';

import { useEffect, type RefObject } from 'react';

/** Keep decorative motion local to its visible figure and the active browser tab. */
export function useLoopingFigure(
  ref: RefObject<HTMLDivElement | null>,
  createAnimations: (root: HTMLDivElement) => Animation[],
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = createAnimations(root);
    let visible = false;
    const synchronize = () => {
      const reduced = reducedMotion.matches;
      const playing = visible && !document.hidden && !reduced;
      root.dataset.figureMotion = reduced ? 'reduced' : playing ? 'playing' : 'paused';
      for (const animation of animations) {
        // Cancelling restores the original, fully drawn SVG for the still view.
        if (reduced) animation.cancel();
        else if (playing) animation.play();
        else animation.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        synchronize();
      },
      { threshold: 0.08 },
    );
    synchronize();
    observer.observe(root);
    reducedMotion.addEventListener('change', synchronize);
    document.addEventListener('visibilitychange', synchronize);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', synchronize);
      document.removeEventListener('visibilitychange', synchronize);
      animations.forEach((animation) => animation.cancel());
      delete root.dataset.figureMotion;
    };
  }, [ref, createAnimations]);
}
