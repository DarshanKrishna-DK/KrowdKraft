import { ImageResponse } from 'next/og';
import fs from 'node:fs/promises';
import path from 'node:path';
export const alt = 'KrowdKraft. Where what is becomes look what I made.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const logo = await fs.readFile(path.join(process.cwd(), 'public/brand/mark.png'));
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '65px 80px',
        background: '#faeeeb',
        color: '#49303a',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <img src={`data:image/png;base64,${logo.toString('base64')}`} width={64} height={64} alt="" />
        <span style={{ fontSize: 31, fontWeight: 700 }}>KrowdKraft.</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', fontSize: 76, letterSpacing: -4, lineHeight: 1.1 }}
      >
        <span>Where what is becomes</span>
        <span>look what I made.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#a44b65', fontSize: 23 }}>
        Workshops. Hack days. Shared projects.
      </div>
    </div>,
    size,
  );
}
