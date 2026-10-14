import "server-only";
import { adminDatabase, publicDatabase } from "./supabase";
import type { Activity } from "@/lib/community-schema";
export type Product = {
  id: string;
  name: string;
  builder: string;
  description: string;
  url: string;
  category: string;
  published_at: string;
};
export type Spotlight = {
  id: string;
  name: string;
  builder: string;
  description: string;
  url: string;
  month: string;
};
export type PublicMember = {
  github_login: string;
  display_name: string;
  avatar_url: string;
  activity: Activity | null;
  activity_month: string | null;
  activity_partial: boolean;
  synced_at: string | null;
};
export async function communityContent<T>(
  table: "kk_projects" | "kk_spotlights" | "kk_members",
  columns: string,
  order: string,
): Promise<{ records: T[]; available: boolean; configured: boolean }> {
  const client = publicDatabase();
  if (!client) return { records: [], available: false, configured: false };
  try {
    const { data, error } = await client
      .from(table)
      .select(columns)
      .order(order, { ascending: false })
      .limit(100);
    return error
      ? { records: [], available: false, configured: true }
      : { records: data as T[], available: true, configured: true };
  } catch {
    return { records: [], available: false, configured: true };
  }
}
export const getProducts = () =>
  communityContent<Product>(
    "kk_projects",
    "id,name,builder,description,url,category,published_at",
    "published_at",
  );
export const getSpotlights = () =>
  communityContent<Spotlight>(
    "kk_spotlights",
    "id,name,builder,description,url,month",
    "month",
  );
export const getPublicMembers = () =>
  communityContent<PublicMember>(
    "kk_members",
    "github_login,display_name,avatar_url,activity,activity_month,activity_partial,synced_at",
    "synced_at",
  );
export async function getOwnProfile(userId: string) {
  const client = adminDatabase();
  if (!client) return null;
  const { data } = await client
    .from("kk_members")
    .select(
      "github_login,display_name,avatar_url,is_public,activity,activity_month,synced_at",
    )
    .eq("id", userId)
    .maybeSingle();
  return data;
}
