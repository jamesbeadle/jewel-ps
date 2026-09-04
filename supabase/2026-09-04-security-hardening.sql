-- ============================================================
-- Migration: security hardening (2026-09-04)
-- Run once in Supabase → SQL Editor → New query → paste → Run.
--
-- SAFE ON LIVE DATA. This script changes permissions and settings
-- only: it never drops a table, alters a column, or updates or
-- deletes a single row. Every statement is idempotent, so running
-- it twice is harmless. The site keeps working throughout — its
-- server code uses the service_role key, which is untouched.
--
-- What it does
--   1. Row Level Security ON for every website table. RLS with NO
--      policies is the locked-down state Supabase recommends for
--      tables that are only ever accessed from server code: the
--      service_role key (the only key this site uses) bypasses RLS,
--      while the public anon/authenticated keys see nothing.
--   2. Defence in depth: revokes the table privileges that Supabase
--      hands the anon/authenticated API roles by default, and stops
--      future tables/functions/sequences receiving them. Even if RLS
--      were switched off by accident, or a permissive policy added
--      later, the public API keys still could not read or write
--      anything. (RLS alone already blocks them — this makes the
--      lock-out hold even when a future change gets it wrong.)
--   3. Adds public.admin_login_attempts, the brute-force lockout
--      log used by /admin/login (5 failed attempts from one IP in
--      15 minutes → locked out until the window passes).
--   4. Finishes with a report so you can see the result at a glance.
--
-- Expected report: every table shows rls_enabled = true,
-- policies = 0, anon_access = false, authenticated_access = false,
-- service_role_access = true.
--
-- Not touched: the storage schema. The public `media` bucket keeps
-- serving uploaded photos and brochure images exactly as before.
--
-- To undo (not expected to be needed):
--   grant select, insert, update, delete on all tables in schema public
--     to anon, authenticated;
-- ============================================================

begin;

-- ---------- 1. RLS on every website table ------------------------
-- Enables RLS on each table that exists; already-enabled tables are a
-- no-op, tables that don't exist yet are skipped rather than failing
-- the script.

do $$
declare
	t text;
begin
	foreach t in array array[
		'enquiries', 'brochures', 'brochure_pages', 'rtw_submissions'
	]
	loop
		if to_regclass('public.' || t) is not null then
			execute format('alter table public.%I enable row level security', t);
		end if;
	end loop;
end
$$;

-- ---------- 2. Public API roles get nothing --------------------------
-- The site's server code authenticates as service_role, which keeps
-- its grants. Only the anon and authenticated roles (i.e. the public
-- "anon key" and logged-in Supabase Auth users — neither used by this
-- site) lose access.

-- Existing tables:
revoke select, insert, update, delete, truncate, references, trigger
	on all tables in schema public
	from anon, authenticated;

revoke usage, select, update
	on all sequences in schema public
	from anon, authenticated;

revoke execute
	on all functions in schema public
	from anon, authenticated, public;

-- Future tables/sequences/functions created from the SQL editor or
-- Table editor (both run as the postgres role):
alter default privileges for role postgres in schema public
	revoke select, insert, update, delete, truncate, references, trigger
	on tables from anon, authenticated;

alter default privileges for role postgres in schema public
	revoke usage, select, update on sequences from anon, authenticated;

alter default privileges for role postgres in schema public
	revoke execute on functions from anon, authenticated, public;

-- ---------- 3. Admin login attempt log ------------------------------
-- One row per attempt to log in at /admin/login (no passwords are
-- stored — only the IP, the username tried and the outcome). The
-- server counts recent failures per IP before checking a password
-- and refuses further attempts once the limit is hit. Rows older
-- than 30 days are pruned by the server after each successful login.

create table if not exists public.admin_login_attempts (
	id uuid primary key default gen_random_uuid(),
	ip text not null,
	username text not null default '',
	success boolean not null default false,
	attempted_at timestamptz not null default now()
);

create index if not exists admin_login_attempts_ip_time_idx
	on public.admin_login_attempts (ip, attempted_at desc);

alter table public.admin_login_attempts enable row level security;

-- (created inside this transaction, so the default-privilege change
-- above already applies to it; the explicit revoke below covers the
-- case where the table pre-dates this script.)
revoke all on public.admin_login_attempts from anon, authenticated;

commit;

-- ---------- 4. Report ---------------------------------------------
-- Lists EVERY table in the public schema, so anything unexpected
-- (a table created by hand, a stray policy) shows up here too.

select
	c.relname                                           as "table",
	c.relrowsecurity                                    as rls_enabled,
	(select count(*) from pg_policies p
	  where p.schemaname = 'public' and p.tablename = c.relname) as policies,
	(   has_table_privilege('anon', c.oid, 'SELECT')
	 or has_table_privilege('anon', c.oid, 'INSERT')
	 or has_table_privilege('anon', c.oid, 'UPDATE')
	 or has_table_privilege('anon', c.oid, 'DELETE'))    as anon_access,
	(   has_table_privilege('authenticated', c.oid, 'SELECT')
	 or has_table_privilege('authenticated', c.oid, 'INSERT')
	 or has_table_privilege('authenticated', c.oid, 'UPDATE')
	 or has_table_privilege('authenticated', c.oid, 'DELETE')) as authenticated_access,
	(   has_table_privilege('service_role', c.oid, 'SELECT')
	and has_table_privilege('service_role', c.oid, 'INSERT')
	and has_table_privilege('service_role', c.oid, 'UPDATE')
	and has_table_privilege('service_role', c.oid, 'DELETE')) as service_role_access
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'p')
order by c.relname;
