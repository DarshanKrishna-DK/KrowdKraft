# KrowdKraft isometric figure plan

Date: 14 October 2026. Status: researched proposal, not an approved design or implementation.

This note supports the wider reference-site study. It covers the installed Anatomy skill, the actual desktop-computer example, retained KrowdKraft facts, and the brand assets inspected. No figures, application, framework, deployment, or repository commit were created.

## Recommendation

Use one detailed interactive desktop computer as KrowdKraft's flagship illustration. It should feel like a builder's personal workbench: precise case seams, vents, screws, keyboard travel, a coiled cable, a small branded screen, and carefully grounded shadows. The brand story is a person making something and sharing it with other Krafters.

Keep the hero heading, community description, event access, and join links as ordinary readable HTML outside the illustration. The computer is an invitation to play, not a gate visitors must operate to navigate. Reuse the same visual language for two optional secondary figures rather than commissioning an entire animated city immediately.

The desktop is an explicit user-requested adaptation of the installed example. Other illustrations should be original physical objects, following Anatomy's principle that the object's working explains the idea. The retained courtyard, duck, previous palette, and old screenshots are available material, not approved directions for this replacement.

## Verified sources and constraints

- `C:/Users/darsh/.agents/skills/anatomy/SKILL.md` was read in full. It supports framework-free SVG and React integration; neither requires choosing the website framework now.
- The complete source of `examples/desk-computer/build.mjs` was inspected, along with `references/motion.md`, relevant `references/craft.md` guidance, and the installed `LICENSE`.
- `AGENTS.md`, `README.md`, `details/brief.md`, `details/community.json`, `details/links.json`, retained event and journal records, and asset provenance were read. Private `.local-data/` was not opened.
- Retained facts: KrowdKraft is a Bengaluru developer community; members are Krafters; the description emphasizes learning together, building useful things, and sharing what people make.
- Website copy should not use em dashes. Keep work local. Event and journal JSON are snapshots, not live feeds.

The example is a 600 by 440 SVG scene, described by the skill as approximately 85 solids and 850 paths. Its 58 modeled keyboard keys visibly depress when pressed. The CRT screen, logo, typing prompt, scanlines, and cursor live in the physical front-face plane, with recessed screen walls and clipping. The computer can switch off by collapsing the picture into a line and then a dot. This is SVG, not a WebGL scene.

The built example HTML files are approximately 237 KB each on disk, uncompressed. This is an example-file measurement, not an estimate of the future site's download or runtime cost. No performance benchmark or browser validation of an adaptation has yet been performed.

## Brand asset choice

Three actual files were visually inspected:

| Asset | Observed appearance | Proposed use |
| --- | --- | --- |
| `assets/logo.png` | Clean multicolor KrowdKraft mark, with curved bands and circular marks, little surrounding decoration | Best starting point for the CRT branding; preserve its recognizable shape and proportions |
| `assets/KrowdKraft_Logo.png` | Large glowing rendition over a full dark background | A possible large brand treatment; unsuitable as a raw small screen decal because its background/glow would compete with the CRT |
| `assets/brand/logo.webp` | Small glowing mark, visually closer to the elaborate rendition | Potential small raster fallback, subject to checking sharpness against the actual screen scale |

The clean PNG is about 76 KB; the large glowing PNG is about 1.53 MB; the existing WebP and AVIF brand renditions are about 10.6 KB and 7.6 KB. These are file sizes, not compressed transfer measurements. No canonical vector logo was found among the obvious retained logo files. An implementation should either embed the owned clean raster with an appropriate aspect-preserving image element or prepare a faithful vector version for review. Do not replace the mark with a generic monogram or invent a new symbol.

Keep the chassis predominantly tonal and let the screen carry the brand color. A monochrome screen-logo treatment is a possible design variant, not already approved branding. The former black/amethyst/cyan palette in the brief is historical; it should inform comparison, not constrain the new design by assumption.

## Exact desktop-computer adaptation points

Source references below point to the installed `anatomy/examples/desk-computer/build.mjs`.

| Source location | Existing behavior | Planned change |
| --- | --- | --- |
| `screen()`, lines 116-135 | Three hardcoded polygon paths construct the Anthropic mark; `H = 19` and `left/base` position it | Replace the `logo` path output with the owned KrowdKraft mark. Refit its taller silhouette in the CRT's available rectangle, keeping space for the prompt. Preserve the screen-plane transform and both recess/clip layers. |
| `.pc-logo`, line 399 | Uniform fill with `fill-rule: evenodd` | Use the appropriate image or vector styling. A full-color asset must not inherit a single fill that destroys its palette. |
| SVG `label`, line 227 | Describes the Anthropic mark | Rewrite to describe the KrowdKraft mark and the optional typing interaction. |
| `PHRASES`, line 231 | `hello, claude`, `what is a crt?`, `draw it isometric` | Suggested short lines: `hello, krafters`, `learn. build. share.`, `made in bengaluru`. These fit the existing 20-character cap. Final copy remains reviewable. |
| `MAX_CHARS`, line 237; `write()` | 20 characters; measures rendered text to move the cursor | Keep a bounded input and measure the longest supported display line. Do not increase the cap without testing clipping. |
| `setPower()` and `crtFrame()`, lines 291-323 | LED, rocker, screen expansion/collapse | Keep the physical behavior as a deliberate secondary interaction, with a visible external power button. |
| `takeOver()`, lines 356-359 | Clears the tour's line on takeover and restarts the tour after nine seconds, erasing visitor text | Stop the demonstration after a visitor takes control. Preserve their local text until they clear it or leave; provide a Replay demo button. |
| Click listener, lines 373-388 | Clicking any part of the computer case toggles power | Limit the power hit area to the rocker and/or an external button. Tapping the screen should not unexpectedly switch the illustration off. |
| Keyboard handler, lines 362-372 | Handles typing, Backspace, Enter, Escape while the group is focused | Keep scope local to the figure or its input. Tab must escape normally. Label Enter as Clear if preserving that behavior; do not imply it submits or executes a command. |
| `plateHtml`, lines 418-430 | Desk computer title, Anthropic legend/caption, technical interaction hint | Proposed title: `The Krafters desk`. Rewrite hint, legend, caption, and accessible instructions. The figure number and readout can adopt the site's editorial styling. |
| `pageHtml`, line 434 | Standalone title `Desk computer` | Use the product's document title when embedding; do not expose example metadata. |

The standalone source uses global `document.querySelector` calls. Before embedding more than one figure, scope selectors to each instance and make SVG clip IDs unique. Otherwise duplicate instances can bind to the wrong screen or clip. A React implementation should preserve static geometry outside the live component and update attributes through refs, rather than re-rendering hundreds of paths every frame.

## Interaction specification: flagship desk

The essential website links remain available in every state, including JavaScript failure.

| State | Visual behavior | Input and transition |
| --- | --- | --- |
| Static initial render | Complete chassis and KrowdKraft screen mark; short welcoming text already visible | No blocking loader or blank canvas. Interactive controls become available when their small script is ready. |
| Demonstration | A short typing sequence depresses the corresponding keys, then rests on the final phrase | Begin only when visible and motion is allowed. Pause on hover/focus. Provide Pause/Replay controls if the sequence is allowed to continue for more than a brief introduction. |
| Visitor typing | Input appears in the screen plane; the actual key animates | A labeled HTML input or clearly focused group accepts text. On mobile, a `Try the keyboard` control reveals/focuses a native input. No server submission, execution, tracking, or persistence is required for the illustration. |
| Text full | Screen remains stable at the limit | Announce the bounded input state on deliberate input, not every animation frame. Backspace and Clear remain available. |
| Power off | Ordinary mode: short CRT collapse, then an unlit screen and dim LED | Toggle through a clearly named button and optional rocker hit target. Main page navigation is unaffected. |
| Power on | Screen opens, restoring the local text or welcome text | Respect reduced motion and do not start a new endless tour. |
| Reduced motion | Stable screen, no automatic typing, cursor blink, collapse animation, hover float, or moving shadow | All controls still work; changes occur immediately. Listen for preference changes while the page is open. |
| Offscreen or hidden tab | Render loop stopped | Resume only any intentional pending interaction when visible; do not run a background tour. |
| JavaScript unavailable | Readable static figure and caption | Main content and links still function. No dead fake controls. |

The current example already includes an IntersectionObserver and reads `prefers-reduced-motion`. It still needs production integration work: its tour is not paused merely by focus/hover; preference changes do not have a dedicated reset handler; CSS fill transitions also need a reduced-motion override; and clicking the broad case is an ambiguous touch target. These are observed implementation differences, not failures verified in a running browser.

The screen should never claim a live member count, connected users, number of projects, tickets left, or deployment status. A decorative terminal prompt is not an AI chat product or a working shell.

## Original supporting figure concepts

These are proposals with meaningful functions. Select companions based on the final section plan; shipping all of them is unnecessary.

| Section | Original physical object | Purpose and exact state changes | Suggested tier |
| --- | --- | --- | --- |
| Learn, build, share | A compact maker's bench with a reading stand, a small assembly jig, and a presentation light | Three ordinary HTML tabs select Learn, Build, or Share. The active tool receives the one highlight; a book stand opens, a jig closes gently around a component, or the lamp turns toward a small display board. The adjacent real text changes with the same selected state. The other tools stay still. | Hero if all three mechanisms share one drawing; a single chosen mechanism can be a Figure |
| Events | A mechanical ticket/agenda printer with platen, feed rollers, perforated paper, cutter guard, and side handwheel | Selecting a real event advances one paper card by a short distance. The readable event title, date, state, and destination are ordinary HTML beside it. `No upcoming event` parks the printer on a truthful idle state; a closed registration never prints an available ticket. | Figure, approximately 40-80 purposeful components |
| Community projects | A small demonstration turntable with a monitor and three replaceable project placards | Previous/Next selects only submitted or verified projects. A tray shifts to the selected project; the DOM heading, description, author credit, and repository link update together. Empty data shows an invitation to share a project, without fabricated cards. Use a 2D translation rather than a live 3D rotation in the first version. | Figure; optional Hero enhancement later |
| Journal / learning notes | A document camera and reading stand, with a movable lamp arm, paper clips, sheet stack, lens ring, and power cable | Selecting an actual retained article lights its page; its title and link appear in HTML. Focus highlights the relevant sheet; Enter follows the real article link. No automatic page-flipping carousel. | Figure |
| Join / footer | Reuse the flagship desk in a quiet compact composition, with a small physical KrowdKraft badge | The screen rests on `hello, krafters`. The real Join WhatsApp / Upcoming events links sit outside it. Do not build a second heavy interactive computer instance just for the footer. | Static reuse |

For the initial website, the recommended set is the flagship desk, one events figure, and optionally one learning/journal figure. This creates a coherent collection without making every section compete for attention. Event posters, real photography, organizer names, and readable stories should carry the social proof.

The duck can appear as a small physical sticker or desk object if chosen for the new art direction. It should not become a constant cursor follower or a second unrelated illustration system. A whole Bengaluru community building with moving people, vehicles, and multiple rooms is an Epic, and should be a separately chosen future scope.

## Craft, mobile, and performance plan

1. Write the concept, real behavior, and an explicit component inventory before geometry. Preserve recognizable construction: base and feet, structural case, mechanical subject, controls, and connectors. A Figure calls for 40-80 parts; Hero 80-150. Detail must come from plausible structure rather than floating symbols.
2. Use the kit's four-tone volume, true painter's order, recess clipping, and fitted projection. Keep a consistent camera and object scale across the collection. The flagship source uses a 56-degree azimuth; test that against the final page composition rather than blindly matching unrelated perspective art.
3. Keep headline and body copy outside the drawing. Inside the screen, short text is appropriate because it belongs to the machine. Use a framed figure with a short title, interaction hint, and truthful readout where appropriate.
4. At a 390 px viewport, scale the whole figure without horizontal scrolling, then place large touch controls below it. The small illustrated keycaps are not adequate primary touch controls. Preserve `touch-action: pan-y`; no scroll-jacking or drag-to-navigate requirement.
5. Precompute static paths once. Animate transforms, opacity, and a few text attributes only; maintain one requestAnimationFrame loop per active figure. Stop it when settled, offscreen, or the document is hidden.
6. Do not add WebGL merely for atmosphere. The desktop already works in SVG. If a later lamp or material effect materially helps the idea, use the same camera, a static SVG fallback, device-pixel ratio capped at 1.5, and render only when visible and active.
7. Avoid the beta live 3D mode for the initial page. The skill reports severe degradation on its dense 380-part stress scene; that is not a measured forecast for this website, but it makes multiple live 3D subjects a poor default.
8. Prefer native button/input semantics with visible focus. Screen-reader state announcements should follow deliberate choices or phase changes, never animation frames. Keep decorative path internals out of the accessibility tree.
9. Compare desktop, 390 px mobile, touch, keyboard, reduced-motion, and static/no-JS states. Inspect the branded screen at 4x to check proportions, blur, clipping, and visible scanline density. Capture several power-transition moments, rapid reversal, and input during the demo.
10. Run the applicable Anatomy geometry and line-end checks, then inspect every generated screenshot. The current desktop source has no `--audit` handler; passing it that flag would not prove an audit. Any geometry-audit requirement needs actual recorder/audit integration before its output can count as evidence.

Performance acceptance targets should be established during implementation and measured on the integrated page. The plan is to load secondary interaction code when needed and keep most of the art static, rather than assert a frame rate or a score before testing.

## Effort and sequencing

Anatomy's planning tiers are: Figure, one mechanism with 40-80 parts; Hero, a dense 80-150-part object with an indicative 2-4-hour craft estimate; Epic, a building/vehicle/plant or multiple 3D subjects with an indicative six hours or more. The skill does not ask for a time quote on a Figure. These are illustration tiers, not a commitment for the complete website, content integration, testing, or launch.

The desktop example already sits around Hero complexity. Rebranding it is a smaller geometry task than creating a new Hero from scratch, but safe interaction adaptation, accessibility, responsive embedding, and verification remain real work.

Proposed implementation order after the overall design is chosen:

1. Create the static branded desk and show it in the approved hero layout.
2. Add typing, power, mobile controls, and reduced-motion behavior.
3. Validate it at desktop and phone sizes before adding any companion figures.
4. Build one Figure for the strongest supporting section, normally events.
5. Add a second companion only if the page still benefits from it after real content and photography are in place.
6. Keep additional mechanisms, shaders, and an Epic community scene as explicit later choices.

## License and provenance

The installed Anatomy package includes an MIT license with `Copyright (c) 2026 Ryan`. Its license text requires the copyright notice and permission notice to be included in copies or substantial portions of the software. Preserve that license alongside copied kit/example code and in any appropriate distributed third-party notices. The text does not demand a visible hero credit.

Replacing Anthropic's embedded mark and references is both necessary for the requested branding and straightforward in the inspected source. The Anatomy software license is not an asset-provenance record for unrelated brand marks or reference-site artwork. This plan uses KrowdKraft's retained logo and newly authored figures; the two reference websites should inform composition and behavior rather than supply copied artwork or brand content.

The current task authorizes analysis and a plan. No example source, logo, retained artwork, private data, or existing site files were modified in producing this note.
