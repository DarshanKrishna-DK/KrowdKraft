"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  projectCategories,
  submissionSchema,
  type CommunitySubmission,
  type SubmissionReply,
} from "@/lib/community-schema";
import { formResolver } from "@/lib/form-resolver";
import { submitCommunity } from "@/app/actions/community-submit";
import { communityEmail } from "@/data/community";
import { Icon } from "@/components/icon";
export function ProductSubmission({
  kind = "project",
}: {
  kind?: "project" | "nomination";
}) {
  const [result, setResult] = useState<SubmissionReply | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommunitySubmission>({
    resolver: formResolver(submissionSchema),
    defaultValues: {
      kind,
      name: "",
      builder: "",
      email: "",
      url: "",
      description: "",
      category: "Other",
      website: "",
      socials: ["", "", ""],
    },
  });
  async function submit(values: CommunitySubmission) {
    setResult(null);
    try {
      const response = await submitCommunity(values);
      setResult(response);
      window.dispatchEvent(
        new CustomEvent("krowd:mail", {
          detail: response.ok ? "delivered" : "error",
        }),
      );
    } catch {
      setResult({ ok: false, reason: "failed" });
    }
  }
  const nomination = kind === "nomination";
  const fields = [
    [
      "name",
      nomination ? "Story or achievement" : "Product name",
      "text",
      100,
      nomination ? "A first contribution, a big win…" : "What did you build?",
    ],
    ["builder", "Builder or team name", "text", 100, "Who’s behind it?"],
    ["email", "Your contact email", "email", 254, "you@example.com"],
    [
      "url",
      nomination
        ? "Link to the work or achievement"
        : "Product, demo or repository link",
      "url",
      2048,
      "https://",
    ],
  ] as const;
  const emailDraft = () => {
    const v = getValues();
    return `mailto:${communityEmail}?subject=${encodeURIComponent(`${nomination ? "Builder nomination" : "Community product"}: ${v.name || "New submission"}`)}&body=${encodeURIComponent(`Name: ${v.name}\nBuilder: ${v.builder}\nContact email: ${v.email}\nLink: ${v.url}\nCategory: ${v.category}\nPublic profiles: ${(v.socials || []).filter(Boolean).join(", ")}\n\n${v.description}`)}`;
  };
  return (
    <div className="submission-form">
      {result?.ok ? (
        <div role="status" className="form-success">
          <Icon name="check" size={34} />
          <h3 style={{ fontSize: 29, marginTop: 17 }}>In the team’s hands.</h3>
          <p style={{ marginTop: 15 }}>
            Your {nomination ? "nomination" : "product"} is saved for review. It
            won’t appear publicly until an organizer approves it.
          </p>
          <p className="page-note">Reference: {result.reference.slice(0, 8)}</p>
          <button
            className="button"
            style={{ marginTop: 22 }}
            onClick={() => {
              reset();
              setResult(null);
            }}
          >
            Submit another
          </button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(submit)}
          aria-busy={isSubmitting}
        >
          <p className="form-hint" style={{ marginBottom: 22 }}>
            Core details are required. Profile links are optional. Your email
            stays private.
          </p>
          <div className="form-grid">
            {fields.map(([name, label, type, maxLength, placeholder]) => (
              <div className="form-field" key={name}>
                <label htmlFor={`submission-${kind}-${name}`}>{label}</label>
                <input
                  id={`submission-${kind}-${name}`}
                  type={type}
                  maxLength={maxLength}
                  placeholder={placeholder}
                  required
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={
                    errors[name]
                      ? `submission-${kind}-${name}-error`
                      : undefined
                  }
                  {...register(name)}
                />
                {errors[name] && (
                  <p
                    id={`submission-${kind}-${name}-error`}
                    className="field-error"
                  >
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}
            {!nomination && (
              <div className="form-field form-wide">
                <label htmlFor="submission-category">Where does it fit?</label>
                <select id="submission-category" {...register("category")}>
                  {projectCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-field form-wide">
              <label htmlFor={`submission-${kind}-description`}>
                {nomination
                  ? "Tell us why this deserves a spotlight"
                  : "What does it do, and who is it for?"}
              </label>
              <textarea
                id={`submission-${kind}-description`}
                maxLength={1500}
                rows={5}
                required
                placeholder={
                  nomination
                    ? "The story, the effort, the impact. Help us see what makes it special."
                    : "The problem it solves, how to try it, and what kind of feedback you’d love."
                }
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                    ? `submission-${kind}-description-error`
                    : undefined
                }
                {...register("description")}
              />
              {errors.description && (
                <p
                  className="field-error"
                  id={`submission-${kind}-description-error`}
                >
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <details className="submission-social-details">
            <summary>
              Add public profile links <span>Optional, up to three</span>
            </summary>
            <p className="form-hint">
              Help people connect with the builder. These links can appear
              publicly after review. Only share profiles you have permission to
              publish.
            </p>
            {[0, 1, 2].map((index) => (
              <div className="form-field" key={index}>
                <label htmlFor={`submission-${kind}-social-${index}`}>
                  Public profile {index + 1}
                </label>
                <input
                  id={`submission-${kind}-social-${index}`}
                  type="url"
                  maxLength={2048}
                  placeholder="https://github.com/yourname"
                  {...register(`socials.${index}`)}
                  aria-invalid={Boolean(errors.socials?.[index])}
                  aria-describedby={
                    errors.socials?.[index]
                      ? `social-error-${kind}-${index}`
                      : undefined
                  }
                />
                {errors.socials?.[index] && (
                  <p
                    className="field-error"
                    id={`social-error-${kind}-${index}`}
                  >
                    {errors.socials[index]?.message}
                  </p>
                )}
              </div>
            ))}
          </details>
          <div className="honeypot" aria-hidden="true">
            <label>
              Leave this empty
              <input
                {...register("website")}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              {...register("consent")}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={
                errors.consent ? `submission-${kind}-consent-error` : undefined
              }
            />
            <span>
              I can share this work and agree to be contacted by email about
              this submission. Approved project or story details may be
              published, including any public profile links I provide.{" "}
              <Link href="/privacy">Privacy details</Link>.
            </span>
          </label>
          {errors.consent && (
            <p className="field-error" id={`submission-${kind}-consent-error`}>
              {errors.consent.message}
            </p>
          )}
          <button
            className="button primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Sending for review…"
              : nomination
                ? "Nominate this builder"
                : "Submit for review"}
            <Icon name="diagonal" size={17} />
          </button>
          {result && !result.ok && (
            <div className="form-feedback" role="alert">
              <p>
                {result.reason === "unavailable"
                  ? "Online submissions aren’t open just yet. Your details are still here. You can send the team this submission by email."
                  : result.reason === "duplicate"
                    ? "This link has already been submitted with this email. The team has it for review."
                    : result.reason === "rate_limited"
                      ? "That’s a few submissions in a short time. Please try again in an hour, or email the team."
                      : result.reason === "validation"
                        ? "Please check the fields above and try again."
                        : "We couldn’t save your submission. Your details are still here. Please try again or email the team."}
              </p>
              <a href={emailDraft()}>
                Open this submission in your email app ↗
              </a>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
