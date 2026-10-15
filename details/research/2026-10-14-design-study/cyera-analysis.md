# Cyera reference analysis for KrowdKraft

Reference: https://secure-the-unknown.cyera.com/
Observed: 14 October 2026. Planning research only; no forms submitted and no application implementation.

## Main finding

This reference is an interactive space expedition inside a viewport-sized WebGL stage. It is **not a conventional scroll-driven landing page**. It uses a short animated introduction, a three-world selector, exploratory scenes with collectible objects, an optional game per world, and conversion content. For KrowdKraft, its strongest reusable ideas are a persistent visual world, a journey between three meaningful activities, camera continuity, and objects that explain the community. Reproducing the entire mandatory expedition would add considerable production and navigation cost.

## Evidence and confidence

| Evidence | What it establishes | Boundary |
| --- | --- | --- |
| REA inspect `ev_6375393335dbf2e44261bef905a59347e40020a6a663b9fa15abc87be2e52ea5` | Same-origin DOM, accessibility, scripts, resource inventory in the selected tab | Passive attach-window observation, no previous network history; excludes cross-origin scripts under default scope; no credentials or raw network bodies |
| REA bundle `ev_8082b935362903642cca4f0c38910942a4ca6b36ab2bef9354b01edfc029aba0` | Four observed same-origin scripts parsed successfully, 450,878 AST nodes, zero parse failures | Static findings do not prove all code executes; server logic and string-built routes may be unknown; source maps not fetched |
| [REA inspect JSON](cyera/rea-inspect.json), [REA bundle JSON](cyera/rea-bundle.json) | Retained complete tool output | Research artifacts, not reusable implementation code |
| [Initial DOM](cyera/dom-initial.json), [styles/resources](cyera/styles-resources.json), [implementation findings](cyera/implementation-evidence.json) | Rendered hierarchy, computed/public styles, initial resource timing entries, named scene classes | Includes hidden stage text, so DOM presence alone does not prove visitor exposure |
| Screenshots below | Actual pixels and tested transitions | Sampled moments, not a continuous performance trace |

REA did not navigate or click. A separate Playwright connection performed ordinary UI interactions on the exact Cyera page in the dedicated research browser. Other tabs were not used or closed.

## Visual language

- Dominant deep purple and lavender space, pale pink highlights, bright lime interactive crystals, near-black outlines, and near-white UI. Observed CSS colors include background `#6D2D93`, ink `#160923`, surface/text `#FBFBFB`, and pale lavender `#F6E8FF`. The loader SVG contains lime `#BFFFA2`, pink `#E574FF`, and lavender `#D390FF`.
- Faceted rocks, crystalline cubes/prisms, a rounded capsule with outlined panel seams, layered rocky landscapes, and clouds. Surface shading is intentionally illustrative rather than photorealistic. Fine stippled/noisy texture runs across the composition. Exact noise implementation was not fully reconstructed.
- Strong scale hierarchy: enormous centered promise in the initial composition; concise white stage captions; large names inside portal-like world windows; small translucent labels tethered to objects by dotted lines; compact white instruction cards with dark text.
- The primary typeface is **Haffer variable**, verified by live `@font-face` and computed button text. Season variable is declared but its visible use was not established. Do not redistribute either font from this website; choose an appropriately licensed KrowdKraft typeface.
- Header stays visually available: small brand at upper left, external site link and filled demo CTA at upper right. CTA construction is distinctive: dark rounded main container with a separate pale square arrow tile. Hover styles invert the demo CTA and fade the text link; those rules are source-observed, not a comprehensive hover test.

## Actual story and interaction order

| Stage | Observed behavior | Design purpose | Evidence |
| --- | --- | --- | --- |
| Branded loading | Small floating illustrated fragments, logo, progress bar on flat purple | Makes asset initialization feel part of the experience | [Mobile loader](cyera/mobile-loader.png); loader DOM |
| Hero | Full-screen capsule/asteroids/crystals behind large white headline and **Begin Your Mission** action | One memorable statement and a clear entry | [Desktop initial](cyera/desktop-initial.png) |
| Animated introduction | CTA click starts camera/object motion; capsule recenters with concentric rings, then shifts around caption positions. Bottom segmented progress and **Skip** appear | Converts product proposition into a short spatial narrative | [Begin transition](cyera/desktop-begin.png), [later transition](cyera/desktop-begin-later.png), [caption sample](cyera/desktop-current.png) |
| World selection | Capsule window becomes a large framed portal. Three alternatives, **Discover / Govern / Protect**, use different scenery and a short descriptor. Current world has an exploration action; pagination dots and swipe guidance appear below | Turns three product pillars into places a visitor can choose | [World selector](cyera/desktop-world-select.png) |
| World introduction | A narrow white card with landscape thumbnail, compact question, short supporting paragraph, and **Explore** action appears over a pastel sky | Explains the purpose before asking for exploration | [Discover intro](cyera/desktop-discover-intro.png) |
| Landing and exploration | Camera passes into a teal, purple-water landscape; capsule descends. Large stage title briefly appears. Cursor motion pans the scene; labelled floating crystals represent subtopics | Makes finding a topic spatial and gives each object narrative meaning | [Landing sample](cyera/desktop-discover-world.png), [panned landscape](cyera/desktop-discover-pan.png) |
| Object selection | A provided visually-hidden particle button can be focused and activated with Enter. This activated the Rogue Agents object, moved capsule and camera toward it, and exposed a topic briefing with game entry and bypass choices | Converts visual discovery into a focused explanation | [Selection transition](cyera/desktop-discover-briefing.png), [briefing text capture](cyera/discover-briefing.txt) |
| Minigames | Hidden DOM and app code identify constellation drawing, compass timing, and shielding. Attempts/status components and bypass controls are present | Interactive metaphor for each pillar | Source/DOM only in this study; game success, failure and complete paths **not verified** |
| Recap/resources | DOM includes completion explanations, product value, customer testimony, further reading, asset request forms and return navigation for each world | Brings playful experience back to proof and conversion | Source/DOM-derived; not visually reached |
| Final conversion | DOM includes mission completion, demo action and a return to another world | Repeated conversion endpoint | Source/DOM-derived; not visually reached; no form submission attempted |

Intro caption order, read from accessibility text: AI adoption sends data into unfamiliar territory; emerging models/agents/workflows increase exposure; the visitor is assigned a security mission; the product becomes the guide; a closing visibility/risk/security proposition leads to the three worlds. This is a paraphrase of the content, not proposed KrowdKraft copy.

## Desktop, mobile and accessibility findings

- Desktop sample: nominal 1440 × 900 viewport, full viewport canvas. `document.documentElement.scrollHeight` was 900. Live CSS sets `body, html, #Stage` to `overflow: hidden` and `touch-action: none`; fixed UI stages replace normal document sections.
- Narrow viewport sample: 390 × 844, document width 390. Desktop wordmark/actions switch to a 34px icon and 48px hamburger control. Hero copy stacks into several centered lines; scene is cropped/recomposed vertically. A loader is still needed. See [narrow hero animation sample](cyera/mobile-home.png) and [narrow intro caption sample](cyera/mobile-world-select.png). The latter filename was intended for world selection but captures an **intro transition**, so it is not evidence of a settled mobile carousel.
- These are responsive viewport tests in desktop Chromium, **not physical-phone or touch-device validation**. A source `Device.mobile` branch exists, so actual touch behavior may differ.
- Some important content is drawn in WebGL; the separate `GLA11y` DOM mirrors introductory captions. Controls use roles, labels and tabindex. Game status has live-region markup. The keyboard particle activation was actually exercised successfully.
- No `prefers-reduced-motion` match was found in the captured main bundle or the inspected live CSS. An attempted Playwright reduced-motion emulation returned `matchMedia(...).matches === false` after reload, so **runtime reduced-motion support remains unverified**; do not claim a conclusive accessibility failure from this test.
- Full menu, tab sequence, focus trapping, screen-reader reading order and game keyboard equivalence were not audited. Subsequent CDP connections timed out and gameplay/menu probing was bounded rather than reported as verified.

## Evidenced technical mechanisms and cost

1. **Custom WebGL/Hydra stack.** The public bundle contains Hydra infrastructure, renderer/scene/shader classes, `GLText`, camera types, named world and particle classes, and a canvas. Do not label the site a React/Next/GSAP/Three.js build: those stacks were not established. A conditional THREE camera adapter exists but does not prove that is the rendering framework used here.
2. **Scene state machine.** Named classes include Landing, PlanetCarousel, PlanetHorizon, PlanetDusk, PlanetSpace, the three games, and Finish. Fixed UI views match those states. Scene changes are therefore better reconstructed as explicit transitions than as an extremely long scrolling page.
3. **Authored animation plus runtime input.** TheatreJS and a compass timeline JSON loaded. Camera and object motion were observed; pointer movement affects viewpoint. Which exact transitions use TheatreJS versus custom tween infrastructure was not traced exhaustively.
4. **Carousel helper.** Flicking ESM loaded; bundle code initializes it. Portal selection has a swipe/pagination affordance. Actual touch swipe was not tested.
5. **Geometry loading.** Draco WASM and wrappers, plus multiple Hydra worker requests, were observed. Code includes Draco bundle decoding. Exact model/poly budgets and total geometry transfer were not measured; worker requests may not appear in top-level resource entries.
6. **Custom illustrative shading.** Code contains BaseOutlineShader, crystal/planet/capsule/sky shaders, outline uniforms and a cloud noise texture. These support the visually observed outlined, flat-shaded world. Copying the compiled shaders is unnecessary; a new illustration system can reproduce the broad visual principles.

At the sampled point, Resource Timing contained 86 entries, of which 41 were same-origin, with approximately **1.03MB transfer size** and **3.24MB decoded size** summed over those same-origin entries. The main JS alone was **318KB encoded / 1.68MB decoded**, Haffer WOFF2 about **166KB encoded**, loader ray imagery about **189KB combined encoded**, and Draco decoder about **66KB encoded / 286KB decoded**. These are **partial, browser-reported samples**, not full download size, cold-load performance, Lighthouse scores or mobile Core Web Vitals. Cross-origin timing restrictions and worker loading prevent a complete weight claim.

## Concrete adaptations for KrowdKraft

| Reference principle | Original KrowdKraft adaptation | Why it fits |
| --- | --- | --- |
| Persistent capsule guides the story | A branded isometric desktop/workbench acts as the recurring hero object; the KrowdKraft mark appears on its screen and case badge | A builder community should feel like a place to make things |
| Three distinct worlds | Three connected stations for Learn, Build and Share; original workshop table, collaborative workbench and demo stage | Clear community meaning without borrowing Cyera's security narrative |
| Camera continuity | Modest pan/zoom from the whole workspace to each station while normal HTML copy stays readable | Creates continuity without requiring a mandatory full-screen game |
| Data particles as topics | Tools, books, code window, badge and microphone become optional hover/focus hotspots that reveal workshop formats or contribution paths | Interactions explain real activity rather than decorative puzzles |
| Mission progress | A subtle three-step rail for Learn/Build/Share, with ordinary anchor navigation and direct event/join actions always available | Visitors can orient themselves and skip ahead |
| Scene-specific scenery | Common warm neutral base, KrowdKraft accent palette, consistent isometric angle, line weight, lighting and shadow geometry | All sections belong to one visual system |
| Recap after exploration | Real event photos, verified event archive, project links and organizer information after the illustrated explanation | Community credibility comes from real people and work |
| Branded loading | Show first usable HTML and static SVG immediately; lazy-load enhanced motion later | Avoids copying a campaign's loading gate into a community site |

Recommended implementation direction: use original editable SVG/isometric components as the baseline, CSS/SVG motion for object detail, and **at most one optional WebGL scene** if a prototype proves it valuable. Use semantic HTML for all primary copy, event information and actions. Native scrolling, keyboard equivalents, stable anchor URLs, explicit reduced-motion states, and a static no-WebGL composition should be designed before visual polishing.

For the anatomy desktop adaptation, replace every Anthropic mark/label with the actual retained KrowdKraft identity, remap the screen and case face in perspective, and preserve consistent stroke widths and lighting. Add original keyboard, mouse, cable connections, a community badge, and small workshop objects. Do not merely place a flat logo over a screenshot. The reusable unit should have separate editable groups for chassis, display, screen content, badge, keyboard, mouse, shadows and hotspots.

## Completion boundary

Answered: visual direction, primary story order, main CTA, three-pillar world selection, representative scene transition, cursor camera behavior, keyboard particle activation, typography, styles, public script mechanisms, partial resource costs, narrow viewport composition.

Partially answered: mobile behavior, loading experience, accessibility, final conversion and game flow (partly source-derived).

Not verified: successful completion of every game/world, submitted forms, backend/API behavior, real-device performance, complete asset bytes, source maps, full reduced-motion behavior, and all keyboard/screen-reader paths. These gaps do not prevent a section-wise KrowdKraft plan; they prevent claiming a pixel-perfect or functionally complete clone specification.
