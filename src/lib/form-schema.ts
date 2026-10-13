import { z } from "zod";
import { dateSchema, httpUrl } from "@/data/event-schema";
export const organizations = [
  "Company",
  "Developer platform",
  "Community",
  "College",
  "Student community",
  "Event",
  "Other",
] as const;
export const plans = [
  "Hackathon",
  "Meetup",
  "Workshop",
  "Technical talk",
  "Community partnership",
  "College initiative",
  "Event promotion",
  "Other",
] as const;
const short = z
  .string()
  .trim()
  .min(1, "Please fill in this field.")
  .max(160, "Use 160 characters or fewer.");
export const emailSchema = z.email("Enter a valid email address.").max(254);
export const collaborationSchema = z
  .object({
    represents: z.enum(organizations, { error: "Choose who you represent." }),
    organization: short,
    name: short,
    email: emailSchema,
    website: z.union([z.literal(""), httpUrl]),
    planning: z.enum(plans, { error: "Choose a collaboration type." }),
    proposedDate: z.union([z.literal(""), dateSchema]),
    location: z.string().trim().max(200),
    audience: z.string().trim().max(200),
    idea: z
      .string()
      .trim()
      .min(20, "Tell us a little more (at least 20 characters).")
      .max(4000),
    involvement: z
      .string()
      .trim()
      .min(10, "Tell us how we can help (at least 10 characters).")
      .max(2000),
    fax: z.string().max(0).optional(),
  })
  .strict();
export const joinSchema = z
  .object({ email: emailSchema, fax: z.string().max(0).optional() })
  .strict();
export type CollaborationInput = z.infer<typeof collaborationSchema>;
export type JoinInput = z.infer<typeof joinSchema>;
