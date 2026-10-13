-- Public profiles are optional and only published after organizer review.
alter table public.kk_submissions add column socials jsonb not null default '[]'::jsonb;
alter table public.kk_projects add column socials jsonb not null default '[]'::jsonb;
alter table public.kk_spotlights add column socials jsonb not null default '[]'::jsonb;
alter table public.kk_submissions add constraint kk_submission_socials_shape check (jsonb_typeof(socials) = 'array' and jsonb_array_length(socials) <= 3 and jsonb_path_query_array(socials, '$[*] ? (@.type() == "string")') = socials);
alter table public.kk_projects add constraint kk_project_socials_shape check (jsonb_typeof(socials) = 'array' and jsonb_array_length(socials) <= 3);
alter table public.kk_spotlights add constraint kk_spotlight_socials_shape check (jsonb_typeof(socials) = 'array' and jsonb_array_length(socials) <= 3);
-- Several reviewed people may share an edition; submission identity stays unique.
alter table public.kk_spotlights drop constraint kk_spotlights_month_key;
create index kk_spotlights_edition on public.kk_spotlights(month desc);
grant select (socials) on public.kk_projects, public.kk_spotlights to anon, authenticated;
create or replace function public.kk_submit(payload jsonb,client_hash text,email_hash text,submission_hash text)
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
  insert into public.kk_submissions(kind,name,builder,email,url,description,category,fingerprint,socials)
    values(payload->>'kind',payload->>'name',payload->>'builder',lower(payload->>'email'),payload->>'url',payload->>'description',payload->>'category',submission_hash,coalesce(payload->'socials','[]'::jsonb))
    returning id into new_id;
  return new_id;
end $$;
revoke all on function public.kk_submit(jsonb,text,text,text) from public, anon, authenticated;
grant execute on function public.kk_submit(jsonb,text,text,text) to service_role;


create or replace function public.kk_review_submission(target_id uuid,decision text,display_title text,display_summary text,edition_month text,actor_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare entry public.kk_submissions;
begin
  if decision not in ('approved','rejected') or char_length(display_title) not between 2 and 100 or char_length(display_summary) not between 30 and 1500 then raise exception 'invalid_review'; end if;
  select * into entry from public.kk_submissions where id=target_id and status='pending' for update;
  if not found then raise exception 'already_reviewed'; end if;
  if decision='approved' then
    if entry.kind='project' then
      insert into public.kk_projects(submission_id,name,builder,description,url,category,socials) values(entry.id,display_title,entry.builder,display_summary,entry.url,entry.category,entry.socials);
    else
      insert into public.kk_spotlights(submission_id,name,builder,description,url,month,socials) values(entry.id,display_title,entry.builder,display_summary,entry.url,edition_month,entry.socials);
    end if;
  end if;
  update public.kk_submissions set status=decision,reviewed_at=now(),reviewed_by=actor_id where id=entry.id;
  insert into public.kk_audit(actor,submission_id,action) values(actor_id,entry.id,decision);
end $$;
revoke all on function public.kk_review_submission(uuid,text,text,text,text,uuid) from public, anon, authenticated;
grant execute on function public.kk_review_submission(uuid,text,text,text,text,uuid) to service_role;
