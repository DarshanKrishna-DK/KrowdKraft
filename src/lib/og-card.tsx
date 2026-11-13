import { ImageResponse } from 'next/og';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const ogSize = { width: 1200, height: 630 };

type OgCard = {
  eyebrow: string;
  title: string;
  details?: string[];
  footer: string;
  poster?: string | null;
};

async function posterDataUrl(src: string) {
  try {
    let source: Buffer;
    if (src.startsWith('/')) {
      source = await fs.readFile(path.join(process.cwd(), 'public', src));
    } else {
      const response = await fetch(src, { signal: AbortSignal.timeout(4000) });
      if (!response.ok) return null;
      source = Buffer.from(await response.arrayBuffer());
    }
    const { data, info } = await sharp(source)
      .resize(840, 760, { fit: 'inside' })
      .png()
      .toBuffer({ resolveWithObject: true });
    return {
      src: `data:image/png;base64,${data.toString('base64')}`,
      width: Math.round(info.width / 2),
      height: Math.round(info.height / 2),
    };
  } catch {
    return null;
  }
}

export async function ogCard({ eyebrow, title, details = [], footer, poster }: OgCard) {
  const [mark, art] = await Promise.all([
    fs.readFile(path.join(process.cwd(), 'public/brand/mark.png')),
    poster ? posterDataUrl(poster) : null,
  ]);
  const titleSize = title.length > 60 ? 54 : title.length > 34 ? 64 : 78;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 28,
        background: '#191821',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 48,
          padding: '44px 56px',
          borderRadius: 26,
          border: '2px solid #f4d9df24',
          backgroundImage:
            'radial-gradient(circle at 85% 10%, #b56e9466, transparent 45%), linear-gradient(135deg, #2a2131, #191821 70%)',
          color: '#f6ece8',
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={`data:image/png;base64,${mark.toString('base64')}`} width={54} height={54} alt="" />
            <span style={{ fontSize: 30, fontWeight: 700 }}>KrowdKraft.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <span
              style={{
                display: 'flex',
                color: '#ffc6df',
                fontSize: 22,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              {eyebrow}
            </span>
            <span style={{ fontSize: titleSize, lineHeight: 1.05, letterSpacing: -2, fontWeight: 700 }}>
              {title}
            </span>
            {details.length > 0 && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 6, color: '#f4d9dfcc', fontSize: 26 }}
              >
                {details.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            )}
          </div>
          <span style={{ display: 'flex', color: '#b56e94', fontSize: 22 }}>{footer}</span>
        </div>
        {art && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={art.src}
              width={art.width}
              height={art.height}
              alt=""
              style={{ borderRadius: 18, border: '2px solid #ffc6df40' }}
            />
          </div>
        )}
      </div>
    </div>,
    ogSize,
  );
}
