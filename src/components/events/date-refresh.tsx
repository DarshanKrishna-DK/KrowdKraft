"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { kolkataToday } from "@/data/event-utils";

/** Keep server-rendered dates fresh even when a visitor leaves the tab open. */
export function DateRefresh({ today }: { today: string }) {
  const router = useRouter();
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let refreshed = false;
    const check = () => {
      clearTimeout(timer);
      if (kolkataToday() !== today && !refreshed) {
        refreshed = true;
        router.refresh();
      }
      const nextMidnight =
        new Date(`${kolkataToday()}T00:00:00+05:30`).getTime() + 86400000;
      timer = setTimeout(
        check,
        Math.max(1000, nextMidnight - Date.now() + 100),
      );
    };
    check();
    document.addEventListener("visibilitychange", check);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [router, today]);
  return null;
}
