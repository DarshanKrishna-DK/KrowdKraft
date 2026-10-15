# Owner launch checklist

The replacement application is built and connected locally. The owner has requested a pull request to `main`. Production deployment, paid infrastructure, and an external notification service remain outside this change.

- Choose and approve the production hosting destination and canonical domain. The retained Vercel project link is historical, not a deployment of this replacement.
- Configure the production Supabase public URL/key, canonical HTTPS `SITE_URL`, and GitHub flag. Runtime does not require a service-role key. Add only the exact production callback URL in Supabase Auth, then verify GitHub sign-in and sign-out on that host.
- Verify HTTPS, hosting access controls, private-route caching, security headers, and canonical/sitemap URLs on the deployed build. Add HSTS at the HTTPS host after confirming the domain configuration.
- Confirm Supabase's backup and restore arrangements, quota monitoring, and incident ownership for the existing project's plan. Perform a restore drill before depending on it as the sole copy of community content.
- Review public event details, contact information, and the privacy notice before launch. Use the organizer desk for updates; content JSON files are seed inputs only.
- Perform a second-account acceptance check for GitHub connection, opt-in/leave, project submission/review/image access, proposal privacy, and sign-out on the final host. Database isolation tests cover these permissions; they do not replace a second real GitHub identity and production callbacks.
- Monitor `krowdkraft-public-github-sync`, per-participant freshness/errors, and the GitHub API budget. Current ingestion permits at most 16 participant updates per hour (48 requests), theoretically 384 per day before retries/manual refreshes. Add an approved server-side GitHub integration before promising daily refresh to a larger community. Previous months currently show their last saved snapshot; a final month-end reconciliation is a separate improvement.
- Provide official Luma page URLs or approved artwork for Preptember (22 September 2025), Blockchain 101 (12 August 2025), and GitHub & LinkedIn Mastery (8 April 2025). Those records use original dimensional title covers and link to the official community archive. x402 uses HackCulture artwork; Namaste Arbitrum, INDIA ONCHAIN, AI-Verse and GrowBiz use verified Luma posters. Hacktoberfest uses its current official poster.
- Provide Deepak N's exact X profile if one should be shown. LinkedIn is verified; Darshan and Viha have verified X links.
- Monitor the 15-minute Medium feed job and its private last-success/error status. Future feed formats or image host changes may require an importer update.
- Review `.env.local`, `.env.previous-production`, and `.env.recovered` privately before any push. They are ignored. Preserve or remove them according to your credential-retention policy; do not paste secrets into issues or chat.
- Decide whether automatic collaboration notifications are needed. The current inbox persists proposals and supports triage; it does not claim to send email.

See [implementation status](details/IMPLEMENTATION-STATUS.md) for verified behavior, security-advisor context, and the boundary between local checks and a launch. The Anatomy source has no geometry recorder, so a complete geometry audit is not certified. The [art verification record](details/ART-VERIFICATION.md) distinguishes visual and endpoint checks from that limitation.
