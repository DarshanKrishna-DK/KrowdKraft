export function CodeSculpture() {
  return (
    <div className="code-sculpture" aria-hidden="true" data-parallax>
      <svg viewBox="0 0 600 520" className="code-prism">
        <defs>
          <linearGradient id="prism-front" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#eedcff" stopOpacity=".9" />
            <stop offset=".38" stopColor="#b389df" stopOpacity=".48" />
            <stop offset="1" stopColor="#704291" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id="prism-side" x2="0" y2="1">
            <stop stopColor="#bea0f0" stopOpacity=".6" />
            <stop offset="1" stopColor="#40244f" stopOpacity=".8" />
          </linearGradient>
          <linearGradient id="prism-slash" x2="1" y2="1">
            <stop stopColor="#d8fff0" />
            <stop offset=".6" stopColor="#9ee1c6" stopOpacity=".72" />
            <stop offset="1" stopColor="#507c81" stopOpacity=".2" />
          </linearGradient>
          <radialGradient id="prism-glow">
            <stop stopColor="#b58ce8" stopOpacity=".25" />
            <stop offset="1" stopColor="#b58ce8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="prism-node">
            <stop stopColor="#fff" />
            <stop offset=".35" stopColor="#dcc0ff" />
            <stop offset="1" stopColor="#73519a" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="272" rx="275" ry="222" fill="url(#prism-glow)" />
        <g fill="none" stroke="#ad90ca" strokeWidth="1">
          <ellipse
            cx="300"
            cy="281"
            rx="261"
            ry="99"
            transform="rotate(-24 300 281)"
            opacity=".24"
          />
          <ellipse
            cx="300"
            cy="269"
            rx="224"
            ry="170"
            transform="rotate(32 300 269)"
            opacity=".13"
          />
          <path
            d="M55 375 170 313M429 179l97-70M370 405l56 55"
            strokeDasharray="3 8"
            opacity=".4"
          />
        </g>
        <ellipse
          cx="311"
          cy="426"
          rx="151"
          ry="19"
          fill="#775587"
          opacity=".13"
        />
        <g className="code-brackets" strokeLinejoin="round">
          <path
            d="m236 137 24 17-83 116 85 86-24 20-115-102 4-27Z"
            fill="url(#prism-side)"
            stroke="#806298"
          />
          <path
            d="m230 123 30 31-93 106 95 96-31 29-124-125Z"
            fill="url(#prism-front)"
            stroke="#debfef"
            strokeOpacity=".75"
          />
          <path
            d="m231 127-119 133 119 119"
            fill="none"
            stroke="#f8eeff"
            strokeOpacity=".8"
          />
          <path
            d="m375 148 30-11 109 116-3 28-114 121-25-25 105-111Z"
            fill="url(#prism-side)"
            stroke="#806298"
          />
          <path
            d="m371 123-29 31 94 106-96 96 31 29 124-125Z"
            fill="url(#prism-front)"
            stroke="#debfef"
            strokeOpacity=".75"
          />
          <path
            d="m371 127 119 133-119 119"
            fill="none"
            stroke="#f8eeff"
            strokeOpacity=".7"
          />
          <path
            d="m317 97 27 18-49 315-31-17Z"
            fill="#325e61"
            stroke="#9ee1c6"
            strokeOpacity=".5"
          />
          <path
            d="m307 86 37 12-58 316-35-12Z"
            fill="url(#prism-slash)"
            stroke="#d3ffed"
            strokeOpacity=".8"
          />
          <path
            d="m310 91-55 307"
            fill="none"
            stroke="#e4fff4"
            strokeWidth="2"
          />
        </g>
        <circle cx="73" cy="340" r="8" fill="url(#prism-node)" />
        <circle cx="508" cy="177" r="11" fill="url(#prism-node)" />
        <circle cx="428" cy="462" r="5" fill="#9ee1c6" />
        <circle cx="160" cy="96" r="3" fill="#dbc3f4" opacity=".65" />
      </svg>
      <div className="code-note note-idea">
        <span /> a little curiosity
      </div>
      <div className="code-note note-build">
        <code>git commit</code>
        <span>to something good.</span>
      </div>
      <p className="code-sculpture-caption">
        Different minds. <span>Shared source.</span>
      </p>
    </div>
  );
}
