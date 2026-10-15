import 'server-only';
import { cache } from 'react';
import { publicClient } from './supabase';
import type { Community, EventRecord, ArticleRecord, Project, Profile } from './types';
export const getCommunity = cache(async (): Promise<Community> => {
  const { data, error } = await publicClient()
    .from('workshop_settings')
    .select('*')
    .eq('id', 'community')
    .single();
  if (error) throw new Error('Community information is temporarily unavailable.');
  return data;
});
export const getEvents = cache(async (): Promise<EventRecord[]> => {
  const { data, error } = await publicClient()
    .from('workshop_events')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });
  if (error) throw new Error('Events are temporarily unavailable.');
  return Promise.all((data || []).map(resolveEventImage));
});
export async function resolveEventImage(event: EventRecord): Promise<EventRecord> {
  if (!event.image || event.image.startsWith('/')) return event;
  const { data } = await publicClient()
    .storage.from('workshop-event-images')
    .createSignedUrl(event.image, 300);
  return { ...event, image: data?.signedUrl || null };
}
export const getArticles = cache(async (): Promise<ArticleRecord[]> => {
  const { data, error } = await publicClient()
    .from('workshop_articles')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false })
    .order('feed_published_at', { ascending: false, nullsFirst: false });
  if (error) throw new Error('The journal is temporarily unavailable.');
  return data || [];
});
async function projectDetails(projects: Project[]): Promise<Project[]> {
  if (!projects.length) return [];
  const db = publicClient();
  const ids = [...new Set(projects.map((p) => p.owner_id))];
  const { data: authors, error } = await db.from('workshop_profiles').select('*').in('id', ids);
  if (error) throw new Error('Project information is temporarily unavailable.');
  return Promise.all(
    projects.map(async (p) => {
      let image_url;
      if (p.image_path) {
        const { data: image } = await db.storage
          .from('workshop-project-images')
          .createSignedUrl(p.image_path, 300);
        image_url = image?.signedUrl;
      }
      return {
        ...p,
        author: ((authors || []) as Profile[]).find((a) => a.id === p.owner_id) || null,
        image_url,
      };
    }),
  );
}
export const getProjects = cache(async (page = 1): Promise<Project[]> => {
  const { data, error } = await publicClient()
    .from('workshop_projects')
    .select('*')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false })
    .order('id')
    .range((page - 1) * 24, page * 24 - 1);
  if (error) throw new Error('Projects are temporarily unavailable.');
  return projectDetails(data || []);
});
export const getProject = cache(async (id: string): Promise<Project | null> => {
  const { data, error } = await publicClient()
    .from('workshop_projects')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle();
  if (error) throw new Error('The project is temporarily unavailable.');
  return data ? (await projectDetails([data]))[0] : null;
});
export const getEvent = cache(async (slug: string): Promise<EventRecord | null> => {
  const { data, error } = await publicClient()
    .from('workshop_events')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw new Error('The event is temporarily unavailable.');
  return data ? resolveEventImage(data) : null;
});
