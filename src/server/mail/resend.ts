import type { MailConfig, MailMessage, MailResult } from "./types";
export async function sendResend(
  message: MailMessage,
  config: MailConfig & { key: string },
  request: typeof fetch = fetch,
): Promise<MailResult> {
  try {
    const response = await request("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { delivered: false, reason: "provider_error" };
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== "object" ||
      !("id" in data) ||
      typeof data.id !== "string" ||
      !data.id
    )
      return { delivered: false, reason: "provider_error" };
    return { delivered: true };
  } catch {
    return { delivered: false, reason: "provider_error" };
  }
}
