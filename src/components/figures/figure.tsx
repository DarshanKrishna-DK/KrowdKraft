"use client";
import { useEffect, useRef } from "react";
type Name = "gather" | "route" | "blocks" | "bridge" | "seat";
const loaders = {
  gather: () => import("@/generated/hairline/gather"),
  route: () => import("@/generated/hairline/route"),
  blocks: () => import("@/generated/hairline/blocks"),
  bridge: () => import("@/generated/hairline/bridge"),
  seat: () => import("@/generated/hairline/seat"),
};
type Definition = {
  name: string; means: string; range: [number, number, number]; tour: ([number, number] | null)[];
  mount: (host: { stage: HTMLDivElement; svg: SVGSVGElement; read: { textContent: string } }, value: number) => { destroy: () => void };
};
export function Figure({ name, className = "" }: { name: Name; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const small = matchMedia("(max-width: 719px)"), reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let near = false, disposed = false, generation = 0, mounted = false;
    let destroy: (() => void) | undefined, stopTour: (() => void) | undefined;
    function clear() {
      generation++; stopTour?.(); stopTour = undefined; destroy?.(); destroy = undefined; mounted = false;
      stage!.replaceChildren(); stage!.removeAttribute("data-hairline");
    }
    async function sync() {
      if (disposed || !near || (small.matches && name !== "gather")) { clear(); return; }
      if (mounted) return;
      mounted = true; const ticket = ++generation;
      try {
        const [module, { HL }] = await Promise.all([loaders[name](), import("@/generated/hairline/kernel")]);
        if (disposed || generation !== ticket) return;
        const definition = module.default as unknown as Definition;
        HL.inject(document); HL.setReducedMotion(reduced.matches);
        stage!.setAttribute("data-hairline", definition.name);
        const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage) as SVGSVGElement;
        const read = { textContent: "rest" };
        const value = definition.range[0] + .9 * (definition.range[1] - definition.range[0]);
        const handle = definition.mount({ stage: stage!, svg, read }, value);
        destroy = handle.destroy;
        if (name === "gather" && !played.current && !reduced.matches) {
          played.current = true;
          const tour = HL.tour(stage, definition.tour, (index: number) => {
            if (index === definition.tour.length - 1) tour.stop();
          });
          stopTour = () => tour.stop();
        }
      } catch {
        if (generation === ticket) clear();
      }
    }
    const observer = new IntersectionObserver(entries => { near = entries[0].isIntersecting; void sync(); }, { rootMargin: "180px 0px" });
    observer.observe(stage);
    const resize = () => void sync();
    const motion = () => { stopTour?.(); clear(); void sync(); };
    small.addEventListener("change", resize); reduced.addEventListener("change", motion);
    return () => { disposed = true; observer.disconnect(); small.removeEventListener("change", resize); reduced.removeEventListener("change", motion); clear(); };
  }, [name]);
  return <div ref={stageRef} className={`figure-plate ${name === "gather" ? "hero-figure" : "desktop-figure"} ${className}`} data-figure={name} aria-hidden="true" />;
}
