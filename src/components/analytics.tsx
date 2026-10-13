"use client";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { analyticsHostAllowed, analyticsPage } from "@/lib/analytics";
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
type Consent = "accepted" | "declined" | null;
export function Analytics({ id, enabled }: { id: string; enabled: boolean }) {
  const pathname = usePathname(),
    [consent, setConsent] = useState<Consent>(null),
    [ready, setReady] = useState(false),
    [preferences, setPreferences] = useState(false),
    [allowed, setAllowed] = useState(false);
  const initialized = useRef(false),
    lastPath = useRef("");
  useEffect(() => {
    const report = () =>
      window.dispatchEvent(
        new CustomEvent("krowd:analytics-state", {
          detail: { enabled: allowed },
        }),
      );
    report();
    window.addEventListener("krowd:analytics-query", report);
    return () => window.removeEventListener("krowd:analytics-query", report);
  }, [allowed]);
  useEffect(() => {
    const allowedHost = enabled && analyticsHostAllowed(location.hostname);
    const task = requestAnimationFrame(() => {
      setAllowed(allowedHost);
      try {
        const stored = localStorage.getItem("krowd-analytics");
        if (stored === "accepted" || stored === "declined") setConsent(stored);
      } catch {}
      setReady(true);
    });
    const open = () => setPreferences(true);
    window.addEventListener("krowd:analytics-preferences", open);
    // Pause collection before any form interaction or email draft is opened. No field data reaches GA.
    const protect = (event: Event) => {
      const element = event.target instanceof Element ? event.target : null;
      const link = element?.closest("a");
      if (
        element?.closest("form") ||
        (link &&
          (link.protocol === "mailto:" ||
            (link.origin === location.origin && !analyticsPage(link.pathname))))
      )
        Reflect.set(window, `ga-disable-${id}`, true);
    };
    window.addEventListener("focusin", protect, true);
    window.addEventListener("pointerdown", protect, true);
    window.addEventListener("click", protect, true);
    return () => {
      cancelAnimationFrame(task);
      window.removeEventListener("krowd:analytics-preferences", open);
      window.removeEventListener("focusin", protect, true);
      window.removeEventListener("pointerdown", protect, true);
      window.removeEventListener("click", protect, true);
    };
  }, [enabled, id]);
  useEffect(() => {
    const page = analyticsPage(pathname),
      active = allowed && consent === "accepted" && Boolean(page);
    Reflect.set(window, `ga-disable-${id}`, !active);
    if (!active || !page) {
      lastPath.current = "";
      return;
    }
    window.dataLayer ??= [];
    // gtag expects the standard Arguments object, rather than a normal array.
    window.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params -- Required by Google's data layer command protocol.
      window.dataLayer!.push(arguments);
    };
    if (!initialized.current) {
      window.gtag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.gtag("js", new Date());
      window.gtag("config", id, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_domain: location.hostname,
        page_location: location.origin + page.path,
        page_referrer: "",
      });
      initialized.current = true;
    }
    if (lastPath.current !== page.path) {
      window.gtag("set", {
        page_location: location.origin + page.path,
        page_referrer: "",
        page_title: page.title,
      });
      window.gtag("event", "page_view", {
        send_to: id,
        page_location: location.origin + page.path,
        page_path: page.path,
        page_title: page.title,
        page_referrer: "",
      });
      lastPath.current = page.path;
    }
  }, [pathname, consent, allowed, id]);
  function choose(value: Consent) {
    setConsent(value);
    setPreferences(false);
    try {
      if (value) localStorage.setItem("krowd-analytics", value);
    } catch {}
    if (value === "declined") {
      Reflect.set(window, `ga-disable-${id}`, true);
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!name.startsWith("_ga")) continue;
        for (const domain of ["", location.hostname, `.${location.hostname}`])
          document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
      }
    } else
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
  }
  const isPublic = Boolean(analyticsPage(pathname));
  return (
    <>
      {allowed && consent === "accepted" && isPublic && (
        <Script
          id="krowd-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
          strategy="afterInteractive"
        />
      )}
      {ready && allowed && isPublic && (consent === null || preferences) && (
        <section className="analytics-notice" aria-label="Optional analytics">
          <div>
            <h2>A little help making this place better.</h2>
            <p>
              Allow Google Analytics to tell us which pages are useful? It’s
              optional. <Link href="/privacy">Privacy details</Link>
            </p>
          </div>
          <div className="analytics-actions">
            <button type="button" onClick={() => choose("accepted")}>
              Allow analytics
            </button>
            <button type="button" onClick={() => choose("declined")}>
              No thanks
            </button>
          </div>
        </section>
      )}
    </>
  );
}
export function AnalyticsPreferences() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const update = (event: Event) =>
      setEnabled(Boolean((event as CustomEvent).detail.enabled));
    window.addEventListener("krowd:analytics-state", update);
    window.dispatchEvent(new Event("krowd:analytics-query"));
    return () => window.removeEventListener("krowd:analytics-state", update);
  }, []);
  return (
    <button
      type="button"
      className="settings-button"
      disabled={!enabled}
      onClick={() =>
        window.dispatchEvent(new Event("krowd:analytics-preferences"))
      }
    >
      {enabled ? "Analytics preferences" : "Analytics off"}
    </button>
  );
}
