import "server-only";
import { mailConfiguration } from "./config";
import { unconfigured } from "./unconfigured";
import type { MailMessage, MailResult } from "./types";
let warnedAboutSmtp = false;
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const config = mailConfiguration(process.env);
  if (config.adapter === "unconfigured") return unconfigured();
  if (config.adapter === "resend") {
    if (config.ignoredSmtp && !warnedAboutSmtp) { console.warn("Both mail providers are configured. Resend selected; SMTP ignored."); warnedAboutSmtp = true; }
    const { sendResend } = await import("./resend");
    return sendResend(message, config);
  }
  const { sendSmtp } = await import("./smtp");
  return sendSmtp(message, config);
}
