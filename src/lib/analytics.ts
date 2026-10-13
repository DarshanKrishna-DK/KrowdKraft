export const analyticsId = "G-QM44WYFLFR";
const publicPages: Record<string, string> = {
  "/": "KrowdKraft",
  "/events": "Events",
  "/marketplace": "Marketplace",
  "/spotlight": "Builder spotlight",
  "/journal": "Journal",
  "/leaderboard": "Community activity",
  "/privacy": "Privacy",
};
export function analyticsPage(
  path: string,
): { path: string; title: string } | null {
  const pathname = path.split(/[?#]/, 1)[0];
  if (Object.hasOwn(publicPages, pathname))
    return { path: pathname, title: publicPages[pathname] };
  if (
    /^\/events\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname) &&
    pathname.length < 180
  )
    return { path: pathname, title: "KrowdKraft event" };
  return null;
}
export function analyticsHostAllowed(hostname: string) {
  return !/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(hostname);
}
