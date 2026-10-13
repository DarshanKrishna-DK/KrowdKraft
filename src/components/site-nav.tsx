"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "./dialog";
import { Icon } from "./icon";
import { events } from "@/data/events";
import { journal } from "@/data/journal";
export const destinations = [
  { label: "Events", href: "/events" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Spotlight", href: "/spotlight" },
  { label: "Journal", href: "/journal" },
];
const directory = [
  ...destinations.map((item) => ({ ...item, type: "Explore" })),
  { label: "Community leaderboard", href: "/leaderboard", type: "Community" },
  { label: "Join the Krowd", href: "/#join", type: "Community" },
  { label: "Connect GitHub", href: "/account", type: "Community" },
  ...events.map((event) => ({
    label: event.title,
    href: `/events/${event.slug}`,
    type: "Event",
  })),
  ...journal.map((article) => ({
    label: article.title,
    href: article.href,
    type: "Journal · Medium",
  })),
];
export function SiteNav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch((value) => !value);
      }
    }
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, []);
  useEffect(() => {
    if (search) input.current?.focus();
  }, [search]);
  const matches = directory.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-shell container">
          <Link href="/" className="brand" aria-label="KrowdKraft home">
            <Image
              src="/brand/logo.webp"
              width={36}
              height={36}
              alt=""
              priority
            />
            <span>
              KrowdKraft<span className="brand-stop">.</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {destinations.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  pathname.startsWith(item.href) ? "page" : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-tools">
            <button
              className="search-trigger"
              onClick={() => setSearch(true)}
              aria-label="Search the community, ⌘ K or Ctrl K"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Icon name="search" size={18} />
              <kbd aria-hidden="true">⌘ K</kbd>
            </button>
            <Link className="button primary nav-join" href="/#join">
              Join the Krowd <Icon name="diagonal" size={16} />
            </Link>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(true)}
              aria-label="Open navigation"
              aria-expanded={menu}
              aria-haspopup="dialog"
            >
              <Icon name="menu" />
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
        <p className="eyebrow">A place for your people</p>
        <h2 id="menu-title">Find your corner.</h2>
        <nav aria-label="Mobile navigation">
          {[
            ...destinations,
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "Connect GitHub", href: "/account" },
            { label: "Join the Krowd", href: "/#join" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenu(false)}
            >
              {item.label}
              <Icon name="diagonal" />
            </Link>
          ))}
        </nav>
      </Dialog>
      <Dialog
        open={search}
        onClose={() => setSearch(false)}
        titleId="search-title"
        className="search-dialog"
      >
        <h2 id="search-title">Find something good.</h2>
        <label className="sr-only" htmlFor="site-search">
          Search pages, events and articles
        </label>
        <div className="search-input-wrap">
          <Icon name="search" />
          <input
            id="site-search"
            ref={input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Events, projects, a little inspiration…"
            autoComplete="off"
          />
        </div>
        <p className="form-hint" role="status">
          {matches.length} results
        </p>
        <ul className="search-results">
          {matches.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setSearch(false)}>
                <span>
                  <small>{item.type}</small>
                  {item.label}
                </span>
                <Icon name="diagonal" />
              </a>
            </li>
          ))}
        </ul>
        {!matches.length && (
          <p className="muted">No matches. Try “Hacktoberfest” or “GitHub”.</p>
        )}
      </Dialog>
      <noscript>
        <nav className="noscript-nav" aria-label="Page navigation">
          {destinations.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </noscript>
    </>
  );
}
