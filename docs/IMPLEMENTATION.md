# KrowdKraft implementation contract

The authority is the unchanged `docs/PROMPT.md`. Its SHA-256 at the start is `FC8A5219471F08209B95CC320F01EFE72B4C7313CBE6141E93207FDDFC74B8E3`.

## Design and architecture

One community page for Bengaluru developers. A dark room, physical clay controls, large Geist type, restrained logo accents. Design variance 7, motion 3, density 3. Cards use 24-40 px radii; buttons use pills; inputs use 14 px. Single dark theme. Original Hairline line objects sit on clay plates. No WebGL or animation library.

Routes: `/` (all nine sections), `/events/[slug]` (shareable event), server actions for collaboration and join interest. No database, CMS, authentication, payments, or external project creation.

Domain: validated JSON events; unique ID/slug; strict date and safe URL fields; upcoming means event date >= today's Asia/Kolkata date. Empty events and partners are intentional. Shared community facts and people have one source.

Interaction states: nav closed/open; event filter + selected event + closed/open drawer; form idle/invalid/sending/delivered/unconfigured/failed/rate-limited. Native dialogs trap focus, close with Escape, and restore their trigger. Mail success requires provider acceptance. No address storage or list enrollment claim.

Authority: anonymous visitors may submit bounded, validated mail to one server-configured recipient. They cannot choose a recipient or sender. The local organizer CLI writes files only after preview and explicit confirmation; there is no organizer HTTP endpoint. Forwarded IPs are trusted only when explicitly configured behind a sanitizing proxy. In-memory limits apply per process and require infrastructure limits when scaling to multiple instances.

## Review plan

Substantial same-repository, non-draft PRs: foundation/reset; community page and event experience; mail-backed forms; original figures; event organizer CLI and final verification. Follow Shipwright comments through GitHub MCP, evaluate each finding, fix valid issues, and verify the latest commit.

The user-supplied reset deletes 22,815 lines (12,129 in the old lockfile). Its foundation PR necessarily exceeds the guide's 5,000-line review cap. Subsequent feature PRs should remain below that cap. Do not split cosmetic edits to increase PR count. Existing PR #78 belongs to the superseded product and is left untouched.

## Validation plan

Lint, strict TypeScript, production build, event validation, meaningful schema/mail/CLI tests. Browser checks at 390 px and laptop sizes, full-page native scrolling, keyboard dialogs/timeline, no-JS copy, reduced motion, accessibility scan, throttled desktop Lighthouse. Hairline build/validation/contact sheets for each figure. Temporary event fixtures removed before final handoff.

## Status

- Foundation in progress.
- Public deployment and live mail delivery are not yet verified.
