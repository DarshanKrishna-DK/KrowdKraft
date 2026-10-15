import { NextRequest, NextResponse } from 'next/server';
import { sessionClient, siteUrl } from '@/lib/supabase';
import { safeNext } from '@/lib/validation';
import { cookies } from 'next/headers';
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const jar = await cookies();
  const next = safeNext(jar.get('kk_auth_next')?.value);
  jar.delete('kk_auth_next');
  const db = await sessionClient();
  if (code && !request.nextUrl.searchParams.has('error')) {
    const { data: exchange, error } = await db.auth.exchangeCodeForSession(code);
    if (!error) {
      // Retain only the application session. GitHub provider tokens are not needed.
      if (exchange.session) {
        const { error: sessionError } = await db.auth.setSession({
          access_token: exchange.session.access_token,
          refresh_token: exchange.session.refresh_token,
        });
        if (sessionError) return NextResponse.redirect(new URL('/connect?error=signin', siteUrl()));
      }
      const {
        data: { user },
      } = await db.auth.getUser();
      if (user) {
        // Metadata supplies project attribution only; it never grants a role or lists a participant.
        const name = String(user.user_metadata.full_name || user.user_metadata.user_name || 'Krafter')
          .trim()
          .slice(0, 80);
        const rawAvatar = String(user.user_metadata.avatar_url || '');
        const avatar = /^https:\/\/avatars\.githubusercontent\.com\//.test(rawAvatar) ? rawAvatar : null;
        const { error: profileError } = await db
          .from('workshop_profiles')
          .upsert(
            { id: user.id, name: name.length >= 2 ? name : 'Krafter', avatar_url: avatar },
            { onConflict: 'id', ignoreDuplicates: true },
          );
        const destination = profileError ? '/connect?notice=attribution' : next;
        const response = NextResponse.redirect(new URL(destination, siteUrl()));
        response.headers.set('Cache-Control', 'private, no-store');
        return response;
      }
    }
  }
  return NextResponse.redirect(new URL('/connect?error=signin', siteUrl()));
}
