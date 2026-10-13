"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Spotlight } from "@/server/community";
import { Icon } from "./icon";
import { SocialLinks } from "./social-links";

export function SpotlightStage({ entries }: { entries: Spotlight[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setReduced(
        media.matches || document.documentElement.dataset.motion === "off",
      );
    const visibility = () => setTabVisible(!document.hidden);
    update();
    visibility();
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (stage.current) observer.observe(stage.current);
    media.addEventListener("change", update);
    window.addEventListener("krowd:motion", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      window.removeEventListener("krowd:motion", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const running = visible && tabVisible && !paused && !hovered && !reduced;
  useEffect(() => {
    if (!running || entries.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % entries.length),
      8000,
    );
    return () => clearInterval(timer);
  }, [entries.length, running]);
  const active = index % Math.max(entries.length, 1);
  function move(direction: number) {
    setPaused(true);
    setIndex((i) => (i + direction + entries.length) % entries.length);
  }
  return (
    <div
      ref={stage}
      className="builder-theatre"
      data-running={running}
      role="region"
      aria-label="Builder spotlight"
      aria-roledescription={entries.length > 1 ? "carousel" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="stage-light stage-light-left" aria-hidden="true">
        <span />
      </div>
      <div className="stage-light stage-light-right" aria-hidden="true">
        <span />
      </div>
      <div className="stage-spot" aria-hidden="true" />
      <div className="stage-cards" aria-live={paused ? "polite" : "off"}>
        {entries.length ? (
          entries.map((entry, i) => (
            <article
              className="builder-feature"
              key={entry.id}
              hidden={i !== active}
              aria-label={`${i + 1} of ${entries.length}`}
              aria-roledescription={entries.length > 1 ? "slide" : undefined}
            >
              <div className="builder-feature-top">
                <span className="builder-monogram" aria-hidden="true">
                  {entry.builder
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span className="feature-edition">
                  {new Intl.DateTimeFormat("en", {
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(`${entry.month}-01T00:00:00Z`))}
                </span>
              </div>
              <h3>{entry.builder}</h3>
              <p className="builder-achievement">{entry.name}</p>
              <p className="builder-story">{entry.description}</p>
              <SocialLinks urls={entry.socials || []} />
              <a
                className="button quiet"
                href={entry.url}
                target="_blank"
                rel="noreferrer"
              >
                See the achievement <Icon name="diagonal" size={16} />
              </a>
            </article>
          ))
        ) : (
          <article className="builder-feature builder-feature-empty">
            <div className="spotlight-medallion" aria-hidden="true">
              <Icon name="star" size={44} />
            </div>
            <p className="feature-edition">First features coming soon</p>
            <h3>
              Your work belongs
              <br />
              in the light.
            </h3>
            <p>
              A hackathon win. A helpful contribution. Something you kept
              building.
            </p>
            <Link href="/spotlight#nominate" className="button light">
              Share your achievement <Icon name="diagonal" size={16} />
            </Link>
          </article>
        )}
      </div>
      <div className="stage-plinth" aria-hidden="true" />
      {entries.length > 1 && (
        <div className="spotlight-controls">
          <button
            className="icon-button arrow-back"
            onClick={() => move(-1)}
            aria-label="Previous builder"
          >
            <Icon name="arrow" />
          </button>
          <span>
            {active + 1} / {entries.length}
          </span>
          <button
            className="icon-button"
            onClick={() => move(1)}
            aria-label="Next builder"
          >
            <Icon name="arrow" />
          </button>
          {!reduced && (
            <button
              className="button quiet"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
            >
              {paused ? "Play spotlights" : "Pause spotlights"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
