import "server-only";
import { safeGithubLogin } from "@/lib/community-schema";
import { scorePublicEvents, type GithubEvent } from "@/lib/github-activity";
const headers = () => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "KrowdKraft-Community",
  ...(process.env.GITHUB_PUBLIC_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_PUBLIC_TOKEN}` }
    : {}),
});
export async function publicActivity(login: string) {
  if (!safeGithubLogin(login)) throw new Error("Invalid GitHub login");
  const all: GithubEvent[] = [],
    now = new Date();
  const from = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
  let truncated = false;
  for (let page = 1; page <= 3; page++) {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(login)}/events/public?per_page=100&page=${page}`,
      {
        headers: headers(),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) throw new Error("GitHub activity unavailable");
    const records: GithubEvent[] = await response.json();
    if (
      !Array.isArray(records) ||
      records.some(
        (item) =>
          typeof item.id !== "string" ||
          typeof item.created_at !== "string" ||
          !item.payload,
      )
    )
      throw new Error("Invalid GitHub activity response");
    all.push(...records);
    if (records.length < 100 || records.at(-1)!.created_at < from) break;
    if (page === 3) truncated = true;
  }
  return {
    ...scorePublicEvents(all, now),
    truncated,
    sampled: all.length,
    syncedAt: now.toISOString(),
  };
}
export type Contributor = {
  login: string;
  html_url: string;
  avatar_url: string;
  contributions: number;
};
export async function siteContributors(): Promise<{
  records: Contributor[];
  available: boolean;
}> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/DarshanKrishna-DK/KrowdKraft/contributors?per_page=100",
      {
        headers: headers(),
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return { records: [], available: false };
    const values: (Contributor & { type: string })[] = await response.json();
    if (!Array.isArray(values)) return { records: [], available: false };
    return {
      records: values
        .filter(
          (item) =>
            item.type === "User" &&
            safeGithubLogin(item.login) &&
            Number.isInteger(item.contributions),
        )
        .map((item) => ({
          login: item.login,
          contributions: item.contributions,
          html_url: `https://github.com/${item.login}`,
          avatar_url: `https://github.com/${item.login}.png?size=96`,
        })),
      available: true,
    };
  } catch {
    return { records: [], available: false };
  }
}
