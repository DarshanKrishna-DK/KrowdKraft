export type Sprite = string[];
export type Placement = { sprite: Sprite; x: number; y: number; sync?: boolean };
export type SceneLayout = (columns: number, rows: number) => Placement[];

const palette: Record<string, [number, number, number]> = {
  '#': [246, 236, 232],
  h: [150, 82, 120],
  b: [181, 110, 148],
  a: [255, 198, 223],
  m: [244, 217, 223],
  k: [120, 58, 94],
  e: [255, 178, 214],
  w: [255, 244, 248],
};

const shoulders = (fill: string, light = '') => [
  `...${fill.repeat(8)}...`,
  `..${fill.repeat(10)}..`,
  `.${fill.repeat(12)}.`,
  `.${fill.repeat(5)}${light || fill.repeat(2)}${fill.repeat(5)}.`,
  fill.repeat(14),
  fill.repeat(14),
  fill.repeat(14),
  fill.repeat(14),
  fill.repeat(14),
];
const face = [
  '...########...',
  '...########...',
  '...########...',
  '....######....',
  '.....####.....',
  '......##......',
];

export const people = {
  shortHair: [
    '.....hhhh.....',
    '....hhhhhh....',
    '...hhhhhhhh...',
    '...h######h...',
    '...########...',
    ...face,
    ...shoulders('b'),
  ],
  agent: [
    '......ee......',
    '......mm......',
    '..mmmmmmmmmm..',
    '.mmmmmmmmmmmm.',
    'emmeeemmeeemme',
    'emmeeemmeeemme',
    '.mmmmmmmmmmmm.',
    '.mmmm....mmmm.',
    '..mmmmmmmmmm..',
    '.....mmmm.....',
    '......mm......',
    ...shoulders('k', 'ee'),
  ],
  longHair: [
    '.....hhhh.....',
    '....hhhhhh....',
    '...hhhhhhhh...',
    '..hhh####hhh..',
    '..hh######hh..',
    '..hh######hh..',
    '..hh######hh..',
    '..hhh####hhh..',
    '..hhhh##hhhh..',
    '..hhh.##.hhh..',
    '..hh..##..hh..',
    ...shoulders('a'),
  ],
  cap: [
    '....aaaaaa....',
    '...aaaaaaaa...',
    '...aaaaaaaaaaa',
    '...########...',
    ...face,
    '..............',
    ...shoulders('h'),
  ],
  dome: [
    '..............',
    '.....mmmm.....',
    '...mmmmmmmm...',
    '..mmmmmmmmmm..',
    '..meeeeeeeem..',
    '..mmmmmmmmmm..',
    '..mmmmmmmmmm..',
    '...mmmmmmmm...',
    '.....mmmm.....',
    '......mm......',
    '..............',
    ...shoulders('k', 'ee'),
  ],
  headphones: [
    '......hh......',
    '.....hhhh.....',
    '....hhhhhh....',
    '..ahhhhhhhha..',
    '..a########a..',
    '..a########a..',
    '...########...',
    '....######....',
    '.....####.....',
    '......##......',
    '..............',
    ...shoulders('b'),
  ],
} satisfies Record<string, Sprite>;

export const props = {
  ticket: [
    'aaaaaaaaaaaaaa',
    'a##.########.a',
    'a##.#ww#ww##.a',
    '.##.########..',
    '.##.#ww#ww##..',
    'a##.########.a',
    'aaaaaaaaaaaaaa',
  ],
  calendar: [
    '.a...a...a.',
    'bbbbbbbbbbb',
    'bbbbbbbbbbb',
    '###########',
    '#.#.#.#.#.#',
    '###########',
    '#.#.#e#.#.#',
    '###########',
    '#.#.#.#.#.#',
    '###########',
  ],
  spark: ['..e..', '..e..', 'eewee', '..e..', '..e..'],
  heart: ['.ee.ee.', 'eeeeeee', 'eeweeee', '.eeeee.', '..eee..', '...e...'],
  banner: [
    'mmaaaaaaaaaaaaaaaaamm',
    'mma..w...w.w...w..amm',
    'mma..w..w..w..w...amm',
    'mma..www...www....amm',
    'mma..w..w..w..w...amm',
    'mma..w...w.w...w..amm',
    'mmaaaaaaaaaaaaaaaaamm',
    'mm.................mm',
    'mm.................mm',
  ],
  mic: ['.eee.', 'eewee', 'eeeee', '.eee.', '..m..', '..m..', '..m..', '..m..', '.mmm.'],
} satisfies Record<string, Sprite>;

type Pixel = {
  x: number;
  y: number;
  color: [number, number, number];
  eye: boolean;
  phase: number;
  speed: number;
};

export function runPixelScene(
  canvas: HTMLCanvasElement,
  options: { cell: (width: number, height: number) => number; layout: SceneLayout; grid?: boolean },
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pixels: Pixel[] = [];
  let state = { columns: 0, rows: 0, cell: 5, left: 0, top: 0 };
  let raf = 0;
  let last = 0;
  let visible = false;

  const build = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const cell = options.cell(width, height);
    const columns = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    state = {
      columns,
      rows,
      cell,
      left: Math.floor((width - columns * cell) / 2),
      top: height - rows * cell,
    };
    pixels = [];
    for (const placement of options.layout(columns, rows)) {
      const syncPhase = Math.random() * Math.PI * 2;
      placement.sprite.forEach((line, row) => {
        [...line].forEach((char, column) => {
          const color = palette[char];
          const x = placement.x + column;
          const y = placement.y + row;
          if (!color || x < 0 || y < 0 || x >= columns || y >= rows) return;
          const eye = char === 'e' || char === 'w';
          pixels.push({
            x,
            y,
            color,
            eye,
            phase: eye || placement.sync ? syncPhase : Math.random() * Math.PI * 2,
            speed: eye ? 1.4 : 0.5 + Math.random() * 1.6,
          });
        });
      });
    }
    draw(performance.now());
  };

  const draw = (now: number) => {
    const { columns, rows, cell, left, top } = state;
    const size = Math.max(1, cell - 1);
    const t = now / 1000;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    if (options.grid) {
      for (let y = 0; y < rows; y++) {
        ctx.fillStyle = `rgba(244, 217, 223, ${(0.05 * y) / rows})`;
        for (let x = 0; x < columns; x++) ctx.fillRect(left + x * cell, top + y * cell, size, size);
      }
    }
    for (const pixel of pixels) {
      const wave = reduced.matches ? 0.4 : Math.max(0, Math.sin(t * pixel.speed + pixel.phase));
      const glow = pixel.eye ? 0.6 + 0.4 * wave : 0.5 + 0.5 * wave ** 6;
      const [r, g, b] = pixel.color;
      const px = left + pixel.x * cell;
      const py = top + pixel.y * cell;
      if (glow > 0.8) {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(glow - 0.8) * 0.9})`;
        ctx.fillRect(px - 1, py - 1, size + 2, size + 2);
      }
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${glow})`;
      ctx.fillRect(px, py, size, size);
    }
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < 50) return;
    last = now;
    draw(now);
  };
  const sync = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (visible && !reduced.matches && !document.hidden) raf = requestAnimationFrame(loop);
    else draw(performance.now());
  };
  const resize = new ResizeObserver(build);
  const seen = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  resize.observe(canvas);
  seen.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  return () => {
    resize.disconnect();
    seen.disconnect();
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', sync);
    reduced.removeEventListener('change', sync);
  };
}
