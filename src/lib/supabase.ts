import 'server-only';
import { cache } from 'react';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function connection() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Database connection is not configured.');
  return { url, key };
}
const boundedFetch: typeof fetch = (url, init) =>
  fetch(url, {
    ...init,
    signal: init?.signal ?? AbortSignal.timeout(12000),
    cache: 'no-store',
  });
export function publicClient() {
  const { url, key } = connection();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: boundedFetch },
  });
}
export function siteUrl() {
  return new URL(process.env.SITE_URL || 'http://localhost:3000').origin;
}
export async function sessionClient() {
  const { url, key } = connection();
  const jar = await cookies();
  return createServerClient(url, key, {
    global: { fetch: boundedFetch },
    cookieOptions: { httpOnly: true, sameSite: 'lax', secure: siteUrl().startsWith('https:'), path: '/' },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          /* Read-only Server Components rely on the session proxy for refresh. */
        }
      },
    },
  });
}
export const currentUser = cache(async () => {
  const db = await sessionClient();
  const { data, error } = await db.auth.getUser();
  return error ? null : data.user;
});
export async function memberContext() {
  const db = await sessionClient();
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) throw new Error('Sign in to continue.');
  return { db, user: data.user };
}
export async function organizerContext() {
  const ctx = await memberContext();
  const { data, error } = await ctx.db
    .from('workshop_roles')
    .select('role')
    .eq('user_id', ctx.user.id)
    .maybeSingle();
  if (error || !data) throw new Error('Organizer access is required.');
  return ctx;
}
