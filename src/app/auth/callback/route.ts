import { NextResponse, type NextRequest } from "next/server";
import { adminDatabase, sessionClient } from "@/server/supabase";
import { safeGithubLogin } from "@/lib/community-schema";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code"),
    client = await sessionClient(),
    database = adminDatabase();
  // Fixed relative destination avoids user-controlled redirects.
  const destination = new URL("/account", request.url);
  const reply = (notice: string) => {
    destination.searchParams.set("notice", notice);
    return NextResponse.redirect(destination, {
      headers: { "Cache-Control": "private, no-store" },
    });
  };
  if (!code || !client || !database) return reply("connection-failed");
  try {
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (error || !data.user || !data.session?.provider_token)
      return reply("connection-failed");
    // GitHub itself supplies the immutable ID and handle. Editable user_metadata is never an authority.
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${data.session.provider_token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "KrowdKraft-Community",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      await client.auth.signOut();
      return reply("connection-failed");
    }
    const github = await response.json();
    if (
      !safeGithubLogin(github.login) ||
      !Number.isSafeInteger(github.id) ||
      github.id < 1
    ) {
      await client.auth.signOut();
      return reply("connection-failed");
    }
    const { error: saveError } = await database
      .from("kk_members")
      .upsert(
        {
          id: data.user.id,
          github_id: String(github.id),
          github_login: github.login,
          display_name:
            typeof github.name === "string"
              ? github.name.slice(0, 100)
              : github.login,
          avatar_url: `https://avatars.githubusercontent.com/u/${github.id}?s=160`,
        },
        { onConflict: "id" },
      );
    if (saveError) {
      await client.auth.signOut();
      return reply("save-failed");
    }
    return reply("connected");
  } catch {
    await client.auth.signOut().catch(() => {});
    return reply("connection-failed");
  }
}
