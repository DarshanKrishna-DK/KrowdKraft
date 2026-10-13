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
      placed = false;
    let arrival: ReturnType<typeof setTimeout> | undefined;
    const seen = new Set<string>();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      frame = 0;
      const guide = ref.current;
      if (!guide) return;
      const docks = Array.from(
        document.querySelectorAll<HTMLElement>("[data-duck-dock]"),
      );
      const candidates = docks
        .map((dock, index) => {
          const region =
            dock.closest<HTMLElement>(
              "[data-guide-section], section, .submission-layout, .page-intro, .subsection",
            ) || dock.closest("main");
          return {
            dock,
            index,
            bounds:
              region?.getBoundingClientRect() || dock.getBoundingClientRect(),
          };
        })
        .filter(
          ({ bounds }) =>
            bounds.top < innerHeight * 0.62 &&
            bounds.bottom > innerHeight * 0.38,
        );
      const target = candidates.sort(
        (a, b) =>
          Math.abs(a.bounds.top - innerHeight * 0.2) -
          Math.abs(b.bounds.top - innerHeight * 0.2),
      )[0];
      const id = target?.dock.dataset.duckDock || stopId.current || "hello";
      const changed = id !== stopId.current;
      const left = target ? target.index % 2 === 1 : false;
      const x = left ? 16 : innerWidth - guide.offsetWidth - 16;
      const y = innerHeight - guide.offsetHeight - 10;
      // A steady screen-edge route. Scroll changes the section, never the ground.
      if (!placed || changed) {
        guide.style.transition = placed ? "" : "none";
        guide.style.setProperty("--duck-x", Math.round(x) + "px");
        guide.style.setProperty("--duck-y", Math.round(y) + "px");
        guide.style.transform =
          "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px,0)";
      }
      if (!changed) {
        placed = true;
        return;
      }
      stopId.current = id;
      setTip(false);
      setReaction(null);
      clearTimeout(arrival);
      if (timeout.current) clearTimeout(timeout.current);
      if (!target) {
        placed = true;
        return;
      }
      const dock = target.dock;
      const mood = moods.includes(dock.dataset.mood as DuckMood)
        ? (dock.dataset.mood as DuckMood)
        : "happy";
      setStop({
        id,
        mood,
        tip: dock.dataset.tip || "",
        href: dock.dataset.href,
        label: dock.dataset.label,
      });
      const walking =
        placed &&
        !reduced.matches &&
        document.documentElement.dataset.motion !== "off";
      setMoving(walking);
      placed = true;
      arrival = setTimeout(
        () => {
          setMoving(false);
          if (
            seen.has(id) ||
            dock.dataset.autoTip === "false" ||
            document.activeElement?.closest("form") ||
            document.querySelector("dialog[open]")
          )
            return;
          seen.add(id);
          setTip(true);
          audio.current?.quack(mood === "celebrate");
          timeout.current = setTimeout(() => setTip(false), 8500);
        },
        walking ? 660 : 800,
      );
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      placed = false;
      schedule();
    };
    const onFocus = (event: FocusEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("form, dialog")
      ) {
        setTip(false);
        setMoving(false);
        clearTimeout(arrival);
      }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("focusin", onFocus);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    stopId.current = "";
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(arrival);
      if (timeout.current) clearTimeout(timeout.current);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
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
      data-walking={moving}
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
