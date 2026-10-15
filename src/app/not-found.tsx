import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="wrap error-state">
      <p className="eyebrow">404</p>
      <h1>A little off the workbench.</h1>
      <p>This page may have moved, or the project is not published.</p>
      <Link href="/" className="button button-silver">
        Back to the workshop
      </Link>
    </section>
  );
}
