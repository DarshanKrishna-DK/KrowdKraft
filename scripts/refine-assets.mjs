import fs from 'node:fs';
const palette =
  '.iso{--anatomy-hi:#fff0f5;--anatomy-mid:#9b6e86;--anatomy-lo:#734f68;--anatomy-paper:#f2dbe4;--anatomy-face:#e7bfce;--anatomy-top:#fae8ed;--anatomy-shade-0:#a77e96;--anatomy-shade-1:#c299b0;--anatomy-shade-2:#e2bace;--anatomy-shade-3:#f4d9e4;--anatomy-lit:#fff5ee;--anatomy-lit-top:#fff2ed;--anatomy-lit-shade:#dec1cc;--anatomy-halo:#08050d}.ac-glass,.ac-glass[data-on]{fill:#332338}';
for (const file of ['public/figures/arcade.svg', 'scripts/import-redesign-research.mjs']) {
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace(/\.iso\{--anatomy-hi:#ead5e0;[^}]+\}/, palette);
  fs.writeFileSync(file, source);
}
const provenance = JSON.parse(fs.readFileSync('details/REFINEMENT-ASSETS.json', 'utf8'));
const community = JSON.parse(fs.readFileSync('details/community.json', 'utf8'));
const fields = ['id', 'name', 'alt', 'group', 'href', 'image', 'width', 'height', 'light'];
const records = provenance.partners.map((p) => Object.fromEntries(fields.map((key) => [key, p[key]])));
for (const record of records) {
  const index = community.partners.findIndex((p) => p.id === record.id);
  if (index === -1) community.partners.push(record);
  else community.partners[index] = record;
}
fs.writeFileSync('details/community.json', JSON.stringify(community, null, 2) + '\n');
const quote = (s) => "'" + s.replaceAll("'", "''") + "'";
fs.mkdirSync('artifacts/revision-assets', { recursive: true });
fs.writeFileSync(
  'artifacts/revision-assets/partners.sql',
  "update public.workshop_settings set partners = (select jsonb_agg(p) from jsonb_array_elements(partners) p where p->>'id' not in ('women-in-product-india','ai-dev-circle')) || " +
    quote(JSON.stringify(records)) +
    "::jsonb where id = 'community';\n",
);
let style = fs.readFileSync('src/styles/atelier.css', 'utf8');
style = style.replace(/@font-face\s*\{[^}]+\}\s*/, '').replaceAll('Yatra,', 'var(--font-display),');
style = style.replace(/\.code-rain\s*\{[^}]+\}/g, '').replace(/\.motion-toggle\s*\{[^}]+\}/g, '');
fs.writeFileSync('src/styles/atelier.css', style);
console.log(JSON.stringify({ partners: community.partners.length, arcadePalette: 'cream pink' }));
