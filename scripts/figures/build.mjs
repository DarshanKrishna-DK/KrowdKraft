import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { assemble } from "../../figures/vendor/build.mjs";
const root = new URL("../../", import.meta.url);
const names = ["gather", "route", "blocks", "bridge", "seat"];
const kernel = (await readFile(new URL("figures/vendor/kernel.js", root), "utf8")).replace(/\r\n/g, "\n");
const generated = new URL("src/generated/hairline/", root);
await mkdir(generated, { recursive: true });
// Preserve the fixed runtime byte-for-byte; the ES module export is an adapter outside it.
await writeFile(new URL("kernel.js", generated), `${kernel}\nexport { HL };\n`);
for (const name of names) {
  const figure = await readFile(new URL(`figures/${name}.js`, root), "utf8");
  await writeFile(new URL(`figures/hairline-${name}.html`, root), assemble(figure));
  await writeFile(new URL(`${name}.js`, generated), `import { HL } from './kernel.js';\nlet definition;\nfunction hairline(value) { definition = value; }\n${figure}\nexport default definition;\n`);
}
console.log(`Built ${names.length} original figures and benches. Kernel SHA-256: ${createHash("sha256").update(kernel).digest("hex")}`);
