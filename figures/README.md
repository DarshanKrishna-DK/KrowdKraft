# Original KrowdKraft figures

`gather`, `route`, `blocks`, `bridge` and `seat` are original drawings. No stock Hairline figure is imported. Each source has one bounded interaction and uses the unmodified Hairline kernel. `vendor/` contains the fixed runtime, bench, builder, validator and visual-check tools from the installed `hairline-create` skill, under Lucas Marques's MIT license.

`npm run figures:build` recreates the five standalone `figures/hairline-<name>.html` benches and the browser modules. These generated copies are kept locally and ignored by Git so reviews focus on the original source and one immutable runtime. The app's dev, build and typecheck scripts generate them automatically. No runtime code evaluation or iframe is used.

Static check: `node figures/vendor/validate.mjs figures/hairline-gather.html`.
All five: `npm run figures:validate` (also run in CI).

From `figures/`, run visual checks:

```
node vendor/look.mjs gather.js --answer 16.5,-24,12 --edge 24,14,12
node vendor/look.mjs route.js --answer 37,0,28 --edge 37,31,28
node vendor/look.mjs blocks.js --answer 4,3,52 --edge 31,15,20
node vendor/look.mjs bridge.js --answer 0,0,10 --edge 19,0,10
node vendor/look.mjs seat.js --answer 63,-25,21 --edge 37,0,21
```

Read `vendor/look.md` and inspect the resulting eight-state contact sheets, including thumbnail, dark/light, range extremes and motion sheets. A local Chrome or Playwright Chromium is required. The visual tool installs `playwright-core` in its user cache once.

The production wrapper uses intensity 0.45, mounts within 180 px of the viewport, destroys distant figures, and omits all but gather below 720 px. Gather gets one tour per page visit; reduced motion disables that tour. Figures are decorative and never own scrolling or keyboard navigation. One selected item moves in route/blocks; one short link grows in gather. Their changed-ink percentage is deliberately below the tool's whole-scene threshold because the brief requires a local response with stationary neighbours.

Visual review, 13 October 2026: all five eight-state sheets inspected. Rest silhouettes, rounded edges, occlusion, single highlights, both themes and frame margins pass. Rest coverage: gather 38%, route 36%, blocks 41%, bridge 40%, seat 31%. Every scene settles, reads the selected target correctly and has a clean browser console. The interaction is intentionally local; changed-ink warnings are accepted for these concepts. The bridge motion sheet shows no crossing or fold. The tours remain defined in each source, ending with a leave; their narrative has not been user-reviewed.
