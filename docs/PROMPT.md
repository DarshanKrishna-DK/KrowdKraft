# KrowdKraft Community Website — Codex Build Prompt

You are planning, designing, and building the KrowdKraft website from a clean repository. This document is the full brief. Follow it in order. Do not invent a second product, a second visual system, or a second information architecture.

The repository has already been cleared. What remains is intentional.

## 0. Starting state

Keep these files. Do not redraw, recolor, or replace the mark.

- `public/KrowdKraft_Logo.png` — source logo. A clay lightbulb built from inflated blobs: lime, cyan, blue, violet, and magenta, on black. About 1.5 MB. This is the brand mark.
- `public/logo.png` — smaller export of the same mark.

`public/KrowdKraft_Logo.png` is too heavy to ship as the rendered logo. Keep the file as the source, and generate an optimized WebP (and AVIF if straightforward) plus a real small favicon (32 px and 180 px apple touch icon). Display the optimized asset. Do not commit a second, redesigned logo.

Git history may still contain an old site. That site split KrowdKraft into a business website and a community website, used generic purple gradients, and named partners and team roles that are not current. Do not restore it. Do not copy its pages, components, copy, partner list, team bios, event photos, or architecture.

There is no CMS, no database, and no authentication. Do not add them.

## 1. What you are building

KrowdKraft is a Bengaluru-based developer community. The website is one community-first experience. It is not an agency site.

Audience, in this order:

1. Developers and students in and around Bengaluru who want to find events, learn, and meet people.
2. Companies, developer platforms, communities, and colleges that want to collaborate on or host developer events with KrowdKraft.

KrowdKraft:

- hosts developer events
- co-hosts events
- collaborates with communities
- collaborates with companies and developer platforms
- works with colleges and student communities
- supports developer initiatives
- helps students and developers discover opportunities
- shares developer events happening in and around Bengaluru
- creates opportunities for developers to meet and learn
- supports hackathons, meetups, workshops, technical sessions, and community initiatives

KrowdKraft is primarily focused on Bengaluru.

KrowdKraft does not charge organizations or communities simply to collaborate. It is open to meaningful collaborations that create genuine value for developers.

Current community facts. These are the only stats. They live in one data module and nowhere else.

```ts
export const communityStats = {
  members: "1,400+",
  events: "30+",
  developersReached: "5,000+",
  city: "Bengaluru",
  country: "India",
} as const;
```

People, and only these facts:

- Darshan
- Deepak
- Vihar

Do not invent surnames, roles, bios, social links, or profile pictures. The old repository had extra names, titles, and photos. Those are not current. Render three elegant clay placeholders with the first name and nothing else.

Primary calls to action:

- Explore the community
- Join the Krowd
- Build with the Krowd

Join destination: a `#join` section on the same page, unless a later real signup URL is supplied. Do not invent a Discord, WhatsApp, Luma, or newsletter endpoint.

Collaboration requests go to `krowdkraft.official@gmail.com` through a server-side mail adapter. Never put mail credentials in client code.

## 2. Positioning

Write and design KrowdKraft as a developer community that can organize and support strong developer experiences.

Do not present KrowdKraft as:

- an event agency
- a commercial event-management company
- a corporate services firm
- a sponsor marketplace
- a partner wall of organizations that have not been supplied

Do not say “everything is free forever.” Do not promise unlimited free operational work.

Use this collaboration sentence, or a very close version of it, in the collaboration section:

> We don't charge communities or organizations simply to collaborate with us. If an idea creates genuine value for developers, we're happy to explore it together.

Tone: clear, warm, specific, and confident. Short sentences. No startup clichés, no “unlock synergy,” no “world-class solutions,” no fake urgency.

## 3. Creative direction

The idea to communicate:

> One developer is a node. A community is what happens when the nodes connect.

You may use that sentence if it fits. You do not have to print it.

The sequence the site should make someone feel:

people → connections → community → opportunities

Express that with layout, clay objects, and a few custom isometric figures. Do not express it with a WebGL engine.

### This site is clay, not a Three.js film

An earlier concept asked for React Three Fiber, particles, camera moves, scroll-scrubbed networks, GSAP, and Lenis. That direction is cancelled. Pages built that way stutter on normal laptops. Do not install or use:

- three
- @react-three/fiber
- @react-three/drei
- GSAP or ScrollTrigger
- Lenis or any smooth-scroll hijack
- a full-viewport canvas
- particle systems
- post-processing
- scroll-jacking
- autoplaying video backgrounds

The page is a normal document. It scrolls vertically. Sections stack. Interaction is hover, focus, click, and a small number of pointer-responsive isometric figures.

### Two materials, used on purpose

1. **Claymorphism** is the interface. Navigation, cards, buttons, stats, forms, and placeholders are inflated, rounded, physical surfaces.
2. **Hairline** is the illustration system. Custom isometric line figures, drawn with the `hairline-create` skill, sit on clay plates. They are not the stock figures from the Hairline package.

Do not turn the whole page into line art. Do not turn the Hairline figures into filled clay. Hairline’s rules forbid extra fills, labels inside the drawing, and glow. Clay color lives on the UI. The figures stay single-stroke isometric line drawings, themed with the CSS variables in section 8.

References for the clay system, not for layout to copy:

- Michał Malewicz, [Claymorphism in User Interfaces](https://hype4.academy/articles/design/claymorphism-in-user-interfaces) (Hype4 Academy). The style is inflated, dome-like, soft 3D. Depth is one outer shadow plus two inset shadows (light on the upper left, dark on the lower right). It works in dark mode only when the fill is not pure black, because the light inset needs a surface to catch.
- [Smashing Magazine, “Claymorphism: Will It Stick Around?”](https://www.smashingmagazine.com/2022/03/claymorphism-css-ui-design-trend/) documents the same three-shadow recipe.
- [claymorphism.com](https://claymorphism.com/) is the Hype4 CSS generator for tuning inset shadows.
- Friendly 3D clay artwork in the same family: Pitch’s key visuals, Amrit Pal Singh, Icons8 clay illustrations. Use them as a feeling (soft, inflated, physical), not as assets to copy.
- The KrowdKraft logo is already this material. The site should look like the same clay, placed in a dark room.

Avoid:

- generic hero / four cards / stat row / logo salad / contact / footer
- neon outer glows
- glassmorphism as the main look (`backdrop-filter` blur panes everywhere)
- purple gradient fog behind every section
- neumorphism (shapes pressed into a same-color background)
- cute illustration that makes the community feel like a children’s product. Counter the softness with strong type, high contrast, and restrained color.

## 4. Color

The old website token was near-black with a neon purple (`hsl(280 100% 70%)`). The logo does not match a purple-only UI. Purple stays the interaction color. The rest of the logo’s clay colors are used in small doses so the mark and the page belong together.

Black and dark violet dominate. Color appears on the logo, on a few clay objects, on the active state, and on one accent per section. Do not flood surfaces.

### Canvas

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#09080D` | Page background. Not pure `#000000`, so clay can separate from it. |
| `bg-raised` | `#100E16` | Alternate section bands |
| `clay` | `#1C1730` | Default inflated surface |
| `clay-2` | `#261E3D` | Hover / raised clay |
| `line` | `rgba(255,255,255,0.08)` | Optional hairline edge, very quiet |

### Text

| Token | Hex | Use |
| --- | --- | --- |
| `text` | `#F4F4F5` | Primary text |
| `muted` | `#A1A1AA` | Secondary text |
| `faint` | `#71717A` | Meta text only, on `bg` or `clay`, never on a saturated clay color |

### Logo clay accents

Sampled from the mark. Use at mid lightness so they still read as clay, not neon.

| Token | Hex | Meaning |
| --- | --- | --- |
| `lime` | `#8FDB4A` | Occasional node / category |
| `cyan` | `#3DDCFF` | Occasional node / category |
| `blue` | `#4C8DFF` | Occasional node / category |
| `violet` | `#8B5CF6` | Connection, primary action, active state |
| `violet-deep` | `#6D28D9` | Pressed violet, dark inset companion |
| `magenta` | `#F25CA2` | Occasional node / category |
| `lilac` | `#C4B5FD` | Violet text on dark clay, links |

Primary buttons are violet clay. Secondary buttons are neutral clay. A section may use one extra accent (lime, cyan, blue, or magenta) on a single object. Never use all five accents in one component.

### Dark clay shadow recipe

Pure black fills collapse in dark mode. Keep fills at `#1C1730` or lighter. Deepen the outer shadow. Keep the light inset low, around 8–14% white, so it reads as a highlight and not a dusty film.

```css
.clay {
  background: #1c1730;
  border-radius: 28px;
  box-shadow:
    12px 16px 32px rgba(0, 0, 0, 0.55),
    inset -8px -10px 16px rgba(0, 0, 0, 0.45),
    inset 8px 10px 16px rgba(255, 255, 255, 0.1);
}

.clay-violet {
  background: linear-gradient(145deg, #9b6dff 0%, #7c3aed 55%, #6d28d9 100%);
  color: #f8f5ff;
  border-radius: 999px;
  box-shadow:
    8px 12px 24px rgba(76, 29, 149, 0.45),
    inset -6px -8px 12px rgba(49, 10, 110, 0.45),
    inset 6px 8px 12px rgba(255, 255, 255, 0.28);
}
```

Tune these. Do not ship the first values if contrast or the highlight looks dirty. Large radii (24–40 px on cards, pills on buttons). Edges may bow slightly outward on hero objects. Cards can stay rounded rectangles. Do not bevel everything into a blob.

Hover: lift 2 px and tighten the shadow. Press: scale to 0.98 and swap the inset so the object feels pressed. Transitions: 180–220 ms, ease-out. No bounce springs on the UI.

Text on violet and magenta must be light and at least WCAG AA (4.5:1 for body, 3:1 for large type). Do not put `muted` gray on saturated clay. If a combination fails, change the fill, not the rule.

## 5. Typography

Use a geometric grotesk with a real range of weights. Load it with `next/font`. Preferred: Geist. Acceptable: Outfit. One family for UI and headlines. Do not add a second display font.

Headlines are large, tight, and mostly sentence case or short stacked lines. Uppercase is for eyebrows, badges, and button labels only. Body copy stays in sentence case, 16–18 px, line-height around 1.6, measure around 62 characters.

Examples of headline scale, not a list of headings to paste into every section:

- Where Bengaluru's developers connect.
- Built by the Krowd.
- Bengaluru is always building.
- Let's build something together.
- There's room for one more.

The hero headline is exactly:

```text
Where Bengaluru's
developers connect.
```

Use a large size and a tight line-height. “developers connect.” can sit on the second line. Do not uppercase the whole headline.

## 6. Page architecture

Build one long page at `/` plus the routes below. Do not create thin marketing subpages for About, Services, or Community.

| Order | Section id | Name |
| --- | --- | --- |
| 00 | — | Navigation |
| 01 | `#top` | Hero |
| 02 | `#about` | What KrowdKraft is |
| 03 | `#impact` | Community impact |
| 04 | `#events` | The Krowd Map |
| 05 | `#bengaluru` | Bengaluru developer ecosystem |
| 06 | `#collaborate` | Build with the Krowd |
| 07 | `#ecosystem` | Ecosystem connections |
| 08 | `#people` | People behind the Krowd |
| 09 | `#join` | Join the Krowd |
| 10 | — | Footer |

Also build:

- `/events/[slug]` — event detail, linked from the timeline and the drawer. The drawer can stay on the home page; the route is the shareable page.
- A server action or route handler for the collaboration form. It is not a public CMS.

Navigation links: About, Events, Collaborate, Community. They scroll to `#about`, `#events`, `#collaborate`, and `#join`.

Community in the nav means join, not a separate community product.

## 7. Navigation

A floating clay bar, sticky, offset from the viewport edges on desktop (about 16 px). Not a glass blur bar.

Desktop contents, left to right:

- Logo, linking to `#top`
- About, Events, Collaborate, Community
- A small violet pip showing which section is in view
- Button: `Join the Krowd`

Mobile: logo, join button, and a clay menu button that opens a clay panel with the same four links. Close on navigation and on Escape. Trap focus while open.

The bar should not change height as the user scrolls. No hide-on-scroll animation.

## 8. Isometric figures — Hairline, custom only

Use the installed Hairline skill `hairline-create` ([github.com/lucasmarkes/hairline](https://github.com/lucasmarkes/hairline)). If the skill is not available in the session, install it with `npx skills add lucasmarkes/hairline` and then read its `SKILL.md`, `rules.md`, `concepts.md`, `kernel.js` index, and the nearer example before drawing.

The package `@lucasmarkes/hairline` ships many ready-made figures (the original six are riffle, terrain, exploded, phosphor, slow, and turntable; later ones include hub, relay, settle, and others). **Do not place any of those components on this website.** They are the reference for quality, not the artwork.

Create original figures for KrowdKraft. The concepts below are already chosen. Do not pause to offer alternatives. Still follow the skill: one figure per file, the ten rules are binding, do not edit the kernel, validate, and look at the contact sheet until the checks pass.

Each figure is one idea. A viewer should understand the object without a caption. Names, numbers, and words go in the read-out, never inside the drawing.

| File | Object | Pointer | Read-out | Where it goes |
| --- | --- | --- | --- | --- |
| `gather` | Seven rounded nodes on a low plinth. Two are already joined by a solid link. The rest sit apart. | The nearest open pair draws into a solid link. | Link count, such as `links 3` | Hero |
| `route` | A dashed isometric path with five pins. One pin rests slightly raised. | The nearest pin lifts off the path. Its neighbours stay down. | Pin index, such as `04` | Events, beside the timeline |
| `blocks` | A cluster of city blocks at different heights. Not a map, not a skyline clipart. | The nearest block rises. | Block index | Bengaluru |
| `bridge` | Two separated clusters with a gap and no link. | A bridge grows across the gap, then stops. | `open` or `linked` | Collaboration, and again on form success |
| `seat` | A ring of nodes with one gap, and one loose node outside the ring. | The loose node slides into the gap and settles. | `open` or `seated` | Join |

For each figure, declare a tour of three to six viewBox points: a lap that shows the idea, then a leave. The figure does not play itself. The page decides.

Theme every figure from the page, on a parent, so plates match the clay they sit on:

```css
.figure-plate {
  --hairline-plate: #1c1730;
  --hairline-hi: #f4f4f5;
  --hairline-edge: #c4b5fd;
  --hairline-mid: #6d28d9;
  --hairline-lo: #2a2340;
  --hairline-stroke: 0.9;
}
```

`--hairline-plate` must match the clay surface behind the figure. Plates are filled, not transparent.

### How the figures meet the page

The skill hands over `hairline-<name>.html`, a bench page with a slider and a play button. That bench is a working file, not the website.

Integration:

- Keep each validated figure source in `figures/<name>.js` and the bench HTML in `figures/` so it can be rechecked.
- Mount the figure into a normal div from a small client component. Copy the kernel the way the skill requires (do not rewrite it). Do not iframe the bench. Do not show the skill’s slider, caption chrome, or play button in the UI.
- `play` is `false` everywhere except the hero. The hero may run its tour once when it enters the viewport, then rest. It must not loop forever.
- `intensity` stays around `0.35` to `0.5`.
- Only figures near the viewport are mounted. Unmount or destroy the others. Hairline already skips off-screen work; still do not mount all five on first paint.
- Give each figure a width of the column it sits in and its natural 5:4 box so layout does not jump.
- `prefers-reduced-motion: reduce`: `play` is false, and pointer response may remain. Do not add a CSS animation on top.

If a figure fails validation, fix the figure. Do not fake the illustration with a stock component or a screenshot.

On viewports under 720 px wide, show at most the hero figure. Other sections stay clay and type. A figure that would shrink into an unreadable thumbnail is omitted, not scaled into mush.

## 9. Performance budget

This is a community site. It has to feel immediate on a normal laptop and a mid-range phone.

- No WebGL.
- No smooth-scroll library. Native scroll only.
- No animation library unless a single interaction cannot be done in CSS. Prefer none. Do not add Framer Motion “just in case.”
- Custom figures are the only continuous-drawing code, and only while a mounted figure is actually moving.
- Hero image/logo and CSS are the critical path. Figure code is dynamically imported after the hero text has painted.
- Optimized logo, not the 1.5 MB PNG, in the document.
- Event images, when they exist later, use explicit width and height, modern formats, and lazy loading below the fold.
- One font family, two or three weights.
- Target: Lighthouse performance in the 90s on desktop for the first view, and no long tasks caused by scroll. Do not add post-processing or effects to chase a visual that the budget forbids.
- `prefers-reduced-motion` disables the hero tour and any CSS that translates large areas.

Test by scrolling the whole page on a throttled CPU profile. If a section drops frames, remove the effect. Do not “optimize” it by adding another abstraction.

## 10. Section designs and copy

### 01 Hero `#top`

Almost the whole first screen is the dark canvas, the headline, the support line, two actions, a location, and the `gather` figure on a clay plate.

Eyebrow, with a small violet dot that gently pulses (one CSS opacity animation, disabled under reduced motion):

```text
Bengaluru, India
```

Headline:

```text
Where Bengaluru's
developers connect.
```

Support:

```text
A 1,400+ member developer community bringing Bengaluru's builders together through events, learning, collaboration and opportunities.
```

Pull `1,400+` from `communityStats.members`. Do not hardcode a second copy of the number in the component if the sentence can read the stat. If grammar makes that awkward, the sentence may contain the number once, and a comment in `community.ts` says the hero sentence must be updated with the stat. Prefer one source.

Actions:

- Primary: `Explore the community` → `#about`
- Secondary: `Join KrowdKraft` → `#join`

No mouse parallax. No nodes following the cursor. The figure’s own pointer response is enough.

### 02 About `#about`

Four clay objects in a row on desktop, stacked on small screens. Not a generic icon-card grid. Each object is a short clay slab with a one-word title and one line.

| Title | Line |
| --- | --- |
| Learn | Workshops, talks and technical sessions. |
| Build | Hackathons, challenges and hands-on experiences. |
| Connect | Meet developers, students, communities and industry. |
| Discover | Find worthwhile developer events and opportunities around Bengaluru. |

One accent color per slab, taken from the logo set. The slab body stays dark clay. The accent is a small clay node, not a full-bleed gradient.

Body copy under or beside them:

```text
KrowdKraft is a Bengaluru-based developer community built around learning, building and bringing people together. We host our own events, collaborate with communities and organizations, support student and developer initiatives, and help people discover what is happening across Bengaluru's tech ecosystem.
```

Do not add more paragraphs.

### 03 Impact `#impact`

Do not build four stat cards in a row.

Build one wide clay stage. As each stat enters the viewport, it becomes the active line and the others recede. Use an Intersection Observer to switch the active index. No scroll library. No counting animation. The numbers appear as type.

Order:

1. `1,400+` — Community members
2. `30+` — Events and collaborations
3. `5,000+` — Developers reached
4. `Bengaluru` — Home base

All four values come from `communityStats`.

A quiet row of clay nodes can sit on the stage: more of them take the violet accent as the active stat advances (members → a few violet, events → links suggested by adjacent violet nodes, reached → a wider field, city → one node marked as home). This is CSS. It is not a canvas.

### 04 Events `#events`

Title:

```text
The Krowd Map
```

Support:

```text
A timeline of places where the Krowd came together.
```

The `route` figure sits with the intro, not inside every event.

Three filters, as clay pills:

- Hosted by us
- With the community
- What's next

Mapping:

| Pill | Contents |
| --- | --- |
| Hosted by us | `relationship` of `hosted` or `co-hosted`, any date |
| With the community | `relationship` of `community-partner` or `community-support`, any date |
| What's next | `date` today or later, any relationship |

Past and upcoming are derived from `date` at read time. Do not store those flags.

Default pill: What's next if any upcoming event exists, otherwise Hosted by us.

The timeline is a horizontal clay track inside a region that can be dragged and scrolled. The page itself still scrolls vertically. Keyboard users can move between points with arrow keys. Each point is a real button.

Selecting a point opens a clay detail drawer (a dialog) with image, title, date, venue, city, type, relationship badge, description, and links when present. The same content exists at `/events/[slug]`.

Relationship badges:

| Data | Label |
| --- | --- |
| `hosted` | Hosted by KrowdKraft |
| `co-hosted` | Co-hosted |
| `community-partner` | Community partner |
| `community-support` | Community support |

Event types shown in title case: Hackathon, Meetup, Workshop, Conference, Technical session, Community event, Other.

Do not render a tall stack of 30 cards. The timeline plus one preview is the layout. The preview is a single clay panel for the selected event.

Empty states, and never the words “No events found.”:

- What's next is empty:

```text
We're krafting
the next one.
```

```text
Join the community to hear about it first.
```

Button: `Join the Krowd` → `#join`. A few clay nodes with a gap, the same idea as `seat`, built in CSS if the figure is not mounted.

- A past filter is empty: a single line, `Nothing on this track yet.` plus the join line. Do not fake events.

Ship with an empty event list, or with one clearly marked example only if it is needed to develop the UI. If you include an example, it must be obvious in the data file as sample content and must not name a real partner. Prefer empty data and a finished empty state. Real events are added later with the CLI.

### 05 Bengaluru `#bengaluru`

Headline:

```text
Bengaluru
is always building.
```

The `blocks` figure is the picture of the ecosystem. Not a geographic map. Not Google Maps. Not a Three.js city.

Around or under the figure, a wrap of small clay chips for topics the community pays attention to:

AI / ML, Web, Mobile, Cloud / DevOps, Cybersecurity, Web3, Data, Developer tools, Open source, Hackathons, College events, Workshops, Meetups.

Copy:

```text
We curate and share developer events, meetups, hackathons and opportunities happening around Bengaluru so you don't have to discover them alone.
```

Button: `Join the community` → `#join`.

### 06 Collaborate `#collaborate`

Headline:

```text
Let's build
something together.
```

Show KrowdKraft as the center clay node. Four surrounding clay nodes: Companies, Communities, Colleges, Developers. Hovering or focusing one highlights that node and the line back to the center. CSS is enough. You may place the `bridge` figure beside this cluster. Do not build a second interactive system that duplicates the figure.

Short lines, revealed on hover and always available to keyboard and screen-reader users (do not hide the only copy behind hover):

- Companies — developer events, community activations, hackathons
- Communities — co-hosting, cross-community collaboration, event discovery
- Colleges — hackathons, workshops, developer sessions, student initiatives
- Developers — speaking, mentoring, volunteering, community contribution

Include the free-collaboration sentence from section 2.

Button: `Build with the Krowd`. It opens a clay dialog with the form.

Collaboration kinds, as a quiet list under the cluster, not as a second hero:

Host an event, Co-host, Community partnership, Workshop, Hackathon, Tech talk, College collaboration, Community outreach, Event discovery / promotion.

### Collaboration form

Fields:

| Field | Control | Required |
| --- | --- | --- |
| I represent a | select: Company, Developer platform, Community, College, Student community, Event, Other | yes |
| Organization name | text | yes |
| Your name | text | yes |
| Email | email | yes |
| Relevant website or link | url | no |
| What are you planning? | select: Hackathon, Meetup, Workshop, Technical talk, Community partnership, College initiative, Event promotion, Other | yes |
| Proposed date | date | no |
| Location | text | no |
| Expected audience | text | no |
| Tell us about the idea | textarea | yes |
| How would you like KrowdKraft involved? | textarea | yes |

Validate with Zod on the client and again on the server. Use React Hook Form. Show errors under the fields. Disable the submit button while the request is in flight.

Submit label: `Send collaboration request`.

Success does not say only “Success.” Play the idea of two clusters joining: if `bridge` is cheap to show here, mount it once; otherwise two clay groups and a violet bar that draws across. Then:

```text
Connection made.
```

```text
We've received your idea. We'll take a look and get back to you.
```

This success copy is allowed only after the server confirms the message was handed to the mail provider.

If mail is not configured, do not show that success. Show:

```text
The form is wired up, and mail isn't configured in this environment yet.
```

In local development the server may write the payload to the server log and return `{ delivered: false, reason: "mail_not_configured" }`. The UI must say that plainly. Never return a fake delivered status.

### 07 Ecosystem `#ecosystem`

Headline:

```text
Ecosystem
connections
```

Copy:

```text
We're building this space as KrowdKraft continues creating alongside communities, companies and developer ecosystems.
```

When `partners` is empty, show this coming-soon state: a loose field of dim clay nodes, a few of them joined by faint lines. No names. No logos. The heading of the empty state is `Coming soon.`

When `partners` has entries, render those entries from data only: name, url, logo, and a one-line note. Adding a partner later must not require a component edit. Do not seed this array. The old site’s college and company logos are not current partners. Do not restore them.

### 08 People `#people`

Headline:

```text
People behind
the Krowd.
```

Copy:

```text
KrowdKraft is community-first, but every community starts with people willing to show up, bring ideas to life and create spaces for others to grow.
```

Three clay portraits. Each shows a single initial (D, D, V) and the name underneath: Darshan, Deepak, Vihar. No role. No bio. No social icon. No photograph. The two Darshan/Deepak initials can be distinguished by accent node color, not by inventing a last name.

### 09 Join `#join`

Headline:

```text
There's room
for one more.
```

Short line:

```text
Join KrowdKraft to hear about events, collaborations and rooms where Bengaluru's developers actually meet.
```

The `seat` figure is the visual. Primary button: `Join the Krowd`.

Until a real join URL exists, the button scrolls to this section and focuses a single email field labeled “Email me when something is happening.” Submitting it uses the same mail adapter, with a clear subject that it is a join-interest note, not a collaboration proposal. If mail is not configured, use the same honest fallback. Do not store addresses in a database. Do not pretend they joined a list.

If you would rather not ship a second form, make the button open the collaboration dialog only for organizations, and for developers show the email address as a `mailto:` plus the honest note that a list is not connected yet. Pick one approach and document it in the README. Do not invent a Discord invite.

### 10 Footer

Clay band, not a sitemap dump.

- Logo
- One line: Bengaluru developer community
- Links to the four sections
- `krowdkraft.official@gmail.com` as a mailto
- Copyright year and KrowdKraft

No fake social profiles. If you cannot point a social link at an official account supplied in this brief, omit it.

## 11. Event data

File: `src/data/events.json`

TypeScript types in `src/data/events.ts`. Zod schema in `src/data/event-schema.ts`, shared by the site and the CLI.

```ts
type EventType =
  | "hackathon"
  | "meetup"
  | "workshop"
  | "conference"
  | "technical-session"
  | "community-event"
  | "other";

type EventRelationship =
  | "hosted"
  | "co-hosted"
  | "community-partner"
  | "community-support";

type KrowdEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  endDate: string | null;
  venue: string;
  city: string;
  type: EventType;
  relationship: EventRelationship;
  image: string | null;
  sourceUrl: string | null;
  registrationUrl: string | null;
  featured: boolean;
};
```

`past` and `upcoming` are functions of `date` compared with the current date in `Asia/Kolkata`. Do not store them.

Adding an event means editing JSON through the CLI, or carefully by hand, then passing validation. Components only render the parsed list.

Partners live in `src/data/partners.ts` and export an empty array plus the type:

```ts
export type Partner = {
  name: string;
  url: string;
  logo: string;
  note: string;
};

export const partners: Partner[] = [];
```

Community stats live in `src/data/community.ts` only.

## 12. Event CLI

Local organizer tool. Not a page. Not an API. No auth, because it never starts a server.

Scripts in `package.json`:

```text
npm run event:add
npm run event:list
npm run event:edit
npm run event:remove
npm run event:validate
```

Primary path:

```text
npm run event:add -- "https://example.com/event"
```

`event:add` fetches the public page and reads, when present:

- Open Graph title, description, image
- JSON-LD `Event` (name, startDate, location, organizer, image, description)
- meta description
- document title

It prints a preview and a checklist. It does not write the file yet.

```text
EVENT FOUND

Hacktoberfest Hack Day Bengaluru
18 October 2026
Startup Park
Bengaluru

Image ........ found
Description .. found
Venue ........ found
Date ......... found
```

Missing fields print `missing`. Then the CLI asks:

```text
How was KrowdKraft involved?

1. Hosted
2. Co-hosted
3. Community partner
4. Community support
```

Then it walks every field and lets the organizer keep or replace the extracted value. Then:

```text
Save event? (y/N)
```

Default is no. On yes:

- generate a unique slug from the title
- validate with the Zod schema
- if an image URL was found, ask before downloading: `Save image locally? (y/N)`. Only download on yes. Store under `public/events/<slug>.webp` when conversion is easy, otherwise keep the original format. If they decline, set `image` to null and say a local image can be added later. Do not hotlink a remote image in the committed JSON unless the organizer explicitly chooses `Keep remote URL`.
- write `src/data/events.json` with stable formatting
- print what changed

```text
Event added
Metadata validated
src/data/events.json updated
```

Never publish scraped data without that confirmation.

`event:list` prints date, title, relationship, and slug.

`event:edit` and `event:remove` ask for a slug, show the record, and require confirmation before writing.

`event:validate` parses the JSON with Zod and exits non-zero on error. Wire it as a check the organizer can run. It does not need a git hook unless you add one that only runs this and does not block unrelated work in a surprising way. A documented npm script is enough.

Use Node’s built-in fetch. Prompts can use Node readline. Do not add a heavy CLI framework for five commands. TypeScript run via `tsx` is fine.

## 13. Mail

Browser code cannot hold SMTP passwords or API keys.

Shape:

```text
src/server/mail/types.ts        MailMessage, MailResult
src/server/mail/send.ts         chooses an adapter from env
src/server/mail/resend.ts       if RESEND_API_KEY is set
src/server/mail/smtp.ts         if SMTP_URL is set
src/server/mail/unconfigured.ts returns delivered: false
```

One adapter runs. If both Resend and SMTP are set, Resend wins, and the server logs that SMTP was ignored. Document this.

`.env.example` (committed, no secrets):

```text
MAIL_FROM=
MAIL_TO=krowdkraft.official@gmail.com
RESEND_API_KEY=
SMTP_URL=
```

`MAIL_TO` defaults to `krowdkraft.official@gmail.com` when unset. `MAIL_FROM` must be set whenever a provider key is set, or send returns unconfigured rather than guessing a from-address.

The collaboration server action:

- validates with the same Zod schema
- rate-limits in a simple in-memory way (for example, a few submissions per IP per hour) so a public form is not an open relay
- escapes text in the email body
- does not reflect HTML from the visitor into a page
- returns `{ delivered: true }` only after the provider accepts the message

Add `/.env` to `.gitignore`. Do not commit `.env`.

## 14. Technical architecture

- Next.js current stable, App Router, TypeScript strict
- React Server Components for the page shell, data loading, and metadata
- Client components only for the nav menu, timeline interaction, dialogs, form, intersection observer, and Hairline mounts
- Tailwind CSS v4 if it is the current default in the Next.js version you install; otherwise Tailwind v3. Do not mix in a component library that brings its own visual system. No shadcn clone of a generic dashboard.
- Zod and React Hook Form
- `next/font` for Geist or Outfit
- ESLint with the Next.js config
- Paths alias `@/`

Suggested layout:

```text
src/app/layout.tsx
src/app/page.tsx
src/app/events/[slug]/page.tsx
src/app/actions/collaborate.ts
src/app/actions/join-interest.ts
src/components/nav.tsx
src/components/clay.tsx
src/components/sections/*.tsx
src/components/events/timeline.tsx
src/components/events/event-dialog.tsx
src/components/collaborate/form.tsx
src/components/figures/hairline-figure.tsx
src/data/community.ts
src/data/events.ts
src/data/events.json
src/data/event-schema.ts
src/data/partners.ts
src/server/mail/*
src/styles/globals.css
scripts/events/*
figures/*
public/KrowdKraft_Logo.png
public/logo.png
public/brand/logo.webp
docs/PROMPT.md
```

`page.tsx` composes sections. It is not a client component. It does not contain the copy as a giant string blob; copy can live next to each section if it is specific to that section. Shared facts (stats, events, partners, people names) come from `src/data`.

People names:

```ts
export const people = [
  { name: "Darshan" },
  { name: "Deepak" },
  { name: "Vihar" },
] as const;
```

Metadata:

- Title: `KrowdKraft — Where Bengaluru's developers connect`
- Description: the hero support sentence
- Open Graph image: the optimized logo on the dark canvas, or a simple generated card. Do not use an old event photo.
- `lang="en"`
- One `h1` (the hero). Later headlines are `h2`.

README, written for a new contributor:

- what KrowdKraft is, in one paragraph
- how to install and run
- where stats, events, partners, and people are edited
- the event CLI
- mail setup and the honest unconfigured behavior
- where custom Hairline figures live and the command to revalidate one
- a note that Three.js and scroll-hijacking are intentionally absent

## 15. Accessibility

- Semantic regions and headings in order
- Visible focus rings that are not removed. A violet outline on clay is fine.
- Dialogs: `role="dialog"`, labelled, focus trapped, restored on close, Escape closes
- Timeline points are buttons with accessible names including the event title and date
- Form errors are tied to fields with `aria-describedby`
- Color is not the only signal for the active nav section or the active stat
- Reduced motion is respected
- Hit targets at least 44 px
- Contrast as specified in section 4

## 16. Build sequence

Work in this order. Do not start with figures and do not start with the CLI.

1. Scaffold Next.js, TypeScript, Tailwind, strict mode, `.gitignore`, README skeleton, `.env.example`.
2. Add tokens, clay primitives, type, and the optimized logo. Check the clay recipe on the dark background before building sections.
3. Build the static page structure and all copy, with empty events and empty partners. Navigation, footer, and every section should be readable with no JavaScript beyond Next’s runtime.
4. Add timeline, dialogs, and the form against the Zod schemas. Wire mail with the unconfigured fallback and test that failure is honest.
5. Draw the five Hairline figures with the skill, validate each, then mount them last, behind dynamic import.
6. Add the event CLI and run `event:validate` against the empty list and against one temporary event you add and then remove.
7. Check keyboard, a 390 px viewport, a laptop viewport, and reduced motion. Fix anything that stutters by removing it.

## 17. Done when

- The site is one community page, not a business site plus a community site.
- The logo is the existing mark, optimized for display.
- The page looks like dark clay in the logo’s colors, with violet as the action color.
- Five original Hairline figures exist, none of the stock figures are imported, and the page still scrolls smoothly with the figures mounted.
- Stats, events, partners, and people are data. The UI does not hardcode a second copy of the numbers.
- Upcoming versus past is computed.
- The event CLI previews, asks, and only then writes.
- The collaboration form reaches `krowdkraft.official@gmail.com` when mail is configured, and refuses to fake success when it is not.
- No partner is named or shown.
- People are Darshan, Deepak, and Vihar, with no invented biography.
- There is no Three.js, GSAP, or Lenis in `package.json`.
- `docs/PROMPT.md` is still here and unchanged.

## 18. Copy deck

Use this copy. Do not rewrite it into something grander.

Hero eyebrow: `Bengaluru, India`

Hero title: `Where Bengaluru's developers connect.`

Hero support: `A 1,400+ member developer community bringing Bengaluru's builders together through events, learning, collaboration and opportunities.`

Hero primary: `Explore the community`

Hero secondary: `Join KrowdKraft`

About: `KrowdKraft is a Bengaluru-based developer community built around learning, building and bringing people together. We host our own events, collaborate with communities and organizations, support student and developer initiatives, and help people discover what is happening across Bengaluru's tech ecosystem.`

Events title: `The Krowd Map`

Events support: `A timeline of places where the Krowd came together.`

Empty upcoming title: `We're krafting the next one.`

Empty upcoming support: `Join the community to hear about it first.`

Bengaluru title: `Bengaluru is always building.`

Bengaluru body: `We curate and share developer events, meetups, hackathons and opportunities happening around Bengaluru so you don't have to discover them alone.`

Collaborate title: `Let's build something together.`

Collaborate fee: `We don't charge communities or organizations simply to collaborate with us. If an idea creates genuine value for developers, we're happy to explore it together.`

Collaborate button: `Build with the Krowd`

Form submit: `Send collaboration request`

Success title: `Connection made.`

Success body: `We've received your idea. We'll take a look and get back to you.`

Ecosystem title: `Ecosystem connections`

Ecosystem body: `We're building this space as KrowdKraft continues creating alongside communities, companies and developer ecosystems.`

Ecosystem empty: `Coming soon.`

People title: `People behind the Krowd.`

People body: `KrowdKraft is community-first, but every community starts with people willing to show up, bring ideas to life and create spaces for others to grow.`

Join title: `There's room for one more.`

Join body: `Join KrowdKraft to hear about events, collaborations and rooms where Bengaluru's developers actually meet.`

Nav CTA and join CTA: `Join the Krowd`
