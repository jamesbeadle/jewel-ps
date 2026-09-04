-- ============================================================
-- Jewel Property Serve — website schema
-- Run once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: every statement is "if not exists".
-- ============================================================

-- ---------- Website enquiries -------------------------------------
-- "Request a free quote" form submissions from /contact. Written by the
-- server action in src/routes/contact/+page.server.js, viewed and managed
-- at /admin/enquiries.

create table if not exists public.enquiries (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	email text not null,
	phone text not null default '',
	postcode text not null default '',
	service text not null default '',
	message text not null,
	status text not null default 'new',     -- new | read | archived
	created_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx
	on public.enquiries (created_at desc);

create index if not exists enquiries_status_idx
	on public.enquiries (status);

-- ---------- Row Level Security ------------------------------------
-- RLS is ON with no policies: only the service_role key (used by the
-- website's server code) can read/write. The anon key has no access at
-- all, so nothing is exposed even if the project URL is public.
-- (The public API roles also lose their table grants at the end of
-- this file — see "Lock the public API roles out".)

alter table public.enquiries enable row level security;

-- ---------- Admin login attempt log (added 2026-09-04) -------------
-- Brute-force protection for /admin/login: the server records every
-- attempt here and refuses an IP after 5 failures in 15 minutes.
-- No passwords are stored. RLS on, no policies: service role only.

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

-- ---------- Lock the public API roles out (added 2026-09-04) --------
-- The site only ever talks to Supabase from server code with the
-- service_role key, so the public anon/authenticated roles need no
-- access at all. RLS-with-no-policies already hides every row from
-- them; revoking their table privileges as well means that even a
-- future mistake (RLS switched off, a permissive policy) can't expose
-- data through the public API keys. service_role is unaffected.
-- Existing databases: run supabase/2026-09-04-security-hardening.sql.

revoke select, insert, update, delete, truncate, references, trigger
	on all tables in schema public from anon, authenticated;
revoke usage, select, update
	on all sequences in schema public from anon, authenticated;
revoke execute
	on all functions in schema public from anon, authenticated, public;

alter default privileges for role postgres in schema public
	revoke select, insert, update, delete, truncate, references, trigger
	on tables from anon, authenticated;
alter default privileges for role postgres in schema public
	revoke usage, select, update on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
	revoke execute on functions from anon, authenticated, public;
