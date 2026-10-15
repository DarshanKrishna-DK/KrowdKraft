# October 15 refinement

This record covers the earlier font and directory revision. The latest navigation, motion, and spacing changes, including their current browser-verification limitation, are recorded in [MOTION-REFINEMENT.md](MOTION-REFINEMENT.md).

This revision follows the owner's font, navigation, light-object, ticket, directory and popup feedback. Work remains local; no commit, push or deployment.

## Delivered
- Jaini Regular, self-hosted through next/font/local, replaces Yatra display lettering. Manrope remains for readable body text and controls.
- Expanded upright section navigation, smooth anchor scrolling, active section indication, responsive visible links. Removed directory trigger/dialog, falling code and global motion button.
- Exact hero phrase with quotation marks around "what is" and "look what I made". Wordmarks have no trailing full stop.
- Cream pink computer, printer and arcade materials, with dark recessed screens. Arcade marquee reads KROWDKRAFT; source geometry and attribution preserved.
- Notched, perforated event ticket with inset borders and cast shadow. Calendar choice card stays below sticky header and within viewport.
- Cohesive button hover glow; arrows do not translate independently.
- Both tape groups cover at least one viewport, so equal duplicated halves create a continuous cycle. Opposite directions retained, accessible duplicates hidden. Official Women in Product India and AI Dev Circle logos added to seed and live settings (17 total).
- Arrow-only back-to-top appears from the second section.
- Redesigned events/builds/leaderboard with original pale isometric artwork. Unfiltered events show 2 hackathons then 7 other gatherings. Custom dropdowns support arrows, Home/End, typeahead, Escape, outside dismissal and automatic URL/results updates. Search debounces.
- Project sharing uses a native route-backed popup from every public trigger. Direct /share refresh remains supported. Existing authenticated submission, owner-scoped reads and moderation are retained.

## Verification
- Production build passed, including generated art validation and TypeScript.
- 25 existing tests across three files passed, including isolated PostgreSQL authorization and calendar boundaries.
- Typecheck, full formatting check and git diff whitespace check passed.
- Read-only optimized HTTP check passed all 10 public routes, protected organizer redirects, sign-out origin enforcement, database health, calendar, sitemap, sharing image and missing record.
- Measured CSS widths: 320, 390, 768 and 1707. No horizontal overflow on inspected home/events/builds/leaderboard/share layouts. Desktop, tablet and phone compositions visually reviewed.
- Event filters: Upcoming yields 1 event; Hackathons yields 2; x402 search yields 1; clearing restores 2 featured + 7 other events.
- Leaderboard month changes automatically to September 2026 with corresponding URL/heading. Genuine empty states remain.
- Popup opens over the current scroll position, uses native modal focus containment, validates required inputs, dismisses with Escape or backdrop click and restores the share trigger. Browser Forward reopens the popup; direct refresh shows the full page. These flows were rechecked in the optimized build. No test submissions were created.
- Calendar choices and header clearance verified at phone width. Section links settle below the header, and back-to-top remains hidden at the hero.
- Desktop logo group widths: organizations 2046px each, institutions 1706.67px each, on a 1690px content viewport. All observed image assets load. This verifies repeat geometry; no fake partner marks.
- No application warnings/errors observed in the optimized browser check. Unrelated browser-extension warnings are excluded.
- Reduced motion is retained through CSS/media queries and figure logic; no new OS preference toggle was performed in this pass.

## Asset sources
Both requested reference fonts are marked personal use only:
- https://www.1001fonts.com/shivaraja-font.html
- https://www.1001fonts.com/ananda-neptouch-2-font.html

Jaini uses Devanagari-influenced Latin forms and is licensed under SIL OFL:
- https://github.com/EkType/Jaini
- public/licenses/jaini-ofl.txt

Verified partner sources:
- https://womeninproductindia.com/
- https://aidevcircle.com/
- https://www.linkedin.com/company/krowdkraft (community-partner announcements)

Full asset metadata, dimensions, hashes and rationale: [REFINEMENT-ASSETS.json](REFINEMENT-ASSETS.json).
Directory design details: [DIRECTORY-REDESIGN.md](DIRECTORY-REDESIGN.md).
Screenshots are local ignored evidence under artifacts/verification/refined-*.png.

## Boundaries
Existing production-launch requirements remain in To-do.md. This revision does not re-prove every authenticated write or perform a deployment. The database update is limited to the two requested public partner entries. The public leaderboard and project board retain real empty states; no fabricated activity or member accounts were added.
