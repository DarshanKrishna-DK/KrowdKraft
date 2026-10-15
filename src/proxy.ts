import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function proxy(request: NextRequest) {
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
