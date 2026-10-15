alter table public.workshop_events drop constraint workshop_poster_path;
alter table public.workshop_events add constraint workshop_poster_path check (
  image is null or image ~ '^/events/[a-z0-9-]+[.]webp$' or image ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}[.](png|jpg|webp)$'
);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('workshop-event-images','workshop-event-images',false,2097152,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy workshop_event_image_public on storage.objects for select to anon, authenticated using (
  bucket_id = 'workshop-event-images' and exists(select 1 from public.workshop_events e where e.image = name and e.published)
);
create policy workshop_event_image_organizer_read on storage.objects for select to authenticated using (
  bucket_id = 'workshop-event-images' and (select workshop_private.is_organizer())
);
create policy workshop_event_image_organizer_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'workshop-event-images' and (select workshop_private.is_organizer()) and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy workshop_event_image_organizer_remove on storage.objects for delete to authenticated using (
  bucket_id = 'workshop-event-images' and (select workshop_private.is_organizer()) and not exists(select 1 from public.workshop_events e where e.image = name)
);
