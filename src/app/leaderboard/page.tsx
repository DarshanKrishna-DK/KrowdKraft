/* eslint-disable @next/next/no-img-element -- Public GitHub avatars do not need a server image proxy. */
import { pageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import { getPublicMembers } from "@/server/community";
import { siteContributors } from "@/server/github";
import { monthWindow } from "@/lib/community-schema";
import { links } from "@/data/links";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "Community activity & contributors | KrowdKraft",
  "Meet the people building in public. Opt-in GitHub activity and the contributors behind the KrowdKraft website.",
  "/leaderboard",
);
export default async function LeaderboardPage() {
  const [{ records, available, configured }, contributors] = await Promise.all([
    getPublicMembers(),
    siteContributors(),
  ]);
  const { period } = monthWindow(),
    ranked = records
      .filter((member) => member.activity && member.activity_month === period)
      .sort(
        (a, b) =>
          b.activity!.total - a.activity!.total ||
          a.github_login.localeCompare(b.github_login),
      );
  const month = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${period}-01T00:00:00Z`));
  return (
    <PageShell className="activity-page">
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">The community board · {month}</p>
          <h1>
            Look who’s
            <br />
            <span className="serif-word">building.</span>
          </h1>
          <p>
            Opt in to share your public GitHub activity for this month. Private
            work stays private.
          </p>
          <div className="actions">
            <Link className="button primary" href="/account">
              <Icon name="github" size={18} /> Connect your GitHub
            </Link>
            <a className="text-link" href="#how-it-works">
              How it works <Icon name="arrow" size={17} />
            </a>
          </div>
        </div>
        {configured && !available ? (
          <p className="notice" role="alert">
            The community board couldn’t be loaded right now. Please refresh to
            try again.
          </p>
        ) : ranked.length ? (
          <div className="table-scroll">
            <table className="leaderboard-table">
              <caption className="sr-only">
                Public activity for {month}; up to 100 opted-in profiles
              </caption>
              <thead>
                <tr>
                  <th scope="col">Builder</th>
                  <th scope="col">Pushes</th>
                  <th scope="col">PRs opened</th>
                  <th scope="col">Reviews</th>
                  <th scope="col">Issues</th>
                  <th scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((member) => (
                  <tr key={member.github_login}>
                    <td>
                      <a
                        href={`https://github.com/${member.github_login}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          width={32}
                          height={32}
                          src={member.avatar_url}
                          alt=""
                        />
                        <span>
                          {member.github_login}
                          {member.activity_partial && (
                            <small className="muted"> · partial feed</small>
                          )}
                          <small
                            style={{
                              display: "block",
                              color: "var(--muted)",
                              fontSize: 9,
                              marginTop: 4,
                            }}
                          >
                            Synced {member.synced_at?.slice(0, 10)}
                          </small>
                        </span>
                      </a>
                    </td>
                    <td>{member.activity!.pushes}</td>
                    <td>{member.activity!.pullRequests}</td>
                    <td>{member.activity!.reviews}</td>
                    <td>{member.activity!.issues}</td>
                    <td>{member.activity!.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-showcase">
            <div>
              <p className="eyebrow">The first green square starts somewhere</p>
              <h2>
                This month’s board
                <br />
                is waiting for its builders.
              </h2>
              <p>
                Once members connect GitHub, opt in and sync their public
                activity, they’ll appear here. No made-up streaks. No pressure
                to compete.
              </p>
            </div>
            <div className="empty-orbit-mark" aria-hidden="true">
              <Icon name="branch" size={55} />
            </div>
          </div>
        )}
        {records.length > ranked.length && (
          <p className="page-note">
            {records.length - ranked.length} public{" "}
            {records.length - ranked.length === 1
              ? "profile is"
              : "profiles are"}{" "}
            waiting for a current-month sync. Previous data is never counted as
            a fresh zero.
          </p>
        )}
        <details className="subsection activity-explainer" id="how-it-works">
          <summary>How public activity is counted</summary>
          <div className="process-list">
            <div>
              <span className="mono">What we count</span>
              <h3>Public activity points.</h3>
              <p>
                One point per public push event, pull request opened, review
                created or issue opened in the current UTC month. A push can
                include several commits; it is still one event.
              </p>
            </div>
            <div>
              <span className="mono">What we can see</span>
              <h3>A window, not the whole story.</h3>
              <p>
                GitHub’s public events feed returns at most 300 recent events
                and may be delayed. We show a sync date and flag a full sample.
                Private work and activity outside the feed aren’t counted.
              </p>
            </div>
            <div>
              <span className="mono">You’re in control</span>
              <h3>Join when you want.</h3>
              <p>
                Sharing is optional. Hide your profile or remove your account at
                any time. Teaching, design, mentoring and thoughtful
                collaboration matter even when there’s no green square for them.
              </p>
            </div>
          </div>
          <p className="page-note">
            Profiles refresh from the account page, with at least 15 minutes
            between refreshes. Up to 100 public profiles are shown.{" "}
            <a
              href="https://docs.github.com/en/rest/activity/events"
              target="_blank"
              rel="noreferrer"
            >
              About GitHub’s events feed ↗
            </a>
          </p>
        </details>
        <div className="subsection" id="contributors">
          <div className="subsection-heading">
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--lilac)", marginBottom: 17 }}
              >
                The people behind this page
              </p>
              <h2>
                Built together.
                <br />
                Right down to this website.
              </h2>
            </div>
            <a
              className="text-link"
              href={links.github}
              target="_blank"
              rel="noreferrer"
            >
              Explore the repository <Icon name="diagonal" />
            </a>
          </div>
          <p className="page-note">
            Contributors to the KrowdKraft website, from GitHub’s repository
            contributor list. Counts below are all-time repository commits,
            separate from the monthly activity board. Bot accounts are omitted.
          </p>
          {contributors.records.length ? (
            <div className="contributors-grid">
              {contributors.records.map((contributor) => (
                <a
                  className="contributor"
                  key={contributor.login}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={contributor.avatar_url}
                    alt=""
                    width={38}
                    height={38}
                    loading="lazy"
                  />
                  <div>
                    <strong>{contributor.login}</strong>
                    <span>
                      {contributor.contributions} repository{" "}
                      {contributor.contributions === 1 ? "commit" : "commits"}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="notice">
              {contributors.available
                ? "The contributor list is still taking shape."
                : "GitHub’s contributor list is temporarily unavailable."}{" "}
              <a
                href={links.github + "/graphs/contributors"}
                style={{ textDecoration: "underline" }}
              >
                View it on GitHub ↗
              </a>
            </div>
          )}
          <DuckDock
            id="contributors"
            mood="happy"
            tip="Someone fixed a bug so you didn't have to meet it. Say thanks."
            href={links.github}
            label="Meet the repo"
          />
        </div>
      </div>
    </PageShell>
  );
}
