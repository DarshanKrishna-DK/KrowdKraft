"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Dialog } from "./dialog";
import { Icon } from "./icon";
import { links } from "@/data/links";
export const destinations = [
  { label: "Events", href: "/events" },
  { label: "Showcase", href: "/marketplace" },
  { label: "Journal", href: "/journal" },
  { label: "Collaborate", href: "/#collaborate" },
];
export function SiteNav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-shell container">
          <Link href="/" className="brand" aria-label="KrowdKraft home">
            <span className="brand-emblem">
              <Image
                src="/brand/logo.webp"
                width={36}
                height={36}
                alt=""
                priority
              />
            </span>
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
                  pathname.startsWith(item.href) ||
                  (item.href === "/marketplace" && pathname === "/spotlight")
                    ? "page"
                    : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-tools">
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
        <h2 id="menu-title">Find your corner.</h2>
        <nav aria-label="Mobile navigation">
          {[
            ...destinations,
            { label: "Builder spotlight", href: "/marketplace#builders" },
            { label: "Calendar on Luma", href: links.luma },
            { label: "Connect GitHub", href: "/account" },
            { label: "Join the Krowd", href: "/#join" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenu(false)}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
              <Icon name="diagonal" />
            </Link>
          ))}
        </nav>
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
