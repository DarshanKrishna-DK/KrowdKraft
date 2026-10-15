# Dark glass redesign: sources and decisions

Researched and implemented on 15 October 2026. This revision supersedes the cream canvas. [DESIGN.md](../DESIGN.md) is the current visual contract.

## Component research

| Reference | Observation and implemented decision |
| --- | --- |
| [Uiverse: dexter-st](https://uiverse.io/dexter-st/young-newt-20) | Inspected the live component and CSS. Nested bevels, a lit upper edge, and a dark underside informed the original glass button styles. |
| [Uiverse: Smit-Prajapati](https://uiverse.io/Smit-Prajapati/chatty-pug-36) | Inspected the circular layered social control. Adapted the material hierarchy and highlight into upright SVG social buttons; no tilted labels. |
| [Uiverse: Gidarx](https://uiverse.io/Gidarx/moody-falcon-73) | Inspected the physical display casing. Recessed panels informed the leaderboard; fictional game data and flashing effects were not carried over. |
| [Call to Inspiration](https://calltoinspiration.com/) | Reviewed the gallery landing view and component categories. Its cards detail view remained on loading images, so detailed card inspection is not claimed. |
| [Neumorphism](https://neumorphism.io/#e0e0e0) | Reviewed the shadow generator and light direction. The implementation uses paired inset/cast shadows plus visible borders so controls remain distinguishable. |
| [Open Peeps](https://www.openpeeps.com/) | Reviewed expressive character shapes. No Open Peeps asset is bundled. |
| [Bible Strong Avatar Lab](https://bible-strong-avatar-lab.vercel.app/) | Reviewed rounded 3D characters and expressions. The small workshop robot is an original Three.js construction; no source asset or religious branding is copied. |

Stitch edited the existing KrowdKraft project, `11073198068008763944`, from screen `23ab551a011f4432a2cfce1241c6ba45` with the new dark glass direction. That output informed materials and hierarchy. The application uses original components and verified community data, not generated placeholder metrics.

Anatomy's existing arcade cabinet is reused under its MIT license, recolored and served as a self-contained static SVG. The desktop and original printer remain. Three separate Three.js models depict books, a laptop, and a presentation board. The WhatsApp path is from [Tabler Icons](https://github.com/tabler/tabler-icons); its MIT license is bundled.

## Event source coverage

Both owner-supplied [KrowdKraft](https://luma.com/krowdkraft_community?period=past) and [older community](https://luma.com/ezhostz_community?period=past) calendars were inspected in the browser. The visible inventory comprised x402, INDIA ONCHAIN TOUR #4, Into the AI-Verse, and GrowBiz. Those four are included alongside the retained archive, making nine records including the upcoming Hacktoberfest event. The owner's 20+ lifetime statistic is not a claim that 20 public event listings were found.

- [x402 Global Challenge PreHack](https://hackculture.io/hackathons/x402-global-challenge-prehack): official HackCulture poster; 23 August 2026 event date. A July metadata date was not substituted for the actual event date.
- [INDIA ONCHAIN TOUR #4](https://luma.com/qovbp2i9): official Luma cover; 8 December 2025, 09:00–13:00 IST. The poster mentions 8–9 December, while this listing specifies 8 December. The listing controls the calendar record. It was visible in the owner's supplied calendar and accessible without authentication, despite an unlisted source flag.
- Into the AI-Verse and GrowBiz: original posters and listing times from the older Luma calendar. GrowBiz was added; the AI-Verse cover was refreshed.
- [Namaste Arbitrum](https://luma.com/9usbg8kx): retained verified official cover.
- [Hacktoberfest Hack Day](https://events.mlh.com/events/15112-hacktoberfest-hack-day-bengaluru-krowdkraft): updated current poster and partner list.
- Preptember, Blockchain 101, and GitHub & LinkedIn Mastery: no verified official artwork recovered. Original dimensional title covers are used. Their links lead to the official community archive, rather than a repository source file or a separate event page.

All poster frames preserve the entire image with `object-fit: contain`. Original poster branding is not edited. App-authored copy uses KrowdKraft.

## Medium

The fixed [official RSS feed](https://medium.com/feed/@cryptech_dk) returned four posts, including the Cursor Pro / MLH article dated 14 October 2026. Exact publication timestamps preserve ordering for posts published on the same day. Three latest published posts appear on the homepage with their actual Medium covers; the full blog page includes the feed archive.

The private database job `krowdkraft-medium-feed` runs every 15 minutes. Its successful scheduled execution was observed. Atomic refreshes preserve the last good content if a response fails. The function accepts no URL input, rejects external XML declarations, bounds response/item sizes, validates article and image hosts, and cannot be executed by anonymous or authenticated client roles. The two image hosts match the page CSP.

## Organizer profiles

| Person | Confirmed public profiles | Evidence |
| --- | --- | --- |
| Darshan Krishna N | [LinkedIn](https://www.linkedin.com/in/darshan-krishna-dk/), [X](https://x.com/CrypTech_DK) | Owner portfolio and GitHub links; live X profile identity. |
| Deepak N | [LinkedIn](https://www.linkedin.com/in/deepak--n/) | Self-linked from GitHub `ldpacl`, matching JLL context. |
| Viha Shomikha | [LinkedIn](https://www.linkedin.com/in/vihashomikhaas/), [X](https://x.com/BunnyYaps_) | Live X profile says Viha.onchain and Community Manager at KrowdKraft, matching the owner's handle hint. |

Viha's older self-linked `VihaTacklesBugs` account no longer exists and was not used. Deepak's Linktree could not be opened because of a connection/TLS error, and X search for his known handle returned no result. His X link remains hidden until an exact destination can be verified.

## Logo tapes

Source and asset metadata are retained in [partner-sources.json](partner-sources.json).

The first tape contains MLH, DEV, DigitalOcean, Startup Park, ShipWright, Where U Elevate, AlgoBharat, HackCulture, and Keploy. The first six are visible on the current Hacktoberfest poster. ShipWright uses the actual poster logo crop and has no inferred website link. Generic Algorand is excluded; AlgoBharat remains a separately named event collaborator.

The opposite-moving campus tape contains REVA, DSU, MSRIT, T. John, HKBK, and Sri Sairam College of Engineering in Bengaluru. Official logo proportions are preserved. Light or dark plaques are selected for each actual asset's contrast.

Animation pauses on hover/focus and through the global motion control. Repeated groups are hidden from screen readers and keyboard navigation. Reduced-motion preferences replace the tape animation with a wrapping logo layout.

## Evidence

Local source captures, poster metadata, and feed records are under ignored `artifacts/research-*` folders. They are research evidence, not runtime dependencies. Runtime assets are retained in `public/`; live content is in Supabase. The one-time research import script requires those local captures and the installed Anatomy example. Normal builds do not.

See [implementation status](IMPLEMENTATION-STATUS.md), [art verification](ART-VERIFICATION.md), and [launch checklist](../To-do.md) for verification scope and remaining hosting work.
