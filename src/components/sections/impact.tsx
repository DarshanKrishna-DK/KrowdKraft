"use client";
import { useEffect, useRef, useState } from "react";
import { communityStats } from "@/data/community";
const stats = [
  { value: communityStats.members, label: "Community members" },
  { value: communityStats.events, label: "Events and collaborations" },
  { value: communityStats.developersReached, label: "Developers reached" },
  { value: communityStats.city, label: "Home base" },
];
export function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-30% 0px -35% 0px", threshold: 0 },
    );
    ref.current
      ?.querySelectorAll(".stat-line")
      .forEach((line) => observer.observe(line));
    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="impact"
      className="section container"
      aria-labelledby="impact-title"
    >
      <div className="impact-stage clay" ref={ref}>
        <div className="impact-aside">
          <h2 id="impact-title">
            Small connections.
            <br />
            Real impact.
          </h2>
          <div className="impact-nodes" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <i className={i < (active + 1) * 3 ? "lit" : ""} key={i} />
            ))}
          </div>
        </div>
        <dl className="stat-lines">
          {stats.map((stat, i) => (
            <div
              className={`stat-line ${active === i ? "active" : ""}`}
              data-index={i}
              key={stat.label}
            >
              <dt>{stat.label}</dt>
              <dd>
                {stat.value}
                <span aria-hidden="true" className="stat-indicator">
                  ↗
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
