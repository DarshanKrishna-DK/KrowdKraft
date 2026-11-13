'use client';

import { useRef } from 'react';
import { useLoopingFigure } from './use-looping-figure';

const DURATION = 15000;
const FADE = 0.025;
const turns = [
  { id: 'girl', from: 0.06, to: 0.24 },
  { id: 'rose', from: 0.4, to: 0.58 },
  { id: 'ink', from: 0.74, to: 0.9 },
];

function swap(element: Element | null, from: number, to: number, shown: boolean) {
  if (!element) return null;
  const off = shown ? 1 : 0;
  const on = shown ? 0 : 1;
  return element.animate(
    [
      { opacity: off, offset: 0 },
      { opacity: off, offset: from },
      { opacity: on, offset: from + FADE },
      { opacity: on, offset: to - FADE },
      { opacity: off, offset: to },
      { opacity: off, offset: 1 },
    ],
    { duration: DURATION, iterations: Infinity, easing: 'ease-in-out' },
  );
}

function playArcade(root: HTMLDivElement) {
  return turns.flatMap(({ id, from, to }) =>
    [
      swap(root.querySelector(`[data-part="rest-${id}"]`), from, to, true),
      swap(root.querySelector(`[data-part="point-${id}"]`), from, to, false),
    ].filter((animation): animation is Animation => animation !== null),
  );
}

export function Arcade({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLoopingFigure(root, playArcade);
  return (
    <div className="iso arcade-figure arcade-animated" ref={root}>
      {children}
    </div>
  );
}
