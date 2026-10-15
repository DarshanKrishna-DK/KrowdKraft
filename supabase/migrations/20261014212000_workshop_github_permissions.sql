-- Supabase may explicitly grant anon execute through default privileges.
-- Revoking PUBLIC alone does not remove those explicit grants.
revoke all on function public.workshop_set_github_participation(boolean) from anon;
do $$ begin
  if to_regprocedure('public.workshop_refresh_github()') is not null then
    revoke all on function public.workshop_refresh_github() from anon;
  end if;
end $$;
