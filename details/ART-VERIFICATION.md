# Current refinement verification

The latest 15 October refinement supersedes the earlier dark revision below. It uses Jaini headings, a visible section navigation bar, a still dotted background, pale cream pink isometric objects and the KrowdKraft arcade marquee. The ticket has restored notches/perforation, calendar header clearance, and a raised edge. Directory pages and the native project popup are complete.

[REFINEMENT-VERIFICATION.md](REFINEMENT-VERIFICATION.md) records current source decisions, checks, responsive measurements and limitations. The global motion control and falling-code background from the earlier record are removed. All 17 collaborator/institution logos load, with continuous repeating strip geometry.

## Earlier dark revision verification

The 15 October dark revision supersedes the light presentation documented below. It uses the existing Anatomy computer with automatic repeating typing and no local controls, the printer with a viewport-safe calendar card, a static adaptation of Anatomy's arcade cabinet, and three new Three.js models for Learn, Build, and Share. The Hairline figure remains available as a standalone retained artifact.

The computer/printer geometry is unchanged from the earlier audited endpoints below; the material palette and controls changed. The arcade was visually reviewed as a reused example, not subjected to a new complete geometry audit. The new Three.js scenes were visually checked on desktop and phone, including each chapter. The robot's eyes follow pointer movement and the renderer stops when offscreen or settled.

Stitch was used again to edit the existing project toward dark smoked glass. [REDESIGN-RESEARCH.md](REDESIGN-RESEARCH.md) documents the component studies, source coverage, current posters, Medium sync, verified profiles and partner assets.

Current checks: calendar card fully visible on desktop and 390px phone; menu Escape returns focus; Learn/Build/Share and Home-key selection work; latest three Medium images load; all 15 logo assets load; opposite tape directions verified; 320px home/events/connect/leaderboard/share/journal/join have no horizontal overflow. A tablet composition was reviewed around 768px. The automatic typing was observed across more than two repeats. Global pause stops the tapes and keeps the calendar choice card usable. The final production browser session reported no application errors or warnings. Reduced-motion behavior is implemented in CSS and JavaScript; an operating-system preference change was not separately emulated.

Saved current proof: dark-home-desktop.png, dark-home-phone.png, dark-about-build.png, and dark-responsive.json under artifacts/verification/. The responsive record includes measured CSS widths (browser zoom was accounted for).

## Historical light revision evidence

# Art and design verification

15 October 2026. The current visual authority is [DESIGN.md](../DESIGN.md). Screenshots are local proof under `artifacts/verification/`, which is ignored by Git. This record distinguishes visual review, static validation, and unsupported checks.

## Stitch and references

Stitch was actually used, not only named in the plan. The existing KrowdKraft project `projects/11073198068008763944` produced screen `23ab551a011f4432a2cfce1241c6ba45` and the Light Atelier design system `assets/d404d1b3276c4e86839eb8e95c0bb9dd`. The implemented site adapts its cream/glass material direction, retaining real community content and the owner's exact quote. Generated placeholder metrics and labels were not adopted.

The earlier REA study of Dwayne Koh and Cyera is preserved in [the reference plan](KROWDKRAFT-WEBSITE-DESIGN-PLAN.md). It informed the spatial index, deliberate object scale, and isometric interactions. Their application bundles are not runtime dependencies.

## Anatomy computer and printer

- Computer: MIT-licensed Anatomy desktop adapted to the KrowdKraft mark, 58 keyboard keys, local text entry, explicit power and replay. HTML controls remain usable independently of the SVG drawing. No Anthropic mark remains in the rendered figure.
- Printer: original KrowdKraft construction, 53 solid components, small paper feed, modeled housing, guides, fasteners, vents, spindle, and supports. Its ticket-side placement keeps the poster and action visible.
- Both figures use the same fixed isometric language and light material palette. They are SVG solids, not WebGL meshes; the dotted landscape is the actual Three.js scene.

Reproduction:

```sh
npm run figures
node scripts/prepare-art-check.mjs
# With the local server running, inspect:
# /figures/qa-anatomy.html?figure=computer&scale=1
# /figures/qa-anatomy.html?figure=computer&scale=4
# /figures/qa-anatomy.html?figure=printer&scale=1
# /figures/qa-anatomy.html?figure=printer&scale=4
```

The diagnostic uses the unchanged official Anatomy line-end checker from `scripts/anatomy/line-ends.mjs`. The generated diagnostic HTML is ignored and was removed before the final production build. It is development tooling, not a public product page.

| Check | Computer | Printer |
| --- | --- | --- |
| Official line checker | 82 lines, 82 checked ends, 0 reported problems | 9 lines, 16 checked ends, 0 reported problems |
| Normal-size review | Reviewed in the application and diagnostic | Reviewed in the ticket and diagnostic |
| 4x review | Screen/recesses, keyboard, feet, cable and casing reviewed | Housing, tray, fastener seating and back hinge reviewed |

The enlarged printer review found fasteners above the outer lid and a rear hinge outside its supporting cap. Their elevations and mounts were corrected, the figure regenerated, and line checks rerun with zero reported problems. Proof: `anatomy-computer-4x.png`, `anatomy-printer-4x.png`, and the corresponding `*-lines.json` files.

**Limit:** the original desktop source does not provide a geometry recorder. A complete solid-intersection/geometry audit is not certified. Zero line-end findings are not a claim of complete geometric correctness.

## Hairline pin field

Metaphor: individual contributions rise from one shared surface. It is an illustrative experiment, not an activity graph. A 7 by 7 bed of rounded pins rests on a thin isometric plate. Two soft peaks compose the idle state; pointer contact lifts a bounded Gaussian neighborhood and selects one pin. Reach changes the neighborhood from 1.5 to 4.5. The figure uses Hairline camera, spring, pointer, palette, visibility and reduced-motion behavior; no second animation engine is introduced.

Source: `figures/pin-field.js`. The build vendors the unchanged official kernel, bench, assembly, and validator in `scripts/hairline/`. It outputs the standalone `public/figures/hairline-pin-field.html` and the application adapter module. This makes a clean checkout independent of the ignored local skill directory. MIT attribution is in `public/licenses/hairline.txt`.

The construction applies Hairline rules 1, 3, 4, 5, 6, 7, 8 and 9: modeled rest state, consistent camera, plate and rounded solids, back-to-front drawing order, restrained line hierarchy, one selected detail, bounded pointer response, and contained limits. The pointer tour visits `[134,140]`, `[260,154]`, `[200,210]`, then leaves with `null`. Play is opt-in and yields to real pointer interaction.

Validation completed:

- Official static validator passed with the kernel and bench intact.
- Manual browser review of all eight required views: rest, answer, 240px rest, 240px answer, low limit, high limit, dark theme, light theme.
- Pins and plate stayed inside the SVG at both range limits; exactly one selected highlight appeared during input.
- SVG paths were unchanged across two settled observations, confirming the scene returns to rest.
- No application console errors or warnings during the figure checks; unrelated extension messages were excluded.

Proof: `hairline-rest.png`, `hairline-answer.png`, `hairline-small.png`, `hairline-small-answer.png`, `hairline-low.png`, `hairline-high.png`, `hairline-dark.png`, `hairline-light.png`. These were manual CUA bench checks, not an automated `look.mjs` run.

## Three.js and application checks

`ContributionSurface` creates a real WebGL scene with 1,681 points, an isometric lit plate, bounded pointer influence, and an SVG fallback if WebGL cannot initialize. It renders on demand, stops when settled/offscreen, observes reduced-motion changes, and disposes resources on unmount. The production page was observed with `data-rendered=true` and an actual canvas.

The cream design was reviewed in the desktop hero, raised navigation dialog, compact event ticket, community section, event directory, and project form. The computer controls fit within the observed desktop and phone viewports. Navigation Escape returns focus to its trigger; community tabs support arrow keys. Desktop and 390px phone screenshots were visually inspected. DOM layout checks at 320px and 768px found no horizontal overflow. The browser capture tool timed out on later emulated-phone screenshot exports; this is not recorded as a successful saved phone image.

The final handoff embeds a saved desktop screenshot. Other saved application proof includes `navigation-final.png`, `event-ticket-final.png`, `community-final.png`, `events-filter-final.png`, `share-final.png`, `leaderboard-live.jpg`, and `responsive-checks.json`. The leaderboard screenshot documents a temporary real opt-in; that entry was hidden again after testing.
