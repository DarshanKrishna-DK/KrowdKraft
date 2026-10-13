import { CollaborationForm } from "@/components/forms/collaboration-form";
import { Figure } from "@/components/figures/figure";
const groups = [
  {
    title: "Companies",
    line: "Developer events, community activations, hackathons",
  },
  {
    title: "Communities",
    line: "Co-hosting, cross-community collaboration, event discovery",
  },
  {
    title: "Colleges",
    line: "Hackathons, workshops, developer sessions, student initiatives",
  },
  {
    title: "Developers",
    line: "Speaking, mentoring, volunteering, community contribution",
  },
];
const kinds = [
  "Host an event",
  "Co-host",
  "Community partnership",
  "Workshop",
  "Hackathon",
  "Tech talk",
  "College collaboration",
  "Community outreach",
  "Event discovery / promotion",
];
export function Collaborate() {
  return (
    <section
      id="collaborate"
      className="section container"
      aria-labelledby="collaborate-title"
    >
      <div className="collaborate-header">
        <h2 id="collaborate-title">
          Let&apos;s build
          <br />
          something together.
        </h2>
        <p className="body-copy">
          We don&apos;t charge communities or organizations simply to
          collaborate with us. If an idea creates genuine value for developers,
          we&apos;re happy to explore it together.
        </p>
      </div>
      <div className="collaboration-stage">
        <div className="collaboration-cluster">
          <div className="cluster-center clay">
            KrowdKraft
            <span className="clay-node" aria-hidden="true" />
          </div>
          {groups.map((group, i) => (
            <a
              key={group.title}
              href="#collaboration-action"
              className={`cluster-group clay group-${i}`}
            >
              <strong>{group.title}</strong>
              <span>{group.line}</span>
            </a>
          ))}
        </div>
        <Figure name="bridge" className="clay bridge-art" />
      </div>
      <div id="collaboration-action" className="collaboration-action">
        <CollaborationForm />
        <ul className="collaboration-kinds" aria-label="Ways to collaborate">
          {kinds.map((kind) => (
            <li key={kind}>{kind}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
