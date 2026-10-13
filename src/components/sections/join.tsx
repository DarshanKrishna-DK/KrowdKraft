import { JoinForm } from "@/components/forms/join-form";
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
          <JoinForm />
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
