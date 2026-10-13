import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import {
  adminDatabase,
  currentMember,
  organizerAllowed,
} from "@/server/supabase";
import { monthWindow } from "@/lib/community-schema";
import { reviewSubmission, unpublishContent } from "@/app/actions/moderation";
import { SocialLinks } from "@/components/social-links";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Organizer desk | KrowdKraft",
  robots: { index: false, follow: false },
};
const messages: Record<string, string> = {
  saved:
    "Review saved. Approved content is now published, or scheduled for its edition month.",
  invalid: "Please check the form fields.",
  failed: "That change could not be saved. It may have been reviewed already.",
  unavailable: "The database is unavailable.",
  conflict:
    "This submission already has a published entry. Refresh the organizer desk before trying again.",
  unpublished: "The entry is no longer public.",
};
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const user = await currentMember();
  if (!user || !organizerAllowed(user.id)) notFound();
  const database = adminDatabase();
  if (!database) notFound();
  const [
    { data: submissions, error },
    { data: projects },
    { data: spotlights },
  ] = await Promise.all([
    database
      .from("kk_submissions")
      .select(
        "id,kind,name,builder,email,url,description,category,created_at,socials",
      )
      .eq("status", "pending")
      .order("created_at")
      .limit(100),
    database
      .from("kk_projects")
      .select("id,name,is_published")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(100),
    database
      .from("kk_spotlights")
      .select("id,name,month,is_published")
      .eq("is_published", true)
      .order("month", { ascending: false })
      .limit(100),
  ]);
  const { notice } = await searchParams;
  return (
    <PageShell>
      <div className="container">
        <div className="page-intro">
          <p className="eyebrow">Private · Organizers only</p>
          <h1>
            The organizer <span className="serif-word">desk.</span>
          </h1>
          <p>
            Review submissions, check the original work and edit the public copy
            before publishing. Contact emails stay in this private view.
          </p>
        </div>
        {notice && messages[notice] && (
          <p role="status" className="notice">
            {messages[notice]}
          </p>
        )}
        {error ? (
          <p role="alert" className="notice">
            The submission queue couldn’t be loaded. Please try again.
          </p>
        ) : !submissions?.length ? (
          <div className="notice">No submissions are waiting for review.</div>
        ) : (
          <div className="moderation-list">
            {submissions.map((item) => (
              <article className="moderation-card" key={item.id}>
                <span className="badge">
                  {item.kind === "project"
                    ? "Product submission"
                    : "Builder nomination"}{" "}
                  · {item.created_at.slice(0, 10)}
                </span>
                <h2>{item.name}</h2>
                <p>
                  By {item.builder} · {item.category}
                </p>
                <p>
                  <a href={`mailto:${item.email}`}>{item.email}</a> ·{" "}
                  <a href={item.url} target="_blank" rel="noreferrer">
                    View submitted work ↗
                  </a>
                </p>
                <SocialLinks urls={item.socials || []} />
                <form action={reviewSubmission}>
                  <input type="hidden" name="id" value={item.id} />
                  <div className="form-grid">
                    <div className="form-field form-wide">
                      <label htmlFor={`title-${item.id}`}>Public title</label>
                      <input
                        id={`title-${item.id}`}
                        name="title"
                        defaultValue={item.name}
                        minLength={2}
                        maxLength={100}
                        required
                      />
                    </div>
                    <div className="form-field form-wide">
                      <label htmlFor={`summary-${item.id}`}>
                        Public description
                      </label>
                      <textarea
                        id={`summary-${item.id}`}
                        name="summary"
                        defaultValue={item.description}
                        minLength={30}
                        maxLength={1500}
                        rows={4}
                        required
                      />
                    </div>
                    {item.kind === "nomination" ? (
                      <div className="form-field">
                        <label htmlFor={`month-${item.id}`}>
                          Spotlight edition
                        </label>
                        <input
                          type="month"
                          id={`month-${item.id}`}
                          name="month"
                          defaultValue={monthWindow().period}
                          required
                        />
                      </div>
                    ) : (
                      <input
                        type="hidden"
                        name="month"
                        value={monthWindow().period}
                      />
                    )}
                  </div>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      name="review-confirmation"
                      required
                    />
                    <span>
                      I have reviewed the work, profile links, and attribution.
                      For a spotlight, I have verified the story and confirmed
                      publication with the builder.
                    </span>
                  </label>
                  <div className="actions">
                    <button
                      className="button primary"
                      type="submit"
                      name="decision"
                      value="approved"
                    >
                      Approve & publish
                    </button>
                    <button
                      className="button"
                      type="submit"
                      name="decision"
                      value="rejected"
                      formNoValidate
                    >
                      Reject submission
                    </button>
                  </div>
                </form>
              </article>
            ))}
          </div>
        )}
        <div className="subsection">
          <h2>Published & scheduled</h2>
          <p className="page-note">
            Unpublishing removes the entry from the public directory while
            retaining the private review record.
          </p>
          <div className="moderation-list">
            {[
              ...(projects || []).map((item) => ({
                ...item,
                kind: "project",
                month: "",
              })),
              ...(spotlights || []).map((item) => ({
                ...item,
                kind: "spotlight",
              })),
            ].map((item) => (
              <div className="published-row" key={item.id}>
                <span>
                  {item.name} {item.month && `· ${item.month}`}
                </span>
                <form action={unpublishContent}>
                  <input type="hidden" name="kind" value={item.kind} />
                  <input type="hidden" name="id" value={item.id} />
                  <button className="button" type="submit">
                    Unpublish
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
