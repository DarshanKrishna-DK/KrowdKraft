# Database source of truth

Keep this directory in Git. MCP manages the hosted database; migrations document its schema, access rules and functions so a contributor can reproduce and test them.

The initial migration's local filename is `20261013123935_community_clubhouse.sql`. The MCP deployment recorded the same SQL as version `20261013135606`, name `community_clubhouse`, in the KrowdKraft Community project. On 14 October 2026, the whitespace-normalized SQL hashes matched exactly (`5c0d35e32d2b0f6125c2a46966b68608`). The difference is in migration identifiers, not database structure.

Do not blindly run `supabase db push` against the existing project: first reconcile local and remote history with an organizer. Do not reapply the initial schema or delete remote history to make the identifiers match. New schema changes need a new reviewed migration and verification against the selected environment.

`npm test` applies the SQL to an isolated PGlite instance and checks grants, row visibility, durable submission limits and transactional moderation. These tests never write to the hosted project.

The showcase migration is stored as `20261013205828_showcase_social_links.sql`; Supabase MCP applied it as `20261013210923`, name `showcase_social_links`, on 14 October 2026 IST. It adds up to three consented profile links, allows multiple approved builders in an edition, and preserves server-only submission/moderation RPCs. Public readers can access only approved listing fields. Isolated tests cover the new profile-link grants and multiple scheduled spotlights.
