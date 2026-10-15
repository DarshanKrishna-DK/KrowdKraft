import { useId } from 'react';

/** Original lightweight isometric objects, with no implied live activity. */
export function DirectoryArt({ kind }: { kind: 'events' | 'builds' | 'leaderboard' }) {
  const id = useId().replaceAll(':', '');
  return (
    <div className={`directory-art directory-art-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 480 330" fill="none">
        <defs>
          <linearGradient
            id={`${id}-cream`}
            x1="100"
            y1="50"
            x2="350"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff3ef" />
            <stop offset="1" stopColor="#e8b9ce" />
          </linearGradient>
          <linearGradient id={`${id}-pink`} x1="120" y1="80" x2="340" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e5adc8" />
            <stop offset="1" stopColor="#aa718d" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="220%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
        </defs>
        <ellipse
          cx="248"
          cy="274"
          rx="151"
          ry="29"
          fill="#08060d"
          opacity=".55"
          filter={`url(#${id}-shadow)`}
        />
        <path
          d="m61 236 174-92 183 98-175 89Z"
          fill="#c38da9"
          opacity=".1"
          stroke="#edc7dc"
          strokeOpacity=".2"
        />
        <path d="m95 239 140-74 146 78-138 72Z" stroke="#e0adc3" strokeOpacity=".2" strokeDasharray="2 7" />
        {kind === 'events' ? (
          <g className="directory-art-object">
            <path d="m110 225 18-139 203 43-17 141Z" fill={`url(#${id}-pink)`} stroke="#f2cfdf" />
            <path d="m128 86 25-15 203 44-25 14Z" fill="#fff3ef" />
            <path d="m331 129 25-14-17 141-25 14Z" fill="#bc8ba4" />
            <path d="m131 104 194 42-14 112-194-42Z" fill={`url(#${id}-cream)`} />
            <path d="m131 104 194 42-4 26-194-42Z" fill="#ae7797" />
            {[0, 1, 2, 3].map((column) =>
              [0, 1].map((row) => (
                <path
                  key={`${column}-${row}`}
                  d={`m${144 + column * 42 - row * 3} ${151 + column * 9 + row * 32} 25 5-2 17-25-5Z`}
                  fill={column === 2 && row === 0 ? '#b27b99' : '#cf9eb6'}
                  opacity={column === 2 && row === 0 ? '1' : '.6'}
                />
              )),
            )}
            {[166, 283].map((x) => (
              <path
                key={x}
                d={`M${x} ${x === 166 ? 99 : 124}v-23c0-15 18-10 18 3v21`}
                stroke="#7d526d"
                strokeWidth="9"
                strokeLinecap="round"
              />
            ))}
            <path d="m294 249 32-18 33 18-32 18Z" fill="#fff3ef" />
            <path d="m294 249 33 18v25l-33-18Z" fill="#e0adc3" />
            <path d="m327 267 32-18v25l-32 18Z" fill="#b8809e" />
            <path d="m308 250 12 5 23-14" stroke="#a36e8b" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : kind === 'builds' ? (
          <g className="directory-art-object">
            <path d="m109 212 12-139 220 48-12 139Z" fill={`url(#${id}-pink)`} stroke="#f2cfdf" />
            <path d="m121 73 20-11 220 48-20 11Z" fill="#fff3ef" />
            <path d="m341 121 20-11-12 139-20 11Z" fill="#b9809d" />
            <path d="m132 91 195 42-10 111-195-42Z" fill={`url(#${id}-cream)`} />
            <path d="m132 91 195 42-2 21-195-42Z" fill="#b783a0" />
            <path
              d="m144 104 1 .2m10 2 1 .2m10 2 1 .2"
              stroke="#fff1eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="m172 145-18 10 16 17m87-9 17 18-19 10m-35-44-23 46"
              stroke="#a66f8d"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="m109 212-40 22 220 49 40-23Z" fill="#fff1eb" />
            <path d="m69 234 220 49v10L69 245Z" fill="#ddb0c5" />
            <path d="m289 283 40-23v10l-40 23Z" fill="#b57d99" />
            <path d="m144 228 102 23m-117-13 103 23" stroke="#bb8aa3" strokeWidth="3" strokeDasharray="8 4" />
            <path d="m350 196 30-17 31 17-30 18Z" fill="#fff3ef" />
            <path d="m350 196 31 18v34l-31-18Z" fill="#e0adc3" />
            <path d="m381 214 30-18v34l-30 18Z" fill="#b8809e" />
          </g>
        ) : (
          <g className="directory-art-object">
            <path d="m101 226 139-75 147 79-139 76Z" fill="#fff1eb" />
            <path d="m101 226 147 80v13l-147-80Z" fill="#d9a9c1" />
            <path d="m248 306 139-76v13l-139 76Z" fill="#b7819e" />
            {[
              { x: 130, y: 200, height: 49 },
              { x: 210, y: 160, height: 110 },
              { x: 288, y: 202, height: 76 },
            ].map(({ x, y, height }) => (
              <g key={x}>
                <path d={`m${x} ${y - height} 35-19 36 19-35 19Z`} fill="#fff3ef" stroke="#f5d9e5" />
                <path d={`m${x} ${y - height} 36 19v${height}l-36-19Z`} fill={`url(#${id}-cream)`} />
                <path d={`m${x + 36} ${y - height + 19} 35-19v${height}l-35 19Z`} fill={`url(#${id}-pink)`} />
              </g>
            ))}
            <path d="m217 66 13 7 21-12" stroke="#b27997" strokeWidth="4" strokeLinecap="round" />
            <path
              d="m177 140 20-11m-10-5v21m147-16 13 7 17-9"
              stroke="#f7dce8"
              strokeWidth="3"
              strokeLinecap="round"
              opacity=".7"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
