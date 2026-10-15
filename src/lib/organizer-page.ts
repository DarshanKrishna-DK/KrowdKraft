import 'server-only';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { currentUser, sessionClient } from './supabase';

// Layouts and pages can render concurrently. Each entry checks access and uses
// the same navigation boundary, without logging ordinary anonymous visits as errors.
export const organizerPageContext = cache(async () => {
  const user = await currentUser();
  if (!user) redirect('/connect?next=%2Fadmin');
  const db = await sessionClient();
  const { data, error } = await db.from('workshop_roles').select('role').eq('user_id', user.id).maybeSingle();
  if (error) throw new Error('Organizer access could not be checked.');
  if (!data) notFound();
  return { db, user };
});
