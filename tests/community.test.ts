import { test } from "node:test";
import assert from "node:assert/strict";
import {
  submissionSchema,
  moderationSchema,
  monthWindow,
  safeGithubLogin,
} from "../src/lib/community-schema";
import { scorePublicEvents } from "../src/lib/github-activity";
import { analyticsPage, analyticsHostAllowed } from "../src/lib/analytics";
import { eventCalendar } from "../src/lib/calendar";
import { events } from "../src/data/events";
import { registrationOpen } from "../src/data/event-utils";
const submission = {
  kind: "project",
  name: "Useful tool",
  builder: "A builder",
  email: "builder@example.com",
  url: "https://example.com/project",
  description:
    "A useful open-source tool for people learning to build their first application.",
  category: "Developer tools",
  consent: true,
  website: "",
};
test("submissions require consent and private email, reject unsafe links and honeypots", () => {
  assert.equal(submissionSchema.safeParse(submission).success, true);
  for (const change of [
    { consent: false },
    { email: "not-an-email" },
    { website: "bot" },
    { url: "javascript:alert(1)" },
    { url: "https://user:password@example.com" },
    { url: "https://127.0.0.1" },
    { phone: "not-a-required-contact" },
  ])
    assert.equal(
      submissionSchema.safeParse({ ...submission, ...change }).success,
      false,
    );
  assert.equal(
    moderationSchema.safeParse({
      id: "not-a-uuid",
      decision: "approved",
      title: "A title",
      summary: submission.description,
      month: "2026-13",
    }).success,
    false,
  );
});
test("public activity deduplicates, bounds the UTC month and excludes private or unscored actions", () => {
  const base = {
    public: true,
    created_at: "2026-10-02T04:00:00Z",
    payload: {},
    type: "PushEvent",
  };
  const result = scorePublicEvents(
    [
      { ...base, id: "1" },
      { ...base, id: "1" },
      { ...base, id: "2", public: false },
      { ...base, id: "3", created_at: "2026-09-30T23:59:59Z" },
      {
        ...base,
        id: "4",
        type: "PullRequestEvent",
        payload: { action: "opened" },
      },
      {
        ...base,
        id: "5",
        type: "PullRequestEvent",
        payload: { action: "closed" },
      },
      {
        ...base,
        id: "6",
        type: "PullRequestReviewEvent",
        payload: { action: "created" },
      },
      { ...base, id: "7", type: "IssuesEvent", payload: { action: "opened" } },
      { ...base, id: "8", created_at: "2026-11-02T00:00:00Z" },
    ],
    new Date("2026-10-13T12:00:00Z"),
  );
  assert.deepEqual(result, {
    activity: { pushes: 1, pullRequests: 1, reviews: 1, issues: 1, total: 4 },
    period: "2026-10",
  });
  assert.equal(monthWindow(new Date("2027-01-01T00:00:00Z")).period, "2027-01");
  assert.equal(safeGithubLogin("../token"), false);
});
test("Hacktoberfest stays upcoming after its registration deadline without an open-registration claim", () => {
  const event = events.find((item) => item.id === "hacktoberfest-2026")!;
  assert.equal(registrationOpen(event, "2026-10-06"), true);
  assert.equal(registrationOpen(event, "2026-10-13"), false);
  const calendar = eventCalendar(event, new Date("2026-10-13T00:00:00Z"));
  assert.match(calendar, /DTSTART:20261018T030000Z/);
  assert.match(calendar, /DTEND:20261018T130000Z/);
  assert.match(calendar, /BEGIN:VCALENDAR\r\n/);
  for (const line of calendar.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
});
test("analytics page views strip search/hash data and exclude identity/admin/callback pages", () => {
  assert.deepEqual(
    analyticsPage("/marketplace?email=private@example.com#submit"),
    { path: "/marketplace", title: "Marketplace" },
  );
  assert.equal(analyticsPage("/auth/callback?code=private"), null);
  assert.equal(analyticsPage("/account?notice=connected"), null);
  assert.equal(analyticsPage("/admin"), null);
  assert.equal(analyticsHostAllowed("127.0.0.1"), false);
});
