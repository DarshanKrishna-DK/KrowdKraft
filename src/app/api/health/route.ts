import { publicClient } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const { error } = await publicClient()
      .from('workshop_settings')
      .select('id')
      .eq('id', 'community')
      .single();
    if (error) throw error;
    return Response.json(
      { status: 'ok', database: 'connected' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { status: 'unavailable', database: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
