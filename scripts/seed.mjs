import { createClient } from '@supabase/supabase-js';
import { contentRecords } from './content-records.mjs';
if (!process.env.SUPABASE_SECRET_KEY)
  throw new Error(
    'Set the server-only SUPABASE_SECRET_KEY to run this seed. The versioned SQL seed can also be applied from the Supabase SQL editor.',
  );
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});
for (const { table, key, rows } of contentRecords) {
  const { error } = await db.from(table).upsert(rows, { onConflict: key, ignoreDuplicates: true });
  if (error)
    throw new Error(
      `${table}: seed failed (${error.code}). Existing records were preserved; rerun after resolving the error.`,
    );
  console.log(`${table}: ${rows.length} seed records checked; existing records preserved.`);
}
