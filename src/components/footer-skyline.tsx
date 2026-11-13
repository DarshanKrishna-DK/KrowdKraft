'use client';
import { useEffect, useRef } from 'react';
import { people, runPixelScene, type Placement } from '@/lib/pixel-art';

const SPRITE_W = 14;
const SPRITE_H = 20;
const crowd = Object.values(people);
const drops = [0, 2, 1, 0, 2, 1, 3];

export function FooterSkyline() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    return runPixelScene(canvas.current, {
      grid: true,
      cell: (_, height) => Math.max(3, Math.floor(height / (SPRITE_H + 3))),
      layout: (columns, rows) => {
        const placements: Placement[] = [];
        for (let index = 0, x = 0; x < columns; index++, x += SPRITE_W + 1) {
          placements.push({
            sprite: crowd[index % crowd.length],
            x,
            y: rows - SPRITE_H + drops[index % drops.length],
          });
        }
        return placements;
      },
    });
  }, []);
  return <canvas ref={canvas} className="footer-skyline" aria-hidden="true" />;
}
