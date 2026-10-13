import type { DuckMood } from "./krafty-character";
export function DuckDock({
  id,
  mood = "happy",
  tip,
  href,
  label,
  align = "start",
}: {
  id: string;
  mood?: DuckMood;
  tip: string;
  href?: string;
  label?: string;
  align?: "start" | "end";
}) {
  return (
    <div
      className={`duck-dock dock-${align}`}
      data-duck-dock={id}
      data-mood={mood}
      data-tip={tip}
      data-href={href}
      data-label={label}
      aria-hidden="true"
    >
      <span className="duck-footprints" />
    </div>
  );
}
