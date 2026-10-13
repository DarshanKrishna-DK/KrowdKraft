import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
for (const name of ["gather", "route", "blocks", "bridge", "seat"]) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("../../figures/vendor/validate.mjs", import.meta.url)), fileURLToPath(new URL(`../../figures/hairline-${name}.html`, import.meta.url))], { stdio: "inherit", windowsHide: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
