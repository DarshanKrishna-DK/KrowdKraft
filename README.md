# KrowdKraft

[![Checks](https://github.com/DarshanKrishna-DK/KrowdKraft/actions/workflows/checks.yml/badge.svg)](https://github.com/DarshanKrishna-DK/KrowdKraft/actions/workflows/checks.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-171717?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)

**Where Bengaluru’s developers connect.** An event-first home for hack days, workshops, community projects, and the people who build them.

[Visit the website](https://krowd-kraft.vercel.app) · [Event calendar](https://krowd-kraft.vercel.app/events) · [WhatsApp announcements](https://whatsapp.com/channel/0029Vb9BTtuEawdmK4IivD1M) · [Report a security issue](SECURITY.md)

## What’s here

- **Events:** date-aware featured event, registration deadlines, type/venue/search filters, participant information, schedules, maps, downloadable ICS, and individual social sharing cards.
- **Marketplace and spotlight:** real submission and nomination forms, private contact emails, organizer review, and published listings. Collections remain honestly empty until approved material exists.
- **Member accounts:** GitHub OAuth, private-by-default profiles, optional monthly public activity, and account removal.
- **Organizer workspace:** server-authorized review, approval, rejection, and unpublishing with transactional audit records.
- **Journal:** Darshan Krishna N’s original Medium articles and their original cover images.
- **Krafty:** original expressive duck artwork, section-to-section movement, and brief local quacks after a user gesture. No microphone or AI service.

Built with Next.js App Router, React, TypeScript, Supabase PostgreSQL/Auth, Zod, React Hook Form, and native CSS. The dark plum visual system pairs Yatra One and Manrope with a dotted canvas and glossy glass controls.

## Quick start

Use **Node 22.19+** and **npm 11.6.2**, matching CI.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Public content works without provider credentials. Copy [.env.example](.env.example) to the ignored `.env.local` when enabling integrations. Never paste secrets into issues, commits, or browser code.

```sh
npm run build
npm start
```

## Find your way around

| Path                  | Responsibility                                                        |
| --------------------- | --------------------------------------------------------------------- |
| `src/app`             | Public routes, member/organizer pages, server actions, OAuth callback |
| `src/components`      | Shared navigation, forms, event UI, illustrations, Krafty             |
| `src/data`            | Validated event records, community facts, journal, socials            |
| `src/server`          | Fresh identity checks, authorization, database writes, mail adapters  |
| `src/lib`             | Validation, metadata, calendars, provider-independent utilities       |
| `src/styles`          | Shared layout, dark theme, responsive and interaction details         |
| `supabase/migrations` | Reproducible schema, RLS, column grants, transactional RPCs           |
| `scripts/events`      | Safe event maintenance CLI                                            |
| `tests`               | Domain, mail, database security, and browser regression checks        |

Public routes: `/`, `/events`, `/events/[slug]`, `/marketplace`, `/spotlight`, `/journal`, `/leaderboard`, and `/privacy`. `/community` permanently redirects to `/events`. Accounts live at `/account`; unauthorized `/admin` requests return 404. Private routes are excluded from indexing and use private, no-store responses.

## Configuration

All values below are server-side. No service credential uses a `NEXT_PUBLIC_` prefix.

| Variable                       | Purpose                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `SITE_URL`                     | Canonical HTTPS origin and OAuth redirects; localhost allowed for development |
| `SUPABASE_URL`                 | Project API URL                                                               |
| `SUPABASE_PUBLISHABLE_KEY`     | Session client; still subject to database permissions                         |
| `SUPABASE_SECRET_KEY`          | Privileged server client, never exposed to the browser                        |
| `COMMUNITY_ADMIN_USER_IDS`     | Comma-separated immutable Supabase user IDs, never usernames                  |
| `SUBMISSION_HASH_SECRET`       | Optional independent salt for abuse keys; defaults to server secret           |
| `TRUST_PROXY`                  | Enable only behind a proxy that replaces forwarded-IP headers                 |
| `GITHUB_PUBLIC_TOKEN`          | Optional public API quota increase; private repository access unnecessary     |
| `MAIL_FROM`, `MAIL_TO`         | Verified sender and organizer recipient                                       |
| `RESEND_API_KEY` or `SMTP_URL` | Collaboration delivery; Resend takes precedence, SMTP requires TLS            |
| `GOOGLE_ANALYTICS_ENABLED`     | Defaults false; activate only after GA settings are corrected                 |

**Integration status:** GitHub sign-in and community persistence are configured in the existing production deployment. Email/password and anonymous sign-in are disabled. Collaboration mail is not configured; its form preserves the draft and offers a user-initiated email fallback. GA4 remains disabled at the owner’s request. Products and spotlight stories are awaiting real, reviewed submissions.

### Database changes

Keep the migrations even when applying changes through Supabase MCP. They document privileges and power isolated security regression tests. [Supabase notes](supabase/README.md) explain the verified local/remote timestamp mapping for the initial migration. **Do not blindly reapply it or rewrite migration history.** Apply new forward-only migrations, review grants/RLS, and run the database tests before deploying.

Profiles are private by default. Only explicitly granted public columns of opted-in profiles and published listings can be read anonymously. Submission emails, member IDs, reviewer identities, audit records, and abuse keys are private. Browser clients have no mutation privileges or access to write RPCs. Organizer actions check the current authenticated user on every request.

Submissions have durable transactional limits: six per origin, four per email, and 100 globally per UTC hour, with duplicate detection and salted identifiers. Collaboration email currently has a process-local limit; add distributed or edge limits before enabling it across multiple instances. Provider acceptance is required for success and does not guarantee inbox delivery.

### Google Analytics

The previous measurement ID, **G-QM44WYFLFR**, is retained. Production loads the tag only after activation and visitor consent. Previews, local development, account, organizer, and auth routes do not send analytics. Public page views omit query strings, hashes, raw referrers, and private titles. Form interaction pauses collection; advertising storage and personalization remain denied.

Before activation, sign into the owning account, `krowdkraft.official@gmail.com`, and update that web stream:

1. Disable Enhanced Measurement for this page-view-only integration, especially automatic history and form tracking. [Google’s manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views).
2. Disable user-provided data capabilities and automatic detection. [Google’s settings guide](https://support.google.com/analytics/answer/14077171?hl=en-GB).
3. Set `GOOGLE_ANALYTICS_ENABLED=true` in production, redeploy, and verify public views in Realtime while keeping private routes and form data absent.

Visitor consent can be changed on the Privacy page. Automated checks intercept Google requests; they never pollute the real property and are not evidence of GA Realtime delivery.

## Maintain the calendar

[Event records](src/data/events.json) are validated against [the schema](src/data/event-schema.ts). Add original organizer sources, correct relationship labels, and photos only when available. Never invent attendance, winners, venues, or event dates. The public calendar documents seven events; the historical 30+ figure is the community’s reported total, not a count of those records.

```sh
npm run event:list
npm run event:validate
npm run event:add -- --help
npm run event:edit -- --help
npm run event:remove -- --help
```

The CLI writes atomically, prevents accidental duplicates, and supports dry runs. Consult each command’s help before changing records. Upcoming/past classification uses Asia/Kolkata calendar dates and refreshes at local midnight or when a tab returns. Registration closes after the stated deadline; a past event moves into the archive automatically. Exact times are used only when known; undated times export as all-day ICS entries.

Community facts are in [community.ts](src/data/community.ts), destinations in [links.ts](src/data/links.ts), and article metadata in [journal.ts](src/data/journal.ts). Archived events with no original public source omit the external source button. Historical provenance remains in Git history.

## Check your changes

```sh
npm run lint
npm test
npm run event:validate
npm run build
npm run typecheck
npx playwright install chromium
npm run test:browser
npm audit --omit=dev
```

Browser tests run the production build with all provider credentials cleared. They cover 320, 390, 768, and 1440px layouts, accessibility, keyboard navigation, form error recovery, event filtering, route scrolling, calendar downloads, duck behavior, and isolated analytics consent. Database tests use PGlite to check RLS, column privileges, durable limits, and transactional moderation. No real submissions, email, or analytics hits are created by these tests.

Live OAuth, authenticated moderation, email inbox delivery, physical-device behavior, and GA Realtime are separate integration checks. Keep the source tests and CI versioned; generated reports are ignored.

**Dependency note, 14 October 2026:** production audit has no known vulnerabilities. The development lint dependency chain includes the unpatched `braces` advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Do not force-downgrade Next’s ESLint configuration to silence it. See [SECURITY.md](SECURITY.md) for scope and follow-up.

## Contribute

1. Run the app and reproduce the problem before editing.
2. Keep UI states complete: loading, empty, validation error, provider failure, and success.
3. Check keyboard focus, 320px width, reduced motion, and no-JavaScript content.
4. Run the relevant checks above. Describe the behavior changed and the evidence.

Website contributors are listed in [GitHub’s contributor graph](https://github.com/DarshanKrishna-DK/KrowdKraft/graphs/contributors). Repository commit totals are distinct from the opt-in monthly community activity board. That board samples GitHub’s recent public event feed, not the complete contribution graph; private work and older events are excluded.

## Design, assets, and next useful additions

The logo and original community photograph are retained. Medium covers come from the linked articles, which open at their original publication. Font licenses are included in `public/fonts`. Krafty and the code sculpture are original; the referenced avatar lab inspired interaction ideas, and its AGPL code/assets were not copied. Stitch and the requested design skills informed hierarchy and interaction choices; generated factual claims and social links were discarded.

Code rain runs at 15 fps only while visible, stops in background tabs, and has a pause control. Reduced motion produces a static frame. Krafty uses compact anchors without reserved blank rows, has no hover transform, and starts sound only after a user gesture. Navigation opens destination pages at the top; explicit section links retain their targets.

Next content priorities: publish event recaps/resources, restore more original archive sources and photographs, review the first usable community tool, and publish the first verified builder story. Useful later workflows include opt-in mentor availability and requests for project collaborators; neither is presented as available today.

Local briefs, agent configuration, credentials, artifacts, caches, build output, and generated reports are ignored. Source assets, database migrations, and meaningful tests remain in Git.
