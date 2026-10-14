"use client";
import { useEffect, useState } from "react";
export function DuckSettings() {
  const [state, setState] = useState({ hidden: false, sound: false });
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setState((value) => ({
          ...value,
          hidden: localStorage.getItem("krowd-duck") === "hidden",
        }));
      } catch {}
    });
    function update(event: Event) {
      setState((event as CustomEvent).detail);
    }
    window.addEventListener("krowd:duck-state", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("krowd:duck-state", update);
    };
  }, []);
  const command = (detail: string) =>
    window.dispatchEvent(new CustomEvent("krowd:duck-command", { detail }));
  return (
    <>
      <button
        type="button"
        className="settings-button"
        aria-pressed={state.hidden}
        onClick={() => command("visibility")}
      >
        {state.hidden ? "Show Krafty" : "Hide Krafty"}
      </button>
      <button
        type="button"
        className="settings-button"
        aria-pressed={state.sound && !state.hidden}
        disabled={state.hidden}
        onClick={() => command("sound")}
      >
        Duck sounds {state.sound && !state.hidden ? "on" : "off"}
      </button>
    </>
  );
}
