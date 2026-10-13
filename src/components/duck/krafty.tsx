"use client";
import { useEffect, useRef, useState } from "react";
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
  const pathname = usePathname(),
    ref = useRef<HTMLElement>(null),
    audio = useRef<DuckSound | null>(null),
    soundTicket = useRef({ version: 0 });
  const [stop, setStop] = useState<Stop>({
    id: "hello",
    mood: "wave",
    tip: "A little curiosity goes a long way.",
  });
  const [hidden, setHidden] = useState(false),
    [sound, setSound] = useState(false),
    [tip, setTip] = useState(false),
    [moving, setMoving] = useState(false),
    [reaction, setReaction] = useState<DuckMood | null>(null);
  const stopId = useRef(""),
    timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let frame = 0,
      moveTimer: ReturnType<typeof setTimeout> | undefined;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const docks = Array.from(
      document.querySelectorAll<HTMLElement>("[data-duck-dock]"),
    );
    function update() {
      frame = 0;
      const candidates = docks
        .map((dock) => ({ dock, bounds: dock.getBoundingClientRect() }))
        .filter(
          ({ bounds }) => bounds.top > 100 && bounds.bottom < innerHeight + 10,
        );
      const target = candidates.sort(
        (a, b) =>
          Math.abs(a.bounds.top - innerHeight * 0.58) -
          Math.abs(b.bounds.top - innerHeight * 0.58),
      )[0];
      if (!ref.current) return;
      if (!target || document.querySelector("dialog[open]")) {
        ref.current.style.visibility = "hidden";
        return;
      }
      const { dock, bounds } = target;
      ref.current.style.transition = stopId.current ? "" : "none";
      ref.current.style.visibility = "visible";
      ref.current.style.transform = `translate3d(${Math.round(bounds.left + scrollX)}px,${Math.round(bounds.top + scrollY)}px,0)`;
      if (stopId.current !== dock.dataset.duckDock) {
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
        setTip(dock.dataset.autoTip !== "false");
        const animate =
          !reduced.matches && document.documentElement.dataset.motion !== "off";
        setMoving(animate);
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => setMoving(false), 850);
        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setTip(false), 9500);
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("krowd:motion", schedule);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    stopId.current = "";
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(moveTimer);
      if (timeout.current) clearTimeout(timeout.current);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("krowd:motion", schedule);
    };
  }, [pathname]);
  useEffect(() => {
    const intent = soundTicket.current;
    const initialize = requestAnimationFrame(() => {
      try {
        setHidden(localStorage.getItem("krowd-duck") === "hidden");
      } catch {}
    });
    async function preferences(event: Event) {
      const command = (event as CustomEvent).detail;
      if (command === "visibility") {
        intent.version++;
        audio.current?.disable();
        setSound(false);
        setHidden((current) => {
          const next = !current;
          try {
            localStorage.setItem("krowd-duck", next ? "hidden" : "visible");
          } catch {}
          return next;
        });
      }
      if (command === "sound") {
        const ticket = ++intent.version;
        if (audio.current?.isEnabled) {
          audio.current.disable();
          setSound(false);
        } else {
          audio.current ??= new DuckSound();
          const enabled = await audio.current.enable();
          if (ticket === intent.version) {
            setSound(enabled);
            if (enabled) audio.current.quack();
          }
        }
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
    window.addEventListener("krowd:duck-command", preferences);
    window.addEventListener("krowd:mail", mail);
    return () => {
      cancelAnimationFrame(initialize);
      intent.version++;
      audio.current?.disable();
      window.removeEventListener("krowd:duck-command", preferences);
      window.removeEventListener("krowd:mail", mail);
    };
  }, []);
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("krowd:duck-state", { detail: { hidden, sound } }),
    );
  }, [hidden, sound]);
  return (
    <aside
      ref={ref}
      className={`krafty-traveller ${hidden ? "krafty-hidden" : ""}`}
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
