import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export function supabaseConfig() {
  const url = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { url, key };
}
export function publicDatabase() {
  const config = supabaseConfig();
  return config
    ? createClient(config.url, config.key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (url, options) =>
            fetch(url, {
              ...options,
              signal: AbortSignal.timeout(8000),
              cache: "no-store",
            }),
        },
      })
    : null;
}
export function adminDatabase() {
  const config = supabaseConfig(),
    secret = process.env.SUPABASE_SECRET_KEY;
  return config && secret
    ? createClient(config.url, secret, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (url, options) =>
            fetch(url, {
              ...options,
              signal: AbortSignal.timeout(10000),
              cache: "no-store",
            }),
        },
      })
    : null;
}
export async function sessionClient() {
  const config = supabaseConfig();
  if (!config) return null;
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            store.set(name, value, options),
          );
        } catch {
          /* Server components rely on proxy refresh. */
        }
      },
    },
  });
}
export async function currentMember() {
  const client = await sessionClient();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getUser();
    return error ? null : data.user;
  } catch {
    return null;
  }
}
export function organizerAllowed(userId: string) {
  return (process.env.COMMUNITY_ADMIN_USER_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(userId);
}
export async function requireOrganizer() {
  const user = await currentMember();
  if (!user || !organizerAllowed(user.id)) throw new Error("Forbidden");
  return user;
}
