import 'server-only';
import { revalidatePath } from 'next/cache';
import type { z } from 'zod';
import { activities } from '@/lib/scoring';
import { serviceClient, siteUrl } from '@/lib/supabase';
import { imageFormat, MAX_IMAGE_BYTES } from '@/lib/uploads';
import { articleSchema, eventSchema } from '@/lib/validation';
import { downloadFile } from './api';
import { articleValues, eventValues, pointValues, type Command, type FlowId } from './flows';

type Db = ReturnType<typeof serviceClient>;

const issues = (error: z.ZodError) =>
  `Not saved:\n${error.issues.map((issue) => `• ${issue.path.join('.') || 'form'}: ${issue.message}`).join('\n')}`;

async function insertWithFreeSlug<T extends { slug: string }>(db: Db, table: string, values: T) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const slug = attempt === 1 ? values.slug : `${values.slug}-${attempt}`;
    const { error } = await db.from(table).insert({ ...values, slug });
    if (!error) return slug;
    if (error.code !== '23505') throw error;
  }
  throw new Error('That page address is taken. Start again with a different one.');
}

async function uploadPoster(db: Db, fileId: string) {
  const bytes = await downloadFile(fileId);
  const format = imageFormat(bytes);
  if (!format || bytes.length > MAX_IMAGE_BYTES)
    throw new Error('The poster must be a PNG, JPEG or WebP under 2 MB.');
  const path = `${crypto.randomUUID()}/${crypto.randomUUID()}.${format.extension}`;
  const { error } = await db.storage
    .from('workshop-event-images')
    .upload(path, bytes, { contentType: format.type, upsert: false, cacheControl: '300' });
  if (error) throw new Error('The poster could not be stored.');
  return path;
}

export async function commit(flow: FlowId, data: Record<string, string>, today: string): Promise<string> {
  const db = serviceClient();
  switch (flow) {
    case 'new_event': {
      const parsed = eventSchema.safeParse(eventValues(data, today));
      if (!parsed.success) return issues(parsed.error);
      const image = data.poster ? await uploadPoster(db, data.poster) : null;
      try {
        const slug = await insertWithFreeSlug(db, 'workshop_events', { ...parsed.data, image });
        revalidatePath('/');
        revalidatePath('/events');
        revalidatePath(`/events/${slug}`);
        revalidatePath('/admin');
        return parsed.data.published
          ? `Published: ${siteUrl()}/events/${slug}`
          : `Saved as a draft. Send /publish_event ${slug} when it is ready.`;
      } catch (error) {
        if (image) await db.storage.from('workshop-event-images').remove([image]);
        throw error;
      }
    }
    case 'new_article': {
      const parsed = articleSchema.safeParse(articleValues(data));
      if (!parsed.success) return issues(parsed.error);
      await insertWithFreeSlug(db, 'workshop_articles', parsed.data);
      revalidatePath('/');
      revalidatePath('/journal');
      revalidatePath('/admin');
      return parsed.data.published ? `Blog added: ${siteUrl()}/#blogs` : 'Blog saved as a draft.';
    }
    case 'add_points': {
      const values = pointValues(data);
      const { error } = await db.from('workshop_leaderboard_entries').insert(values);
      if (error) throw error;
      revalidatePath('/');
      revalidatePath('/leaderboard');
      return `+${activities[values.kind].points} points for ${values.member}.`;
    }
    default: {
      const unhandled: never = flow;
      throw new Error(`Unknown flow ${unhandled}`);
    }
  }
}

export async function runCommand(command: Command): Promise<string> {
  const db = serviceClient();
  switch (command.name) {
    case 'recent': {
      const [events, articles, points] = await Promise.all([
        db
          .from('workshop_events')
          .select('slug,title,date,published')
          .order('date', { ascending: false })
          .limit(5),
        db
          .from('workshop_articles')
          .select('title,date,published')
          .order('date', { ascending: false })
          .limit(5),
        db
          .from('workshop_leaderboard_entries')
          .select('member,kind,date')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);
      const failed = events.error || articles.error || points.error;
      if (failed) throw failed;
      const draft = (published: boolean) => (published ? '' : ' (draft)');
      return [
        'Events',
        ...(events.data ?? []).map((e) => `• ${e.date} ${e.title}${draft(e.published)} — ${e.slug}`),
        '',
        'Blogs',
        ...(articles.data ?? []).map((a) => `• ${a.date} ${a.title}${draft(a.published)}`),
        '',
        'Points',
        ...(points.data ?? []).map(
          (p) => `• ${p.date} ${p.member}: ${activities[p.kind as keyof typeof activities]?.label ?? p.kind}`,
        ),
      ].join('\n');
    }
    case 'publish_event':
    case 'hide_event': {
      const published = command.name === 'publish_event';
      const { data, error } = await db
        .from('workshop_events')
        .update({ published })
        .eq('slug', command.slug)
        .select('slug')
        .maybeSingle();
      if (error) throw error;
      if (!data) return `No event with the address ${command.slug}. Send /recent to see them.`;
      revalidatePath('/');
      revalidatePath('/events');
      revalidatePath(`/events/${command.slug}`);
      return published ? `Live: ${siteUrl()}/events/${command.slug}` : `Hidden: ${command.slug}`;
    }
    default: {
      const unhandled: never = command;
      throw new Error(`Unknown command ${JSON.stringify(unhandled)}`);
    }
  }
}
