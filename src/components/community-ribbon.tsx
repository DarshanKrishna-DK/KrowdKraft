"use client";
import { useState } from "react";
export function CommunityRibbon({ phrases }: { phrases: string[] }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`community-ribbon ${paused ? "ribbon-paused" : ""}`}>
      <div className="ribbon-track">
        {[0, 1].map((copy) => (
          <div
            className="ribbon-lap"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {phrases.map((phrase) => (
              <span key={phrase}>
                {phrase}
                <i aria-hidden="true">✳</i>
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        className="ribbon-control"
        aria-label={paused ? "Play community ribbon" : "Pause community ribbon"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      </button>
    </div>
  );
}
