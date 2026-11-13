import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from 'file:///C:/Users/darsh/.agents/skills/anatomy/kit/iso-kit.mjs';

// Figure. A cream museum board on a dark plinth. Five project sheets hang on
// the board. A girl, a man in a dark coat, and a man in rose stand facing the
// board without moving. Each has a resting arm and a pointing arm; the
// component swaps them so one person at a time points at the sheets.

const HERE = dirname(fileURLToPath(import.meta.url));
const WIDTH = 720;
const HEIGHT = 520;

const PLINTH = { x: -132, y: -36, w: 264, d: 228, r: 10 };
const PLINTH_H = 14;
const BOARD = { x: -86, y: -8, w: 176, d: 8, r: 3 };
const BOARD_Z = 28;
const BOARD_H = 132;
const CARD_W = 46;
const CARD_H = 36;
const CARD_D = 2.2;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLINTH, -6, PLINTH_H),
    [BOARD.x, BOARD.y, BOARD_Z + BOARD_H + 22],
    [BOARD.x + BOARD.w, BOARD.y + BOARD.d, BOARD_Z],
    [-96, 168, 130],
    [108, 176, 136],
  ],
  WIDTH,
  HEIGHT,
  { pad: 16, azimuth: 38, elevation: 24 },
);

const parts = [];
const add = (point, svg) => parts.push({ key: k.depthOf(point, P), svg });
const paint = (paths, material, extra = {}) =>
  k.solidSvg(paths, { tone: 'mid', className: material, crease: extra.crease ?? 'lo', flat: extra.flat });

function feet() {
  add([0, 0, -4], `<path class="iso-halo" d="${k.haloOf(PLINTH, -6, PLINTH_H, P)}"/>`);
  for (const [x, y] of k.corners(PLINTH, 26)) {
    add([x, y, -4], paint(k.cylinder(x, y, 8, -6, 2, P, 24), 'gallery-ink'));
    add([x, y, -2], paint(k.cylinder(x, y, 5, -4, 4, P, 24), 'gallery-rose'));
  }
  add([0, 0, 6], paint(k.slabOf(PLINTH, 0, PLINTH_H, P, 8, 1.4), 'gallery-ink'));
  const top = k.insetPlan(PLINTH, 8);
  add([0, 0, PLINTH_H], paint(k.slabOf(top, PLINTH_H, 1.4, P, 8, 0.3), 'gallery-rose', { crease: 'none' }));
}

function board() {
  for (const x of [BOARD.x + 10, BOARD.x + BOARD.w - 10]) {
    add(
      [x, BOARD.y + 4, 70],
      paint(k.cylinder(x, BOARD.y + 4, 3.4, PLINTH_H, BOARD_Z - PLINTH_H + 4, P, 16), 'gallery-ink'),
    );
  }
  add([0, BOARD.y, 90], paint(k.slabOf(BOARD, BOARD_Z, BOARD_H, P, 6, 1), 'gallery-board'));
  const cap = { x: BOARD.x - 4, y: BOARD.y - 2, w: BOARD.w + 8, d: BOARD.d + 5, r: 2 };
  add([0, BOARD.y, BOARD_Z + BOARD_H], paint(k.slabOf(cap, BOARD_Z + BOARD_H, 5, P, 6, 0.6), 'gallery-rose'));
}

function card(x, z, material, part) {
  const plan = { x, y: BOARD.y + BOARD.d, w: CARD_W, d: CARD_D, r: 1.2 };
  const body = [
    paint(k.slabOf(plan, z, CARD_H, P, 4, 0.5), material),
    paint(
      k.slabOf({ x: x + 6, y: plan.y + CARD_D, w: CARD_W - 16, d: 0.6, r: 0.4 }, z + CARD_H - 14, 7, P, 3),
      'gallery-ink',
      { crease: 'none', flat: true },
    ),
    k.lineSvg(k.planOutline({ x: x + 6, y: plan.y + CARD_D, w: CARD_W - 14, d: 0.35, r: 0 }, z + 8, P), {
      tone: 'lo',
    }),
  ].join('');
  const point = [x + CARD_W / 2, plan.y + 1, z + CARD_H / 2];
  add(point, part ? k.groupSvg(body, { 'data-part': part }) : body);
}

function person({ x, y, kind, id, side }) {
  const z = PLINTH_H;
  const girl = kind === 'girl';
  const shoulder = girl ? 13 : 16;
  const sleeve = girl ? 'gallery-blush' : kind === 'ink' ? 'gallery-ink' : 'gallery-rose';
  const bits = [];
  const put = (paths, material) => bits.push(paint(paths, material));
  const armX = x + side * shoulder;
  const rest = [
    paint(k.cylinder(armX, y - 1, 3, z + 32, 24, P, 12), 'gallery-skin'),
    paint(k.slabOf({ x: armX - 3.5, y: y - 8, w: 7, d: 7, r: 2 }, z + 28, 4, P, 4, 0.2), 'gallery-skin'),
  ];
  add([armX, y - 1, z + 44], k.groupSvg(rest.join(''), { 'data-part': `rest-${id}` }));
  const reach = (from, to, lift, thick, material) =>
    paint(
      k.slabOf(
        { x: armX - thick / 2, y: y - to, w: thick, d: to - from, r: thick / 2.4 },
        z + lift,
        thick,
        P,
        4,
        0.3,
      ),
      material,
    );
  const point = [
    paint(k.cylinder(armX, y - 2, 3.4, z + 52, 12, P, 12), sleeve),
    paint(k.cylinder(armX, y - 4, 3, z + 62, 10, P, 12), 'gallery-skin'),
    reach(2, 18, 70, 5, 'gallery-skin'),
    reach(16, 22, 71, 5.4, 'gallery-skin'),
    reach(21, 29, 73, 2.2, 'gallery-skin'),
  ];
  add([armX, y + 2, z + 72], k.groupSvg(point.join(''), { 'data-part': `point-${id}`, opacity: '0' }));
  const shoe = (sx) =>
    put(k.slabOf({ x: sx - 5, y: y - 12, w: 10, d: 14, r: 3 }, z, 3.2, P, 4, 0.3), 'gallery-ink');
  shoe(x - 7);
  shoe(x + 7);
  if (girl) {
    put(k.slabOf({ x: x - 16, y: y - 9, w: 32, d: 18, r: 7 }, z + 4, 34, P, 6, 1), 'gallery-blush');
  } else {
    put(k.cylinder(x - 7, y - 2, 4.2, z + 3, 28, P, 14), 'gallery-ink');
    put(k.cylinder(x + 7, y - 2, 4.2, z + 3, 28, P, 14), 'gallery-ink');
    put(
      k.slabOf(
        { x: x - 15, y: y - 8, w: kind === 'ink' ? 32 : 30, d: 14, r: 6 },
        z + 30,
        kind === 'ink' ? 32 : 28,
        P,
        6,
        1,
      ),
      kind === 'ink' ? 'gallery-ink' : 'gallery-rose',
    );
  }
  put(
    k.slabOf({ x: x - shoulder - 1, y: y - 8, w: shoulder * 2 + 2, d: 12, r: 5 }, z + 52, 7, P, 5, 0.5),
    sleeve,
  );
  const otherX = x - side * shoulder;
  put(k.cylinder(otherX, y - 1, 3, z + 32, 24, P, 12), 'gallery-skin');
  put(k.slabOf({ x: otherX - 3.5, y: y - 8, w: 7, d: 7, r: 2 }, z + 28, 4, P, 4, 0.2), 'gallery-skin');
  const neck = girl ? 58 : 62;
  put(k.cylinder(x, y - 3, 3, z + neck, 6, P, 12), 'gallery-skin');
  put(k.cylinder(x, y - 4, girl ? 8.4 : 9, z + neck + 6, girl ? 14 : 16, P, 18), 'gallery-skin');
  put(k.cylinder(x - 3, y - 11, 1.05, z + neck + 12, 1.4, P, 8), 'gallery-ink');
  put(k.cylinder(x + 3, y - 11, 1.05, z + neck + 12, 1.4, P, 8), 'gallery-ink');
  put(k.cylinder(x, y - 13, 1.2, z + neck + 9, 2, P, 8), 'gallery-skin');
  if (girl) {
    put(k.slabOf({ x: x - 9, y: y + 1, w: 18, d: 12, r: 6 }, z + 46, 40, P, 6, 0.7), 'gallery-ink');
    put(k.cylinder(x, y - 2, 8.8, z + neck + 14, 8, P, 16), 'gallery-ink');
  } else if (kind === 'ink') {
    put(k.cylinder(x, y - 2, 9.2, z + neck + 16, 6, P, 16), 'gallery-rose');
    put(k.slabOf({ x: x - 4, y: y - 12, w: 8, d: 4, r: 2 }, z + neck + 6, 5, P, 4, 0.2), 'gallery-ink');
  } else {
    put(k.cylinder(x, y + 1, 9.2, z + neck + 16, 6, P, 16), 'gallery-ink');
  }
  add([x, y, z + 70], bits.join(''));
}

feet();
board();
const cardLeft = BOARD.x + 12;
const cardGap = 8;
const cardTop = BOARD_Z + BOARD_H - CARD_H - 12;
const cardLow = BOARD_Z + 16;
for (const column of [0, 1, 2]) card(cardLeft + column * (CARD_W + cardGap), cardTop, 'gallery-paper');
card(cardLeft + 18, cardLow, 'gallery-paper');
card(cardLeft + 18 + CARD_W + cardGap, cardLow, 'gallery-paper');
person({ x: -76, y: 112, kind: 'girl', id: 'girl', side: 1 });
person({ x: -6, y: 136, kind: 'ink', id: 'ink', side: 1 });
person({ x: 68, y: 116, kind: 'rose', id: 'rose', side: 1 });

parts.sort((a, b) => a.key - b.key);
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: 'A girl and two men stand facing a museum board of project sheets, taking turns pointing at it.',
  body: parts.map((part) => part.svg).join(''),
});

writeFileSync(join(HERE, '../public/figures/gallery.svg'), svg);
console.log(`parts ${parts.length}`);
