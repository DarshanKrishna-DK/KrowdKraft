-- Optional GitHub participation; there is no member profile dashboard.
create table public.workshop_github_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  github_id text unique not null check (github_id ~ '^[0-9]+$'),
  login text not null check (login ~ '^[A-Za-z0-9][A-Za-z0-9-]{0,38}$'),
  listed boolean not null default false,
  connected_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  sync_error text check (sync_error in ('rate_limited','unavailable','identity_changed','incomplete'))
);
create table public.workshop_github_months (
  user_id uuid not null references public.workshop_github_connections(user_id) on delete cascade,
  month date not null check (extract(day from month)=1),
  commits integer not null check (commits>=0),
  pull_requests integer not null check (pull_requests>=0),
  score bigint generated always as (commits::bigint+pull_requests::bigint) stored,
  synced_at timestamptz not null default now(),
  primary key(user_id,month)
);
alter table public.workshop_github_connections enable row level security;
alter table public.workshop_github_months enable row level security;
revoke all on public.workshop_github_connections,public.workshop_github_months from anon,authenticated;
grant select on public.workshop_github_connections,public.workshop_github_months to authenticated;
create policy github_connection_self on public.workshop_github_connections for select to authenticated using(user_id=(select auth.uid()));
create policy github_month_self on public.workshop_github_months for select to authenticated using(user_id=(select auth.uid()));
create index workshop_github_sync_queue on public.workshop_github_connections(last_attempt_at) where listed;
create index workshop_github_month_ranking on public.workshop_github_months(month,score desc);

create function public.workshop_set_github_participation(enabled boolean) returns void
language plpgsql security definer set search_path='' as $$
declare member_id uuid:=auth.uid(); ident record;
begin
  if member_id is null then raise exception 'Connect GitHub first.'; end if;
  if not enabled then
    update public.workshop_github_connections set listed=false where user_id=member_id;
    return;
  end if;
  select provider_id,coalesce(identity_data->>'user_name',identity_data->>'preferred_username') as login
    into ident from auth.identities where user_id=member_id and provider='github' limit 1;
  if ident.provider_id is null or ident.login !~ '^[A-Za-z0-9][A-Za-z0-9-]{0,38}$'
    then raise exception 'A verified GitHub identity is required.'; end if;
  insert into public.workshop_github_connections(user_id,github_id,login,listed)
    values(member_id,ident.provider_id,ident.login,true)
    on conflict(user_id) do update set login=excluded.login,github_id=excluded.github_id,listed=true,sync_error=null;
end $$;
revoke all on function public.workshop_set_github_participation(boolean) from public;
grant execute on function public.workshop_set_github_participation(boolean) to authenticated;

create function public.workshop_leaderboard(target_month date)
returns table(login text,github_id text,commits integer,pull_requests integer,score bigint,rank bigint,synced_at timestamptz)
language sql stable security definer set search_path='' as $$
  select c.login,c.github_id,m.commits,m.pull_requests,m.score,
    rank() over(order by m.score desc),m.synced_at
  from public.workshop_github_months m join public.workshop_github_connections c on c.user_id=m.user_id
  where c.listed and m.month=target_month
  order by m.score desc,lower(c.login) limit 100;
$$;
revoke all on function public.workshop_leaderboard(date) from public;
grant execute on function public.workshop_leaderboard(date) to anon,authenticated;
