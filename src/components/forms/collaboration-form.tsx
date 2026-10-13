"use client";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/dialog";
import { submitCollaboration } from "@/app/actions/collaborate";
import {
  collaborationSchema,
  organizations,
  plans,
  type CollaborationInput,
} from "@/lib/form-schema";
import { formResolver } from "@/lib/form-resolver";
import { MailFeedback, notifyGuide } from "./mail-feedback";
import type { SubmissionResult } from "@/server/mail/types";

const fields = [
  ["organization", "Organization name", "text", true, 160, "organization"],
  ["name", "Your name", "text", true, 160, "name"],
  ["email", "Email", "email", true, 254, "email"],
  ["website", "Relevant website or link", "url", false, 2048, "url"],
  ["proposedDate", "Proposed date", "date", false, 10, "off"],
  ["location", "Location", "text", false, 200, "off"],
  ["audience", "Expected audience", "text", false, 200, "off"],
  ["idea", "Tell us about the idea", "textarea", true, 4000, "off"],
  [
    "involvement",
    "How would you like KrowdKraft involved?",
    "textarea",
    true,
    2000,
    "off",
  ],
] as const;

export function CollaborationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CollaborationInput>({
    resolver: formResolver(collaborationSchema),
    defaultValues: {
      organization: "",
      name: "",
      email: "",
      website: "",
      proposedDate: "",
      location: "",
      audience: "",
      idea: "",
      involvement: "",
      fax: "",
    },
  });
  async function submit(values: CollaborationInput) {
    setResult(null);
    notifyGuide("sending");
    let response: SubmissionResult;
    try {
      response = await submitCollaboration(values);
    } catch {
      response = { delivered: false, reason: "provider_error" };
    }
    setResult(response);
    if (!response.delivered && response.reason === "invalid_input") {
      for (const [key, messages] of Object.entries(response.errors ?? {}))
        setError(key as keyof CollaborationInput, { message: messages[0] });
    }
    notifyGuide(
      response.delivered
        ? "delivered"
        : response.reason === "mail_not_configured"
          ? "unconfigured"
          : "error",
    );
  }
  function select(
    name: "represents" | "planning",
    label: string,
    options: readonly string[],
  ) {
    return (
      <div className="form-field" key={name}>
        <label htmlFor={`collab-${name}`}>
          {label} <span aria-hidden="true">*</span>
        </label>
        <select
          id={`collab-${name}`}
          required
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          {...register(name)}
          defaultValue=""
        >
          <option value="" disabled>
            Choose one
          </option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {errors[name] && (
          <p className="field-error" id={`error-${name}`}>
            {errors[name]?.message}
          </p>
        )}
      </div>
    );
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      titleId="collaboration-form-title"
      className="collaboration-dialog"
    >
      <p className="eyebrow">A good idea starts a conversation</p>
      <h2 id="collaboration-form-title">Build with the Krowd.</h2>
      {!result?.delivered && (
        <form
          noValidate
          onSubmit={handleSubmit(submit)}
          aria-busy={isSubmitting}
        >
          <p className="form-hint">
            Tell us what you have in mind. Fields marked * are required.
          </p>
          <div className="form-grid">
            {select("represents", "I represent a", organizations)}
            {fields.map(
              (
                [name, label, type, required, maxLength, autoComplete],
                index,
              ) => (
                <Fragment key={name}>
                  {index === 4 &&
                    select("planning", "What are you planning?", plans)}
                  <div
                    className={
                      type === "textarea"
                        ? "form-field form-wide"
                        : "form-field"
                    }
                  >
                    <label htmlFor={`collab-${name}`}>
                      {label}
                      {required ? (
                        <span aria-hidden="true"> *</span>
                      ) : (
                        <span className="optional"> (optional)</span>
                      )}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        id={`collab-${name}`}
                        rows={4}
                        required
                        maxLength={maxLength}
                        aria-invalid={Boolean(errors[name])}
                        aria-describedby={
                          errors[name] ? `error-${name}` : undefined
                        }
                        {...register(name)}
                      />
                    ) : (
                      <input
                        id={`collab-${name}`}
                        type={type}
                        required={required}
                        maxLength={maxLength}
                        autoComplete={autoComplete}
                        aria-invalid={Boolean(errors[name])}
                        aria-describedby={
                          errors[name] ? `error-${name}` : undefined
                        }
                        {...register(name)}
                      />
                    )}
                    {errors[name] && (
                      <p className="field-error" id={`error-${name}`}>
                        {errors[name]?.message}
                      </p>
                    )}
                  </div>
                </Fragment>
              ),
            )}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label>
              Leave this empty
              <input {...register("fax")} tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <button
            className="button primary form-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending your idea…" : "Send collaboration request"}
          </button>
          <p className="form-hint">
            This sends an email to the KrowdKraft team.
          </p>
        </form>
      )}
      <MailFeedback result={result} />
    </Dialog>
  );
}
