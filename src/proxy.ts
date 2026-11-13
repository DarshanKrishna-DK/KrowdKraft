import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { officialEventUrl } from '@/lib/events';
import { isShareCrawlerUa } from '@/lib/share-crawler';
import type { EventRecord } from '@/lib/types';

async function publicRow(table: string, slug: string, select: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const response = await fetch(
    `${url}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=${select}&limit=1`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as unknown[];
  return rows[0] ?? null;
}

async function shareRedirect(request: NextRequest) {
  if (isShareCrawlerUa(request.headers.get('user-agent') ?? '')) return null;
  const event = request.nextUrl.pathname.match(/^\/events\/([^/]+)$/);
  const article = request.nextUrl.pathname.match(/^\/journal\/([^/]+)$/);
  const slug = decodeURIComponent((event || article)?.[1] ?? '');
  if (!slug || slug === 'opengraph-image') return null;
  try {
    if (event) {
      const row = await publicRow('workshop_events', slug, 'source_url,registration_url');
      return row ? NextResponse.redirect(officialEventUrl(row as EventRecord)) : null;
    }
    const row = (await publicRow('workshop_articles', slug, 'href')) as { href?: string } | null;
    return row?.href ? NextResponse.redirect(row.href) : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const redirected = await shareRedirect(request);
  if (redirected) return redirected;
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const dev = process.env.NODE_ENV === 'development';
  const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co https://avatars.githubusercontent.com https://cdn-images-1.medium.com https://cdn-images-2.medium.com; font-src 'self'; connect-src 'self' https://*.supabase.co${dev ? ' ws:' : ''}; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key && request.cookies.getAll().some((c) => c.name.startsWith('sb-'))) {
    const db = createServerClient(url, key, {
      global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(12000) }) },
      cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: request.nextUrl.protocol === 'https:',
        path: '/',
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values, headers) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          requestHeaders.set('cookie', request.headers.get('cookie') || '');
          response = NextResponse.next({ request: { headers: requestHeaders } });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          if (headers) Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
        },
      },
    });
    try {
      await db.auth.getClaims();
    } catch {
      /* Each protected action and page still verifies the user and database role. */
    }
  }
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|brand/|events/.*\\.webp|fonts/|figures/|licenses/|robots.txt|sitemap.xml).*)',
  ],
};
