-- Preserve publication-time ordering when multiple posts share a date.
alter table public.workshop_articles add column feed_published_at timestamptz;
create or replace function workshop_private.refresh_medium_feed() returns text
language plpgsql security definer set search_path='' as $$
declare response extensions.http_response; document xml; item record; article_id text;
  canonical text; cover text; summary text; item_date timestamptz; count_items integer:=0;
begin
  if not pg_try_advisory_xact_lock(7938844) then return 'busy'; end if;
  update workshop_private.medium_sync set attempted_at=now() where id;
  begin
    perform extensions.http_set_curlopt('CURLOPT_TIMEOUT_MS','7000');
    select * into response from extensions.http_get('https://medium.com/feed/@cryptech_dk');
    if response.status<>200 or length(response.content)>2000000 or response.content ~* '<!DOCTYPE|<!ENTITY' then
      raise exception 'invalid_feed';
    end if;
    document:=xmlparse(document response.content);
    if coalesce((xpath('count(/rss/channel/item)',document))[1]::text::integer,0) not between 1 and 100 then raise exception 'empty_feed'; end if;
    for item in select * from xmltable(
      xmlnamespaces('http://purl.org/rss/1.0/modules/content/' as content,'http://purl.org/dc/elements/1.1/' as dc),
      '/rss/channel/item' passing document columns
      title text path 'title', link text path 'link', guid text path 'guid',
      published_at text path 'pubDate', author text path 'dc:creator', html text path 'content:encoded'
    ) loop
      canonical:=split_part(item.link,'?',1);
      if canonical !~ '^https://medium[.]com/@cryptech_dk/[a-zA-Z0-9-]+$'
        or item.guid !~ '^https://medium[.]com/p/[a-f0-9]+$'
        or length(item.title) not between 3 and 160 then raise exception 'invalid_item'; end if;
      item_date:=item.published_at::timestamptz;
      if item_date>now()+interval '1 day' then raise exception 'invalid_date'; end if;
      cover:=substring(item.html from '<img[^>]+src="([^"]+)"');
      if cover !~ '^https://cdn-images-[12][.]medium[.]com/' then cover:=null; end if;
      summary:=left(regexp_replace(split_part(substr(item.html, greatest(strpos(item.html,'<p'),1)),'</p>',1),'<[^>]*>','','g'),420);
      summary:=replace(replace(replace(replace(summary,'&amp;','&'),'&nbsp;',' '),'&quot;','"'),'&#39;','''');
      if length(summary)<10 then summary:='Read '||item.title||' on Medium.'; end if;
      select slug into article_id from public.workshop_articles
        where split_part(href,'?',1)=canonical or feed_guid=item.guid limit 1;
      article_id:=coalesce(article_id,'medium-'||split_part(item.guid,'/',5));
      insert into public.workshop_articles(slug,title,subtitle,description,date,topic,author,href,published,image,feed_guid,feed_published_at)
        values(article_id,item.title,'',summary,(item_date at time zone 'UTC')::date,'From Medium',
        left(coalesce(nullif(item.author,''),'Darshan Krishna N'),100),canonical,true,cover,item.guid,item_date)
        on conflict(slug) do update set title=excluded.title,description=excluded.description,
          date=excluded.date,author=excluded.author,href=excluded.href,image=excluded.image,feed_guid=excluded.feed_guid,feed_published_at=excluded.feed_published_at;
      count_items:=count_items+1;
    end loop;
    update workshop_private.medium_sync set succeeded_at=now(),item_count=count_items,error_code=null where id;
    return 'synced';
  exception when others then
    -- Subtransaction rolls back every partial article change, retaining the last good feed.
    update workshop_private.medium_sync set error_code='feed_unavailable' where id;
    return 'unavailable';
  end;
end $$;
revoke all on function workshop_private.refresh_medium_feed() from public,anon,authenticated;
