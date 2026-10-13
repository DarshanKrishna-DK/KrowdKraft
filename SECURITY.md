# Security

Report suspected vulnerabilities privately to **krowdkraft.official@gmail.com**. Include the affected route, reproduction steps, and impact. Do not post credentials or other members’ data in public issues. Avoid destructive testing or unsolicited production submissions.

## Boundaries

- GitHub OAuth identifies members; organizer access uses immutable Supabase user IDs and fresh server-side authentication.
- PostgreSQL RLS and column privileges restrict public reads. Mutation RPCs are server-only. Submission emails and moderation records are private.
- Strict input validation, output escaping, duplicate detection, and durable community-submission limits are enforced on the server.
- Security headers deny framing and object embedding, constrain base URLs, disable camera/microphone/geolocation, and prevent content sniffing. This is not a nonce-based strict script CSP.
- Secrets belong in encrypted hosting settings or ignored local environment files, never client bundles or Git.

## Known limitations and follow-up

As of 14 October 2026, `npm audit --omit=dev` reports no production vulnerabilities. The development-only ESLint chain pulls `braces` through `fast-glob` and `micromatch`. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) can exhaust the stack when processing adversarial patterns. There is no patched release at this audit date. Current lint patterns are repository-controlled. Monitor upstream and update the compatible dependency chain when fixed; do not use `npm audit fix --force` to downgrade Next’s ESLint integration.

Collaboration email is not enabled in production. Its current rate limit is process-local; add distributed or edge abuse controls before enabling mail on multiple instances. Community product and nomination limits are already transactional in PostgreSQL.

Supabase’s leaked-password protection advisory is not enabled on this Free project. Email/password sign-in was disabled with owner approval; GitHub remains enabled. Reassess password defenses before adding a password provider. Restrictive RLS-without-policy advisories on private service-only tables are intentional.

Automated tests cover application authorization and database privileges in isolation. They do not constitute a penetration test or a guarantee that all vulnerabilities are absent. Live provider changes and destructive member/organizer workflows need scoped verification without using real member data as fixtures.
