import fs from 'node:fs/promises';
import { LINE_ENDS } from './anatomy/line-ends.mjs';
const styles = (
  await Promise.all(
    ['anatomy', 'globals', 'forms', 'atelier'].map((n) => fs.readFile('src/styles/' + n + '.css', 'utf8')),
  )
).join('\n');
const computer = await fs.readFile('public/figures/computer.svg', 'utf8');
const printer = await fs.readFile('public/figures/printer.svg', 'utf8');
await fs.writeFile(
  'public/figures/qa-anatomy.html',
  `<!doctype html><html><meta charset="utf-8"><title>Local Anatomy verification</title><style>${styles}\nbody{padding:20px}#art{width:600px;margin:20px}#art .iso-svg{width:100%;max-height:none}pre{white-space:pre-wrap;font-size:12px}#art .computer-art,#art .printer-art{width:100%;filter:none}</style><h1 style="font-size:25px">Anatomy line verification</h1><pre id="report">Checking…</pre><div id="art"></div><template id="computer"><div class="iso computer-art">${computer}</div></template><template id="printer"><div class="iso printer-art">${printer}</div></template><script>const args=new URLSearchParams(location.search);const figure=args.get('figure')==='printer'?'printer':'computer';document.querySelector('#art').append(document.querySelector('#'+figure).content.cloneNode(true));document.querySelector('#art').style.width=(600*(args.get('scale')==='4'?4:1))+'px';addEventListener('load',()=>{const result=(${LINE_ENDS})({select:'#art',show:true});document.querySelector('#report').textContent=JSON.stringify(result,null,2);});</script></html>`,
);
console.log('Local diagnostic: /figures/qa-anatomy.html?figure=computer (or printer), optionally &scale=4');
