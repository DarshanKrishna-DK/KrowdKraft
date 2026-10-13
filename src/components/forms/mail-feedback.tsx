import { communityEmail } from "@/data/community";
import type { SubmissionResult } from "@/server/mail/types";

export function MailFeedback({
  result,
  join = false,
}: {
  result: SubmissionResult | null;
  join?: boolean;
}) {
  if (!result) return null;
  if (result.delivered)
    return (
      <div className="mail-feedback delivered" role="status">
        {!join && (
          <div className="connection-mark" aria-hidden="true">
            <i />
            <span />
            <i />
          </div>
        )}
        <h3>{join ? "Your note is on its way." : "Connection made."}</h3>
        <p>
          {join
            ? "We've sent your interest to the team. This doesn't enroll you in a mailing list."
            : "We've received your idea. We'll take a look and get back to you."}
        </p>
      </div>
    );
  const message = {
    mail_not_configured:
      "The form is wired up, and mail isn't configured in this environment yet.",
    provider_error:
      "Your message couldn't be sent. Your details are still here, so you can try again.",
    rate_limited:
      "We've reached the submission limit for now. Try again later, or email the team directly.",
    invalid_input: "Please check the highlighted fields and try again.",
  }[result.reason];
  return (
    <div className="mail-feedback" role="alert">
      <p>{message}</p>
      <a href={`mailto:${communityEmail}`}>Email {communityEmail}</a>
    </div>
  );
}

export function notifyGuide(
  state: "sending" | "delivered" | "unconfigured" | "error",
) {
  window.dispatchEvent(new CustomEvent("krowd:mail", { detail: state }));
}
