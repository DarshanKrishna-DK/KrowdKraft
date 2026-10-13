import { communityEmail } from "@/data/community";
import { emailSchema } from "@/lib/form-schema";
export function mailConfiguration(env: Record<string, string | undefined>) {
  const from = env.MAIL_FROM?.trim(), to = env.MAIL_TO?.trim() || communityEmail;
  const sender = from?.match(/^[^<>,;@\r\n]+<([^<>]+)>$/)?.[1] || from;
  if (!from || /[\r\n]/.test(from + to) || !emailSchema.safeParse(sender).success || !emailSchema.safeParse(to).success) return { adapter: "unconfigured" } as const;
  if (env.RESEND_API_KEY) return { adapter: "resend", from, to, key: env.RESEND_API_KEY, ignoredSmtp: Boolean(env.SMTP_URL) } as const;
  if (env.SMTP_URL) {
    try { const url = new URL(env.SMTP_URL); if (!["smtp:", "smtps:"].includes(url.protocol) || !url.hostname) return { adapter: "unconfigured" } as const; }
    catch { return { adapter: "unconfigured" } as const; }
    return { adapter: "smtp", from, to, url: env.SMTP_URL } as const;
  }
  return { adapter: "unconfigured" } as const;
}
