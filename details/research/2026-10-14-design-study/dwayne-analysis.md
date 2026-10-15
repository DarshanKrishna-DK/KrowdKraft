# Dwayne Koh / The Lantern House: reference analysis

Date: 2026-10-14. Public reference: https://www.dwaynekoh.com/. Planning and public browser/source inspection only. No KrowdKraft application was built.

## Conclusion for KrowdKraft

Borrow the idea of a memorable place with meaningful objects, a small set of visible navigation controls, and a conventional content index. The strongest adaptation is a KrowdKraft maker's studio or community workbench, with the KrowdKraft mark on a desktop monitor, rather than a replica of the Japanese pavilion. Use the visual world to introduce community activities; make events, joining, and factual community information immediately available as HTML.

The reference home is **not a scrolling landing page**. It is an orbitable full-viewport WebGL world whose wheel input zooms the camera. Its project details become conventional editorial content panels. A KrowdKraft section-by-section story therefore combines the reference's world-building and detail-panel discipline with a deliberately different normal-page navigation model.

## Evidence and coverage

- REA passive page Evidence: `ev_d147b7372fd5e2fd1773fbac825b637dd59b20e08f34d85060ecd97d654360f0`.
- REA static bundle Evidence: `ev_42a604304fc9b088ba380214214a524da9bf5611dcf6f77ea39d5d993ee9b46c`.
- Complete inline records exported to [dwayne/rea-session-evidence.json](dwayne/rea-session-evidence.json), 197,827 bytes, two records.
- Bundle capture parsed all 63 observed scripts without parse failure, visiting 435,244 AST nodes. This is completeness within that capture, not coverage of every lazy-loaded world or server behavior.
- Browser evidence: [initial DOM and resource timings](dwayne/initial-dom.json), [index](dwayne/index-dom.json), [detail content structure](dwayne/detail-dom.json), [mobile controls](dwayne/mobile-controls.json).
- Public loaded source saved under `dwayne/source/`; focused snippets are in [mechanisms.json](dwayne/mechanisms.json) and [render-mechanisms.json](dwayne/render-mechanisms.json). These are evidence for mechanism, not code or assets to reuse in KrowdKraft.

REA passively inspected the selected CDP target. Active clicks, hover, wheel, viewport changes and screenshots were performed separately with Playwright. REA did not perform those actions. REA attachment cannot recover earlier network/console activity. Source maps were not fetched; URL-less scripts were excluded by the REA origin policy. No backend, private API, authenticated feature, or external client site was inspected.

## What is visibly on the site

### Home world

[Desktop initial](dwayne/01-desktop-initial.png): a nearly black blue night environment contains a two-storey wooden lantern pavilion on water. Warm gold paper signs and lamps make the central building the focal point. Blossom trees and rocks frame both sides; water reflections occupy the lower half. A boat, drifting petals and atmosphere make the environment feel alive. Client marks become physical signs on the building instead of floating cards.

- DK wordmark at top-left, restrained uppercase project links across the top, sound control at top-right.
- The Index trigger is a small side-edge control. It is useful but visually subtle.
- Cassette/music entry at bottom-left; Lantern / Chroma visual-style control bottom-center; secondary social/award treatment near the lower-right.
- At initial desktop capture there was no conventional hero headline, description or primary call to action. The scene is the introduction.
- DOM body height matched viewport height. There is no ordinary home section stack.
- The typography observed in navigation, buttons and headings is `Helvetica Neue, Helvetica, Arial, sans-serif`; UI labels are small and quiet. Theme labels were 10px in computed style. The spectacle comes from lighting, space and motion, not ornamental type.

### Inputs and movement

- Hovering Leonardo changed its nav label to warm gold: [hover](dwayne/02-hover-leonardo.png).
- A positive wheel delta visibly moved the camera farther from the pavilion: [wheel](dwayne/03-wheel.png). This is camera zoom, not movement down a document.
- Source contains OrbitControls, pointer listeners, camera target interpolation and model hit detection. Actual pointer-drag orbit was not separately exercised; its presence is a source-derived finding.
- Clicking Leonardo changed the URL to `/#leonardo`, selected the top nav item and started `Loading Scene 93%`: [loading transition](dwayne/08-leonardo-scene.png). The final atelier scene did not finish within the sampled window; do not present it as observed.
- Initial sound button label was `Turn sound on`; after interactions it read `Mute all sound`. Audio was not listened to or judged. Do not infer its exact activation policy from that label change alone.

### Index and information architecture

[Settled index](dwayne/05-index-settled.png): a dark right-side drawer occupies roughly half the desktop width and shifts the scene aside. A thin divider separates the drawer from the still-visible world. The hierarchy is concise: Index heading, tabs, filters, text list, footer utilities.

- Tabs: Projects, Archive, About, Awards, Keeper.
- Project filters: All, AI, Digital, Campaigns, Film.
- 24 project links and a viewed counter in the captured initial state. The list scrolls within the drawer.
- About opens editorial text with a clear title and readable paragraphs: [About tab](dwayne/06-index-about.png).
- Footer contains social links and `Return to the world`.
- Links resolve to real `/work/...` paths with a `returnTo` hash query, preserving the world return context. This is a valuable dual entry system: explore spatially or go directly to an accessible text index.
- Archive, Awards, Keeper and project category filtering were inventoried but not exercised. There is no basis here for claims about Keeper's backend or AI provider.

### Representative project detail

Opened the observed route https://www.dwaynekoh.com/work/leonardo-rebrand?returnTo=%23home. [Detail top](dwayne/09-detail-top.png) and [after wheel scrolling](dwayne/10-detail-scroll.png).

The site changes visual mode from a dark world to warm cream paper with fine rules, black typography and purple active accents. A compact top strip holds identity, Index and return actions. Four numbered project tabs sit beneath it. A persistent narrow left rail lists six chapters: Overview, Identity, Typography, Graphic toolkit, Motion, In the world. The central region alternates oversized statements, two-column explanation and generous image/video plates. The lower status bar shows project position, project label and reading percentage.

The inner content scroller was 17,492px tall with an 855px visible area. Wheel input scrolled it successfully; the outer document remained viewport height. Public CSS and class names show Lenis handling this inner scroll region. The first screenshot catches a heading reveal partway through animation; the clipped title is not evidence of the settled text layout.

This reference suggests useful event-detail patterns for KrowdKraft: event overview, agenda, speakers, venue, gallery/recap and next event, with legible chapter navigation. Do not carry across all of its nested tabs, double return actions and internal scrolling unless the content warrants that complexity.

### Mobile at 390 × 844

[Phone home](dwayne/11-mobile-home.png) and [phone menu animation](dwayne/12-mobile-menu.png).

- The pavilion is reframed smaller and lower to fit the narrow portrait composition; there is substantial empty sky.
- DK remains top-left. Top project links collapse into a hamburger. Sound stays top-right.
- The lower theme control, cassette and social utility remain visible. The side Index affordance is still present.
- The hamburger opens a full-height dark `Brands` menu with project links, View All Projects, music entry and social links. These links were recorded in the DOM. The screenshot captures an early reveal, not the settled whole menu.
- This was viewport emulation, not a real mobile device performance or touch-gesture test.
- The visual composition works at phone width, but KrowdKraft should use that available space for an explicit headline, join action and upcoming-event link instead of requiring visitors to discover the purpose through exploration.

### Chroma verification boundary

The control and source exist. The file `07-chroma.png` records an attempted desktop click; it **still shows Lantern selected**, and the public runtime snapshot still reported `styleMode: original`. A later retest encountered a CDP connection timeout. Chroma's final visual appearance is therefore unverified in this study. Do not use that screenshot as evidence of the alternate style.

## Technical mechanisms supported by evidence

| Mechanism | Evidence and confidence | KrowdKraft implication |
| --- | --- | --- |
| Three.js | Public bundle has revision 185 registration, renderer, GLTF loader and OrbitControls; runtime canvas visible | Optional 3D hero can be implemented with a small scene; full world is a separate scope |
| Perspective camera | Source initializes 42-degree camera and OrbitControls; later runtime snapshot FOV 44 | A perspective world is not the same as an isometric SVG; keep the intended visual distinction |
| Camera controls | Damping enabled, `.075`; min/max distance 8/105; pan disabled; rotate speed `.4`; source-derived | For KrowdKraft constrain tilt/orbit to maintain layout and avoid consuming normal page scrolling |
| Model / texture system | GLB pavilion + wooden boat; WebP sign atlas + JSON sign layout; runtime count 57 sign atlas entries | Separate geometry, decals and content data; place KrowdKraft logo on a dedicated screen/sign layer |
| Ambient rendering | Visible reflection and petals; runtime diagnostic exposes WebGL2 lake, blossom/petal counts and atmosphere | Use a limited number of purposeful effects; do not add real-time water simply to imitate complexity |
| Quality management | Source caps DPR to .85 economy, up to 1/1.25 balanced and 1.5 high; model variant selection | Provide reduced effects and static/SVG fallback; measure target phones before expanding effects |
| Lifecycle management | Source visibility-change pause and disposal paths, WebGL context-loss message | Stop animation offscreen and in background tabs; provide a usable fallback if context fails |
| Motion accessibility | `prefers-reduced-motion` branches exist in JS and CSS; not tested end-to-end | Implement and test actual reduced-motion behavior, including camera movement and diagram loops |
| Framework fingerprints | REA infers Next.js high confidence, React medium, Vite medium; `_next` paths and Rolldown chunk names observed | Do not infer an exact build setup from mixed fingerprints; no framework has to be copied |
| HTML controls | Real anchors/buttons, labelled canvas (`Orbitable 3D portfolio pavilion`), progressbar, aria labels | Preserve semantic HTML navigation and equivalent actions outside the illustration |

A runtime diagnostic snapshot reported mobile model variant, balanced quality, 154 geometries, 22 textures, 676 draw calls and about 1,006,230 triangles while the Leonardo scene was loading. These are one exposed diagnostic snapshot in this environment, not a verified GPU trace or universal scene totals.

## Performance observations

[Resource summary](dwayne/initial-resource-summary.json): 57 completed resource timing entries totalled **12,781,920 transfer bytes**, with 12,764,820 encoded body bytes. This is the already-loaded page's observed resource buffer, not a controlled cold-load benchmark, Lighthouse score or Core Web Vitals result. The HTML navigation resource is not included.

Largest observed items:

| Resource | Encoded bytes |
| --- | ---: |
| `water-pavilion-v25-mobile.glb` | 3,673,592 |
| `garden-after-rain.wav` | 3,072,044 |
| `night-circuit.wav` | 3,072,044 |
| `sakura-atlas.lossless.webp` | 1,264,004 |
| `sign-atlas-v32.webp` | 414,320 |
| `levis-theatre-transform.mp3` | 328,494 |
| `wooden-boat.glb` | 254,240 |

All four observed audio resources accounted for 6,496,390 encoded bytes. This makes eager audio loading a clear cost to avoid for a community site. A proposed KrowdKraft budget should defer sound and any heavyweight world until explicit intent, load ordinary content immediately, and use a lightweight authored SVG/2.5D studio by default.

## Patterns to reuse in the combined plan

1. **A place that expresses the community.** A workbench/studio with a KrowdKraft desktop, a small meetup stage, a build board and publication shelf. Each object should represent a genuine route or section.
2. **An illustration with two levels of depth.** An engaging overview first; a click or section scroll brings one object into focus and reveals ordinary text beside it. An anatomy-style desktop can open into monitor, keyboard, board and network layers.
3. **Calm UI around expressive art.** Thin rules, restrained labels, a small fixed header, generous negative space and one active accent.
4. **A direct content index.** Events / Community / Builds / About / Join remain reachable without manipulating an illustration. Object hotspots duplicate those destinations.
5. **Preserved context.** Detail links have stable URLs and a predictable back destination. Returning to an event list preserves the relevant list position.
6. **Editorial proof.** After the artistic hero, use real event photographs, genuine recaps and accurate metadata. The reference's case-study chapter rhythm adapts well to community event pages.
7. **Motion hierarchy.** Primary motion explains one transition; secondary motion is faint and limited. Prefer a one-shot screen boot, wire trace or object assembly over many independent perpetual loops.

## Patterns to avoid

- An unexplained world as the only homepage for a new visitor seeking event or join information.
- Wheel capture across the entire page; it competes with standard browsing and phone scrolling.
- Tiny hidden edge controls as the only route to essential content.
- Eager loading of multiple audio tracks and high-complexity geometry before content is usable.
- A mandatory loader, long fly-through, or animated intro before visitors can act.
- Copying the pavilion, client marks, textures, audio or authored scene code. Reuse principles and create original KrowdKraft artwork.
- Inventing a community guide chatbot, viewed counter, achievements, stats or partner marks without a real content/data need.

## Coverage status

Answered: initial desktop composition, hover, wheel/zoom, index open/close structure, About tab, representative project detail and inner scrolling, phone home/menu, public source mechanism, observed asset byte costs.

Partially answered: project-world navigation (URL and loader observed; final Leonardo world not sampled), mobile menu animation (DOM complete, screenshot mid-transition), audio activation semantics.

Unresolved: final Chroma state, all ten project worlds, real mobile touch/frame-time behavior, keyboard/focus audit, contrast audit, screen reader usability, full reduced-motion behavior, server-side features. These limits do not prevent the KrowdKraft section plan, but they must not become claims that every interaction on the reference was fully validated.
