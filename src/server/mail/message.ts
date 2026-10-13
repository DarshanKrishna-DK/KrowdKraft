import type { CollaborationInput } from "@/lib/form-schema";
import type { MailMessage } from "./types";
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}
function message(
  subject: string,
  email: string,
  fields: [string, string][],
): MailMessage {
  return {
    subject,
    replyTo: email,
    text: fields
      .map(([label, value]) => `${label}: ${value || "Not supplied"}`)
      .join("\n\n"),
    html: fields
      .map(
        ([label, value]) =>
          `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value || "Not supplied").replace(/\n/g, "<br>")}</p>`,
      )
      .join(""),
  };
}
export function collaborationMessage(input: CollaborationInput): MailMessage {
  return message("KrowdKraft collaboration request", input.email, [
    ["Represents", input.represents],
    ["Organization", input.organization],
    ["Name", input.name],
    ["Email", input.email],
    ["Website", input.website],
    ["Planning", input.planning],
    ["Proposed date", input.proposedDate],
    ["Location", input.location],
    ["Expected audience", input.audience],
    ["Idea", input.idea],
    ["KrowdKraft involvement", input.involvement],
  ]);
}
