'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="wrap error-state">
      <p className="eyebrow">A short interruption</p>
      <h1>
        We couldn’t load
        <br />
        this part of the workshop.
      </h1>
      <p>We couldn’t load this page. Please try again.</p>
      <button className="button button-silver" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
