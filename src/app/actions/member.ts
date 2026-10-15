'use server';
import { revalidatePath } from 'next/cache';
import { memberContext } from '@/lib/supabase';
import { projectSchema, proposalSchema } from '@/lib/validation';
import { invalid, failed } from '@/lib/action-result';
import { imageFormat, MAX_IMAGE_BYTES } from '@/lib/uploads';
import type { ActionResult } from '@/lib/types';
import { z } from 'zod';

export async function saveProject(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db, user } = await memberContext();
    const { data: profile, error: profileError } = await db
      .from('workshop_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile) throw new Error('Reconnect GitHub before submitting a project.');
    const { id, ...values } = parsed.data;
    let oldImage: string | null = null;
    if (id) {
      const { data, error } = await db
        .from('workshop_projects')
        .select('image_path,updated_at')
        .eq('id', id)
        .eq('owner_id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('This project could not be found.');
      oldImage = data.image_path;
      if (form.get('version') !== data.updated_at)
        throw new Error('This item changed in another tab. Refresh before saving.');
    }
    let newImage: string | null = null;
    const file = form.get('image');
    if (file instanceof File && file.size) {
      if (file.size > MAX_IMAGE_BYTES)
        throw new Error('The image must be a PNG, JPEG, or WebP smaller than 2 MB.');
      const bytes = new Uint8Array(await file.arrayBuffer());
      const format = imageFormat(bytes);
      if (!format || file.type !== format.type)
        throw new Error('The image must be a PNG, JPEG, or WebP smaller than 2 MB.');
      newImage = `${user.id}/${crypto.randomUUID()}.${format.extension}`;
      const { error } = await db.storage
        .from('workshop-project-images')
        .upload(newImage, bytes, { contentType: format.type, upsert: false, cacheControl: '300' });
      if (error) throw new Error('Your upload could not be saved. Please try again.');
    }
    const image_path = newImage || (form.get('remove_image') === 'on' ? null : oldImage);
    const record = { ...values, owner_id: user.id, image_path, status: 'pending' };
    const query = id
      ? db
          .from('workshop_projects')
          .update(record)
          .eq('id', id)
          .eq('owner_id', user.id)
          .eq('updated_at', String(form.get('version')))
      : db.from('workshop_projects').insert(record);
    const { data, error } = await query.select('id').maybeSingle();
    if (error || !data) {
      if (newImage) await db.storage.from('workshop-project-images').remove([newImage]);
      throw error || new Error('This item changed in another tab. Refresh before saving.');
    }
    if (oldImage && oldImage !== image_path)
      await db.storage.from('workshop-project-images').remove([oldImage]);
    revalidatePath('/share');
    revalidatePath('/collaborate');
    revalidatePath('/builds');
    revalidatePath('/admin');
    if (id) revalidatePath(`/builds/${id}`);
    return {
      ok: true,
      message:
        'Your project is saved and queued for organizer review. It will appear publicly after approval.',
    };
  } catch (error) {
    return failed(error);
  }
}
export async function withdrawProject(_: ActionResult, form: FormData): Promise<ActionResult> {
  const id = z.uuid().safeParse(form.get('id'));
  if (!id.success) return invalid(id.error);
  try {
    const { db, user } = await memberContext();
    const { data, error } = await db
      .from('workshop_projects')
      .update({ status: 'withdrawn' })
      .eq('id', id.data)
      .eq('owner_id', user.id)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('This project could not be found.');
    revalidatePath('/share');
    revalidatePath('/collaborate');
    revalidatePath('/builds');
    revalidatePath(`/builds/${id.data}`);
    revalidatePath('/admin');
    return { ok: true, message: 'Project withdrawn. You can edit and resubmit it at any time.' };
  } catch (error) {
    return failed(error);
  }
}
export async function submitProposal(_: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = proposalSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { db, user } = await memberContext();
    const { error } = await db.from('workshop_proposals').insert({ ...parsed.data, user_id: user.id });
    if (error) throw error;
    revalidatePath('/share');
    revalidatePath('/collaborate');
    revalidatePath('/admin');
    return { ok: true, message: 'Your proposal is saved for the organizers. Track its status below.' };
  } catch (error) {
    return failed(error);
  }
}
