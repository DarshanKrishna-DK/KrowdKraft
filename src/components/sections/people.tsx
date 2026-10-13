import { people } from "@/data/community";
export function People() {
  return (
    <section
      id="people"
      className="section container people-section"
      aria-labelledby="people-title"
    >
      <h2 id="people-title">
        People behind
        <br />
        the Krowd.
      </h2>
      <p className="body-copy">
        KrowdKraft is community-first, but every community starts with people
        willing to show up, bring ideas to life and create spaces for others to
        grow.
      </p>
      <div className="people-row">
        {people.map((person, i) => (
          <div
            className={`person accent-${["lime", "cyan", "magenta"][i]}`}
            key={person.name}
          >
            <div className="portrait clay" aria-hidden="true">
              <span>{person.name[0]}</span>
              <i className="clay-node" />
            </div>
            <h3>{person.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
