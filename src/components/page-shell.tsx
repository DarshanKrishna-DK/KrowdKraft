import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <SiteNav />
      <main id="main" className={`inner-page ${className}`}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
