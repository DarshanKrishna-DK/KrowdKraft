'use client';
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: '#faeeeb', color: '#49303a', fontFamily: 'system-ui', padding: '12vh 8vw' }}>
        <main>
          <p>KrowdKraft</p>
          <h1>A short pause at the workshop.</h1>
          <p>We couldn’t load the community right now. Please try again in a moment.</p>
          <button onClick={reset} style={{ padding: '12px 22px', font: 'inherit', cursor: 'pointer' }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
