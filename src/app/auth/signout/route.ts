import { NextRequest, NextResponse } from 'next/server';
import { sessionClient, siteUrl } from '@/lib/supabase';
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== siteUrl()) return new Response('Forbidden', { status: 403 });
  const db = await sessionClient();
  const { error } = await db.auth.signOut({ scope: 'local' });
  if (error) return NextResponse.redirect(new URL('/connect?error=signout', siteUrl()), 303);
  const response = NextResponse.redirect(new URL('/', siteUrl()), 303);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
