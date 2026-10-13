# KrowdKraft

KrowdKraft is a Bengaluru developer community for learning, building, meeting people and discovering worthwhile events. This repository is one community website built with Next.js, strict TypeScript, Tailwind CSS, five original Hairline illustrations and Krafty, an optional duck guide. The existing community logo and the supplied product brief are preserved.

## Run

Use Node 22.19 or newer and npm 11.6.2 (the version used in CI).

```
npm ci
npm run dev
```

For production locally, run `npm run build`, then `npm start`. Figure modules and standalone benches are generated automatically before development, production builds and typechecking. Set `SITE_URL` to the final public origin when deploying. Vercel previews use their own origin and are marked noindex.

## Content

Edit stats and people in `src/data/community.ts`, partners in `src/data/partners.ts`, and events in `src/data/events.json`. Events and partners intentionally start empty. The shared Zod event schema rejects duplicate identities, invalid dates and unsafe URLs. Dates are classified in Asia/Kolkata at read time.

Use `event:add`, `event:list`, `event:edit`, `event:remove` and `event:validate`. For example: `npm run event:add -- "https://example.com/event"`. The CLI previews source metadata, reviews every field and requires explicit approval before saving. Image downloads require separate approval. Full instructions are in [docs/EVENTS.md](docs/EVENTS.md).

## Mail and join interest

Copy `.env.example` to `.env.local`. Configure `MAIL_FROM` with a sender verified by your provider and either `RESEND_API_KEY` or `SMTP_URL`. Resend wins when both are set; the server logs that SMTP was ignored, without exposing credentials. SMTP requires authenticated TLS certificate validation. `MAIL_TO` accepts one email address and defaults to `krowdkraft.official@gmail.com`.

Client and server both validate submissions. A missing sender/provider gives an explicit unconfigured response and preserves the input. Provider acceptance is required for success copy; it is not a guarantee of inbox delivery. Join interest sends a note to the team, not automatic mailing-list enrollment. No addresses are stored in a database, and payloads are not logged.

The in-memory limits are five submissions per origin per hour and 100 per server process. With `TRUST_PROXY=false`, visitors share one conservative origin bucket. Only enable forwarded-IP trust behind a proxy that replaces that header. The bounded origin map fails closed if its capacity is exhausted and removes expired entries on each request. Multi-instance hosting requires infrastructure-level rate limits. No live mail delivery has been claimed from mocked tests.

## Design

The original logo has optimized WebP/AVIF, icon and social-image exports. Original figure sources and revalidation commands are in [figures/README.md](figures/README.md). The fixed Hairline engine is vendored under its MIT license; no stock drawing is used. Figures mount near the viewport, and phones show only the hero illustration.

Krafty uses original SVG expressions and locally synthesized, opt-in quacks. See [docs/KRAFTY.md](docs/KRAFTY.md). It can be hidden, respects reduced motion and does not require an AI service, microphone, tracking or external media.

Three.js, GSAP, smooth-scroll hijacking, authentication, CMS and database dependencies are intentionally absent. See [docs/PROMPT.md](docs/PROMPT.md) for the unchanged product contract and [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) for architecture and delivery status.

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

`npm run test:events` temporarily builds fixture events, checks populated timelines and event routes, then restores the original JSON and rebuilds it. Stop the local server first. Standard unit tests use isolated temporary files. Browser tests exercise mail's unconfigured state and never send real mail. Production dependencies currently audit clean; an unpatched dev-only glob dependency advisory is recorded in the implementation status.
