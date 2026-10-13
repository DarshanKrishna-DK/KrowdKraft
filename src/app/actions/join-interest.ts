"use server";
import { headers } from "next/headers";
import { joinSchema } from "@/lib/form-schema";
import { sendMail } from "@/server/mail/send";
import { joinMessage } from "@/server/mail/message";
import { allowSubmission, allowGlobalSubmission, clientKey } from "@/server/rate-limit";
import type { SubmissionResult } from "@/server/mail/types";
export async function submitJoinInterest(input: unknown): Promise<SubmissionResult> {
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) return { delivered: false, reason: "invalid_input", errors: parsed.error.flatten().fieldErrors };
  const key = clientKey(await headers(), process.env.TRUST_PROXY === "true");
  if (!allowSubmission(key) || !allowGlobalSubmission("all")) return { delivered: false, reason: "rate_limited" };
  return sendMail(joinMessage(parsed.data.email));
}
