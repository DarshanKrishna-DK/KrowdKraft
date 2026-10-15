# KrowdKraft build contract

Updated 15 October 2026. The owner's cream/glass redesign and optional GitHub direction supersede the initial dark-theme and member-account plan. Keep work local. Do not commit, push, or deploy without a new explicit request.

## Product and domain

Anyone can browse published events, journal links, approved projects, the leaderboard, and community links without a login. There is no public account dashboard, editable member profile, or bookmark interface. An optional GitHub connection verifies identity for leaderboard participation, project attribution, and private collaboration proposals. Signing in never opts someone into the leaderboard. Organizers retain a separate role-protected desk.

Core records are community settings, events, articles, internal project-attribution profiles, organizer roles, projects, private reviews, private proposals, audit entries, GitHub connections, and monthly activity snapshots. Earlier saved-event records and `kk_*` tables remain preserved; they are not new public product surfaces.

| Record | State and authority |
| --- | --- |
| Event | Draft/published is independent of scheduled/cancelled/completed and open/closed/waitlist/unknown registration. Date-aware presentation does not treat an expired registration window as a past event. Registration stays with the official provider. |
| Project | New or edited work enters pending review. Organizers approve/reject; the author can withdraw. Editing approved work returns it to pending. Ownership and creation identity cannot be changed. Private review notes stay off public queries. |
| Proposal | New, reviewing, closed. Visible to its author and organizers only. Success means database persistence, not an email being sent. |
| GitHub connection | Identity derives from the trusted GitHub Auth identity. Listing is explicitly opt-in and reversible. Public queries include only currently listed participants. |
| Monthly snapshot | Server-authored public commit and opened-PR counts, score = commits + pull requests. UTC month, shared ranks for equal scores, visible freshness. Clients cannot write scores. |

Postgres constraints, grants, RLS, transactional review functions, immutable identifiers, optimistic version checks, and server authorization enforce these boundaries. Roles come solely from `workshop_roles`; editable names, metadata, and client fields cannot grant access. The owner-approved DarshanKrishna-DK account has organizer/owner access. No general role-management API is exposed.

Storage uses private buckets, owner-scoped paths, raster signatures, MIME and size checks, publication/review visibility, and bounded signed URLs. No provider tokens or runtime service-role keys are retained. Sessions use server-set HttpOnly cookies, validated redirects, same-origin mutations, and private/no-store behavior.

## Routes

| Audience | Routes |
| --- | --- |
| Public | `/`, `/events`, `/events/[slug]`, `/events/[slug]/calendar`, `/journal`, `/builds`, `/builds/[id]`, `/leaderboard`, `/join`, `/privacy` |
| Optional connection | `/connect`, `/auth/github`, `/auth/callback`, POST `/auth/signout` |
| Attributed contributions | `/share`, `/collaborate`; show connection guidance to anonymous visitors |
| Organizers | `/admin`, `/admin/events/[slug]`, `/admin/articles/[slug]`, `/admin/settings` |
| Infrastructure | `/api/health`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` |
| Compatibility | `/account` redirects to the relevant connection/submission page; it renders no account dashboard |

Authentication and private contribution/organizer routes are excluded from search indexing. Health reports connection state without secrets. Missing/draft records render the not-found boundary. Next.js may send HTTP 200 if that boundary or an authentication redirect resolves after streaming begins; the response includes the correct noindex boundary or redirect, without private data.

## Visual acceptance

[DESIGN.md](../DESIGN.md) is the visual authority. Cream pink `#faeeeb`, pearl `#fffaf7`, wine `#49303a`, rose `#a44b65`, a dotted canvas, raised glass surfaces, local Yatra One and Manrope fonts. Desktop index tabs sit on the left, a raised Index control opens a native dialog, and four real SVG socials sit on the hero's right. The exact headline is: **Where what is becomes look what I made.**

The computer and adjacent power/replay/keyboard controls fit within the normal first desktop viewport. The compact upcoming-event ticket has an official contained poster, date/status, clear details link, small printer, and calendar action. The community section pairs a real Three.js point surface with keyboard-operable Learn/Build/Share tabs. Small archive cards, a truthful opt-in leaderboard, a Hairline pin field/project invitation, journal strips, organizer nameplates, and community links complete the home page. Supporting pages use the same materials and readable form structure.

No location/status dot eyebrow, Find your people button, Keep the date overlay, curiosity slogan, emojis, fabricated activity, required game, wheel capture, or automatic audio. Narrow/short screens may grow vertically to preserve readability. Reduced motion, focus visibility, touch input, and no horizontal overflow are acceptance criteria.

## Figure and design tools

The rebranded desktop adapts Anatomy; the agenda printer is an original Anatomy construction. Their controls are accessible HTML, and entered computer text stays in the browser tab. An original Hairline pin field uses the unchanged official kernel; a separate Three.js landscape supplies the actual WebGL surface. Stitch generated a cream/glass reference in the existing KrowdKraft design project. Reference sites informed the spatial index and isometric composition without shipping their application bundles.

See [ART-VERIFICATION.md](ART-VERIFICATION.md). Line endpoint checks and 1x/4x visual review are evidence; a full Anatomy geometry-recorder audit is not supported by the original source and is not claimed.

## Verification and launch boundary

Run typecheck, formatting, production build, dependency audit, isolated PostgreSQL authorization tests, connection checks, read-only production HTTP checks, and responsive/keyboard browser checks. Verify extension-backed GitHub ingestion separately against the real project; PGlite cannot emulate the network/cron extensions. Record actual results in [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md).

No fabricated users or published projects are needed for a UI check. A second real GitHub identity, final-host OAuth, HTTPS/canonical configuration, backups, queue monitoring, and missing official artwork remain in [To-do.md](../To-do.md). A successful local build is not a deployed-launch claim.
