import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".agents/**",
    ".codex/**",
    ".artifacts/**",
    "next-env.d.ts",
    "figures/**",
    "src/generated/**",
    "test-results/**",
  ]),
]);
