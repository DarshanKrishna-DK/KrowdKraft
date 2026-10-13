import { JoinForm } from "@/components/forms/join-form";
import { Figure } from "@/components/figures/figure";
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
        <Figure name="seat" className="join-art" />
      </div>
    </section>
  );
}
