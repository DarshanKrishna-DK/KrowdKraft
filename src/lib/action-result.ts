import type { ZodError } from 'zod';
import type { ActionResult } from './types';
export function invalid(error: ZodError): ActionResult {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] || 'form');
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { ok: false, message: 'Check the highlighted fields and try again.', fieldErrors };
}
export function failed(error: unknown): ActionResult {
  const e = error as { message?: string; code?: string };
  if (e.code === '23505')
    return { ok: false, message: 'This item already exists. Open the existing record to edit it.' };
  if (e.message?.includes('Daily submission limit'))
    return {
      ok: false,
      message: 'You have reached today’s limit of five submissions. Please try again tomorrow.',
    };
  const allowed = [
    'Sign in to continue.',
    'Organizer access is required.',
    'This item changed in another tab. Refresh before saving.',
    'This submission has already changed. Refresh the queue.',
    'The image must be a PNG, JPEG, or WebP smaller than 2 MB.',
    'Reconnect GitHub before submitting a project.',
    'This project could not be found.',
    'Your upload could not be saved. Please try again.',
  ];
  if (e.message && allowed.includes(e.message)) return { ok: false, message: e.message };
  console.error('KrowdKraft action failed', { code: e.code || 'unavailable' });
  return { ok: false, message: 'We could not save this change. Please try again. Your form is still here.' };
}
