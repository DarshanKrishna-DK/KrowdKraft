"use client";
import Script from "next/script";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
type Figure = {
  mount: (
    host: {
      stage: HTMLElement;
      svg: SVGSVGElement;
      read: { textContent: string };
    },
    value: number,
  ) => { destroy: () => void };
};
declare global {
  interface Window {
    krowdBuilder?: Figure;
    HL?: {
      inject: (root: Document) => void;
      setReducedMotion: (value: boolean) => void;
    };
  }
}
export function BuilderScene() {
  const stage = useRef<HTMLDivElement>(null),
    svg = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (
      !ready ||
      !stage.current ||
      !svg.current ||
      !window.krowdBuilder ||
      !window.HL
    )
      return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () =>
      window.HL?.setReducedMotion(
        media.matches || document.documentElement.dataset.motion === "off",
      );
    window.HL.inject(document);
    motion();
    const figure = window.krowdBuilder.mount(
      { stage: stage.current, svg: svg.current, read: { textContent: "rest" } },
      10,
    );
    media.addEventListener("change", motion);
    window.addEventListener("krowd:motion", motion);
    return () => {
      figure.destroy();
      media.removeEventListener("change", motion);
      window.removeEventListener("krowd:motion", motion);
    };
  }, [ready]);
  return (
    <div className="builder-scene">
      <div className="builder-backdrop" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="builder-plaque">
        <span className="live-dot" /> A little idea, taking shape.
      </div>
      <div
        ref={stage}
        data-hairline="builder"
        className="builder-stage"
        role="img"
        aria-label="An isometric developer wearing headphones and typing at a desk. Move across the keyboard to guide their hands."
      >
        {!ready && (
          <Image
            className="builder-fallback"
            src="/art/hairline/builder-rest.svg"
            alt=""
            width={400}
            height={320}
            unoptimized
          />
        )}
        <svg ref={svg} viewBox="0 0 400 320" aria-hidden="true" />
      </div>
      <p className="builder-caption">
        Where “what if” becomes <span>“look what I made.”</span>
      </p>
      <Script
        src="/art/hairline/builder-runtime.js"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
    </div>
  );
}
