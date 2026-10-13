import { readFileSync, writeFileSync } from "node:fs";
// Keep the Hairline kernel byte-for-byte unchanged; only the figure is ours.
const kernel = readFileSync("public/art/hairline/kernel.js", "utf8");
const figure = readFileSync("figures/builder.js", "utf8");
writeFileSync(
  "public/art/hairline/builder-runtime.js",
  `${kernel}\n(() => {\nfunction hairline(figure) { window.krowdBuilder = figure; }\n${figure}\n})();\n`,
);
