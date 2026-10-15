// Bitmap lettering adapted from Anatomy's arcade-cabinet/screen.mjs.
// Copyright (c) 2026 Ryan. MIT license: public/licenses/anatomy.txt.
// Cabinet geometry and marquee projection remain the original Anatomy art.
const letters = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
};

export function brandArcadeSvg(svg) {
  const label = 'KROWDKRAFT';
  const scale = 1.55;
  const advance = 6.5;
  const width = (label.length * advance - (advance - 5)) * scale;
  const height = 7 * scale;
  // Keep a minimum 6-unit inset in the original 112 by 27.2-unit window.
  if (width > 100 || height > 15.2) throw new Error('Arcade marquee text does not fit');
  const round = (value) => Math.round(value * 100) / 100;
  let path = '';
  [...label].forEach((letter, index) => {
    letters[letter].forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== '1') continue;
        let end = x + 1;
        while (row[end] === '1') end++;
        const left = -width / 2 + (index * advance + x) * scale;
        const top = -height / 2 + y * scale;
        const run = (end - x) * scale;
        path += `M${round(left)} ${round(top)}h${round(run)}v${scale}h${round(-run)}z`;
        x = end - 1;
      }
    });
  });
  const target = /<path class="ac-marquee-art"[^>]*\bd="[^"]*"[^>]*\/>/g;
  if ([...svg.matchAll(target)].length !== 1) {
    throw new Error('Expected exactly one arcade marquee lettering path');
  }
  return svg.replace(
    target,
    `<path class="ac-marquee-art" data-label="${label}" style="fill:var(--anatomy-lo)" d="${path}"/>`,
  );
}
