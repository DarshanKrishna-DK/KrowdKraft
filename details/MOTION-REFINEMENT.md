# Navigation, motion, and spacing refinement

Implemented locally on 15 October 2026. No commit, push, deployment, or database mutation was performed in this pass.

## Delivered

- Transparent outer header, centered upright glass navigation, and a Be a Krafter action using the existing WhatsApp channel from community settings.
- About is the first navigation item and follows the hero. Events targets `/#past-events`, which now contains the upcoming ticket above the past-event heading and cards. The `#next-event` anchor remains valid inside that collection.
- Four separate circular glass statistics with inset highlights, cream rims, and cast shadows. Smaller widths use two columns. The header places the brand and WhatsApp action above the centered navigation below 900px.
- The printer repeatedly feeds and releases a ticket on a 6.2-second cycle. Its existing Google Calendar and ICS choice card remains available.
- The Three.js robot walks a bounded lane, turns, blinks, and uses chapter-specific expressions. Learn turns book pages, Build animates the coding workstation, and Share adds a wave and moving chart. Gait motion settles before turns. Shadow resources are disposed when changing chapters.
- The KrowdKraft arcade uses animated pixel gameplay, joystick movement, button presses, fan rotation, and circuit lights. Cream pink materials and original art attribution remain.
- Decorative figure loops pause offscreen and in hidden tabs. Reduced motion restores useful still SVG artwork or renders a single still Three.js pose. This behavior was reviewed in source, not exercised in a browser during this pass.
- Removed redundant home breadcrumbs from Events, Builds, Leaderboard, and the shared individual-page introduction.
- Clear filters uses the elevated glass button style and a 44px minimum target. Automatic filter behavior is unchanged.
- Closing invitation text and actions are grouped centrally on directory pages and the homepage, with compact wrapping on narrow screens.
- Global design-research skill and writing instructions are installed. See [DESIGN-RESEARCH-SKILL.md](DESIGN-RESEARCH-SKILL.md) for exact locations and invocation.

## Current verification

- Optimized Next.js build passed, including generated artwork validation and TypeScript.
- All 25 existing tests passed across three files, including isolated PostgreSQL authorization and calendar boundaries.
- Full formatting check and Git whitespace check passed.
- Production HTTP checks passed all 10 public pages, organizer redirects, sign-out origin enforcement, database health, calendar, sitemap, sharing image, and missing-record handling.
- Additional production markup checks confirmed navigation order, Events destination, upcoming-ticket nesting, About placement, the existing WhatsApp channel, four statistics, animated figure markup, breadcrumb removal across nine individual pages, and the Clear filters class. Evidence is in `artifacts/verification/motion-http.json`.
- The global skill passed the official skill validator, and this session discovers it in the skill catalog. All 17 supplied reference URLs are retained.

## Browser limitation

Chrome reconnected and exposed the local preview tabs, but the browser tool repeatedly returned `Debugger unattached` for both DOM inspection and screenshots. A fresh tab and explicit tab claim did not restore inspection. No current screenshot, responsive measurement, animation frame comparison, or interactive calendar/filter acceptance is claimed for this pass. Earlier screenshot records describe the earlier revision only.

The optimized local preview is available at http://localhost:3000. The remaining visual check is to inspect the centered header and circular cards at 320px, 390px, 700px, 865px, and desktop widths; observe a complete printer and robot cycle; switch all three chapters; verify offscreen and reduced-motion states; and exercise calendar choices and Clear filters.

Existing production-launch boundaries remain in [To-do.md](../To-do.md).
