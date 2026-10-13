-- KrowdKraft only. Do not apply to an unrelated product's project.
create table public.kk_members (
  id uuid primary key references auth.users(id) on delete cascade,
  github_id text not null unique check (github_id ~ '^[0-9]+$'),
  github_login text not null unique check (github_login ~ '^[A-Za-z0-9][A-Za-z0-9-]{0,38}$'),
  display_name text not null check (char_length(display_name) between 1 and 100),
  avatar_url text not null,
  is_public boolean not null default false,
  consent_at timestamptz,
  activity jsonb,
  activity_month text check (activity_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  activity_partial boolean not null default false,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  check (not is_public or consent_at is not null)
);
create table public.kk_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('project','nomination')),
  name text not null check (char_length(name) between 2 and 100),
  builder text not null check (char_length(builder) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  url text not null check (char_length(url) <= 2048 and url ~ '^https://'),
  description text not null check (char_length(description) between 30 and 1500),
  category text not null check (category in ('Developer tools','AI & agents','Open source','Web & mobile','Learning','Other')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  fingerprint text not null unique,
  consent_version text not null default '2026-10-13',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);
create table public.kk_projects (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.kk_submissions(id) on delete cascade,
  name text not null, builder text not null, description text not null, url text not null, category text not null,
  is_published boolean not null default true,
  published_at timestamptz not null default now()
);
create table public.kk_spotlights (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.kk_submissions(id) on delete cascade,
  name text not null, builder text not null, description text not null, url text not null,
  month text not null unique check (month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  is_published boolean not null default true,
  published_at timestamptz not null default now()
);
create table public.kk_submission_limits (
  bucket text primary key, used integer not null default 1, expires_at timestamptz not null
);
create table public.kk_audit (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id) on delete set null,
  submission_id uuid references public.kk_submissions(id) on delete set null,
  action text not null, created_at timestamptz not null default now()
);
create index kk_submissions_pending on public.kk_submissions(status,created_at desc);
create index kk_submissions_reviewer on public.kk_submissions(reviewed_by);
create index kk_limits_expiry on public.kk_submission_limits(expires_at);
create index kk_audit_actor on public.kk_audit(actor);
create index kk_audit_submission on public.kk_audit(submission_id);
create index kk_public_activity on public.kk_members(activity_month,synced_at desc) where is_public;

alter table public.kk_members enable row level security;
alter table public.kk_submissions enable row level security;
alter table public.kk_projects enable row level security;
alter table public.kk_spotlights enable row level security;
alter table public.kk_submission_limits enable row level security;
alter table public.kk_audit enable row level security;
revoke all on public.kk_members, public.kk_submissions, public.kk_projects, public.kk_spotlights, public.kk_submission_limits, public.kk_audit from anon, authenticated;
-- Only explicitly public columns are reachable through the public Data API.
grant select (github_login,display_name,avatar_url,activity,activity_month,activity_partial,synced_at) on public.kk_members to anon, authenticated;
grant select (id,name,builder,description,url,category,published_at) on public.kk_projects to anon, authenticated;
grant select (id,name,builder,description,url,month) on public.kk_spotlights to anon, authenticated;
grant all on public.kk_members, public.kk_submissions, public.kk_projects, public.kk_spotlights, public.kk_submission_limits, public.kk_audit to service_role;
grant usage, select on sequence public.kk_audit_id_seq to service_role;
create policy "Consenting public profiles" on public.kk_members for select to anon, authenticated using (is_public);
create policy "Published products" on public.kk_projects for select to anon, authenticated using (is_published);
create policy "Published spotlight editions" on public.kk_spotlights for select to anon, authenticated using (is_published and month <= to_char(now() at time zone 'UTC','YYYY-MM'));

-- Both RPCs use invoker privileges, and only the server's service role can call them.
-- There are no client write grants, no metadata-based roles, and no SECURITY DEFINER functions.
create function public.kk_submit(payload jsonb,client_hash text,email_hash text,submission_hash text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare new_id uuid; counter integer; bucket_key text; keys text[]; ceilings integer[] := array[6,4,100]; i integer;
begin
  if char_length(client_hash) <> 64 or char_length(email_hash) <> 64 or char_length(submission_hash) <> 64 then raise exception 'invalid_submission'; end if;
  delete from public.kk_submission_limits where expires_at < now() - interval '1 day';
  keys := array['client:'||client_hash,'email:'||email_hash,'global'];
  for i in 1..3 loop
    bucket_key := keys[i]||':'||to_char(now() at time zone 'UTC','YYYY-MM-DD-HH24');
    insert into public.kk_submission_limits(bucket,used,expires_at) values(bucket_key,1,date_trunc('hour',now())+interval '1 hour')
      on conflict(bucket) do update set used=public.kk_submission_limits.used+1 returning used into counter;
    if counter > ceilings[i] then raise exception 'rate_limited'; end if;
  end loop;
  insert into public.kk_submissions(kind,name,builder,email,url,description,category,fingerprint)
    values(payload->>'kind',payload->>'name',payload->>'builder',lower(payload->>'email'),payload->>'url',payload->>'description',payload->>'category',submission_hash)
    returning id into new_id;
  return new_id;
end $$;
revoke all on function public.kk_submit(jsonb,text,text,text) from public, anon, authenticated;
grant execute on function public.kk_submit(jsonb,text,text,text) to service_role;

create function public.kk_review_submission(target_id uuid,decision text,display_title text,display_summary text,edition_month text,actor_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare entry public.kk_submissions;
begin
  if decision not in ('approved','rejected') or char_length(display_title) not between 2 and 100 or char_length(display_summary) not between 30 and 1500 then raise exception 'invalid_review'; end if;
  select * into entry from public.kk_submissions where id=target_id and status='pending' for update;
  if not found then raise exception 'already_reviewed'; end if;
  if decision='approved' then
    if entry.kind='project' then
      insert into public.kk_projects(submission_id,name,builder,description,url,category) values(entry.id,display_title,entry.builder,display_summary,entry.url,entry.category);
    else
      insert into public.kk_spotlights(submission_id,name,builder,description,url,month) values(entry.id,display_title,entry.builder,display_summary,entry.url,edition_month);
    end if;
  end if;
  update public.kk_submissions set status=decision,reviewed_at=now(),reviewed_by=actor_id where id=entry.id;
  insert into public.kk_audit(actor,submission_id,action) values(actor_id,entry.id,decision);
end $$;
revoke all on function public.kk_review_submission(uuid,text,text,text,text,uuid) from public, anon, authenticated;
grant execute on function public.kk_review_submission(uuid,text,text,text,text,uuid) to service_role;

create function public.kk_unpublish(target_id uuid,content_kind text,actor_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare source_id uuid;
begin
  if content_kind='project' then
    update public.kk_projects set is_published=false where id=target_id and is_published returning submission_id into source_id;
  elsif content_kind='spotlight' then
    update public.kk_spotlights set is_published=false where id=target_id and is_published returning submission_id into source_id;
  else raise exception 'invalid_kind'; end if;
  if source_id is null then raise exception 'not_published'; end if;
  insert into public.kk_audit(actor,submission_id,action) values(actor_id,source_id,'unpublished');
end $$;
revoke all on function public.kk_unpublish(uuid,text,uuid) from public, anon, authenticated;
grant execute on function public.kk_unpublish(uuid,text,uuid) to service_role;
