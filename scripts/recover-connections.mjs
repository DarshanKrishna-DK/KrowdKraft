import { writeFileSync } from 'node:fs';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url?.includes('qbmvzxucumzwvrizgbiy.supabase.co') || !key)
  throw new Error('Recovered project does not match KrowdKraft.');
const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
if (!response.ok) throw new Error(`Auth settings check failed: ${response.status}`);
const settings = await response.json();
const env = {
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || '',
  COMMUNITY_ADMIN_USER_IDS: process.env.COMMUNITY_ADMIN_USER_IDS || '',
  SITE_URL: 'http://localhost:3000',
  GITHUB_AUTH_ENABLED: String(settings.external?.github === true),
  KROWDKRAFT_CONTENT_MODE: 'database',
};
writeFileSync(
  '.env.local',
  Object.entries(env)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join('\n') + '\n',
);
console.log(
  JSON.stringify({
    project: 'KrowdKraft Community',
    githubEnabled: settings.external?.github === true,
    hasServerKey: !!env.SUPABASE_SECRET_KEY,
    organizerIdsConfigured: !!env.COMMUNITY_ADMIN_USER_IDS,
  }),
);
