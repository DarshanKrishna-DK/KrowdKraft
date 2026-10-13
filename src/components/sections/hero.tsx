import { communityStats, heroDescription } from "@/data/community";
import { Arrow } from "@/components/clay";
export function Hero() {
  return (
    <section id="top" className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="location-pip" />
          {communityStats.city}, {communityStats.country}
        </p>
        <h1 id="hero-title">
          Where Bengaluru&apos;s
          <br />
          <span>developers connect.</span>
        </h1>
        <p className="body-copy">{heroDescription}</p>
        <div className="actions">
          <a className="button primary" href="#about">
            Explore the community <Arrow />
          </a>
          <a className="button" href="#join">
            Join KrowdKraft <Arrow />
          </a>
        </div>
      </div>
      <div
        className="hero-art figure-placeholder clay"
        data-figure="gather"
        aria-hidden="true"
      >
        <div className="clay-orbit">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </section>
  );
}
