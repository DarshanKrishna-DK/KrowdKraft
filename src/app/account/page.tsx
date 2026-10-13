/* eslint-disable @next/next/no-img-element -- GitHub avatar comes from verified provider identity. */
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { DuckDock } from "@/components/duck/duck-dock";
import { Icon } from "@/components/icon";
import {
  currentMember,
  organizerAllowed,
  supabaseConfig,
} from "@/server/supabase";
import { getOwnProfile } from "@/server/community";
import {
  connectGithub,
  disconnectSession,
  removeAccount,
  setProfileVisibility,
  syncActivity,
} from "@/app/actions/account";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your corner of the Krowd | KrowdKraft",
  robots: { index: false, follow: false },
};
const notices: Record<string, string> = {
  unavailable:
    "GitHub connection isn’t available here just yet. You can still join the community and explore everything else.",
  "connection-failed":
    "We couldn’t complete the GitHub connection. Please try again. If you declined access, nothing else is needed.",
  connected:
    "GitHub connected. Your profile stays private unless you choose to share it.",
  "save-failed": "We couldn’t save that change. Please try again.",
  published:
    "You’re on the community list. Sync your public activity to join this month’s board.",
  private: "Your profile and activity are now hidden from the community board.",
  synced: "Your public GitHub activity has been refreshed.",
  "sync-failed":
    "GitHub activity couldn’t be refreshed right now. Your previous snapshot is unchanged.",
  "recently-synced":
    "You’re up to date. You can refresh again 15 minutes after your last sync.",
  "signed-out": "You’ve signed out. Your visibility preference is unchanged.",
  "signout-failed": "We couldn’t sign you out. Please try again.",
  removed:
    "Your KrowdKraft account and public activity profile have been removed.",
  "removal-unconfirmed": "Tick the confirmation before removing your account.",
  "remove-failed":
    "We couldn’t finish removing your account. Please sign in again to retry, or contact the team.",
};
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams,
    user = await currentMember(),
    profile = user ? await getOwnProfile(user.id) : null;
  const ready = Boolean(
    supabaseConfig() &&
    process.env.SUPABASE_SECRET_KEY &&
    (process.env.SITE_URL || process.env.NODE_ENV === "development"),
  );
  return (
    <PageShell>
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">Your corner of the Krowd</p>
          <h1>
            Bring your GitHub.
            <br />
            <span className="serif-word">Be yourself.</span>
          </h1>
          <p>
            Connect your developer identity, choose what to share, and keep
            track of your public building activity.
          </p>
        </div>
        {notice && notices[notice] && (
          <p
            className="notice"
            role="status"
            style={{ maxWidth: 660, marginBottom: 25 }}
          >
            {notices[notice]}
          </p>
        )}
        {user && profile ? (
          <div className="account-card">
            <div className="member-profile">
              <img src={profile.avatar_url} width={50} height={50} alt="" />
              <div>
                <strong>{profile.display_name}</strong>
                <p>@{profile.github_login}</p>
              </div>
            </div>
            <h2>Your profile, your call.</h2>
            <p>
              {profile.is_public
                ? "Your name, GitHub handle, avatar and synced activity appear on the community board."
                : "Your profile is private. It does not appear on the community board."}
            </p>
            <form action={setProfileVisibility}>
              <input
                type="hidden"
                name="visibility"
                value={profile.is_public ? "private" : "public"}
              />
              {!profile.is_public && (
                <label className="checkbox-field">
                  <input name="public-consent" type="checkbox" required />
                  <span>
                    I want my name, GitHub handle, avatar and public activity to
                    appear on the leaderboard. I can hide them again at any
                    time.
                  </span>
                </label>
              )}
              <button className="button primary" type="submit">
                {profile.is_public
                  ? "Make my profile private"
                  : "Join the public community board"}
                <Icon name="arrow" size={17} />
              </button>
            </form>
            <div
              className="subsection"
              style={{
                marginTop: 36,
                paddingTop: 25,
                borderTop: "1px solid var(--line)",
              }}
            >
              <h3 style={{ fontSize: 22, marginBottom: 12 }}>
                A little progress check.
              </h3>
              <p>
                {profile.synced_at
                  ? `Last refreshed ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(profile.synced_at))} IST.`
                  : "Your activity hasn’t been synced yet."}
              </p>
              <form action={syncActivity}>
                <button className="button" type="submit">
                  Refresh public activity <Icon name="branch" size={17} />
                </button>
              </form>
              <Link
                href="/leaderboard"
                className="text-link"
                style={{ marginTop: 14 }}
              >
                See the community board <Icon name="diagonal" size={17} />
              </Link>
            </div>
            <div className="account-actions">
              <form action={disconnectSession}>
                <button className="button" type="submit">
                  Sign out
                </button>
              </form>
              {organizerAllowed(user.id) && (
                <Link href="/admin" className="button">
                  Organizer desk <Icon name="diagonal" size={17} />
                </Link>
              )}
            </div>
            <details style={{ marginTop: 35 }}>
              <summary
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  cursor: "pointer",
                  minHeight: 44,
                }}
              >
                Remove my KrowdKraft account
              </summary>
              <p>
                This removes your member profile, activity snapshots and sign-in
                account here. It does not delete your GitHub account or
                previously emailed submissions.
              </p>
              <form action={removeAccount}>
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    name="confirm"
                    value="remove"
                    required
                  />
                  <span>
                    I want to permanently remove my KrowdKraft account and
                    profile.
                  </span>
                </label>
                <button className="button danger-button" type="submit">
                  Remove account and profile
                </button>
              </form>
            </details>
          </div>
        ) : (
          <div className="account-card">
            <Icon name="github" size={36} />
            <h2>A familiar way to say hello.</h2>
            <p>
              Sign in with GitHub. Your profile starts private, and sharing your
              public activity is optional. We don’t ask for access to your
              repositories or permission to change your code.
            </p>
            <form action={connectGithub}>
              <button
                className="button primary"
                type="submit"
                disabled={!ready}
              >
                {ready
                  ? "Continue with GitHub"
                  : "GitHub connection coming soon"}
                <Icon name="diagonal" size={17} />
              </button>
            </form>
            {!ready && (
              <p className="page-note">
                We’re getting member connections ready. In the meantime,{" "}
                <Link href="/#join" style={{ textDecoration: "underline" }}>
                  come meet the community
                </Link>
                .
              </p>
            )}
            <p className="page-note">
              <Link href="/privacy">How your information is used</Link> ·{" "}
              <Link href="/leaderboard#how-it-works">
                How activity is counted
              </Link>
            </p>
          </div>
        )}
        <DuckDock
          id="account"
          mood="curious"
          tip="Private by default. Even a duck understands personal space."
        />
      </div>
    </PageShell>
  );
}
