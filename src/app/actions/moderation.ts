"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { moderationSchema } from "@/lib/community-schema";
import { adminDatabase, requireOrganizer } from "@/server/supabase";
export async function reviewSubmission(form: FormData) {
  const user = await requireOrganizer(),
    database = adminDatabase();
  if (!database) redirect("/admin?notice=unavailable");
  const parsed = moderationSchema.safeParse({
    id: form.get("id"),
    decision: form.get("decision"),
    title: form.get("title"),
    summary: form.get("summary"),
    month: form.get("month"),
  });
  if (!parsed.success) redirect("/admin?notice=invalid");
  const value = parsed.data;
  if (value.decision === "approved" && form.get("review-confirmation") !== "on")
    redirect("/admin?notice=invalid");
  const { error } = await database.rpc("kk_review_submission", {
    target_id: value.id,
    decision: value.decision,
    display_title: value.title,
    display_summary: value.summary,
    edition_month: value.month,
    actor_id: user.id,
  });
  if (error)
    redirect(`/admin?notice=${error.code === "23505" ? "conflict" : "failed"}`);
  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/spotlight");
  revalidatePath("/admin");
  redirect("/admin?notice=saved");
}
export async function unpublishContent(form: FormData) {
  const user = await requireOrganizer();
  const database = adminDatabase();
  const kind = form.get("kind"),
    id = form.get("id");
  if (
    !database ||
    (kind !== "project" && kind !== "spotlight") ||
    typeof id !== "string" ||
    !/^[0-9a-f-]{36}$/.test(id)
  )
    redirect("/admin?notice=invalid");
  const { error } = await database.rpc("kk_unpublish", {
    target_id: id,
    content_kind: kind,
    actor_id: user.id,
  });
  if (error) redirect("/admin?notice=failed");
  revalidatePath("/");
  revalidatePath("/marketplace");
  revalidatePath("/spotlight");
  revalidatePath("/admin");
  redirect("/admin?notice=unpublished");
}
