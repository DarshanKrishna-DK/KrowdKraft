import { communityEmail } from "@/data/community";
export function mailConfiguration(env: Record<string, string | undefined>) {
  const from = env.MAIL_FROM?.trim(), to = env.MAIL_TO?.trim() || communityEmail;
  if (!from || /[\r\n]/.test(from + to)) return { adapter: "unconfigured" } as const;
  if (env.RESEND_API_KEY) return { adapter: "resend", from, to, key: env.RESEND_API_KEY, ignoredSmtp: Boolean(env.SMTP_URL) } as const;
  if (env.SMTP_URL) {
    try { if (!["smtp:", "smtps:"].includes(new URL(env.SMTP_URL).protocol)) return { adapter: "unconfigured" } as const; }
    catch { return { adapter: "unconfigured" } as const; }
    return { adapter: "smtp", from, to, url: env.SMTP_URL } as const;
  }
  return { adapter: "unconfigured" } as const;
}
