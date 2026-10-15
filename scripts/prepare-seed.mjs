import fs from 'node:fs';
import { contentRecords } from './content-records.mjs';
const sqlValue = (v) =>
  v == null
    ? 'null'
    : typeof v === 'boolean'
      ? String(v)
      : `'${String(typeof v === 'object' ? JSON.stringify(v) : v).replaceAll("'", "''")}'`;
const insert = (table, records, key) =>
  records
    .map(
      (row) =>
        `insert into public.${table} (${Object.keys(row).join(',')}) values (${Object.values(row).map(sqlValue).join(',')}) on conflict (${key}) do nothing;`,
    )
    .join('\n');
fs.mkdirSync('supabase/seeds', { recursive: true });
fs.writeFileSync(
  'supabase/seeds/content.sql',
  '-- Preserved content only. Existing rows and organizer permissions are never changed.\nbegin;\n' +
    contentRecords.map(({ table, key, rows }) => insert(table, rows, key)).join('\n') +
    '\ncommit;\n',
);
console.log(
  JSON.stringify(Object.fromEntries(contentRecords.map(({ table, rows }) => [table, rows.length]))),
);
