"use client";
import { useId } from "react";
export type DuckMood =
  | "wave"
  | "happy"
  | "curious"
  | "thinking"
  | "celebrate"
  | "concerned";
export function KraftyCharacter({
  mood,
  travelling = false,
}: {
  mood: DuckMood;
  travelling?: boolean;
}) {
  const id = useId().replaceAll(":", ""),
    joyful = mood === "happy" || mood === "celebrate",
    sad = mood === "concerned";
  return (
    <svg
      className={`krafty-character mood-${mood} ${travelling ? "is-travelling" : ""}`}
      viewBox="0 0 160 174"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-body`} cx=".3" cy=".2" r=".9">
          <stop stopColor="#fff8c5" />
          <stop offset=".55" stopColor="#ffe38c" />
          <stop offset="1" stopColor="#e3b64e" />
        </radialGradient>
        <linearGradient id={`${id}-beak`} x2="0" y2="1">
          <stop stopColor="#ffbd6c" />
          <stop offset="1" stopColor="#ec803c" />
        </linearGradient>
        <linearGradient id={`${id}-wing`} x2="1" y2="1">
          <stop stopColor="#fff2a8" />
          <stop offset="1" stopColor="#e5b94e" />
        </linearGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#090710" stopOpacity=".4" />
          <stop offset="1" stopColor="#090710" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        className="duck-shadow"
        cx="80"
        cy="161"
        rx="53"
        ry="10"
        fill={`url(#${id}-shadow)`}
      />
      <g
        className="duck-feet"
        fill="#ed964d"
        stroke="#d5813e"
        strokeWidth="1.5"
      >
        <path
          className="duck-foot-left"
          d="M55 142 47 153q-1 5 8 5h18l-4-16Z"
        />
        <path className="duck-foot-right" d="m86 143-3 14h21q9-1 5-6l-11-10Z" />
      </g>
      <g className="duck-body">
        <path d="M124 99q24-4 17 14l-16 11" fill="#e2b952" />
        <ellipse cx="80" cy="116" rx="43" ry="34" fill={`url(#${id}-body)`} />
        <ellipse cx="74" cy="124" rx="24" ry="19" fill="#fff4be" opacity=".7" />
        <path
          className="duck-wing wing-left"
          d="M48 95c-13-11-28 1-19 20 6 15 19 15 21 5 2-8 3-15-2-25Z"
          fill={`url(#${id}-wing)`}
          stroke="#e3b54f"
          strokeWidth="1.2"
        />
        <path
          className="duck-wing wing-right"
          d="M110 95c13-10 27 1 19 20-6 15-19 15-21 5-2-8-3-15 2-25Z"
          fill={`url(#${id}-wing)`}
          stroke="#e3b54f"
          strokeWidth="1.2"
        />
        <path d="m50 98 51-2 12 13-14 3-5 14-14-21-23 5Z" fill="#a58bd3" />
        <path
          d="m54 100 48-2"
          stroke="#d2bfee"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <g className="duck-head">
          <path
            d="M65 28c-7-11 3-19 7-14 4 5-1 11 0 13 1-13 15-17 14-9-1 5-8 9-7 11"
            fill="#ffe79e"
          />
          <path
            d="M33 61c0-25 20-37 46-37s49 15 49 40c0 28-17 41-48 41S33 92 33 61Z"
            fill={`url(#${id}-body)`}
          />
          <path
            d="M44 48c4-11 14-16 24-17"
            stroke="#fff9d6"
            strokeWidth="5"
            strokeLinecap="round"
            opacity=".7"
          />
          <g
            className="duck-eyes"
            stroke="#342c3b"
            strokeWidth="4.6"
            strokeLinecap="round"
          >
            {joyful ? (
              <>
                <path d="M48 62q7-13 14 0" />
                <path d="M87 62q7-13 14 0" />
              </>
            ) : (
              <>
                <ellipse
                  cx={mood === "curious" ? 59 : 56}
                  cy={sad ? 66 : 63}
                  rx="5.2"
                  ry={mood === "thinking" ? 6 : 8}
                  fill="#342c3b"
                  stroke="none"
                />
                <ellipse
                  cx={mood === "curious" ? 101 : 96}
                  cy={sad ? 66 : 63}
                  rx="5.2"
                  ry={mood === "thinking" ? 6 : 8}
                  fill="#342c3b"
                  stroke="none"
                />
                <circle cx="57" cy="60" r="1.7" fill="white" stroke="none" />
                <circle cx="97" cy="60" r="1.7" fill="white" stroke="none" />
              </>
            )}
          </g>
          <g
            className="duck-brows"
            stroke="#a67938"
            strokeWidth="2.8"
            strokeLinecap="round"
          >
            {sad ? (
              <>
                <path d="m46 51 15-5" />
                <path d="m89 46 14 5" />
              </>
            ) : mood === "thinking" ? (
              <>
                <path d="m47 47 13 4" />
                <path d="m89 47 14-4" />
              </>
            ) : mood === "curious" ? (
              <>
                <path d="M46 49q7-5 13-1" />
                <path d="M91 43q7-6 13 0" />
              </>
            ) : (
              <>
                <path d="M47 48q7-4 12 0" />
                <path d="M90 48q7-4 12 0" />
              </>
            )}
          </g>
          <ellipse
            cx="44"
            cy="78"
            rx="8"
            ry="4.5"
            fill="#ed9b77"
            opacity=".6"
          />
          <ellipse
            cx="111"
            cy="78"
            rx="8"
            ry="4.5"
            fill="#ed9b77"
            opacity=".6"
          />
          {joyful && <path d="M62 79q16 25 29 0" fill="#6a3c31" />}
          <path
            d={
              sad
                ? "M57 83q17-17 37-1 0 9-18 7-19 1-19-6Z"
                : "M55 77q20-15 42 0 3 10-21 10T55 77Z"
            }
            fill={`url(#${id}-beak)`}
            stroke="#e59d52"
            strokeWidth="1"
          />
          <path
            d="M63 77q14 5 28 0"
            stroke="#cc713c"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {joyful && (
            <path
              d="M72 91q7-4 11 0"
              stroke="#e5a58e"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
          {sad && <path d="M109 83q8 12 0 12-8 0 0-12Z" fill="#91c8ed" />}
        </g>
      </g>
      {mood === "celebrate" && (
        <g className="duck-confetti" strokeWidth="3" strokeLinecap="round">
          <path d="m18 35-4-7m129 20 6-4M121 17l2-7" stroke="#d3f878" />
          <path d="m25 65-9 2m121 7 7 3M43 13l-3-7" stroke="#c8abff" />
        </g>
      )}
    </svg>
  );
}
