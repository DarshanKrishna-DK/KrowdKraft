import { communityStats, heroDescription } from "@/data/community";
import { Arrow } from "@/components/clay";
import { Figure } from "@/components/figures/figure";
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
      <Figure name="gather" className="hero-art clay" />
    </section>
  );
}
