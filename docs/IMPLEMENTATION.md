# KrowdKraft implementation contract

The authority is the unchanged `docs/PROMPT.md`. Its SHA-256 at the start is `FC8A5219471F08209B95CC320F01EFE72B4C7313CBE6141E93207FDDFC74B8E3`.

## Design and architecture

One community page for Bengaluru developers. A dark room, physical clay controls, large Geist type, restrained logo accents. Design variance 7, motion 3, density 3. Cards use 24-40 px radii; buttons use pills; inputs use 14 px. Single dark theme. Original Hairline line objects sit on clay plates. No WebGL or animation library.

Routes: `/` (all nine sections), `/events/[slug]` (shareable event), server actions for collaboration and join interest. No database, CMS, authentication, payments, or external project creation.

Domain: validated JSON events; unique ID/slug; strict date and safe URL fields; upcoming means event date >= today's Asia/Kolkata date. Empty events and partners are intentional. Shared community facts and people have one source.

Interaction states: nav closed/open; event filter + selected event + closed/open drawer; form idle/invalid/sending/delivered/unconfigured/failed/rate-limited. Native dialogs trap focus, close with Escape, and restore their trigger. Mail success requires provider acceptance. No address storage or list enrollment claim.

Authority: anonymous visitors may submit bounded, validated mail to one server-configured recipient. They cannot choose a recipient or sender. The local organizer CLI writes files only after preview and explicit confirmation; there is no organizer HTTP endpoint. Forwarded IPs are trusted only when explicitly configured behind a sanitizing proxy. In-memory limits apply per process and require infrastructure limits when scaling to multiple instances.

## Review plan

Substantial same-repository, non-draft PRs: foundation/reset (#79); community page and event experience (#80); mail-backed forms (#81); original figures (#82); event organizer CLI (#83); Krafty and final interaction verification (#84). Shipwright comments were read through GitHub MCP, checked against the complete source and tests, and confirmed issues fixed in their feature branches.

The user-supplied reset deletes 22,815 lines (12,129 in the old lockfile). Its foundation PR necessarily exceeds the guide's 5,000-line review cap. Subsequent feature PRs should remain below that cap. Do not split cosmetic edits to increase PR count. Existing PR #78 belongs to the superseded product and is left untouched.

## Validation plan

Lint, strict TypeScript, production build, event validation, meaningful schema/mail/CLI tests. Browser checks at 390 px and laptop sizes, full-page native scrolling, keyboard dialogs/timeline, no-JS copy, reduced motion, accessibility scan, throttled desktop Lighthouse. Hairline build/validation/contact sheets for each figure. Temporary event fixtures removed before final handoff.

## Implemented, 13 October 2026

- Nine responsive sections, footer, original clay system, Geist 400/500/600, optimized existing logo, keyboard navigation, native page scrolling and mobile menu.
- Shared factual data, three first-name/initial profiles, intentionally empty partner/event lists and finished empty states. No historical partner claims restored.
- Validated event timeline with relationship/upcoming filters, native touch scrolling, mouse dragging, arrow/Home/End controls, focus-managed event dialogs, SSR detail URLs and unknown-slug 404s. Start dates are classified in Asia/Kolkata.
- Collaboration and join-interest server actions with client/server validation, honest unconfigured/error states, preserved input, fixed recipient, honeypot, bounded process-local limits, Resend precedence and certificate-verified SMTP. Provider acceptance is the success boundary; no database or mailing-list enrollment.
- Five original Hairline figures with immutable vendor runtime and bench, reproducible builds, viewport mounting/destruction, one hero tour, mobile-only hero, reduced-motion settling and static fallback copy.
- Confirmation-first event CLI for add/list/edit/remove/validate, metadata preview, per-field review, separately approved local WebP conversion, public-address/DNS-pinned downloads, bounded responses and locked atomic JSON writes.
- Krafty, an original SVG duck with six expressions, contextual section/event guidance, honest form reactions, explicit sound opt-in, cancellation-safe local quacks, hide/restore and Escape/focus support. No reference-project code or assets copied. See [KRAFTY.md](KRAFTY.md).

## Verification evidence

All commands are reproducible from the README. Local evidence is retained in ignored `.artifacts/` and generated figure benches/contact sheets; temporary content is not shipped.

| Check | Result |
| --- | --- |
| Clean dependency installation / lockfile | npm 11.6.2 clean CI install passes |
| Unit suite | 15 tests pass: schema/date boundaries, provider acceptance/rejection, sender/recipient validation, rate limits, organizer consent, images, conflicts and public-address filtering |
| ESLint / strict TypeScript / production build | Pass |
| Main browser flows | 8 tests pass: desktop and 390 px navigation/dialog focus, form failure/input preservation, no-JS copy, viewport figures, reduced motion, duck navigation/audio/hide and pending-audio cancellation |
| Populated event browser suite | 2 tests pass; 11 temporary records removed, original empty JSON rebuilt |
| Accessibility and layout | Axe WCAG A/AA: zero violations in checked page/dialog/guide states; no horizontal page overflow; no browser exceptions |
| Figure validation | All five static validators pass; all five eight-state contact sheets inspected; intentional local changed-ink warnings documented in `figures/README.md` |
| Lighthouse desktop | Initial complete-site audit: performance 100, accessibility 100, best practices 100, SEO 100; local production build, not a field-data claim |
| Throttled native scroll | 4× CPU slowdown, full-page wheel traversal: zero long tasks, no overflow, at most two figures mounted |
| Content preservation | Original prompt hash unchanged; events `[]`; partners empty; original logo retained |

## Review and release state

The complete implementation is on `codex/krafty-duck-guide`. The review stack is [#79](https://github.com/DarshanKrishna-DK/KrowdKraft/pull/79) → [#80](https://github.com/DarshanKrishna-DK/KrowdKraft/pull/80) → [#81](https://github.com/DarshanKrishna-DK/KrowdKraft/pull/81) → [#82](https://github.com/DarshanKrishna-DK/KrowdKraft/pull/82) → [#83](https://github.com/DarshanKrishna-DK/KrowdKraft/pull/83) → [#84](https://github.com/DarshanKrishna-DK/KrowdKraft/pull/84). Parent fixes are merged forward. Review as a stack; the foundation alone is a scaffold and must not be released as the finished product. Existing unrelated PR #78 is untouched.

Existing GitHub/Vercel integrations automatically created branch previews in the two already-connected projects. No production branch merge, new hosting project, deployment destination change or paid service provisioning was performed. Shipwright is not uniformly green: several blocking findings assert that committed modules/scripts are missing, and its T3 verdict requires an authorized human approval label. The agent has not applied that label or bypassed review. See [SHIPWRIGHT_REVIEW.md](SHIPWRIGHT_REVIEW.md) for findings and evidence.

## Owner-dependent launch steps and limits

- Configure a verified `MAIL_FROM` and either Resend or SMTP, then verify a real submission reaches the intended inbox. No live mail was sent or claimed; current unconfigured behavior is intentional.
- Set the final `SITE_URL`. Previews are noindex. A production build without an origin omits the absolute social-image URL instead of inventing one.
- Review the complete preview and Shipwright evidence, satisfy any human approval requirements, and coordinate the full stack release. Do not deploy only #79's foundation.
- Add only real approved event/partner records through the documented workflow. Current empty data is the requested deliverable.
- Proxy trust defaults off. Trusted X-Forwarded-For must be a bare IP from a sanitizing proxy; malformed/ported values deliberately share the conservative bucket. Multi-instance production needs infrastructure rate limits. A killed local CLI can leave a lock; safe manual recovery is documented.
- Runtime dependency audit reports zero vulnerabilities. The full development audit reports five high findings through the unpatched `braces`/`micromatch`/`fast-glob` ESLint toolchain. No compatible patched release was available during verification; no forced framework downgrade was made. Recheck before the next dependency update.
