const heldSections = new Set(['builds', 'share', 'leaderboard']);

function sectionOf(pathname: string) {
  const [section] = pathname.split('/').filter(Boolean);
  return section && heldSections.has(section) ? section : null;
}

/** True when a same-origin link would open projects or the leaderboard from outside that page. */
export function comingSoonTarget(currentPath: string, destination: URL, origin: string) {
  if (destination.origin !== origin) return false;
  const next = sectionOf(destination.pathname);
  if (!next) return false;
  return sectionOf(currentPath) !== next;
}
