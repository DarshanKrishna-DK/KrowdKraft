import { getEvent } from '@/lib/data';
import { calendar } from '@/lib/events';
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const event = await getEvent((await params).slug);
  if (!event) return new Response('Event not found', { status: 404 });
  return new Response(calendar(event), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
      'Cache-Control': 'no-store',
    },
  });
}
