import { events } from "@/data/events";
import { eventCalendar } from "@/lib/calendar";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params,
    event = events.find((item) => item.slug === slug);
  if (!event) return new Response("Event not found", { status: 404 });
  return new Response(eventCalendar(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
