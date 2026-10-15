-- Workshop v2 is additive. Existing kk_* data remains untouched.
create schema if not exists workshop_private;
revoke all on schema workshop_private from public;
grant usage on schema workshop_private to authenticated;

create table public.workshop_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','organizer')),
  created_at timestamptz not null default now()
);
alter table public.workshop_roles enable row level security;
grant select on public.workshop_roles to authenticated;
create policy role_self on public.workshop_roles for select to authenticated using (user_id = (select auth.uid()));
create function workshop_private.is_organizer() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from public.workshop_roles where user_id = auth.uid());
$$;
revoke all on function workshop_private.is_organizer() from public;
grant execute on function workshop_private.is_organizer() to authenticated;

create table public.workshop_settings (
  id text primary key check (id = 'community'),
  name text not null, description text not null, city text not null, email text not null,
  links jsonb not null default '{}', organizers jsonb not null default '[]',
  updated_at timestamptz not null default now()
);
create table public.workshop_events (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(title) between 3 and 160),
  description text not null check (length(description) between 10 and 6000),
  date date not null, starts_at timestamptz, ends_at timestamptz,
  venue text not null, city text not null default 'Bengaluru',
  type text not null check (type in ('hackathon','workshop','meetup','technical-session')),
  relationship text not null default 'hosted', image text,
  source_url text not null check (source_url ~ '^https://'),
  registration_url text check (registration_url is null or registration_url ~ '^https://'),
  participant_url text check (participant_url is null or participant_url ~ '^https://'),
  registration_deadline date,
  registration_status text not null default 'unknown' check (registration_status in ('open','closed','waitlist','unknown','not-applicable')),
  lifecycle text not null default 'scheduled' check (lifecycle in ('scheduled','cancelled','completed')),
  partners jsonb not null default '[]', featured boolean not null default false,
  published boolean not null default false,
  verified_at timestamptz, updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create index workshop_events_date on public.workshop_events(date desc) where published;
create table public.workshop_articles (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(title) between 3 and 160),
  subtitle text not null default '', description text not null check (length(description) between 10 and 1000),
  date date not null, topic text not null, author text not null,
  href text not null check (href ~ '^https://'),
  published boolean not null default false, updated_at timestamptz not null default now()
);
create table public.workshop_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(name) between 2 and 80),
  bio text not null default '' check (length(bio) <= 400),
  website text check (website is null or website ~ '^https://'),
  avatar_url text check (avatar_url is null or avatar_url ~ '^https://avatars.githubusercontent.com/'),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.workshop_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(title) between 3 and 100),
  summary text not null check (length(summary) between 20 and 240),
  description text not null check (length(description) between 40 and 6000),
  repository_url text not null check (repository_url ~ '^https://github.com/[^/]+/[^/?#]+/?$'),
  demo_url text check (demo_url is null or demo_url ~ '^https://'),
  image_path text check (image_path is null or image_path like owner_id::text || '/%'),
  tags text[] not null default '{}' check (cardinality(tags) <= 6),
  status text not null default 'pending' check (status in ('pending','approved','rejected','withdrawn')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(owner_id, repository_url)
);
create index workshop_projects_owner on public.workshop_projects(owner_id);
create index workshop_projects_public on public.workshop_projects(updated_at desc) where status = 'approved';
create table public.workshop_reviews (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.workshop_projects(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id), decision text not null check (decision in ('approved','rejected')),
  note text not null default '' check (length(note) <= 2000), created_at timestamptz not null default now()
);
create index workshop_reviews_project on public.workshop_reviews(project_id);
create table public.workshop_saved_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_slug text not null references public.workshop_events(slug) on delete cascade,
  created_at timestamptz not null default now(), primary key (user_id, event_slug)
);
create index workshop_saved_event_slug on public.workshop_saved_events(event_slug);
create table public.workshop_proposals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (length(subject) between 5 and 160),
  message text not null check (length(message) between 30 and 5000),
  status text not null default 'new' check (status in ('new','reviewing','closed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index workshop_proposals_user on public.workshop_proposals(user_id);
create table public.workshop_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid, action text not null, entity text not null, entity_id text not null,
  created_at timestamptz not null default now()
);

-- Every exposed table is protected, including the tables used only by organizers.
alter table public.workshop_settings enable row level security;
alter table public.workshop_events enable row level security;
alter table public.workshop_articles enable row level security;
alter table public.workshop_profiles enable row level security;
alter table public.workshop_projects enable row level security;
alter table public.workshop_reviews enable row level security;
alter table public.workshop_saved_events enable row level security;
alter table public.workshop_proposals enable row level security;
alter table public.workshop_audit_log enable row level security;
grant select on public.workshop_settings, public.workshop_events, public.workshop_articles, public.workshop_profiles, public.workshop_projects to anon, authenticated;
grant insert, update, delete on public.workshop_events, public.workshop_articles to authenticated;
grant update on public.workshop_settings to authenticated;
grant insert, update on public.workshop_profiles, public.workshop_projects, public.workshop_proposals to authenticated;
grant select on public.workshop_reviews, public.workshop_saved_events, public.workshop_proposals, public.workshop_audit_log to authenticated;
grant insert on public.workshop_reviews, public.workshop_saved_events to authenticated;
grant delete on public.workshop_saved_events to authenticated;

create policy settings_public on public.workshop_settings for select to anon, authenticated using (true);
create policy settings_admin on public.workshop_settings for update to authenticated using ((select workshop_private.is_organizer())) with check ((select workshop_private.is_organizer()));
create policy events_public on public.workshop_events for select to anon, authenticated using (published);
create policy events_admin on public.workshop_events for all to authenticated using ((select workshop_private.is_organizer())) with check ((select workshop_private.is_organizer()));
create policy articles_public on public.workshop_articles for select to anon, authenticated using (published);
create policy articles_admin on public.workshop_articles for all to authenticated using ((select workshop_private.is_organizer())) with check ((select workshop_private.is_organizer()));
create policy profile_own on public.workshop_profiles for select to authenticated using (id = (select auth.uid()) or (select workshop_private.is_organizer()));
create policy profile_public_author on public.workshop_profiles for select to anon, authenticated using (exists(select 1 from public.workshop_projects p where p.owner_id = workshop_profiles.id and p.status = 'approved'));
create policy profile_insert on public.workshop_profiles for insert to authenticated with check (id = (select auth.uid()));
create policy profile_update on public.workshop_profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy projects_public on public.workshop_projects for select to anon, authenticated using (status = 'approved');
create policy projects_own on public.workshop_projects for select to authenticated using (owner_id = (select auth.uid()) or (select workshop_private.is_organizer()));
create policy projects_insert on public.workshop_projects for insert to authenticated with check (owner_id = (select auth.uid()) and status = 'pending');
create policy projects_edit on public.workshop_projects for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()) and status in ('pending','withdrawn'));
create policy projects_admin on public.workshop_projects for update to authenticated using ((select workshop_private.is_organizer())) with check ((select workshop_private.is_organizer()));
create policy reviews_private on public.workshop_reviews for select to authenticated using ((select workshop_private.is_organizer()) or exists(select 1 from public.workshop_projects p where p.id = project_id and p.owner_id = (select auth.uid())));
create policy reviews_admin on public.workshop_reviews for insert to authenticated with check ((select workshop_private.is_organizer()) and reviewer_id = (select auth.uid()));
create policy saved_own_select on public.workshop_saved_events for select to authenticated using (user_id = (select auth.uid()));
create policy saved_own_insert on public.workshop_saved_events for insert to authenticated with check (user_id = (select auth.uid()) and exists(select 1 from public.workshop_events e where e.slug = event_slug and e.published));
create policy saved_own_delete on public.workshop_saved_events for delete to authenticated using (user_id = (select auth.uid()));
create policy proposals_select on public.workshop_proposals for select to authenticated using (user_id = (select auth.uid()) or (select workshop_private.is_organizer()));
create policy proposals_insert on public.workshop_proposals for insert to authenticated with check (user_id = (select auth.uid()) and status = 'new');
create policy proposals_admin on public.workshop_proposals for update to authenticated using ((select workshop_private.is_organizer())) with check ((select workshop_private.is_organizer()));
create policy audit_admin on public.workshop_audit_log for select to authenticated using ((select workshop_private.is_organizer()));

-- Immutable ownership, server timestamps, per-user rate limits, and audit records.
create function workshop_private.before_write() returns trigger language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); n integer;
begin
  if tg_op = 'UPDATE' then
    new.updated_at := now();
    if tg_table_name in ('workshop_profiles','workshop_projects','workshop_proposals') then new.created_at := old.created_at; end if;
    if tg_table_name = 'workshop_projects' and new.owner_id <> old.owner_id then raise exception 'Ownership cannot change'; end if;
    if tg_table_name = 'workshop_proposals' and new.user_id <> old.user_id then raise exception 'Ownership cannot change'; end if;
  end if;
  if tg_op = 'INSERT' and actor is not null and tg_table_name in ('workshop_projects','workshop_proposals') then
    perform pg_advisory_xact_lock(hashtextextended(actor::text || tg_table_name, 0));
    if tg_table_name = 'workshop_projects' then
      select count(*) into n from public.workshop_projects where owner_id = actor and created_at > now() - interval '1 day';
    else
      select count(*) into n from public.workshop_proposals where user_id = actor and created_at > now() - interval '1 day';
    end if;
    if n >= 5 then raise exception 'Daily submission limit reached'; end if;
    new.created_at := now();
  end if;
  return new;
end $$;
revoke all on function workshop_private.before_write() from public;
create function workshop_private.record_change() returns trigger language plpgsql security definer set search_path = '' as $$
declare row_data jsonb;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  insert into public.workshop_audit_log(actor_id, action, entity, entity_id)
  values(auth.uid(), lower(tg_op), tg_table_name, coalesce(row_data->>'id', row_data->>'slug', 'community'));
  return coalesce(new, old);
end $$;
revoke all on function workshop_private.record_change() from public;
do $$ declare t text; begin
  foreach t in array array['workshop_settings','workshop_events','workshop_articles','workshop_profiles','workshop_projects','workshop_proposals'] loop
    execute format('create trigger set_updated before insert or update on public.%I for each row execute function workshop_private.before_write()', t);
    execute format('create trigger log_change after insert or update or delete on public.%I for each row execute function workshop_private.record_change()', t);
  end loop;
end $$;

create function public.workshop_review_project(project uuid, decision text, note text) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if not workshop_private.is_organizer() then raise exception 'Forbidden'; end if;
  if decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
  perform 1 from public.workshop_projects where id = project and status = 'pending' for update;
  if not found then raise exception 'This submission has already changed. Refresh the queue.'; end if;
  update public.workshop_projects set status = decision where id = project;
  insert into public.workshop_reviews(project_id,reviewer_id,decision,note) values(project,auth.uid(),decision,note);
end $$;
revoke all on function public.workshop_review_project(uuid,text,text) from public;
grant execute on function public.workshop_review_project(uuid,text,text) to authenticated;

-- Project screenshots stay private until the corresponding project is approved.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('workshop-project-images','workshop-project-images',false,2097152,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy workshop_image_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'workshop-project-images' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy workshop_image_read on storage.objects for select to anon, authenticated using (
  bucket_id = 'workshop-project-images' and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists(select 1 from public.workshop_projects p where p.image_path = name and p.status = 'approved')
  )
);
create policy workshop_image_admin_read on storage.objects for select to authenticated using (bucket_id = 'workshop-project-images' and (select workshop_private.is_organizer()));
create policy workshop_image_remove on storage.objects for delete to authenticated using (
  bucket_id = 'workshop-project-images' and (storage.foldername(name))[1] = (select auth.uid())::text
  and not exists(select 1 from public.workshop_projects p where p.image_path = name)
);
