"use client";
import { useState, type ComponentType } from "react";
import { communityEmail } from "@/data/community";

type FormProps = { open: boolean; onClose: () => void };

/** The form and its validators load on intent; closing it preserves the draft. */
export function CollaborationForm() {
  const [Form, setForm] = useState<ComponentType<FormProps> | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  async function show() {
    if (loading) return;
    if (Form) {
      setOpen(true);
      return;
    }
    setLoading(true);
    setFailed(false);
    try {
      const { CollaborationDialog } = await import("./collaboration-form");
      setForm(() => CollaborationDialog);
      setOpen(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className="button primary"
        onClick={show}
        aria-busy={loading}
        aria-disabled={loading}
        aria-haspopup="dialog"
      >
        {loading ? "Opening form…" : "Build with the Krowd"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      {failed && (
        <p className="form-hint" role="alert">
          The form couldn’t load. Try again or{" "}
          <a href={`mailto:${communityEmail}`}>email the team</a>.
        </p>
      )}
      <noscript>
        <a href={`mailto:${communityEmail}`}>Email the team to collaborate</a>
      </noscript>
      {Form && <Form open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
