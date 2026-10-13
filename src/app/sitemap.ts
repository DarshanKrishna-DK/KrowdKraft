import type { MetadataRoute } from "next";
import { events } from "@/data/events";
import { siteOrigin } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  if (!origin || process.env.VERCEL_ENV === "preview") return [];
  return [
    "/",
    "/events",
    "/marketplace",
    "/spotlight",
    "/journal",
    "/leaderboard",
    "/privacy",
    ...events.map((event) => `/events/${event.slug}`),
  ].map((path) => ({
    url: origin + path,
    changeFrequency: path === "/privacy" ? "yearly" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
