import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container foundation-preview">
      <p className="eyebrow">KrowdKraft</p>
      <h1>
        This connection
        <br />
        is missing.
      </h1>
      <p className="body-copy">That page isn&apos;t here. The community is.</p>
      <Link className="button primary" href="/#events">
        Explore the Krowd Map <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
