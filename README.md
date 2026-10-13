# KrowdKraft

KrowdKraft is a Bengaluru developer community for learning, building, meeting people and discovering worthwhile events. This repository is one community website built with Next.js, strict TypeScript, Tailwind CSS, five original Hairline illustrations and Krafty, an optional duck guide. The existing community logo is preserved.

## Run

Use Node 22.19 or newer and npm 11.6.2 (the version used in CI).

```
npm ci
npm run dev
```

For production locally, run `npm run build`, then `npm start`. Figure modules and standalone benches are generated automatically before development, production builds and typechecking. Set `SITE_URL` to the final public origin when deploying. Vercel previews use their own origin and are marked noindex. Without a known origin, production omits the absolute social-image URL instead of publishing localhost metadata.

## Content

Edit stats and people in `src/data/community.ts`, partners in `src/data/partners.ts`, and events in `src/data/events.json`. Events and partners intentionally start empty. The shared Zod event schema rejects duplicate identities, invalid dates and unsafe URLs. Dates are classified in Asia/Kolkata at read time.

The CLI previews source metadata, reviews every field and requires explicit approval before saving. Enter keeps a displayed value; `-` clears an optional field. Save prompts default to cancellation. Image downloads require separate approval and produce local WebP assets. Keeping a remote image requires typing `Keep remote URL`; that host will receive visitors' image requests.

```
npm run event:add -- "https://example.com/event"
npm run event:add
npm run event:list
npm run event:edit -- event-slug
npm run event:remove -- event-slug
npm run event:validate
```

URL imports read public HTML metadata without executing the site's scripts. Fill missing fields manually; never invent events. The downloader checks and pins public DNS addresses, bounds redirects and response sizes, and rejects credentials/private destinations. Writes use a lock and atomic replacement, refusing to overwrite concurrent edits. Removal retains image assets. After a killed organizer process, confirm no writer remains before removing a stale `src/data/events.json.lock`.

## Mail and join interest

Copy `.env.example` to `.env.local`. Configure `MAIL_FROM` with a sender verified by your provider (one address, optionally `KrowdKraft <hello@example.com>`) and either `RESEND_API_KEY` or `SMTP_URL`. Resend wins when both are set; the server logs that SMTP was ignored, without exposing credentials. SMTP requires authenticated TLS certificate validation. `MAIL_TO` accepts one email address and defaults to `krowdkraft.official@gmail.com`.

Client and server both validate submissions. A missing sender/provider gives an explicit unconfigured response and preserves the input. Provider acceptance is required for success copy; it is not a guarantee of inbox delivery. Join interest sends a note to the team, not automatic mailing-list enrollment. No addresses are stored in a database, and payloads are not logged.

The in-memory limits are five submissions per origin per hour and 100 per server process. With `TRUST_PROXY=false`, visitors share one conservative origin bucket. Only enable forwarded-IP trust behind a proxy that replaces that header. The bounded origin map fails closed if its capacity is exhausted and removes expired entries on each request. Multi-instance hosting requires infrastructure-level rate limits. No live mail delivery has been claimed from mocked tests.

## Design

The original logo has optimized WebP/AVIF, icon and social-image exports. Original figure sources and revalidation commands are in [figures/README.md](figures/README.md). The fixed Hairline engine is vendored under its MIT license; no stock drawing is used. Figures mount near the viewport, and phones show only the hero illustration.

Krafty uses six original SVG expressions and locally synthesized, opt-in quacks. It offers contextual section/event guidance, reacts to real form outcomes, can be hidden, and respects reduced motion. Sound starts only after an explicit sound-button gesture. It does not require an AI service, microphone, tracking or external media.

Three.js, GSAP, smooth-scroll hijacking, authentication, CMS and database dependencies are intentionally absent. Project briefs, local agent configuration and development artifacts are kept outside Git tracking. Source tests and CI remain versioned because they verify mail, organizer data safety and browser behavior; generated test reports are ignored.

## Checks

```
npm test
npm run lint
npm run typecheck
npm run event:validate
npm run figures:validate
npm run build
npx playwright install chromium
npx playwright test
```

`npm run test:events` temporarily builds fixture events, checks populated timelines and event routes, then restores the original JSON and rebuilds it. Stop the local server first. Standard unit tests use isolated temporary files. Browser tests exercise mail's unconfigured state and never send real mail. On 13 October 2026, production dependencies audited clean; the full audit reported five high dev-only findings through the unpatched braces/micromatch/fast-glob ESLint toolchain. Recheck when updating dependencies.

If the event browser process is interrupted, stop its remaining build/server processes before recovery. Compare `src/data/events.json` with `.artifacts/event-browser-original.json` and any work you made during the run. The backup contains the original data. Restore it only after preserving newer legitimate edits; never commit fixture records. Once the correct data is restored, remove that backup and the stale `src/data/events.json.lock`, run `npm run event:validate`, and rebuild. The harness deliberately refuses to overwrite an existing backup or concurrent edits.
