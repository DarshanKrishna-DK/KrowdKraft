import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const actor = "10000000-0000-4000-8000-000000000001",
  member = "10000000-0000-4000-8000-000000000002";
test("database enforces private submissions, moderation, profile consent, and durable limits", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); grant usage on schema public, auth to anon,authenticated,service_role; grant select on auth.users to service_role; insert into auth.users values('${actor}'),('${member}');`,
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/20261013123935_community_clubhouse.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/20261013205828_showcase_social_links.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec("set role anon");
    await assert.rejects(
      db.query("select email from public.kk_submissions"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select public.kk_submit('{}','x','x','x')"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select public.kk_unpublish($1,'project',$2)", [member, actor]),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select id,is_public from public.kk_members"),
      /permission denied/,
    );
    await db.exec("reset role; set role service_role");
    const payload = {
      kind: "project",
      name: "Test tool",
      builder: "Test builder",
      email: "test@example.com",
      url: "https://example.com/tool",
      description:
        "A real validation fixture used only in a local PostgreSQL test database.",
      category: "Open source",
      socials: [
        "https://github.com/example",
        "https://www.linkedin.com/in/example",
      ],
    };
    const submit = async (n: number) =>
      db.query<{ id: string }>(
        "select public.kk_submit($1::jsonb,$2,$3,$4) as id",
        [
          JSON.stringify({ ...payload, url: `${payload.url}/${n}` }),
          "a".repeat(64),
          "b".repeat(64),
          String(n).padStart(64, "0"),
        ],
      );
    const first = (await submit(1)).rows[0].id;
    await assert.rejects(submit(1), /duplicate key/);
    await db.exec("reset role; set role anon");
    assert.equal(
      (await db.query("select name from public.kk_projects")).rows.length,
      0,
    );
    await db.exec("reset role; set role service_role");
    await db.query(
      "select public.kk_review_submission($1,'approved',$2,$3,'2026-10',$4)",
      [first, "Reviewed tool", payload.description, actor],
    );
    await assert.rejects(
      db.query(
        "select public.kk_review_submission($1,'approved',$2,$3,'2026-10',$4)",
        [first, "Reviewed tool", payload.description, actor],
      ),
      /already_reviewed/,
    );
    assert.equal(
      (await db.query("select * from public.kk_audit")).rows.length,
      1,
    );
    await db.query(
      "insert into public.kk_members(id,github_id,github_login,display_name,avatar_url) values($1,'123','test-builder','Test builder','https://avatars.githubusercontent.com/u/123')",
      [member],
    );
    await db.exec("reset role; set role anon");
    assert.deepEqual(
      (await db.query("select name from public.kk_projects")).rows,
      [{ name: "Reviewed tool" }],
    );
    assert.deepEqual(
      (await db.query("select socials from public.kk_projects")).rows,
      [{ socials: payload.socials }],
    );
    await assert.rejects(
      db.query("select socials from public.kk_submissions"),
      /permission denied/,
    );
    assert.equal(
      (await db.query("select github_login from public.kk_members")).rows
        .length,
      0,
    );
    await assert.rejects(
      db.query("update public.kk_members set is_public=true"),
      /permission denied/,
    );
    await db.exec("reset role; set role service_role");
    await assert.rejects(
      db.query("update public.kk_members set is_public=true where id=$1", [
        member,
      ]),
      /check constraint/,
    );
    await db.query(
      "update public.kk_members set is_public=true,consent_at=now() where id=$1",
      [member],
    );
    await db.exec("reset role; set role anon");
    assert.equal(
      (await db.query("select github_login from public.kk_members")).rows
        .length,
      1,
    );
    await db.exec("reset role; set role service_role");
    await db.query(
      "update public.kk_members set is_public=false,consent_at=null where id=$1",
      [member],
    );
    await submit(2);
    await submit(3);
    await submit(4);
    await assert.rejects(submit(5), /rate_limited/);
    assert.equal(
      (await db.query("select * from public.kk_submissions")).rows.length,
      4,
    );
    const project = (
      await db.query<{ id: string }>("select id from public.kk_projects")
    ).rows[0];
    await db.query("select public.kk_unpublish($1,'project',$2)", [
      project.id,
      actor,
    ]);
    assert.equal(
      (
        await db.query(
          "select action from public.kk_audit where action='unpublished'",
        )
      ).rows.length,
      1,
    );
    const nominate = async (n: number) =>
      (
        await db.query<{ id: string }>(
          "select public.kk_submit($1::jsonb,$2,$3,$4) as id",
          [
            JSON.stringify({ ...payload, kind: "nomination" }),
            "c".repeat(64),
            "d".repeat(64),
            String(n).padStart(64, "0"),
          ],
        )
      ).rows[0].id;
    const future = await nominate(11),
      conflicting = await nominate(12);
    await db.query(
      "select public.kk_review_submission($1,'approved',$2,$3,'2999-01',$4)",
      [future, "Future spotlight", payload.description, actor],
    );
    await db.query(
      "select public.kk_review_submission($1,'approved',$2,$3,'2999-01',$4)",
      [
        conflicting,
        "Another builder in the edition",
        payload.description,
        actor,
      ],
    );
    assert.deepEqual(
      (
        await db.query("select status from public.kk_submissions where id=$1", [
          conflicting,
        ])
      ).rows,
      [{ status: "approved" }],
    );
    assert.equal(
      (
        await db.query(
          "select id from public.kk_spotlights where month='2999-01'",
        )
      ).rows.length,
      2,
    );
    assert.deepEqual(
      (await db.query("select socials from public.kk_spotlights limit 1")).rows,
      [{ socials: payload.socials }],
    );
    await db.exec("reset role; set role anon");
    assert.equal(
      (await db.query("select name from public.kk_projects")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select name from public.kk_spotlights")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select github_login from public.kk_members")).rows
        .length,
      0,
    );
    await assert.rejects(
      db.query("select action from public.kk_audit"),
      /permission denied/,
    );
  } finally {
    await db.close();
  }
});
