import { activityScore, monthWindow } from "./community-schema";
export type GithubEvent = {
  id: string;
  type: string;
  public: boolean;
  created_at: string;
  payload: { action?: string };
};
export function scorePublicEvents(events: GithubEvent[], now = new Date()) {
  const { from, to, period } = monthWindow(now),
    seen = new Set<string>();
  const counts = { pushes: 0, pullRequests: 0, reviews: 0, issues: 0 };
  for (const event of events) {
    if (
      !event.public ||
      event.created_at < from ||
      event.created_at > to ||
      seen.has(event.id)
    )
      continue;
    seen.add(event.id);
    if (event.type === "PushEvent") counts.pushes++;
    if (event.type === "PullRequestEvent" && event.payload.action === "opened")
      counts.pullRequests++;
    if (
      event.type === "PullRequestReviewEvent" &&
      event.payload.action === "created"
    )
      counts.reviews++;
    if (event.type === "IssuesEvent" && event.payload.action === "opened")
      counts.issues++;
  }
  return { activity: activityScore(counts), period };
}
