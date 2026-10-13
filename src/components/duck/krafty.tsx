"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { KraftyCharacter, type DuckMood } from "./krafty-character";
import { DuckSound } from "./sound";

type Stop = {
  id: string;
  mood: DuckMood;
  tip: string;
  href?: string;
  label?: string;
};
const moods: DuckMood[] = [
  "wave",
  "happy",
  "curious",
  "thinking",
  "celebrate",
  "concerned",
];
export function Krafty() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const audio = useRef<DuckSound | null>(null);
  const stopId = useRef("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stop, setStop] = useState<Stop>({
    id: "hello",
    mood: "wave",
    tip: "I'm Krafty. A little curiosity goes a long way.",
  });
  const [tip, setTip] = useState(false);
  const [moving, setMoving] = useState(false);
  const [reaction, setReaction] = useState<DuckMood | null>(null);
  useLayoutEffect(() => {
    const guide = ref.current;
    const bubble = guide?.querySelector<HTMLElement>(".krafty-bubble");
    if (!guide || !bubble) return;
    const resize = new ResizeObserver(() => {
      guide.style.setProperty("--bubble-height", `${bubble.offsetHeight}px`);
    });
    resize.observe(bubble);
    return () => resize.disconnect();
  }, [tip, stop]);
  useEffect(() => {
    let frame = 0,
      placed = false,
      hadTarget = false;
    let moveTimer: ReturnType<typeof setTimeout> | undefined;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      frame = 0;
      const guide = ref.current;
      if (!guide) return;
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>("[data-duck-dock]"),
      )
        .map((dock) => ({ dock, bounds: dock.getBoundingClientRect() }))
        .filter(
          ({ bounds }) => bounds.top > 105 && bounds.bottom < innerHeight - 8,
        );
      const target = targets.sort(
        (a, b) =>
          Math.abs(a.bounds.top - innerHeight * 0.58) -
          Math.abs(b.bounds.top - innerHeight * 0.58),
      )[0];
      const width = guide.offsetWidth,
        height = guide.offsetHeight;
      const x = Math.max(
        12,
        Math.min(
          target?.bounds.left ?? innerWidth - width - 16,
          innerWidth - width - 12,
        ),
      );
      const y = Math.max(
        105,
        Math.min(
          target?.bounds.top ?? innerHeight - height - 18,
          innerHeight - height - 12,
        ),
      );
      guide.style.transition = placed ? "" : "none";
      guide.style.setProperty("--duck-x", `${Math.round(x)}px`);
      guide.style.setProperty("--duck-y", `${Math.round(y)}px`);
      guide.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
      placed = true;
      if (!target) {
        if (hadTarget) setTip(false);
        hadTarget = false;
        return;
      }
      hadTarget = true;
      const { dock } = target;
      if (stopId.current === dock.dataset.duckDock) return;
      stopId.current = dock.dataset.duckDock || "";
      const mood = moods.includes(dock.dataset.mood as DuckMood)
        ? (dock.dataset.mood as DuckMood)
        : "happy";
      setStop({
        id: stopId.current,
        mood,
        tip: dock.dataset.tip || "",
        href: dock.dataset.href,
        label: dock.dataset.label,
      });
      setReaction(null);
      const showTip =
        dock.dataset.autoTip !== "false" &&
        !document.activeElement?.closest("form");
      setTip(showTip);
      if (showTip) audio.current?.quack(mood === "celebrate");
      setMoving(!reduced.matches);
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => setMoving(false), 700);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setTip(false), 6500);
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.closest("form"))
        setTip(false);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", onFocus);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    stopId.current = "";
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(moveTimer);
      if (timeout.current) clearTimeout(timeout.current);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);
  useEffect(() => {
    let disposed = false,
      activating = false;
    async function activate() {
      if (activating || audio.current?.isEnabled) return;
      activating = true;
      audio.current ??= new DuckSound();
      const enabled = await audio.current.enable();
      activating = false;
      if (disposed) {
        audio.current?.disable();
        return;
      }
      if (enabled) {
        if (ref.current?.querySelector(".krafty-bubble")) audio.current.quack();
        document.removeEventListener("pointerdown", activate);
        document.removeEventListener("keydown", activate);
      }
    }
    function mail(event: Event) {
      const status = (event as CustomEvent).detail;
      setReaction(
        status === "delivered"
          ? "celebrate"
          : status === "sending"
            ? "thinking"
            : "concerned",
      );
      if (status === "delivered") audio.current?.quack(true);
    }
    document.addEventListener("pointerdown", activate, { passive: true });
    document.addEventListener("keydown", activate);
    window.addEventListener("krowd:mail", mail);
    return () => {
      disposed = true;
      audio.current?.disable();
      document.removeEventListener("pointerdown", activate);
      document.removeEventListener("keydown", activate);
      window.removeEventListener("krowd:mail", mail);
    };
  }, []);
  return (
    <aside
      ref={ref}
      className="krafty-traveller"
      aria-label="Krafty, your community companion"
      data-stop={stop.id}
      data-mood={reaction || stop.mood}
    >
      <button
        className="krafty-body-button"
        type="button"
        aria-label={`Krafty is ${reaction || stop.mood}. ${tip ? "Hide" : "Show"} a tip`}
        aria-expanded={tip}
        onClick={() => {
          setTip((current) => !current);
          setReaction((current) =>
            current === "celebrate" ? stop.mood : "celebrate",
          );
          audio.current?.quack();
          if (timeout.current) clearTimeout(timeout.current);
        }}
      >
        <KraftyCharacter mood={reaction || stop.mood} travelling={moving} />
      </button>
      {tip && (
        <div className="krafty-bubble">
          <button
            className="bubble-close"
            aria-label="Dismiss Krafty's tip"
            onClick={() => setTip(false)}
          >
            ×
          </button>
          <p>{stop.tip}</p>
          {stop.href && (
            <a href={stop.href}>
              {stop.label || "Take a look"} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
