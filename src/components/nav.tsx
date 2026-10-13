"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Dialog } from "./dialog";
export const navLinks = [
  { label: "About", id: "about" },
  { label: "Events", id: "events" },
  { label: "Collaborate", id: "collaborate" },
  { label: "Community", id: "join" },
];
export function Nav({ detail = false }: { detail?: boolean }) {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    if (detail) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [detail]);
  const prefix = detail ? "/" : "";
  const current = ["bengaluru", "ecosystem", "people"].includes(active)
    ? "join"
    : active === "impact"
      ? "about"
      : active;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="nav-wrap">
        <div className="nav-bar clay">
          <a
            className="brand"
            href={`${prefix}#top`}
            aria-label="KrowdKraft home"
          >
            <Image
              src="/brand/logo.webp"
              width={40}
              height={40}
              alt=""
              priority
            />
            <span>
              KrowdKraft<span className="brand-stop">.</span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`${prefix}#${link.id}`}
                aria-current={current === link.id ? "location" : undefined}
              >
                <span className="nav-pip" />
                {link.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <a href={`${prefix}#join`} className="button primary nav-join">
              Join the Krowd <span aria-hidden="true">↗</span>
            </a>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(true)}
              aria-label="Open navigation"
              aria-expanded={menu}
              aria-haspopup="dialog"
            >
              <span className="menu-lines" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <Dialog
        open={menu}
        onClose={() => setMenu(false)}
        titleId="menu-title"
        className="menu-dialog"
      >
        <h2 id="menu-title">Find your people.</h2>
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`${prefix}#${link.id}`}
              onClick={() => setMenu(false)}
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </Dialog>
      <noscript>
        <nav className="noscript-nav" aria-label="Section navigation">
          {navLinks.map((link) => (
            <a key={link.id} href={`${prefix}#${link.id}`}>
              {link.label}
            </a>
          ))}
        </nav>
      </noscript>
    </>
  );
}
