const values = [
  {
    title: "Learn",
    line: "Workshops, talks and technical sessions.",
    accent: "lime",
  },
  {
    title: "Build",
    line: "Hackathons, challenges and hands-on experiences.",
    accent: "cyan",
  },
  {
    title: "Connect",
    line: "Meet developers, students, communities and industry.",
    accent: "violet",
  },
  {
    title: "Discover",
    line: "Find worthwhile developer events and opportunities around Bengaluru.",
    accent: "magenta",
  },
];
export function About() {
  return (
    <section
      id="about"
      className="section container about"
      aria-labelledby="about-title"
    >
      <div className="about-intro">
        <h2 id="about-title">
          Built by
          <br />
          the Krowd.
        </h2>
        <p className="body-copy">
          KrowdKraft is a Bengaluru-based developer community built around
          learning, building and bringing people together. We host our own
          events, collaborate with communities and organizations, support
          student and developer initiatives, and help people discover what is
          happening across Bengaluru&apos;s tech ecosystem.
        </p>
      </div>
      <div className="value-slabs">
        {values.map((value) => (
          <article
            className={`clay value-slab accent-${value.accent}`}
            key={value.title}
          >
            <span className="clay-node" aria-hidden="true" />
            <h3>{value.title}</h3>
            <p>{value.line}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
