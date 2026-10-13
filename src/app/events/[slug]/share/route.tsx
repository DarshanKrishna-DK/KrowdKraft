import { ImageResponse } from "next/og";
import { events } from "@/data/events";
import {
  formatEventDate,
  formatEventVenue,
  typeLabels,
} from "@/data/event-utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);
  if (!event) return new Response("Event not found", { status: 404 });
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "60px 72px",
        background: "#100e18",
        color: "#f4edf7",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 28,
          color: "#cfb0ef",
        }}
      >
        <span>KrowdKraft.</span>
        <span>{typeLabels[event.type]}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: event.title.length > 35 ? 62 : 78,
            lineHeight: 1.08,
            fontWeight: 700,
          }}
        >
          {event.title}
        </div>
        <div style={{ fontSize: 32, color: "#cfb0ef" }}>
          {formatEventDate(event.date)}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 27,
          borderTop: "1px solid #665573",
          paddingTop: 28,
        }}
      >
        {formatEventVenue(event)}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}
