'use server';
import { revalidatePath } from 'next/cache';
import { memberContext } from '@/lib/supabase';
import type { ActionResult } from '@/lib/types';
export async function setParticipation(_: ActionResult, form: FormData): Promise<ActionResult> {
  try {
    const { db } = await memberContext();
    const enabled = form.get('enabled') === 'true';
    const { error } = await db.rpc('workshop_set_github_participation', { enabled });
    if (error) throw error;
    revalidatePath('/connect');
    revalidatePath('/leaderboard');
    revalidatePath('/');
    return {
      ok: true,
      message: enabled
        ? 'You have joined the leaderboard. Your first public GitHub sync is queued.'
        : 'Your entry is hidden from the leaderboard.',
    };
  } catch {
    return { ok: false, message: 'We could not update participation. Reconnect GitHub and try again.' };
  }
}
export async function refreshActivity(_: ActionResult): Promise<ActionResult> {
  try {
    const { db } = await memberContext();
    const { data, error } = await db.rpc('workshop_refresh_github');
    if (error) throw error;
    revalidatePath('/connect');
    revalidatePath('/leaderboard');
    revalidatePath('/');
    if (data === 'synced') return { ok: true, message: 'Your public GitHub activity is up to date.' };
    if (data === 'queued')
      return { ok: true, message: 'Your next update is queued. Refreshes are limited to once an hour.' };
    return {
      ok: false,
      message:
        data === 'identity_changed'
          ? 'Your GitHub identity has changed. Reconnect before syncing.'
          : 'GitHub could not provide a complete update. Your last verified score is preserved; the next scheduled sync will retry.',
    };
  } catch {
    return { ok: false, message: 'The update could not complete. Please try again later.' };
  }
}
