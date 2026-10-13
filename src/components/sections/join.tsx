import { communityEmail } from "@/data/community";
export function Join() {
  return (
    <section
      id="join"
      className="section container"
      aria-labelledby="join-title"
    >
      <div className="join-stage clay">
        <div>
          <h2 id="join-title">
            There&apos;s room
            <br />
            for one more.
          </h2>
          <p className="body-copy">
            Join KrowdKraft to hear about events, collaborations and rooms where
            Bengaluru&apos;s developers actually meet.
          </p>
          <a className="button primary" href={`mailto:${communityEmail}`}>
            Join the Krowd <span aria-hidden="true">↗</span>
          </a>
          <p className="join-note">
            Email the team. A mailing list isn&apos;t connected yet.
          </p>
        </div>
        <div
          data-figure="seat"
          className="figure-placeholder join-art"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
