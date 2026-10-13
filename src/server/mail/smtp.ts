import nodemailer from "nodemailer";
import type { MailConfig, MailMessage, MailResult } from "./types";
export async function sendSmtp(message: MailMessage, config: MailConfig & { url: string }): Promise<MailResult> {
  const options = {
    url: config.url,
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 10000,
    dnsTimeout: 10000, requireTLS: true, ignoreTLS: false, opportunisticTLS: false,
    tls: { rejectUnauthorized: true },
    disableFileAccess: true, disableUrlAccess: true,
  };
  const transport = nodemailer.createTransport(options);
  try {
    const result = await transport.sendMail({ from: config.from, to: config.to, replyTo: message.replyTo, subject: message.subject, text: message.text, html: message.html });
    return result.accepted.length > 0 && result.rejected.length === 0 ? { delivered: true } : { delivered: false, reason: "provider_error" };
  } catch { return { delivered: false, reason: "provider_error" }; }
  finally { transport.close(); }
}
