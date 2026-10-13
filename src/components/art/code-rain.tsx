"use client";
import { useEffect, useRef, useState } from "react";

const glyphs = "01{}[]<>/;=+constawaitbuildreturn";
export function CodeRain() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      last = 0,
      visible = true,
      width = 0,
      height = 0,
      elapsed = 0;
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.font = "14px ui-monospace, monospace";
      const columns = Math.ceil(width / 39);
      for (let column = 0; column < columns; column++) {
        const speed = 18 + ((column * 13) % 24);
        const head = ((elapsed * speed + column * 117) % (height + 390)) - 110;
        for (let row = 0; row < 16; row++) {
          const y = head - row * 20;
          if (y < 0 || y > height) continue;
          context.fillStyle =
            row === 0
              ? "rgba(203,244,230,.85)"
              : `rgba(175,147,217,${(1 - row / 16) * 0.55})`;
          context.fillText(
            glyphs[
              (column * 11 + row * 7 + Math.floor(elapsed * 1.5)) %
                glyphs.length
            ],
            column * 39 + 10,
            y,
          );
        }
      }
    };
    const tick = (time: number) => {
      if (!visible || document.hidden || reduced.matches || paused) {
        frame = 0;
        return;
      }
      if (time - last > 65) {
        elapsed += Math.min((time - last) / 1000, 0.1);
        last = time;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
      if (!paused && visible && !document.hidden && !reduced.matches) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
      height = element.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      start();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    resize.observe(element);
    observer.observe(element);
    reduced.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      reduced.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, [paused]);
  return (
    <>
      <canvas ref={canvas} className="code-rain" aria-hidden="true" />
      <button
        className="rain-control"
        type="button"
        aria-label={paused ? "Play code rain" : "Pause code rain"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      </button>
    </>
  );
}
