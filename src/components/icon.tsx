export function Icon({
  name = 'arrow',
  size = 20,
}: {
  name?:
    | 'arrow'
    | 'back'
    | 'diagonal'
    | 'calendar'
    | 'pin'
    | 'github'
    | 'plus'
    | 'close'
    | 'menu'
    | 'power'
    | 'play'
    | 'pause'
    | 'book'
    | 'code'
    | 'mic'
    | 'check'
    | 'bookmark'
    | 'linkedin'
    | 'instagram'
    | 'x'
    | 'whatsapp'
    | 'people'
    | 'chart';
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 10v7M7 7v.01M11 17v-7m0 3c0-4 6-4 6 0v4" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    x: (
      <>
        <path d="M4 3h5l11 18h-5ZM20 3 4 21" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 21V11h5v10M10 21V4h5v17M16 21V8h5v13M2 21h21" />
      </>
    ),
    back: <path d="M19 12H5m7-7-7 7 7 7" />,
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 11h18M7 15h3" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    github: (
      <path d="M9 19c-4.3 1.3-4.3-2-6-2.5M15 22v-3.9c.1-1.1-.4-1.8-.8-2.1 2.8-.3 5.8-1.4 5.8-6.3 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.6-.1-3.3 0 0-1.1-.3-3.6 1.3a12 12 0 0 0-6 0C6.5 2.7 5.4 3 5.4 3c-.7 1.7-.2 3-.1 3.3C4.5 7.2 4 8.3 4 9.7c0 4.9 3 6 5.8 6.3-.4.4-.8 1.1-.8 2.1V22" />
    ),
    plus: <path d="M12 4v16M4 12h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    power: (
      <>
        <path d="M12 2v10M6 5a9 9 0 1 0 12 0" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <path d="M8 5v14M16 5v14" />,
    book: (
      <>
        <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1v15" />
      </>
    ),
    code: (
      <>
        <path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-17-2 20" />
      </>
    ),
    mic: (
      <>
        <rect x="8" y="2" width="8" height="13" rx="4" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" />
      </>
    ),
    check: <path d="m4 12 5 5L20 6" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
