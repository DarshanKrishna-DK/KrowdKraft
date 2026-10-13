import { z } from "zod";
export const projectCategories = [
  "Developer tools",
  "AI & agents",
  "Open source",
  "Web & mobile",
  "Learning",
  "Other",
] as const;
export const publicUrl = z
  .url()
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      url.hostname.includes(".") &&
      !/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[)/i.test(
        url.hostname,
      )
    );
  }, "Use a public HTTPS link without credentials.");
export const submissionSchema = z
  .object({
    kind: z.enum(["project", "nomination"]),
    name: z.string().trim().min(2, "Give this a name.").max(100),
    builder: z.string().trim().min(2, "Add the builder or team name.").max(100),
    email: z
      .email("Enter a valid email address.")
      .trim()
      .toLowerCase()
      .max(254),
    url: publicUrl,
    description: z
      .string()
      .trim()
      .min(30, "Tell us a little more (at least 30 characters).")
      .max(1500),
    category: z.enum(projectCategories),
    consent: z.literal(true, {
      error: "Please agree so we can review your submission.",
    }),
    website: z.string().max(0, "Leave the extra field empty."),
  })
  .strict();
export type CommunitySubmission = z.infer<typeof submissionSchema>;
export type SubmissionReply =
  | { ok: true; reference: string }
  | {
      ok: false;
      reason:
        | "validation"
        | "unavailable"
        | "rate_limited"
        | "duplicate"
        | "failed";
      errors?: Record<string, string[]>;
    };
export const moderationSchema = z
  .object({
    id: z.uuid(),
    decision: z.enum(["approved", "rejected"]),
    title: z.string().trim().min(2).max(100),
    summary: z.string().trim().min(30).max(1500),
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  })
  .strict();
export function safeGithubLogin(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(value)
  );
}
export function monthWindow(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return {
    period: start.toISOString().slice(0, 7),
    from: start.toISOString(),
    to: now.toISOString(),
  };
}
export type Activity = {
  pushes: number;
  pullRequests: number;
  reviews: number;
  issues: number;
  total: number;
};
export function activityScore(counts: Omit<Activity, "total">): Activity {
  for (const value of Object.values(counts))
    if (!Number.isInteger(value) || value < 0)
      throw new Error("Invalid contribution count");
  return {
    ...counts,
    total: counts.pushes + counts.pullRequests + counts.reviews + counts.issues,
  };
}
