-- Record-specific fields must be accessed only inside a matching PL/pgSQL branch.
-- This also closes direct-API identity changes and bounds private image storage.
create or replace function workshop_private.before_write() returns trigger language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); n integer;
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    if tg_table_name in ('workshop_profiles','workshop_projects','workshop_proposals') then
      new.created_at := old.created_at;
      if new.id <> old.id then raise exception 'Record identity cannot change'; end if;
    end if;
    if tg_table_name in ('workshop_events','workshop_articles') then
      if new.slug <> old.slug then raise exception 'Record address cannot change'; end if;
    end if;
    if tg_table_name = 'workshop_projects' then
      if new.owner_id <> old.owner_id then raise exception 'Ownership cannot change'; end if;
    end if;
    if tg_table_name = 'workshop_proposals' then
      if new.user_id <> old.user_id then raise exception 'Ownership cannot change'; end if;
    end if;
  elsif tg_table_name in ('workshop_profiles','workshop_projects','workshop_proposals') then
    new.created_at := now();
  end if;
  if tg_op = 'INSERT' and actor is not null and tg_table_name in ('workshop_projects','workshop_proposals') then
    perform pg_advisory_xact_lock(hashtextextended(actor::text || tg_table_name, 0));
    if tg_table_name = 'workshop_projects' then
      select count(*) into n from public.workshop_projects where owner_id = actor and created_at > now() - interval '1 day';
    else
      select count(*) into n from public.workshop_proposals where user_id = actor and created_at > now() - interval '1 day';
    end if;
    if n >= 5 then raise exception 'Daily submission limit reached'; end if;
  end if;
  return new;
end $$;

alter table public.workshop_events add constraint workshop_event_start_day check (starts_at is null or (starts_at at time zone 'Asia/Kolkata')::date = date);
alter table public.workshop_events add constraint workshop_event_end_requires_start check (ends_at is null or starts_at is not null);
alter table public.workshop_events add constraint workshop_registration_destination check (registration_status not in ('open','waitlist') or registration_url is not null);
alter table public.workshop_events add constraint workshop_poster_path check (image is null or image ~ '^/events/[a-z0-9-]+[.]webp$');
create index workshop_reviews_reviewer on public.workshop_reviews(reviewer_id);

create function workshop_private.has_image_capacity() returns boolean language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); n integer;
begin
  if actor is null then return false; end if;
  perform pg_advisory_xact_lock(hashtextextended(actor::text || 'workshop-images',0));
  select count(*) into n from storage.objects where bucket_id = 'workshop-project-images' and (storage.foldername(name))[1] = actor::text;
  return n < 30;
end $$;
revoke all on function workshop_private.has_image_capacity() from public;
grant execute on function workshop_private.has_image_capacity() to authenticated;
drop policy workshop_image_insert on storage.objects;
create policy workshop_image_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'workshop-project-images' and (storage.foldername(name))[1] = (select auth.uid())::text and (select workshop_private.has_image_capacity())
);

-- Approved work can be returned to its maker with a recorded explanation.
create or replace function public.workshop_review_project(project uuid, decision text, note text) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if not workshop_private.is_organizer() then raise exception 'Forbidden'; end if;
  if decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
  perform 1 from public.workshop_projects where id = project and (status = 'pending' or (status = 'approved' and decision = 'rejected')) for update;
  if not found then raise exception 'This submission has already changed. Refresh the queue.'; end if;
  update public.workshop_projects set status = decision where id = project;
  insert into public.workshop_reviews(project_id,reviewer_id,decision,note) values(project,auth.uid(),decision,note);
end $$;
