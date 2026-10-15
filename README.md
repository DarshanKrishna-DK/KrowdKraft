# KrowdKraft

A community workshop for curious builders. The replacement uses Next.js, React, TypeScript, Three.js, and Supabase Postgres, Auth, and Storage. The current [design direction](DESIGN.md) is a still dark plum surface with visible rose dots, raised glass components, Devanagari-influenced Jaini headings, an expanded section navigation bar, and cream pink isometric figures. See the [build contract](details/BUILD-CONTRACT.md) for product and authorization boundaries. The original reference analysis is retained as historical research.

## Run locally

Use Node.js 22.14 or later and npm. The existing `.env.local` connects this checkout to KrowdKraft's database. Keep it private.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To run the optimized application, stop the development server, run `npm run build`, then `npm start`. Both commands bind to loopback by default. A public production deployment remains a separate owner-approved step.

For another checkout, copy `.env.example` to `.env.local`, then set the Supabase URL and publishable key, `SITE_URL`, and `GITHUB_AUTH_ENABLED`. The application requires a real database; it does not substitute fixtures when a connection fails. `SUPABASE_SECRET_KEY` is optional setup tooling only, never a runtime requirement or a public environment variable.

## What is connected

- Public event directory, filters, official external event links, registration state, calendar choices, automatically refreshed Medium posts, approved project board, and community links.
- Optional GitHub connection through Supabase, an opt-in monthly developer leaderboard, project submissions with optional images, and private collaboration proposals. There is no viewer account dashboard, editable member profile, or bookmark interface.
- Organizer desk for event and article drafts/publication, poster uploads, site settings, project review/unpublishing, proposal triage, and audit records.
- Anatomy desktop with repeating typing, original isometric agenda printer with a calendar popup, three distinct Three.js learning/building/sharing scenes, and the branded Anatomy arcade cabinet. The background is still; operating-system reduced-motion preferences are respected. The global motion button has been removed.
- Events, builds and leaderboard directories have pale isometric illustrations. Accessible event/month filters update automatically. Project sharing opens a native dialog during site navigation and retains a direct `/share` fallback. Two continuous logo strips include all 17 verified collaborators and institutions.

Event registration remains with the event's official provider. Calendar downloads are not reservations. Journal entries link to the original articles. Collaboration proposals are saved in the organizer inbox; no email notification provider is configured. Empty project and leaderboard states are genuine, with no fabricated activity.

## Database and authentication

The existing project is **KrowdKraft Community**, reference `qbmvzxucumzwvrizgbiy`, in the KrowdKraft organization. The new tables use the `workshop_` prefix. Earlier `kk_*` tables and local archives are preserved.

Ten new workshop migrations in `supabase/migrations/` define tables, constraints, row-level security, storage policies, immutable ownership, review transactions, write limits, audit triggers, opt-in GitHub participation, scheduled public GitHub ingestion, community statistics and partner data, and a private Medium RSS importer. They are already applied to the existing project. The earlier clubhouse migration is retained unchanged to preserve migration history. For an empty Supabase development project, apply the migrations in filename order, then apply `supabase/seeds/content.sql` through trusted database tooling. The sync migration requires Supabase's `http` and `pg_cron` extensions. Do not reset the existing project.

`npm run db:prepare` regenerates the content seed from retained `details/*.json`. It does not connect to a database. `npm run db:seed` applies those same content records using a server-only setup key. Both seed paths preserve existing rows and never grant organizer roles. Public pages read database records after setup; editing the JSON files does not change live content.

The existing GitHub OAuth provider is reused. Supabase allows `http://localhost:3000/auth/callback` for local sign-in. The GitHub OAuth App callback stays at the Supabase Auth callback. For a future deployment, set `SITE_URL` to its canonical HTTPS origin and add that exact application's `/auth/callback` to Supabase's redirect allowlist. Do not use broad wildcard callbacks for production.

Organizer access comes exclusively from `workshop_roles`, using the Supabase Auth user UUID. The owner approved the existing DarshanKrishna-DK account and its owner role. Future grants must verify the precise account and approved privileges through trusted database administration. User metadata, public names, and client form fields cannot grant roles. There is no public role-management API.

## GitHub leaderboard

The selected scoring is **one point per indexed public commit and one point per public pull request opened**, counted within a UTC calendar month. Commit search covers default branches. Equal scores share a rank; timestamps and source limitations appear in the UI. GitHub OAuth verifies identity, and a separate explicit action controls listing. Signing out does not change participation; Leave the leaderboard hides the entry.

The database cron runs every minute and selects a listed participant due for a daily update. Ingestion verifies the GitHub numeric identity, rejects incomplete or failed responses, and preserves the last verified score. Manual refresh is limited to once an hour. The unauthenticated API budget is capped at 16 participant updates / 48 requests per hour; monitor queue age as participation grows. Historical months retain their last saved snapshot, not a guaranteed month-end total. No GitHub provider token or runtime service-role key is stored.

## Medium and source data

The fixed official feed at https://medium.com/feed/@cryptech_dk refreshes every 15 minutes through a private database function. The homepage shows the newest three published posts and their original covers. Failed refreshes preserve the last successful data. Monitor workshop_private.medium_sync and the krowdkraft-medium-feed cron job.

Verified event, organizer, partner and component sources are recorded in [REDESIGN-RESEARCH.md](details/REDESIGN-RESEARCH.md). The one-time research importer is not needed for ordinary builds; all runtime assets are retained in public/.

The font and partner sources, popup behavior, directory changes and earlier responsive evidence are recorded in [REFINEMENT-VERIFICATION.md](details/REFINEMENT-VERIFICATION.md). The latest navigation, animated figures and spacing changes, including the browser-verification limitation, are recorded in [MOTION-REFINEMENT.md](details/MOTION-REFINEMENT.md). Both requested font examples are personal-use-only; the bundled Jaini typeface uses the SIL Open Font License.

## Validation

```sh
npm test
npm run typecheck
npm run format:check
npm run build
npm audit --omit=dev
npm run check:connections
# Start the local server before this read-only check:
npm run check:http
```

Tests run the policy migrations and adversarial RLS scenarios in isolated PGlite, plus URL validation, upload signatures, and event/calendar boundary tests. The extension-backed GitHub and Medium syncs are checked against the real Supabase project separately; PGlite does not emulate that network job. Tests do not create fake participants or submissions in the connected project. Browser verification and its limits are recorded in [IMPLEMENTATION-STATUS.md](details/IMPLEMENTATION-STATUS.md). The local GitHub Actions workflow runs source checks after you push; it performs no deployment.

## Repository layout

- `src/app/`: public, optional GitHub, submission, organizer, authentication, calendar, and health routes.
- `src/components/`: reusable forms, navigation, content, and interactive figures.
- `src/lib/`: database access, server actions, validation, dates, and shared types.
- `supabase/`: additive migrations and idempotent content seed.
- `scripts/`: figure generation, setup, and connection/HTTP verification.
- `tests/`: isolated database and application tests.
- `public/`: runtime fonts, branding, posters, and generated illustrations.
- `assets/` and `details/`: retained assets, source content, research, and provenance.
- Raw reference-site captures and downloaded bundles under `details/research/2026-10-14-design-study/cyera/` and `dwayne/` stay local and are ignored. Links to these captures in historical analysis require the original local research folder.
- `.local-data/`: preserved private databases and files, ignored by Git.
- `.vercel/`: preserved historical project link, ignored by Git.

The computer adapts the MIT-licensed Anatomy drawing kit; the printer is an original KrowdKraft construction using that kit. The arcade cabinet adapts an existing Anatomy example. The retained pin field is an original Hairline figure, available as a standalone artifact. Unmodified Hairline kernel and bench tooling are vendored under `scripts/hairline/` so builds do not depend on a local skill installation. Attribution is in `public/licenses/`. Figure checks and reproduction commands are in [ART-VERIFICATION.md](details/ART-VERIFICATION.md). Original branding and event assets are retained with provenance. Reference websites informed composition; their application bundles are not used by the runtime.

See [To-do.md](To-do.md) for deployment and operational checks that require the owner's chosen production destination. Never include `.env*` recovery files, credentials, `.local-data/`, or signed image URLs in a commit.
