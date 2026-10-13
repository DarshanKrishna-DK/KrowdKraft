/* eslint-disable @next/next/no-img-element -- Data-owned logos have reserved dimensions and lazy loading. */
import { partners } from "@/data/partners";
import { ClayNodes } from "@/components/clay";
export function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="section container"
      aria-labelledby="ecosystem-title"
    >
      <div className="ecosystem-layout">
        <div>
          <h2 id="ecosystem-title">
            Ecosystem
            <br />
            connections
          </h2>
          <p className="body-copy">
            We&apos;re building this space as KrowdKraft continues creating
            alongside communities, companies and developer ecosystems.
          </p>
        </div>
        {partners.length ? (
          <div className="partner-list">
            {partners.map((partner) => (
              <a
                key={partner.url}
                className="clay partner"
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={partner.logo}
                  width={80}
                  height={80}
                  loading="lazy"
                  alt=""
                />
                <h3>{partner.name}</h3>
                <p>{partner.note}</p>
                <span className="sr-only">Opens in a new tab</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="clay ecosystem-empty">
            <ClayNodes className="dim" />
            <h3>Coming soon.</h3>
          </div>
        )}
      </div>
    </section>
  );
}
