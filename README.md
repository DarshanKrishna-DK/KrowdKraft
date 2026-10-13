# KrowdKraft

KrowdKraft is a Bengaluru developer community for learning, building, meeting people, and discovering worthwhile events. This repository is one community website built with Next.js, TypeScript, Tailwind CSS and original Hairline illustrations.

## Run

Use Node 22 or newer. Run `npm ci`, then `npm run dev`. `npm run build` and `npm start` run the production site. Check with `npm run lint`, `npm run typecheck`, and `npm run event:validate`.

## Content

Edit stats and people in `src/data/community.ts`, partners in `src/data/partners.ts`, and events in `src/data/events.json`. Events and partners intentionally start empty. The shared Zod event schema rejects duplicate identities, invalid dates and unsafe URLs. Dates are classified in Asia/Kolkata at read time.

## Mail and join interest

Copy `.env.example` to `.env.local`. Configure `MAIL_FROM` and either `RESEND_API_KEY` or `SMTP_URL`. Resend wins when both are set; the server logs that SMTP was ignored. The default recipient is `krowdkraft.official@gmail.com`. Without a sender and provider, forms report that mail is not configured, never success. Join interest is an email note to the team, not mailing-list enrollment. No addresses are stored in a database.

The form's memory rate limit is per server process. Only enable `TRUST_PROXY` behind a proxy that overwrites the forwarded IP header. Use host-level limits for a multi-instance deployment.

## Design

The original logo is retained, with optimized display exports. Three.js, GSAP, smooth-scroll hijacking, authentication, CMS and database dependencies are intentionally absent. See `docs/PROMPT.md` for the product contract and `docs/IMPLEMENTATION.md` for architecture, states, review sequencing and validation status.

Original figures and the organizer CLI are added in subsequent feature PRs.
