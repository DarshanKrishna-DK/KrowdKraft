import type { CSSProperties } from "react";
export function ClayNodes({ className = "" }: { className?: string }) {
  return (
    <div className={`clay-nodes ${className}`} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <i key={i} style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );
}
export function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      ↗
    </span>
  );
}
