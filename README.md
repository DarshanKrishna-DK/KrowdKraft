# KrowdKraft

A Bengaluru developer community website built with Next.js, React and TypeScript. The site includes a researched event archive, downloadable calendars, Medium journal, community socials, product submissions, monthly builder spotlights, an optional GitHub activity board, and Krafty, an expressive travelling duck.

## Run

Use Node 22.19+ and npm 11.6.2, matching CI.

```sh
npm ci
npm run dev
```

For production locally, run `npm run build`, then `npm start`. Copy `.env.example` to `.env.local` for integrations. Never commit credentials. Set `SITE_URL` to the canonical HTTPS origin; Vercel previews are noindex and do not load Analytics.

## Content and events

Community facts and organizer first names live in `src/data/community.ts`; social destinations in `src/data/links.ts`; Medium article metadata in `src/data/journal.ts`. Articles link to the original publication and are not republished here.

Events live in `src/data/events.json`. The 2026 Hacktoberfest Hack Day and x402 PreHack link to organizer sources; historical workshops come from this repository's previous community archive. HackCulture is attributed as the x402 innovation partner. Registration availability is separate from the event date: the 18 October Hack Day closed registration on 7 October. Calendar downloads use UTC timestamps and RFC 5545 escaping/folding. Date classification uses Asia/Kolkata and includes ongoing multi-day events.

```sh
npm run event:add -- "https://example.com/event"
npm run event:list
npm run event:edit -- event-slug
npm run event:remove -- event-slug
npm run event:validate
```

The CLI previews imported metadata and asks before saving. Missing information must be supplied rather than invented. Image downloads need separate confirmation. Imports pin public DNS addresses, reject private destinations, bound redirects and response size, and do not execute remote scripts. Writes are locked and atomic, with concurrent edits rejected. Images are retained when an event is removed. New optional time, participant and registration-deadline fields can also be edited directly in the validated JSON.

## Supabase and GitHub sign-in

The **KrowdKraft Community** project (`qbmvzxucumzwvrizgbiy`) belongs to the KrowdKraft organization and uses the free plan in Mumbai (`ap-south-1`). Its community migration is applied, GitHub OAuth is configured, and the existing `krowd-kraft` Vercel project's production environment contains the server-side credentials. The separate CryptoKrowd project is unchanged. Other environments remain usable without credentials: GitHub connection is marked coming soon, and a failed online submission retains its draft with a user-initiated email alternative. Products and builder features start empty; no invented listings, winners or member scores are seeded.

Setup in the selected KrowdKraft project:

1. The migration `supabase/migrations/20261013123935_community_clubhouse.sql` is already applied to this project. Live checks confirmed RLS on all six tables. Security and performance advisors returned no warnings or errors; informational findings concern intentionally server-only tables and indexes on the empty database. For another environment, review and apply the migration before connecting it. Isolated PGlite tests additionally verify access rules, rate limits and moderation transactions.
2. Set server-only `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` in the existing Vercel project's production environment. Use a publishable key and secret/service-role key for the same project. No key belongs in a `NEXT_PUBLIC_` variable here.
3. The [KrowdKraft Community OAuth application](https://github.com/settings/applications/3929124) is owned by `DarshanKrishna-DK`. Its callback is `https://qbmvzxucumzwvrizgbiy.supabase.co/auth/v1/callback`. GitHub is enabled in Supabase Auth, its Site URL is `https://krowd-kraft.vercel.app`, and the sole allowed redirect is `https://krowd-kraft.vercel.app/auth/callback`. Wildcard callbacks and device flow are off. Add an exact local callback only when intentionally testing OAuth locally. The website exposes GitHub sign-in only; other Supabase provider settings are unchanged.
4. Sign in, then configure `COMMUNITY_ADMIN_USER_IDS` with the immutable Supabase Auth UUIDs of approved organizers. Do not use email addresses, names, or editable user metadata as roles.
5. Verify the complete live sign-in, private/public consent, activity refresh, sign-out and account deletion flows. Exercise organizer approval and rejection with an explicitly authorized real submission.

GitHub requests only `read:user user:email`, never repository write access. The callback verifies the handle and immutable ID directly with GitHub; it does not trust editable profile metadata. Supabase PKCE sessions use HTTP-only secure cookies in production, proxy refresh, and fresh server-side user verification. Callback destinations are fixed. Member profiles are private until explicit publication consent and can be hidden or deleted.

The board counts public push events, opened pull requests, created reviews and opened issues in the current UTC month, one point each. It is not a complete GitHub contribution graph or a measure of developer quality. GitHub's public events API provides a bounded recent window and at most 300 events; capped snapshots are labeled. Members refresh their snapshot manually, at most once per 15 minutes after a successful sync. Failed refreshes retain the previous snapshot. `GITHUB_PUBLIC_TOKEN` is optional for public API quota. Website contributors are independently fetched from this repository and cached for one hour.

## Submissions and organizer review

Marketplace listings and spotlight nominations collect a private contact **email only**, the work's public link, attribution, description, and explicit contact/publication consent. `/admin` is restricted to configured organizer UUIDs; it supports reviewing, editing public copy, approving/rejecting, scheduling monthly spotlights and unpublishing. Future spotlight editions remain hidden until their UTC month. Publication and audit entries are transactional.

All public database tables have RLS. Anonymous users can read only explicitly granted columns of published content or consenting profiles. They cannot read submissions, email addresses, audit entries or member identifiers, and cannot execute write RPCs. No client has write privileges. Secrets stay server-side. Approval requires a fresh organizer check; editable metadata is never an authorization source.

Submissions use durable transactional limits of six per origin, four per email, and 100 globally per UTC hour, plus duplicate detection. Abuse keys are salted hashes, not plaintext IPs. Set `SUBMISSION_HASH_SECRET` separately if desired; otherwise the server secret supplies the salt. `TRUST_PROXY=false` shares a conservative origin bucket. Enable proxy trust only where the hosting proxy replaces the forwarded-IP header. Limits are pruned after expiry; they do not replace hosting-level traffic controls.

## Collaboration mail

Set `MAIL_FROM` to a verified sender and either `RESEND_API_KEY` or authenticated TLS `SMTP_URL`. Resend takes precedence. `MAIL_TO` defaults to `krowdkraft.official@gmail.com`. Client and server validate the form. Success requires provider acceptance, which is not a guarantee of inbox delivery. Missing configuration and failures preserve the draft and provide a user-initiated email fallback. No form payloads or credentials are logged. Mail rate limits are process-local; multi-instance deployments should add infrastructure-level limits.

## Google Analytics

The previous codebase's GA4 measurement ID **`G-QM44WYFLFR`** is restored. Analytics is **disabled by default** through `GOOGLE_ANALYTICS_ENABLED=false` while the owner updates the existing property. The footer shows “Analytics off” until enabled. After activation, `src/components/analytics.tsx` loads Google's tag only after a visitor chooses “Allow analytics,” on production public pages. Local development and Vercel previews do not load it. Declining disables collection and clears matching first-party GA cookies for the current host.

Manual page views cover public routes and omit query strings, hashes, raw referrers and private page titles. Account, organizer and authentication routes are excluded. Collection is paused before form interaction and mailto/private-route link activation. We do not send form fields, emails, GitHub identifiers, submissions or search terms as analytics events. Advertising storage and personalization remain denied.

The owner chose to configure Analytics settings later. Sign into Google Analytics with `krowdkraft.official@gmail.com`, select the web stream with measurement ID `G-QM44WYFLFR`, then:

1. In Admin → Data streams → the web stream → Enhanced measurement, turn off Enhanced measurement for this page-view-only implementation. At minimum disable browser-history page changes and automatic form interactions. Google documents that enhanced history tracking can create additional page views even with `send_page_view: false`: [manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views).
2. In the Google tag's configuration, disable **Allow user-provided data capabilities**, including automatic detection. This website does not need email matching or enhanced conversions. See [Google's user-provided data settings](https://support.google.com/analytics/answer/14077171?hl=en-GB).
3. Set `GOOGLE_ANALYTICS_ENABLED=true` in the existing Vercel project's production environment and redeploy. On the public site, allow analytics and confirm public page views in GA Realtime. Private routes and form data must stay absent.

The current public tag configuration was checked and still includes automatic history/form tracking and user-provided-data detection, so the activation flag should remain false until these settings are changed. Automated tests intercept Analytics requests and do not pollute the real property; they do not establish real Realtime delivery.

## Design and assets

The midnight, ivory, lime and lilac design uses original layered scenes: a clay computer with HTML code on its screen, a perforated event ticket, a real community photograph, orbital product art, a spotlight rosette, contribution tiles and distinct journal covers. It uses native scrolling, CSS animation, restrained requestAnimationFrame parallax, reduced-motion support and a persistent pause control. Native dialogs manage focus and keyboard navigation; public content remains readable without JavaScript.

Krafty has six original SVG expressions and locally synthesized opt-in sound. It travels to reserved section anchors, reacts to form states and clicks, and can be hidden. It does not follow the cursor, use a microphone, call an AI service or load external audio. The reference avatar lab informed the state-based interaction concept; its AGPL code and assets were not copied.

`public/art/clubhouse-computer.webp` was generated with the built-in imagegen tool and optimized to WebP. Prompt direction: an original cream clay CRT computer, lavender glass screen and keyboard, soft tactile lighting, curved cable, transparent background, with no lettering, logos or code baked into the image. The interface and animation are live HTML/CSS/SVG. `public/events/ai-verse-2025.webp` is an optimized photograph recovered from this repository's previous MSRIT event archive. The existing KrowdKraft logo is preserved.

## Checks

```sh
npm test
npm run lint
npm run event:validate
npm run build
npm run typecheck
npx playwright install chromium
npm run test:browser
```

Tests cover validation, calendar boundaries, durable database limits, RLS/column privileges, transactional moderation, consent, mail provider acceptance and event-import safety. Browser checks use the production build with provider credentials cleared, cover desktop/mobile accessibility, navigation, form failure recovery, duck behavior and Analytics consent, and never send real mail, submissions or Analytics hits. Database tests use an isolated in-memory PostgreSQL-compatible engine, not a connected project. Live OAuth, provider delivery, moderation and GA Realtime remain separate checks.

Project briefs, agent configuration, local artifacts, credentials, build output and generated test reports are ignored. Source tests and CI remain versioned to protect identity, privacy and real form behavior.
