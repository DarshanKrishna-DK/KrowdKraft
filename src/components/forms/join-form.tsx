"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { submitJoinInterest } from "@/app/actions/join-interest";
import { joinSchema, type JoinInput } from "@/lib/form-schema";
import { formResolver } from "@/lib/form-resolver";
import { MailFeedback, notifyGuide } from "./mail-feedback";
import type { SubmissionResult } from "@/server/mail/types";
import { communityEmail } from "@/data/community";

export function JoinForm() {
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const { register, handleSubmit, setFocus, formState: { errors, isSubmitting } } = useForm<JoinInput>({ resolver: formResolver(joinSchema), defaultValues: { email: "", fax: "" } });
  useEffect(() => {
    function focus() { if (location.hash === "#join") setFocus("email"); }
    window.addEventListener("hashchange", focus);
    return () => window.removeEventListener("hashchange", focus);
  }, [setFocus]);
  async function submit(values: JoinInput) {
    setResult(null); notifyGuide("sending");
    let response: SubmissionResult;
    try { response = await submitJoinInterest(values); }
    catch { response = { delivered: false, reason: "provider_error" }; }
    setResult(response);
    notifyGuide(response.delivered ? "delivered" : response.reason === "mail_not_configured" ? "unconfigured" : "error");
  }
  return <div className="join-form">
    {!result?.delivered && <form noValidate onSubmit={handleSubmit(submit)} aria-busy={isSubmitting}>
      <label htmlFor="join-email">Email me when something is happening.</label>
      <input id="join-email" type="email" required autoComplete="email" maxLength={254} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "join-email-error" : "join-email-note"} {...register("email")} />
      {errors.email && <p className="field-error" id="join-email-error">{errors.email.message}</p>}
      <div className="honeypot" aria-hidden="true"><label>Leave this empty<input {...register("fax")} tabIndex={-1} autoComplete="off" /></label></div>
      <button className="button primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending your note…" : "Join the Krowd"}<span aria-hidden="true">↗</span></button>
    </form>}
    <p className="join-note" id="join-email-note">An email to the team, not automatic mailing-list enrollment.</p>
    <MailFeedback result={result} join />
    <noscript><p>Email <a href={`mailto:${communityEmail}`}>{communityEmail}</a> to express interest.</p></noscript>
  </div>;
}
