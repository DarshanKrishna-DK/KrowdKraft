import { NextRequest, NextResponse } from 'next/server';
import { sessionClient, siteUrl } from '@/lib/supabase';
import { safeNext } from '@/lib/validation';
import { cookies } from 'next/headers';
export async function GET(request: NextRequest) {
  const next = safeNext(request.nextUrl.searchParams.get('next'));
  if (process.env.GITHUB_AUTH_ENABLED !== 'true')
    return NextResponse.redirect(new URL('/connect?error=unavailable', siteUrl()));
  const callback = new URL('/auth/callback', siteUrl());
  (await cookies()).set('kk_auth_next', next, {
    httpOnly: true,
    sameSite: 'lax',
    secure: siteUrl().startsWith('https:'),
    path: '/',
    maxAge: 600,
  });
  const db = await sessionClient();
  const { data, error } = await db.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: callback.href, scopes: 'user:email', skipBrowserRedirect: true },
  });
  if (error || !data.url) return NextResponse.redirect(new URL('/connect?error=unavailable', siteUrl()));
  const response = NextResponse.redirect(data.url);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
