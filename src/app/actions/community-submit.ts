"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { submissionSchema, type SubmissionReply } from "@/lib/community-schema";
import { adminDatabase } from "@/server/supabase";
import { clientKey, createRateLimiter } from "@/server/rate-limit";
const processLimiter = createRateLimiter(10);
export async function submitCommunity(
  input: unknown,
): Promise<SubmissionReply> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      reason: "validation",
      errors: parsed.error.flatten().fieldErrors,
    };
  const client = adminDatabase();
  if (!client) return { ok: false, reason: "unavailable" };
  const key = clientKey(await headers(), process.env.TRUST_PROXY === "true");
  if (!processLimiter(key)) return { ok: false, reason: "rate_limited" };
  const { kind, name, builder, email, url, description, category } =
    parsed.data;
  const submission = { kind, name, builder, email, url, description, category };
  const salt =
    process.env.SUBMISSION_HASH_SECRET || process.env.SUPABASE_SECRET_KEY!;
  const hash = (value: string) =>
    createHash("sha256").update(salt).update(value).digest("hex");
  try {
    const { data, error } = await client.rpc("kk_submit", {
      payload: submission,
      client_hash: hash(key),
      email_hash: hash(submission.email),
      submission_hash: hash(
        `${submission.kind}:${submission.email}:${submission.url.toLowerCase()}`,
      ),
    });
    if (error)
      return {
        ok: false,
        reason: error.message.includes("rate_limited")
          ? "rate_limited"
          : error.code === "23505"
            ? "duplicate"
            : "failed",
      };
    if (typeof data !== "string" || !/^[0-9a-f-]{36}$/.test(data))
      return { ok: false, reason: "failed" };
    return { ok: true, reference: data };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
