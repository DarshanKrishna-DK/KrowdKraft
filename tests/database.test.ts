import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
let db: PGlite;
const alice = '10000000-0000-4000-8000-000000000001',
  bob = '10000000-0000-4000-8000-000000000002',
  organizer = '10000000-0000-4000-8000-000000000003';
const project = '20000000-0000-4000-8000-000000000001';
async function as<T = Record<string, unknown>>(id: string | null, sql: string, params: unknown[] = []) {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub','${id || ''}',false); set role ${id ? 'authenticated' : 'anon'}`,
  );
  return db.query<T>(sql, params);
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth,storage to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant select,insert,delete on storage.objects to anon,authenticated;create function storage.foldername(name text) returns text[] language sql immutable as $$select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1]$$;insert into auth.users values('${alice}'),('${bob}'),('${organizer}');`,
  );
  await db.exec(
    `create table auth.identities(user_id uuid, provider text,provider_id text,identity_data jsonb);insert into auth.identities values('${alice}','github','1001','{"user_name":"alice-maker"}'),('${bob}','github','1002','{"user_name":"bob-maker"}');`,
  );
  for (const file of fs
    .readdirSync('supabase/migrations')
    .filter(
      (f) =>
        f.endsWith('.sql') &&
        !f.endsWith('_workshop_github_sync.sql') &&
        !f.endsWith('_workshop_medium_excerpt.sql'),
    )
    .sort()) {
    const sql = fs.readFileSync(`supabase/migrations/${file}`, 'utf8');
    // PGlite does not include http/pg_cron. Exercise feed DDL here; the private
    // network function and its scheduled execution are verified on Supabase.
    await db.exec(sql.split(/create (?:or replace )?function workshop_private\.refresh_medium_feed/)[0]);
  }
  await db.exec(
    `insert into workshop_roles(user_id,role)values('${organizer}','organizer');insert into workshop_settings(id,name,description,city,email)values('community','KrowdKraft','Community test setup','Bengaluru','hello@example.org');insert into workshop_events(slug,title,description,date,venue,type,source_url,published)values('public-event','Public event','A public community event','2026-10-18','Test venue','workshop','https://example.org/event',true),('draft-event','Draft event','An unpublished community event','2026-10-18','Test venue','workshop','https://example.org/event',false);`,
  );
});
afterAll(async () => {
  await db?.close();
});
describe('database authorization against real PostgreSQL policies', () => {
  it('protects feed synchronization and community content from public writes', async () => {
    await expect(as(null, 'select * from workshop_private.medium_sync')).rejects.toThrow();
    await expect(as(alice, 'select * from workshop_private.medium_sync')).rejects.toThrow();
    await expect(
      as(null, "update workshop_settings set stats='[]' where id='community' returning id"),
    ).rejects.toThrow();
    expect(
      (await as(alice, "update workshop_settings set stats='[]' where id='community' returning id")).rows,
    ).toHaveLength(0);
    await as(
      organizer,
      `update workshop_settings set stats='[{"value":"1.5k+","label":"Developers"}]' where id='community'`,
    );
    expect((await as(null, 'select stats from workshop_settings')).rows[0].stats).toEqual([
      { value: '1.5k+', label: 'Developers' },
    ]);
  });
  it('derives leaderboard identity from GitHub and blocks client score forgery', async () => {
    await as(alice, 'select workshop_set_github_participation(true)');
    const own = await as(alice, 'select login from workshop_github_connections');
    expect(own.rows[0].login).toBe('alice-maker');
    expect((await as(bob, 'select * from workshop_github_connections')).rows).toHaveLength(0);
    await expect(as(alice, "update workshop_github_connections set login='someone-else'")).rejects.toThrow();
    await expect(
      as(
        alice,
        "insert into workshop_github_months(user_id,month,commits,pull_requests)values($1,'2026-10-01',999,999)",
        [alice],
      ),
    ).rejects.toThrow();
    await db.exec(
      `reset role;insert into workshop_github_months(user_id,month,commits,pull_requests)values('${alice}','2026-10-01',7,3)`,
    );
    const board = await as(null, "select * from workshop_leaderboard('2026-10-01')");
    expect(Number(board.rows[0].score)).toBe(10);
    await as(alice, 'select workshop_set_github_participation(false)');
    expect((await as(null, "select * from workshop_leaderboard('2026-10-01')")).rows).toHaveLength(0);
    await expect(as(null, 'select workshop_set_github_participation(true)')).rejects.toThrow();
  });
  it('separates public content from drafts and private tables', async () => {
    const { rows } = await as(null, 'select slug from workshop_events');
    expect(rows.map((r) => r.slug)).toEqual(['public-event']);
    await expect(as(null, 'select * from workshop_proposals')).rejects.toThrow();
  });
  it('lets a member save only their own profile and cannot self-promote', async () => {
    await as(alice, 'insert into workshop_profiles(id,name)values($1,$2)', [alice, 'Alice Maker']);
    await as(alice, 'update workshop_profiles set bio=$1 where id=$2', [
      'I build useful community projects.',
      alice,
    ]);
    await expect(
      as(alice, 'insert into workshop_profiles(id,name)values($1,$2)', [bob, 'Not Bob']),
    ).rejects.toThrow();
    await expect(
      as(alice, 'insert into workshop_roles(user_id,role)values($1,$2)', [alice, 'owner']),
    ).rejects.toThrow();
  });
  it('rejects self-approval, ownership transfer and cross-member edits', async () => {
    await as(
      alice,
      `insert into workshop_projects(id,owner_id,title,summary,description,repository_url)values($1,$2,'Useful project','A real project with a useful purpose.','A sufficiently detailed explanation of the real project for its community.','https://github.com/alice/useful')`,
      [project, alice],
    );
    await expect(
      as(alice, "update workshop_projects set status='approved' where id=$1", [project]),
    ).rejects.toThrow();
    await expect(
      as(alice, 'update workshop_projects set owner_id=$1 where id=$2', [bob, project]),
    ).rejects.toThrow();
    const other = await as(
      bob,
      "update workshop_projects set title='Stolen project' where id=$1 returning id",
      [project],
    );
    expect(other.rows).toHaveLength(0);
    expect((await as(null, 'select id from workshop_projects')).rows).toHaveLength(0);
  });
  it('allows organizer review, publishes the profile, and keeps notes private', async () => {
    await expect(as(bob, "select workshop_review_project($1,'approved','')", [project])).rejects.toThrow();
    await as(organizer, "select workshop_review_project($1,'approved','A useful contribution.')", [project]);
    expect((await as(null, 'select id from workshop_projects')).rows).toHaveLength(1);
    expect((await as(null, 'select name from workshop_profiles')).rows[0]?.name).toBe('Alice Maker');
    expect((await as(bob, 'select note from workshop_reviews')).rows).toHaveLength(0);
    expect((await as(alice, 'select note from workshop_reviews')).rows[0]?.note).toBe(
      'A useful contribution.',
    );
  });
  it('withdraws published work and requires a new review after editing', async () => {
    await as(alice, "update workshop_projects set status='withdrawn' where id=$1", [project]);
    expect((await as(null, 'select id from workshop_projects')).rows).toHaveLength(0);
    await as(
      alice,
      "update workshop_projects set status='pending',title='Revised useful project' where id=$1",
      [project],
    );
    expect((await as(null, 'select id from workshop_projects')).rows).toHaveLength(0);
  });
  it('isolates private proposals and supports organizer triage', async () => {
    const { rows } = await as<{ id: string }>(
      alice,
      "insert into workshop_proposals(user_id,subject,message)values($1,'A workshop idea','Let us build a useful workshop for the community together.')returning id",
      [alice],
    );
    expect((await as(bob, 'select id from workshop_proposals')).rows).toHaveLength(0);
    await as(organizer, "update workshop_proposals set status='reviewing' where id=$1", [rows[0].id]);
    expect((await as(alice, 'select status from workshop_proposals')).rows[0]?.status).toBe('reviewing');
  });
  it('isolates saved events and refuses bookmarks of unpublished records', async () => {
    await as(alice, "insert into workshop_saved_events(user_id,event_slug)values($1,'public-event')", [
      alice,
    ]);
    expect((await as(bob, 'select * from workshop_saved_events')).rows).toHaveLength(0);
    await expect(
      as(alice, "insert into workshop_saved_events(user_id,event_slug)values($1,'draft-event')", [alice]),
    ).rejects.toThrow();
    await as(alice, 'delete from workshop_saved_events where user_id=$1', [alice]);
    expect((await as(alice, 'select * from workshop_saved_events')).rows).toHaveLength(0);
  });
  it('restricts storage paths and unreviewed screenshots', async () => {
    await as(alice, "insert into storage.objects(bucket_id,name)values('workshop-project-images',$1)", [
      `${alice}/image.png`,
    ]);
    await expect(
      as(alice, "insert into storage.objects(bucket_id,name)values('workshop-project-images',$1)", [
        `${bob}/image.png`,
      ]),
    ).rejects.toThrow();
    expect((await as(null, 'select * from storage.objects')).rows).toHaveLength(0);
    expect((await as(bob, 'select * from storage.objects')).rows).toHaveLength(0);
    await as(alice, 'update workshop_projects set image_path=$1 where id=$2', [
      `${alice}/image.png`,
      project,
    ]);
    await as(organizer, "select workshop_review_project($1,'approved','')", [project]);
    expect((await as(null, 'select * from storage.objects')).rows).toHaveLength(1);
    expect(
      (await as(alice, 'delete from storage.objects where name=$1 returning id', [`${alice}/image.png`]))
        .rows,
    ).toHaveLength(0);
  });
  it('keeps draft event uploads private and limits upload rights to organizers', async () => {
    const image = `${organizer}/30000000-0000-4000-8000-000000000001.webp`;
    await expect(
      as(alice, "insert into storage.objects(bucket_id,name)values('workshop-event-images',$1)", [
        `${alice}/30000000-0000-4000-8000-000000000002.webp`,
      ]),
    ).rejects.toThrow();
    await as(organizer, "insert into storage.objects(bucket_id,name)values('workshop-event-images',$1)", [
      image,
    ]);
    await as(organizer, "update workshop_events set image=$1 where slug='draft-event'", [image]);
    expect(
      (await as(null, "select name from storage.objects where bucket_id='workshop-event-images'")).rows,
    ).toHaveLength(0);
    await as(organizer, "update workshop_events set published=true where slug='draft-event'");
    expect(
      (await as(null, "select name from storage.objects where bucket_id='workshop-event-images'")).rows,
    ).toHaveLength(1);
    expect(
      (await as(organizer, 'delete from storage.objects where name=$1 returning id', [image])).rows,
    ).toHaveLength(0);
    await as(organizer, "update workshop_events set published=false,image=null where slug='draft-event'");
    expect(
      (await as(organizer, 'delete from storage.objects where name=$1 returning id', [image])).rows,
    ).toHaveLength(1);
  });
  it('keeps record identities fixed and supports removing an approved project with a review', async () => {
    await expect(
      as(alice, 'update workshop_projects set id=$1,status=$2 where id=$3', [
        '20000000-0000-4000-8000-000000000099',
        'pending',
        project,
      ]),
    ).rejects.toThrow('Record identity');
    await as(
      organizer,
      "select workshop_review_project($1,'rejected','Returned after publication for a correction.')",
      [project],
    );
    expect((await as(null, 'select id from workshop_projects')).rows).toHaveLength(0);
  });
  it('keeps audit entries server-authored and owner-readable', async () => {
    expect(
      (await as(organizer, "select * from workshop_audit_log where entity='workshop_projects'")).rows.length,
    ).toBeGreaterThan(3);
    await expect(
      as(
        alice,
        "insert into workshop_audit_log(actor_id,action,entity,entity_id)values($1,'fake','workshop_projects',$2)",
        [alice, project],
      ),
    ).rejects.toThrow();
    expect((await as(alice, 'select * from workshop_audit_log')).rows).toHaveLength(0);
  });
  it('caps per-member submissions without trusting supplied timestamps', async () => {
    for (let i = 0; i < 4; i++)
      await as(
        alice,
        "insert into workshop_proposals(user_id,subject,message,created_at)values($1,'Another useful proposal','A detailed idea for a useful community gathering.',now()-interval '10 days')",
        [alice],
      );
    await expect(
      as(
        alice,
        "insert into workshop_proposals(user_id,subject,message)values($1,'One too many proposals','A detailed idea for a useful community gathering.')",
        [alice],
      ),
    ).rejects.toThrow('Daily submission limit');
  });
});
