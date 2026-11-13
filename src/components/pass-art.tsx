'use client';
import { useEffect, useRef } from 'react';
import { people, props, runPixelScene, type Placement } from '@/lib/pixel-art';

type Scene = { width: number; height: number; placements: Placement[] };

const scenes: Record<'general' | 'amigos' | 'core', Scene> = {
  general: {
    width: 36,
    height: 23,
    placements: [
      { sprite: people.shortHair, x: 4, y: 3 },
      { sprite: props.calendar, x: 21, y: 9 },
      { sprite: props.spark, x: 29, y: 2 },
    ],
  },
  amigos: {
    width: 48,
    height: 28,
    placements: [
      { sprite: people.longHair, x: 3, y: 9 },
      { sprite: people.cap, x: 17, y: 8 },
      { sprite: people.headphones, x: 31, y: 9 },
      { sprite: props.heart, x: 21, y: 0, sync: true },
      { sprite: props.spark, x: 6, y: 1 },
      { sprite: props.spark, x: 38, y: 0 },
    ],
  },
  core: {
    width: 48,
    height: 27,
    placements: [
      { sprite: props.banner, x: 13, y: 0 },
      { sprite: people.shortHair, x: 3, y: 9 },
      { sprite: people.agent, x: 17, y: 8 },
      { sprite: people.longHair, x: 31, y: 9 },
    ],
  },
};

export function PassArt({ scene }: { scene: keyof typeof scenes }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const { width, height, placements } = scenes[scene];
    return runPixelScene(canvas.current, {
      cell: (w, h) => Math.max(2, Math.floor(Math.min(w / width, h / height))),
      layout: (columns, rows) => {
        const left = Math.floor((columns - width) / 2);
        const top = rows - height;
        return placements.map((placement) => ({ ...placement, x: placement.x + left, y: placement.y + top }));
      },
    });
  }, [scene]);
  return <canvas ref={canvas} className="pass-art" aria-hidden="true" />;
}
