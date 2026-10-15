// Original KrowdKraft agenda printer, using the MIT Anatomy drawing core.
import fs from 'node:fs';
import * as k from './anatomy/iso-kit.mjs';
const P = k.fitProjection(
  [-122, 122].flatMap((x) => [-76, 145].flatMap((y) => [-10, 90].map((z) => [x, y, z]))),
  540,
  400,
  { pad: 22, azimuth: 56 },
);
const parts = [];
let count = 0;
const solid = (plan, z, h, tone = 'mid', lit = false) => {
  count++;
  return k.solidSvg(k.slabOf(plan, z, h, P, 5, 0.8), { tone, lit, crease: 'faint' });
};
const line = (d, tone = 'faint', free = false) => k.lineSvg(d, { tone, free });
const box = (x, y, w, d, r = 2) => ({ x, y, w, d, r });
const base = box(-105, -60, 210, 160, 10);
parts.push(`<path class="iso-halo" d="${k.haloOf(base, -8, 16, P)}"/>`);
for (const [x, y] of k.corners(base, 14)) parts.push(solid(box(x - 5, y - 5, 10, 10, 3), -8, 6, 'lo'));
parts.push(solid(base, -2, 7));
const housing = box(-96, -52, 192, 130, 9);
// Hollow housing: the output sheet passes through a real gap between the front bands.
parts.push(solid(box(-96, -52, 192, 12, 5), 5, 65));
parts.push(solid(box(-96, -40, 12, 118, 4), 5, 65));
parts.push(solid(box(-84, 66, 168, 12, 3), 5, 10, 'lo'));
// Platen, guide channels and paper. The paper is below the front cutter bridge.
parts.push(solid(box(-76, 58, 152, 69, 4), 7, 3, 'lo'));
for (const x of [-79, 73]) parts.push(solid(box(x, 62, 6, 63), 10, 6));
const feedStart = k.iso([0, 0, 0], P),
  feedEnd = k.iso([0, 10, 0], P);
parts.push(
  `<g class="printer-paper" data-printer-paper data-feed-x="${feedEnd[0] - feedStart[0]}" data-feed-y="${feedEnd[1] - feedStart[1]}">${solid(box(-64, 46, 128, 81, 1), 17, 0.8, 'hi', true)}`,
);
const matrix = k.topMatrix([-64, 46], 17.8, P);
parts.push(
  `<g transform="${matrix}"><rect x="0" y="0" width="128" height="81" rx="1" fill="#f0f2fa"/><path d="M9 28h110M9 67h110" stroke="#a3adc4" stroke-width=".5"/><image href="/brand/mark.png" x="10" y="31" width="16" height="16"/><text x="33" y="42" fill="#343953" font-size="5.5" font-family="monospace">KrowdKraft</text><text x="10" y="55" fill="#656c86" font-size="3.7" font-family="monospace">a place to make things</text><text data-printer-date x="10" y="63" fill="#323b56" font-size="5" font-family="monospace">NEXT GATHERING</text>`,
);
for (let i = 0; i < 16; i++)
  parts.push(`<rect x="${10 + i * 6.7}" y="70" width="${i % 3 === 0 ? 2 : 1}" height="5" fill="#535d79"/>`);
parts.push('</g></g>');
parts.push(solid(box(84, -40, 12, 118, 4), 5, 65));
parts.push(solid(box(-84, 66, 168, 12, 3), 26, 44));
parts.push(solid(box(-91, -47, 182, 118, 7), 70, 6));
parts.push(solid(box(-86, 48, 172, 15, 2), 18, 8, 'lo'));
for (const x of [-88, 78]) {
  parts.push(solid(box(x, 46, 10, 20, 2), 8, 18));
  parts.push(solid(box(x + 2, 49, 6, 9, 1), 26, 3, 'hi'));
}
parts.push(solid(box(-89, -42, 178, 83, 6), 76, 3));
// A narrow, inset service panel, controls and status lamp.
parts.push(solid(box(-77, -27, 103, 48, 4), 79, 0.8, 'lo'));
for (let i = 0; i < 8; i++) parts.push(solid(box(-69, -18 + i * 4.2, 87, 1.2, 0.6), 79.8, 0.4, 'lo'));
parts.push(solid(box(40, -24, 34, 42, 4), 79, 1, 'lo'));
parts.push(solid(box(47, -16, 20, 17, 3), 80, 3, 'hi', true));
parts.push(solid(box(51, 8, 12, 4, 2), 80, 0.8, 'hi', true));
// Side drive cover and a faceted feed dial, with captive center and grip.
parts.push(solid(box(96, -25, 5, 55, 2), 24, 31, 'lo'));
parts.push(solid(box(101, -10, 8, 22, 3), 33, 17));
parts.push(solid(box(109, -12, 4, 26, 4), 30, 23, 'hi'));
parts.push(solid(box(113, -3, 4, 8, 2), 37, 8));
parts.push(solid(box(113, 7, 5, 4, 1), 33, 4, 'lo'));
for (const { plan, inset, height } of [
  { plan: box(-91, -47, 182, 118, 7), inset: 9, height: 76 },
  { plan: box(-89, -42, 178, 83, 6), inset: 6, height: 79 },
])
  for (const [x, y] of k.corners(plan, inset)) {
    parts.push(solid(box(x - 1.3, y - 1.3, 2.6, 2.6, 0.7), height, 0.4, 'lo'));
    parts.push(line(k.lineOnTop([x - 1, y], [x + 1, y], height + 0.4, P), 'mid'));
  }
for (const x of [-77, 77])
  for (const y of [70, 115]) parts.push(solid(box(x - 1, y - 1, 2, 2, 0.5), 16, 0.3, 'lo'));
parts.push(solid(box(-69, -46, 76, 3, 1), 76, 1, 'lo'));
parts.push(line(k.lineOnTop([-63, -44.5], [-8, -44.5], 77, P), 'mid', true));
for (const x of [-65, 3]) parts.push(solid(box(x, -45.5, 1.8, 1.8, 0.6), 77, 0.3));
const svg = k.figureSvg({
  width: 540,
  height: 400,
  label:
    'A detailed isometric agenda printer with paper guides, feed dial, vents and a printed KrowdKraft event slip.',
  body: parts,
});
fs.writeFileSync('public/figures/printer.svg', svg);
console.log('Built original agenda printer:', count, 'solid components');
