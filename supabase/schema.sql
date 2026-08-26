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

alter table public.enquiries enable row level security;
