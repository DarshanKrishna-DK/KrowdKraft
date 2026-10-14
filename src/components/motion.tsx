"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const parallax = new Set<HTMLElement>();
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const reduce = () =>
      media.matches || document.documentElement.dataset.motion === "off";
    // Content is visible in HTML. Entrances only enhance newly encountered sections.
    const entrances: Record<string, Keyframe> = {
      rise: { translate: "0 28px", opacity: 0.65 },
      slide: { translate: "-26px 0", opacity: 0.65 },
      photo: { translate: "0 24px", rotate: "-3deg", opacity: 0.75 },
      card: { translate: "0 30px", rotate: "2deg", opacity: 0.7 },
      scale: { scale: "0.96", opacity: 0.7 },
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          if (seen.has(target)) return;
          seen.add(target);
          if (reduce() || !(target instanceof HTMLElement)) return;
          const start =
            entrances[target.dataset.reveal || "rise"] || entrances.rise;
          const animation = target.animate(
            [
              start,
              { translate: "0 0", rotate: "0deg", scale: "1", opacity: 1 },
            ],
            {
              duration: 640,
              delay: Math.min(180, Number(target.dataset.revealDelay) || 0),
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: 0.12 },
    );
    function register(root: ParentNode) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        // Do not animate the initial viewport or move an already visible click target.
        if (element.getBoundingClientRect().top < innerHeight)
          seen.add(element);
        if (!seen.has(element)) observer.observe(element);
      });
      root
        .querySelectorAll<HTMLElement>("[data-parallax]")
        .forEach((element) => parallax.add(element));
    }
    register(document);
    // Server-streamed showcase sections arrive after hydration on a cold visit.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (
            node instanceof Element &&
            node.querySelector("[data-reveal], [data-parallax]")
          )
            register(node);
        }),
      );
    });
    mutations.observe(document.getElementById("main") || document.body, {
      childList: true,
      subtree: true,
    });
    function update() {
      frame = 0;
      if (reduce()) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
      parallax.forEach((element) => {
        if (!element.isConnected) {
          parallax.delete(element);
          return;
        }
        const bounds = element.getBoundingClientRect();
        const value =
          !reduce() && bounds.bottom > 0 && bounds.top < innerHeight
            ? Math.max(
                -32,
                Math.min(
                  32,
                  (innerHeight / 2 - bounds.top - bounds.height / 2) * 0.07,
                ),
              )
            : 0;
        element.style.setProperty("--parallax", `${value}px`);
      });
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    window.addEventListener("krowd:motion", scroll);
    media.addEventListener("change", scroll);
    scroll();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("krowd:motion", scroll);
      media.removeEventListener("change", scroll);
    };
  }, [pathname]);
  return null;
}
