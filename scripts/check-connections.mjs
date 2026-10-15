import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Configure the Supabase URL and publishable key in .env.local.');
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) }) },
});
const report = {
  project: new URL(url).hostname.split('.')[0],
  tables: {},
  githubProvider: false,
  privateRecordsHidden: false,
};
for (const table of ['workshop_settings', 'workshop_events', 'workshop_articles', 'workshop_projects']) {
  const { error, count } = await db.from(table).select('*', { head: true, count: 'exact' });
  if (error) throw new Error(`${table}: database check failed (${error.code})`);
  report.tables[table] = count;
}
const response = await fetch(`${url}/auth/v1/settings`, {
  headers: { apikey: key },
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) throw new Error('Auth configuration is unavailable.');
report.githubProvider = (await response.json()).external?.github === true;
const { data, error } = await db.from('workshop_proposals').select('id').limit(1);
report.privateRecordsHidden = !!error || data?.length === 0;
console.log(JSON.stringify(report, null, 2));
if (!report.githubProvider || !report.privateRecordsHidden) process.exitCode = 1;
