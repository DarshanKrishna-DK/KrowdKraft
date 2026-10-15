import fs from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { brandArcadeSvg } from './arcade-branding.mjs';
// Override ANATOMY_SKILL_DIR when the global skill is installed elsewhere.
const anatomySkillDir = process.env.ANATOMY_SKILL_DIR || path.join(homedir(), '.agents', 'skills', 'anatomy');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
const community = read('details/community.json'),
  links = read('details/links.json');
const organizers = read('artifacts/research-medium/organizer-links.json').confirmed;
community.organizers = community.organizers.map((p) => {
  const found = organizers.find((x) => x.name === p.name);
  return {
    ...p,
    ...(found?.linkedin ? { linkedin: found.linkedin } : {}),
    ...(found?.x ? { x: found.x } : {}),
  };
});
community.stats = [
  { value: '1.5k+', label: 'Developers' },
  { value: '20+', label: 'Events hosted' },
  { value: '3', label: 'Hackathons' },
  { value: '5+', label: 'Event partnerships' },
];
links.instagram = 'https://www.instagram.com/krowdkraft/';
const manifest = read('artifacts/research-partners/partner-manifest.json');
for (const entry of manifest.entries) delete entry.asset.absolutePath;
fs.mkdirSync('public/partners', { recursive: true });
community.partners = manifest.entries.map((e) => {
  const filename = path.basename(e.file);
  fs.copyFileSync(
    e.asset.relativePath || path.join('artifacts/research-partners', e.file),
    'public/partners/' + filename,
  );
  return {
    id: e.id,
    name: e.name,
    alt: e.alt,
    group: e.group,
    href: e.href,
    image: '/partners/' + filename,
    light: e.id === 'dev' || (!['reva', 'msrit', 'shipwright'].includes(e.id) && !/white/i.test(e.variant)),
    width: e.asset.width,
    height: e.asset.height,
  };
});
write('details/community.json', community);
write('details/links.json', links);
write('details/partner-sources.json', manifest);
const events = read('details/events.json'),
  research = read('artifacts/research-events/events-research.json');
research.events.push(...read('artifacts/research-events/additional-events.json').events);
for (const r of research.events.filter((e) => e.posterFile)) {
  const prior = events.find((e) => e.id === r.id);
  const poster = '/events/' + r.id + '.webp';
  fs.copyFileSync(r.posterFile, 'public' + poster);
  const event = {
    ...(prior || {}),
    id: r.id,
    slug: prior?.slug || r.slug,
    title: r.title,
    description: r.description,
    date: r.date,
    startsAt: r.startsAt,
    endsAt: r.endsAt,
    venue: r.venue,
    city: r.city,
    type: r.type === 'seminar' ? 'technical-session' : r.type,
    relationship: r.relationship,
    image: poster,
    sourceUrl: r.sourceUrl,
    registrationUrl: prior?.registrationUrl || null,
    partners: r.namedOrganizations
      .filter((x) => x.name !== 'KrowdKraft' && x.name !== 'Algorand')
      .map((x) => x.name),
    featured: prior?.featured || false,
    verifiedAt: new Date().toISOString(),
  };
  if (prior) Object.assign(prior, event);
  else events.push(event);
}
const upcoming = events.find((e) => e.id === 'hacktoberfest-2026');
upcoming.partners = manifest.entries
  .filter((e) => manifest.currentHacktoberfestPartners.includes(e.id))
  .map((e) => e.name);
await sharp('artifacts/research-partners/hacktoberfest-current.png')
  .resize({ width: 1100, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile('public/events/hacktoberfest-2026.webp');
write('details/events.json', events);
const feed = read('artifacts/research-medium/feed-metadata.json');
write(
  'details/journal-history.json',
  feed.articles.map((a) => ({
    slug: 'medium-' + a.guid.split('/').pop(),
    title: a.title,
    subtitle: '',
    description: a.leadParagraphs[0].slice(0, 420),
    date: a.publishedAt.slice(0, 10),
    topic: 'From Medium',
    author: a.author,
    href: a.href,
    image: a.coverImage,
    feed_guid: a.guid,
  })),
);
const html = fs.readFileSync(
  path.join(anatomySkillDir, 'examples', 'arcade-cabinet', 'arcade-cabinet.html'),
  'utf8',
);
let svg = html.match(/<svg[^>]*class="iso-svg"[^>]*>[\s\S]*?<\/svg>/)?.[0];
if (!svg) throw new Error('Arcade SVG not found');
svg = brandArcadeSvg(svg);
svg = svg.replace(
  /aria-label="[^"]*"/,
  'aria-label="An isometric arcade cabinet, opened to reveal the circuit boards, controls and wiring behind a working project."',
);
svg = svg
  .replace(/id="([^"]+)"/g, (_, id) => 'id="arcade-' + id + '"')
  .replace(/url\(#([^)]+)\)/g, (_, id) => 'url(#arcade-' + id + ')');
const styles =
  fs.readFileSync('src/styles/anatomy.css', 'utf8') +
  fs.readFileSync(path.join(anatomySkillDir, 'examples', 'arcade-cabinet', 'arcade-cabinet.css'), 'utf8');
svg = svg
  .replace('class="iso-svg"', 'class="iso iso-svg"')
  .replace(
    '>',
    '><style>' +
      styles +
      '.iso{--anatomy-hi:#fff0f5;--anatomy-mid:#9b6e86;--anatomy-lo:#734f68;--anatomy-paper:#f2dbe4;--anatomy-face:#e7bfce;--anatomy-top:#fae8ed;--anatomy-shade-0:#a77e96;--anatomy-shade-1:#c299b0;--anatomy-shade-2:#e2bace;--anatomy-shade-3:#f4d9e4;--anatomy-lit:#fff5ee;--anatomy-lit-top:#fff2ed;--anatomy-lit-shade:#dec1cc;--anatomy-halo:#08050d}.ac-glass,.ac-glass[data-on]{fill:#332338}</style>',
  );
fs.writeFileSync('public/figures/arcade.svg', svg);
fs.copyFileSync(
  path.join(anatomySkillDir, 'examples', 'arcade-cabinet', 'arcade-cabinet.css'),
  'src/styles/arcade.css',
);
const val = (v) =>
  v == null
    ? 'null'
    : typeof v === 'boolean'
      ? String(v)
      : "'" + String(typeof v === 'object' ? JSON.stringify(v) : v).replaceAll("'", "''") + "'";
const { contentRecords } = await import('./content-records.mjs?refresh=' + Date.now());
let sql = 'begin;\n';
sql +=
  'update public.workshop_settings set links=' +
  val(links) +
  '::jsonb,organizers=' +
  val(community.organizers) +
  '::jsonb,stats=' +
  val(community.stats) +
  '::jsonb,partners=' +
  val(community.partners) +
  "::jsonb where id='community';\n";
const changed = new Set(
  research.events.filter((e) => e.posterFile).map((e) => events.find((x) => x.id === e.id).slug),
);
changed.add(upcoming.slug);
for (const event of contentRecords
  .find((c) => c.table === 'workshop_events')
  .rows.filter((e) => changed.has(e.slug))) {
  const row = { ...event, partners: event.partners };
  const fields = Object.keys(row);
  sql +=
    'insert into public.workshop_events (' +
    fields.join(',') +
    ') values (' +
    fields.map((k) => val(row[k])).join(',') +
    ') on conflict(slug) do update set ' +
    fields
      .filter((k) => k !== 'slug')
      .map((k) => k + '=excluded.' + k)
      .join(',') +
    ';\n';
}
sql += 'commit;\n';
fs.writeFileSync('artifacts/redesign-content.sql', sql);
console.log(
  JSON.stringify({
    events: events.length,
    partners: community.partners.length,
    articles: feed.itemCount,
    arcadeBytes: svg.length,
  }),
);
