-- Public GitHub API ingestion runs in Postgres. No provider token or service key is retained.
create extension if not exists http with schema extensions;
create extension if not exists pg_cron;
do $$ declare f record; begin
  for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='extensions' and p.proname like 'http%'
  loop execute format('revoke execute on function %s from public,anon,authenticated',f.signature); end loop;
end $$;

create table workshop_private.github_sync_budget(hour timestamptz primary key,used integer not null);
revoke all on workshop_private.github_sync_budget from public,anon,authenticated;
create function workshop_private.github_json(endpoint text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare response extensions.http_response; body jsonb;
begin
  if endpoint !~ '^/(users/[A-Za-z0-9-]+|search/(commits|issues)\?)' then raise exception 'Invalid endpoint'; end if;
  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT_MS','4000');
  select * into response from extensions.http(('GET','https://api.github.com'||endpoint,
    array[extensions.http_header('User-Agent','KrowdKraft-Community'),extensions.http_header('Accept','application/vnd.github+json'),extensions.http_header('X-GitHub-Api-Version','2022-11-28')],
    null,null)::extensions.http_request);
  if response.status in (403,429) then raise exception 'rate_limited'; end if;
  if response.status<>200 then raise exception 'unavailable'; end if;
  body:=response.content::jsonb;
  if coalesce((body->>'incomplete_results')::boolean,false) then raise exception 'incomplete'; end if;
  return body;
end $$;
revoke all on function workshop_private.github_json(text) from public,anon,authenticated;

create function workshop_private.sync_github_member(member_id uuid) returns text
language plpgsql security definer set search_path='' as $$
declare c public.workshop_github_connections; profile jsonb; commit_data jsonb; pr_data jsonb;
  period date:=(date_trunc('month',now() at time zone 'UTC'))::date;
  last_day date; date_query text; available integer; failure text;
begin
  if not pg_try_advisory_xact_lock(7938821) then return 'queued'; end if;
  select * into c from public.workshop_github_connections where user_id=member_id and listed for update;
  if c.user_id is null then return 'not_listed'; end if;
  if c.last_attempt_at>now()-interval '1 hour' then return 'queued'; end if;
  insert into workshop_private.github_sync_budget(hour,used) values(date_trunc('hour',now()),0) on conflict do nothing;
  -- At most 48 unauthenticated requests/hour. Never run requests in a page render.
  update workshop_private.github_sync_budget set used=used+1
    where hour=date_trunc('hour',now()) and used<16 returning used into available;
  if available is null then return 'queued'; end if;
  delete from workshop_private.github_sync_budget where hour<now()-interval '2 days';
  update public.workshop_github_connections set last_attempt_at=now(),sync_error=null where user_id=member_id;
  begin
    profile:=workshop_private.github_json('/users/'||c.login);
    if profile->>'id'<>c.github_id then raise exception 'identity_changed'; end if;
    last_day:=(period+interval '1 month'-interval '1 day')::date;
    date_query:=period::text||'..'||last_day::text;
    commit_data:=workshop_private.github_json('/search/commits?per_page=1&q='||extensions.urlencode('author:'||c.login||' author-date:'||date_query||' is:public'));
    pr_data:=workshop_private.github_json('/search/issues?per_page=1&q='||extensions.urlencode('author:'||c.login||' is:pr created:'||date_query||' is:public'));
    if jsonb_typeof(commit_data->'total_count')<>'number' or jsonb_typeof(pr_data->'total_count')<>'number' then raise exception 'incomplete'; end if;
    insert into public.workshop_github_months(user_id,month,commits,pull_requests,synced_at)
      values(member_id,period,(commit_data->>'total_count')::integer,(pr_data->>'total_count')::integer,now())
      on conflict(user_id,month) do update set commits=excluded.commits,pull_requests=excluded.pull_requests,synced_at=excluded.synced_at;
    return 'synced';
  exception when others then
    failure:=case when sqlerrm in ('rate_limited','identity_changed','incomplete') then sqlerrm else 'unavailable' end;
    update public.workshop_github_connections set sync_error=failure where user_id=member_id;
    return failure;
  end;
end $$;
revoke all on function workshop_private.sync_github_member(uuid) from public,anon,authenticated;

create function public.workshop_refresh_github() returns text language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Connect GitHub first.'; end if;
  return workshop_private.sync_github_member(auth.uid());
end $$;
revoke all on function public.workshop_refresh_github() from public;
grant execute on function public.workshop_refresh_github() to authenticated;

create function workshop_private.refresh_github_queue() returns void language plpgsql security definer set search_path='' as $$
declare member_id uuid;
begin
  select user_id into member_id from public.workshop_github_connections
    where listed and (last_attempt_at is null or last_attempt_at<now()-interval '24 hours')
    order by last_attempt_at asc nulls first limit 1;
  if member_id is not null then perform workshop_private.sync_github_member(member_id); end if;
end $$;
revoke all on function workshop_private.refresh_github_queue() from public,anon,authenticated;
select cron.schedule('krowdkraft-public-github-sync','* * * * *','select workshop_private.refresh_github_queue()');
