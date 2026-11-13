-- Quarterly leaderboard entries and the organizer Telegram bot's conversation state.
create table public.workshop_leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  member text not null check (length(member) between 2 and 80),
  track text not null check (track in ('developers','creators')),
  kind text not null check (kind ~ '^[a-z]+(-[a-z]+)*$'),
  date date not null,
  evidence text not null default '' check (length(evidence) <= 300),
  created_at timestamptz not null default now()
);
create index workshop_leaderboard_entries_date on public.workshop_leaderboard_entries(date);
alter table public.workshop_leaderboard_entries enable row level security;
grant select on public.workshop_leaderboard_entries to anon, authenticated;
grant insert, update, delete on public.workshop_leaderboard_entries to authenticated;
create policy leaderboard_public on public.workshop_leaderboard_entries for select to anon, authenticated using (true);
create policy leaderboard_admin on public.workshop_leaderboard_entries for all to authenticated
  using ((select workshop_private.is_organizer())) with check ((select workshop_private.is_organizer()));

-- Only the server's secret key reaches these: RLS is on and no policies exist.
create table public.workshop_bot_sessions (
  chat_id bigint primary key,
  flow text not null,
  step integer not null,
  data jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create table public.workshop_bot_updates (
  update_id bigint primary key,
  created_at timestamptz not null default now()
);
alter table public.workshop_bot_sessions enable row level security;
alter table public.workshop_bot_updates enable row level security;
revoke all on public.workshop_bot_sessions, public.workshop_bot_updates from anon, authenticated;
