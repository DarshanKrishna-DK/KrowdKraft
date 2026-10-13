import type { MailResult } from "./types";
export async function unconfigured(): Promise<MailResult> {
  return { delivered: false, reason: "mail_not_configured" };
}
