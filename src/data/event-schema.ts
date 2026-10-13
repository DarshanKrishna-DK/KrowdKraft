import { z } from "zod";

export const eventTypes = ["hackathon", "meetup", "workshop", "conference", "technical-session", "community-event", "other"] as const;
export const eventRelationships = ["hosted", "co-hosted", "community-partner", "community-support"] as const;
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Use a real calendar date");
export const httpUrl = z.url().refine((value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}, "Use an HTTP or HTTPS URL without credentials");
const localImage = z.string().regex(/^\/events\/[a-z0-9][a-z0-9._-]*\.(?:webp|avif|png|jpe?g|gif)$/i, "Use a local event image path");
export const eventSchema = z.object({
  id: z.string().trim().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(10000),
  date: dateSchema,
  endDate: dateSchema.nullable(),
  venue: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  type: z.enum(eventTypes),
  relationship: z.enum(eventRelationships),
  image: z.union([localImage, httpUrl]).nullable(),
  sourceUrl: httpUrl.nullable(),
  registrationUrl: httpUrl.nullable(),
  featured: z.boolean(),
}).strict().refine((event) => !event.endDate || event.endDate >= event.date, { message: "End date must not precede start date", path: ["endDate"] });
export const eventsSchema = z.array(eventSchema).superRefine((events, context) => {
  for (const key of ["id", "slug"] as const) {
    const seen = new Set<string>();
    events.forEach((event, index) => {
      if (seen.has(event[key])) context.addIssue({ code: "custom", message: `Duplicate ${key}`, path: [index, key] });
      seen.add(event[key]);
    });
  }
});
export type KrowdEvent = z.infer<typeof eventSchema>;
export type EventType = KrowdEvent["type"];
export type EventRelationship = KrowdEvent["relationship"];
