'use server';
import { revalidatePath } from 'next/cache';
import { organizerContext } from '@/lib/supabase';
import { articleSchema, eventSchema, settingsSchema, slugSchema } from '@/lib/validation';
import { failed, invalid } from '@/lib/action-result';
import type { ActionResult } from '@/lib/types';
import { z } from 'zod';
import { imageFormat, MAX_IMAGE_BYTES } from '@/lib/uploads';

export async function saveEventContent(_: ActionResult, form: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(form);
  const time = (v: FormDataEntryValue | undefined) => (typeof v === 'string' && v ? `${v}:00+05:30` : '');
  const parsed = eventSchema.safeParse({
    ...raw,
    starts_at: time(raw.starts_at),
    ends_at: time(raw.ends_at),
    published: form.get('published') === 'on',
    featured: form.get('featured') === 'on',
  });
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db, user } = await organizerContext();
    const original = String(form.get('original_slug') || '');
    if (original && (!slugSchema.safeParse(original).success || original !== parsed.data.slug))
      throw new Error('This item changed in another tab. Refresh before saving.');
    let oldImage: string | null = null;
    if (original) {
      const { data: previous, error: previousError } = await db
        .from('workshop_events')
        .select('image,updated_at')
        .eq('slug', original)
        .maybeSingle();
      if (previousError) throw previousError;
      if (!previous || previous.updated_at !== form.get('version'))
        throw new Error('This item changed in another tab. Refresh before saving.');
      oldImage = previous.image;
    }
    let uploaded: string | null = null;
    const poster = form.get('poster');
    if (poster instanceof File && poster.size) {
      if (poster.size > MAX_IMAGE_BYTES)
        throw new Error('The image must be a PNG, JPEG, or WebP smaller than 2 MB.');
      const bytes = new Uint8Array(await poster.arrayBuffer()),
        format = imageFormat(bytes);
      if (!format || poster.type !== format.type)
        throw new Error('The image must be a PNG, JPEG, or WebP smaller than 2 MB.');
      uploaded = `${user.id}/${crypto.randomUUID()}.${format.extension}`;
      const { error } = await db.storage
        .from('workshop-event-images')
        .upload(uploaded, bytes, { contentType: format.type, upsert: false, cacheControl: '300' });
      if (error) throw new Error('Your upload could not be saved. Please try again.');
    }
    const values = {
      ...parsed.data,
      image: uploaded || parsed.data.image,
      ...(form.get('verified') === 'on' ? { verified_at: new Date().toISOString() } : {}),
    };
    const query = original
      ? db
          .from('workshop_events')
          .update(values)
          .eq('slug', original)
          .eq('updated_at', String(form.get('version')))
      : db.from('workshop_events').insert(values);
    const { data, error } = await query.select('slug').maybeSingle();
    if (error || !data) {
      if (uploaded) await db.storage.from('workshop-event-images').remove([uploaded]);
      throw error || new Error('This item changed in another tab. Refresh before saving.');
    }
    if (oldImage && !oldImage.startsWith('/') && oldImage !== values.image)
      await db.storage.from('workshop-event-images').remove([oldImage]);
    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath(`/events/${parsed.data.slug}`);
    revalidatePath('/admin');
    return {
      ok: true,
      message: values.published
        ? 'Event saved and published.'
        : 'Draft saved. It is visible only to organizers.',
    };
  } catch (error) {
    return failed(error);
  }
}
export async function saveArticle(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = articleSchema.safeParse({
    ...Object.fromEntries(form),
    published: form.get('published') === 'on',
  });
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db } = await organizerContext();
    const original = String(form.get('original_slug') || '');
    if (original && (!slugSchema.safeParse(original).success || original !== parsed.data.slug))
      throw new Error('This item changed in another tab. Refresh before saving.');
    const query = original
      ? db
          .from('workshop_articles')
          .update(parsed.data)
          .eq('slug', original)
          .eq('updated_at', String(form.get('version')))
      : db.from('workshop_articles').insert(parsed.data);
    const { data, error } = await query.select('slug').maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('This item changed in another tab. Refresh before saving.');
    revalidatePath('/');
    revalidatePath('/journal');
    revalidatePath('/admin');
    return {
      ok: true,
      message: parsed.data.published ? 'Article saved and published.' : 'Article saved as a draft.',
    };
  } catch (error) {
    return failed(error);
  }
}
export async function reviewProject(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = z
    .object({ id: z.uuid(), decision: z.enum(['approved', 'rejected']), note: z.string().trim().max(2000) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db } = await organizerContext();
    const { error } = await db.rpc('workshop_review_project', {
      project: parsed.data.id,
      decision: parsed.data.decision,
      note: parsed.data.note,
    });
    if (error) throw error;
    revalidatePath('/admin');
    revalidatePath('/builds');
    revalidatePath(`/builds/${parsed.data.id}`);
    revalidatePath('/');
    return {
      ok: true,
      message:
        parsed.data.decision === 'approved'
          ? 'Project approved and published.'
          : 'Project returned to its author with your review.',
    };
  } catch (error) {
    return failed(error);
  }
}
export async function updateProposal(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = z
    .object({ id: z.uuid(), status: z.enum(['new', 'reviewing', 'closed']) })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db } = await organizerContext();
    const { data, error } = await db
      .from('workshop_proposals')
      .update({ status: parsed.data.status })
      .eq('id', parsed.data.id)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('This item changed in another tab. Refresh before saving.');
    revalidatePath('/admin');
    revalidatePath('/share');
    revalidatePath('/collaborate');
    return { ok: true, message: 'Proposal status updated.' };
  } catch (error) {
    return failed(error);
  }
}
export async function saveSettings(_: ActionResult, form: FormData): Promise<ActionResult> {
  let organizers: unknown;
  try {
    organizers = JSON.parse(String(form.get('organizers') || '[]'));
  } catch {
    return { ok: false, message: 'Check the organizer information.' };
  }
  const links = Object.fromEntries(
    ['github', 'luma', 'linkedin', 'instagram', 'x', 'medium', 'whatsapp'].map((k) => [
      k,
      form.get(`link_${k}`),
    ]),
  );
  const parsed = settingsSchema.safeParse({ ...Object.fromEntries(form), links, organizers });
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db } = await organizerContext();
    const { data, error } = await db
      .from('workshop_settings')
      .update(parsed.data)
      .eq('id', 'community')
      .eq('updated_at', String(form.get('version')))
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('This item changed in another tab. Refresh before saving.');
    revalidatePath('/', 'layout');
    return { ok: true, message: 'Community settings saved.' };
  } catch (error) {
    return failed(error);
  }
}
