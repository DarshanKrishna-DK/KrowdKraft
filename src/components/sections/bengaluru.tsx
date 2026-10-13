import { Arrow } from "@/components/clay";
import { Figure } from "@/components/figures/figure";
const topics = [
  "AI / ML",
  "Web",
  "Mobile",
  "Cloud / DevOps",
  "Cybersecurity",
  "Web3",
  "Data",
  "Developer tools",
  "Open source",
  "Hackathons",
  "College events",
  "Workshops",
  "Meetups",
];
export function Bengaluru() {
  return (
    <section
      id="bengaluru"
      className="section bengaluru-band"
      aria-labelledby="bengaluru-title"
    >
      <div className="container">
        <div className="city-layout">
          <div className="city-copy">
            <p className="eyebrow">Our home. Your next connection.</p>
            <h2 id="bengaluru-title">
              Bengaluru
              <br />
              is always building.
            </h2>
            <p className="body-copy">
              We curate and share developer events, meetups, hackathons and
              opportunities happening around Bengaluru so you don&apos;t have to
              discover them alone.
            </p>
            <a className="button" href="#join">
              Join the community <Arrow />
            </a>
          </div>
          <Figure name="blocks" className="clay city-art" />
        </div>
        <ul className="topic-chips" aria-label="Community topics">
          {topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
