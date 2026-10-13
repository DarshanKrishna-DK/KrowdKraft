"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    const reduce = () =>
      media.matches || document.documentElement.dataset.motion === "off";
    function update() {
      frame = 0;
      parallax.forEach((element) => {
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
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("krowd:motion", scroll);
      media.removeEventListener("change", scroll);
    };
  }, [pathname]);
  return null;
}
