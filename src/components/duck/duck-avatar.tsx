import { useId } from "react";
export type DuckMood = "curious" | "happy" | "thinking" | "wave" | "celebrate" | "concerned";
export function DuckAvatar({ mood = "curious" }: { mood?: DuckMood }) {
  const id = useId().replace(/:/g, "");
  const smile = mood === "happy" || mood === "celebrate";
  const waving = mood === "wave" || mood === "celebrate";
  return <svg className="duck-avatar" viewBox="0 0 128 140" aria-hidden="true" focusable="false" data-mood={mood}>
    <defs>
      <linearGradient id={`${id}-body`} x1=".2" y1="0" x2=".8" y2="1"><stop stopColor="#fff7d8" /><stop offset=".6" stopColor="#f1e7bf" /><stop offset="1" stopColor="#cbbd91" /></linearGradient>
      <linearGradient id={`${id}-bill`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffcb7c" /><stop offset="1" stopColor="#df9155" /></linearGradient>
      <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ba9cff" /><stop offset=".5" stopColor="#8b5cf6" /><stop offset="1" stopColor="#5933a7" /></linearGradient>
    </defs>
    <ellipse cx="61" cy="128" rx="36" ry="6" fill="#09080d" opacity=".25" />
    <path d="M37 116c-7 1-13 7-10 11 3 3 19 2 23-1l-1-10m24 0c8 0 15 6 13 10-2 4-19 4-24 0l1-9" fill={`url(#${id}-bill)`} />
    <path d="M27 83c-10 0-15-8-14-12 0-4 11 3 17 0 8-4 17-10 33-8 20 1 35 16 35 34 0 21-17 32-39 31-25 0-38-15-38-30 0-5 2-10 6-15Z" fill={`url(#${id}-body)`} />
    <path d="M39 86c-9-8-16-2-12 12 3 12 14 18 27 13 5-3 3-7-1-10-6-3-9-8-14-15Z" fill="#e3d5ab" />
    <path d="M31 88c1 9 6 15 15 17" fill="none" stroke="#fff9de" strokeWidth="2" strokeLinecap="round" opacity=".7" />
    {waving && <path className="duck-wing" d="M88 89c4-8 11-22 17-21 7 1 5 17 0 27-4 8-10 10-15 5" fill={`url(#${id}-body)`} />}
    <g className="duck-head" transform={mood === "thinking" ? "rotate(-8 65 66)" : mood === "curious" ? "rotate(5 65 66)" : undefined}>
      <path d="M37 56c0-23 14-36 33-34 21 1 33 15 32 36-1 18-13 30-32 31-18 0-33-13-33-33Z" fill={`url(#${id}-body)`} />
      <path d="M40 47c2-14 12-23 25-23" fill="none" stroke="#fffcef" strokeWidth="3" strokeLinecap="round" opacity=".6" />
      <ellipse cx="48" cy="65" rx="7" ry="4" fill="#f25ca2" opacity=".18" />
      <ellipse cx="91" cy="66" rx="5" ry="3" fill="#f25ca2" opacity=".14" />
      {smile ? <g fill="none" stroke="#282035" strokeWidth="3" strokeLinecap="round"><path d="M54 55q5-7 10 0" /><path d="M79 55q4-7 8 0" /></g> : <g fill="#282035">
        <ellipse cx={mood === "thinking" ? 59 : 61} cy="54" rx="3.5" ry={mood === "concerned" ? 4 : 5} />
        <ellipse cx={mood === "thinking" ? 82 : 84} cy="54" rx="3" ry="4.5" />
        <circle cx={mood === "thinking" ? 58 : 60} cy="52" r="1" fill="#fff" /><circle cx={mood === "thinking" ? 81 : 83} cy="52" r=".8" fill="#fff" />
      </g>}
      <g fill="none" stroke="#78674d" strokeWidth="1.7" strokeLinecap="round">
        <path d={mood === "concerned" ? "M54 45l9-3" : "M55 42q4-3 8-1"} />
        <path d={mood === "concerned" ? "M79 42l8 3" : mood === "curious" ? "M78 38q5-2 9 1" : "M79 42q4-2 8 1"} />
      </g>
      <path d="M69 63c7-5 13-5 22-1 10 3 16 7 14 11-2 7-25 11-34 4-6-4-8-10-2-14Z" fill={`url(#${id}-bill)`} />
      {mood === "celebrate" ? <><ellipse cx="86" cy="74" rx="10" ry="5" fill="#71442f" /><path d="M79 77q7-5 14-1" fill="#f4a797" /></> : <path d="M70 70q13 7 31 1" fill="none" stroke="#bb7c4b" strokeWidth="1.4" strokeLinecap="round" />}
      <ellipse cx="79" cy="64" rx="1.5" ry="1" fill="#b67c4a" />
      <path d="M40 31c-1-14 10-22 23-22 13-1 24 5 28 18-15 8-34 9-51 4Z" fill={`url(#${id}-cap)`} />
      <path d="M42 29c17 0 29-5 45-5 12 0 20 6 18 10-2 6-17 5-29 2-13 1-26 1-34-1-5-1-5-5 0-6Z" fill="#8151db" />
      <path d="M49 15c5-4 13-5 19-3" fill="none" stroke="#dcc9ff" strokeWidth="2" strokeLinecap="round" opacity=".65" />
      <circle cx="61" cy="8" r="3" fill="#b898f5" />
    </g>
  </svg>;
}
