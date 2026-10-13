export type MailMessage = {
  subject: string;
  replyTo: string;
  text: string;
  html: string;
};
export type MailResult =
  | { delivered: true }
  | { delivered: false; reason: "mail_not_configured" | "provider_error" };
export type SubmissionResult =
  | MailResult
  | {
      delivered: false;
      reason: "invalid_input" | "rate_limited";
      errors?: Record<string, string[]>;
    };
export type MailConfig = { from: string; to: string };
