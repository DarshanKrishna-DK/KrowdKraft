'use client';

import { useRef } from 'react';
import { useLoopingFigure } from './use-looping-figure';

function playArcade(root: HTMLDivElement) {
  const animations: Animation[] = [];
  const animate = (selector: string, frames: Keyframe[], duration: number, easing = 'ease-in-out') => {
    root.querySelectorAll<SVGElement>(selector).forEach((element) => {
      animations.push(element.animate(frames, { duration, iterations: Infinity, easing }));
    });
  };
  root
    .querySelectorAll('.ac-marquee, [data-name="marquee.tube"], [data-name="marquee.plexi"], .ac-led')
    .forEach((element) => element.setAttribute('data-on', ''));

  // The raster remains in the illustration's original projected screen plane.
  animate(
    '[data-part="ship"]',
    [
      { transform: 'translate(70px, 250px)' },
      { transform: 'translate(153px, 250px)' },
      { transform: 'translate(94px, 250px)' },
      { transform: 'translate(70px, 250px)' },
    ],
    9000,
  );
  animate(
    '[data-part="formation"]',
    [
      { transform: 'translate(-11px, 0)' },
      { transform: 'translate(11px, 7px)' },
      { transform: 'translate(-11px, 0)' },
    ],
    9000,
  );
  animate(
    '[data-part="shot"]',
    [
      { transform: 'translate(111px, 244px)', opacity: 0, offset: 0 },
      { transform: 'translate(111px, 244px)', opacity: 1, offset: 0.12 },
      { transform: 'translate(111px, 111px)', opacity: 1, offset: 0.76 },
      { transform: 'translate(111px, 105px)', opacity: 0, offset: 0.8 },
      { transform: 'translate(111px, 244px)', opacity: 0, offset: 1 },
    ],
    3000,
    'linear',
  );
  animate(
    '[data-part="stick-upper"]',
    [
      { transform: 'rotate(-5deg)' },
      { transform: 'rotate(5deg)' },
      { transform: 'rotate(-2deg)' },
      { transform: 'rotate(-5deg)' },
    ],
    9000,
  );
  animate(
    '[data-button="fire"]',
    [
      { transform: 'translate(0, 0)', offset: 0 },
      { transform: 'translate(0, 0)', offset: 0.1 },
      { transform: 'translate(-0.6px, 2px)', offset: 0.14 },
      { transform: 'translate(0, 0)', offset: 0.24 },
      { transform: 'translate(0, 0)', offset: 1 },
    ],
    3000,
  );
  animate(
    '[data-button="jump"]',
    [
      { transform: 'translate(0, 0)', offset: 0 },
      { transform: 'translate(0, 0)', offset: 0.54 },
      { transform: 'translate(-0.6px, 2px)', offset: 0.58 },
      { transform: 'translate(0, 0)', offset: 0.64 },
      { transform: 'translate(0, 0)', offset: 1 },
    ],
    9000,
  );
  animate('[data-part="fan"]', [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], 5000, 'linear');
  animate('.ac-led circle', [{ opacity: 0.45 }, { opacity: 1 }, { opacity: 0.45 }], 3400);
  animate('[data-frame="a"]', [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], 1500, 'steps(1, end)');
  animate('[data-frame="b"]', [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 1500, 'steps(1, end)');
  return animations;
}

export function Arcade({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLoopingFigure(root, playArcade);
  return (
    <div className="arcade-figure arcade-animated" ref={root}>
      {children}
    </div>
  );
}
