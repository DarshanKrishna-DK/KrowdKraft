// One-time source adaptation. MIT source: Anatomy, Copyright (c) 2026 Ryan.
import fs from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
// Override ANATOMY_SKILL_DIR when the global skill is installed elsewhere.
const anatomySkillDir = process.env.ANATOMY_SKILL_DIR || join(homedir(), '.agents', 'skills', 'anatomy');
let source = fs.readFileSync(join(anatomySkillDir, 'examples', 'desk-computer', 'build.mjs'), 'utf8');
source = source.slice(0, source.indexOf('const PHRASES'));
source = source
  .replace('"../../kit/iso-kit.mjs"', '"./anatomy/iso-kit.mjs"')
  .replace('import { kitScript } from "../../scripts/inline-kit.mjs";', '');
source = source.replace(/  const H = 19;[\s\S]*?  const lines = \[\];/, `  const lines = [];`);
source = source.replace(
  '`<path class="pc-logo" d="${logo}"/>`',
  '`<image class="pc-logo" href="/brand/mark.png" x="-20" y="-139" width="40" height="40" preserveAspectRatio="xMidYMid meet"/>`',
);
source = source.replace('font-size="5.2">&gt; </text>', 'font-size="4.9">&gt; hello, krafters</text>');
source = source.replaceAll('the Anthropic mark', 'the KrowdKraft mark');
source += `\nwriteFileSync(join(HERE, '../public/figures/computer.svg'), svg);\nwriteFileSync(join(HERE, '../src/components/figures/computer-meta.json'), JSON.stringify({keys:keyList, midpoint:CRT_MID, textX:CRT.x0+8, down:k.iso([0,0,-1.7],P).map((n,i)=>n-k.iso([0,0,0],P)[i])}));\nconsole.log('Built branded computer:', keyList.length, 'keys');\n`;
fs.writeFileSync('scripts/build-computer.mjs', source);
console.log('Adapted the licensed computer geometry.');
