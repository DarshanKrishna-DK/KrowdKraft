"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Destination pages start at the top; explicit section links retain their target. */
export function RouteScroll() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  useEffect(() => {
    let frame = 0;
    function samePage(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.target ||
        link.hasAttribute("download")
      )
        return;
      const target = new URL(link.href);
      if (
        target.origin !== location.origin ||
        target.pathname !== location.pathname ||
        target.search !== location.search ||
        target.hash
      )
        return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
      );
    }
    document.addEventListener("click", samePage, true);
    return () => {
      document.removeEventListener("click", samePage, true);
      cancelAnimationFrame(frame);
    };
  }, []);
  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const frame = requestAnimationFrame(() =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return null;
}
