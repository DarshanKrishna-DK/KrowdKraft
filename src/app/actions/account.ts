"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminDatabase,
  currentMember,
  sessionClient,
  supabaseConfig,
} from "@/server/supabase";
import { publicActivity } from "@/server/github";
export async function connectGithub() {
  const client = await sessionClient(),
    config = supabaseConfig();
  const origin =
    process.env.SITE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  if (
    !client ||
    !config ||
    !adminDatabase() ||
    !origin ||
    (process.env.NODE_ENV === "production" && !origin.startsWith("https://"))
  )
    redirect("/account?notice=unavailable");
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin.replace(/\/$/, "")}/auth/callback`,
      scopes: "read:user user:email",
    },
  });
  if (
    error ||
    !data.url ||
    new URL(data.url).origin !== new URL(config.url).origin
  )
    redirect("/account?notice=connection-failed");
  redirect(data.url);
}
export async function disconnectSession() {
  const client = await sessionClient();
  if (client) {
    const { error } = await client.auth.signOut();
    if (error) redirect("/account?notice=signout-failed");
  }
  redirect("/account?notice=signed-out");
}
export async function setProfileVisibility(form: FormData) {
  const user = await currentMember(),
    client = adminDatabase();
  if (!user || !client) redirect("/account?notice=unavailable");
  const isPublic = form.get("visibility") === "public";
  if (isPublic && form.get("public-consent") !== "on")
    redirect("/account?notice=save-failed");
  const { data, error } = await client
    .from("kk_members")
    .update({
      is_public: isPublic,
      consent_at: isPublic ? new Date().toISOString() : null,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();
  if (error || !data) redirect("/account?notice=save-failed");
  revalidatePath("/leaderboard");
  revalidatePath("/account");
  redirect(`/account?notice=${isPublic ? "published" : "private"}`);
}
export async function syncActivity() {
  const user = await currentMember(),
    client = adminDatabase();
  if (!user || !client) redirect("/account?notice=unavailable");
  const { data: profile } = await client
    .from("kk_members")
    .select("github_login,synced_at")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/account?notice=save-failed");
  if (
    profile.synced_at &&
    Date.now() - new Date(profile.synced_at).getTime() < 15 * 60 * 1000
  )
    redirect("/account?notice=recently-synced");
  let success = false;
  try {
    const result = await publicActivity(profile.github_login);
    const { error } = await client
      .from("kk_members")
      .update({
        activity: result.activity,
        activity_month: result.period,
        synced_at: result.syncedAt,
        activity_partial: result.truncated,
      })
      .eq("id", user.id);
    success = !error;
  } catch {
    /* Keep the last successful snapshot; never replace errors with zero. */
  }
  revalidatePath("/leaderboard");
  revalidatePath("/account");
  redirect(`/account?notice=${success ? "synced" : "sync-failed"}`);
}
export async function removeAccount(form: FormData) {
  const user = await currentMember(),
    client = adminDatabase(),
    session = await sessionClient();
  if (!user || !client || !session || form.get("confirm") !== "remove")
    redirect("/account?notice=removal-unconfirmed");
  const { error: signoutError } = await session.auth.signOut({
    scope: "global",
  });
  if (signoutError) redirect("/account?notice=remove-failed");
  const { error } = await client.auth.admin.deleteUser(user.id);
  if (error) redirect("/account?notice=remove-failed");
  revalidatePath("/leaderboard");
  redirect("/account?notice=removed");
}
