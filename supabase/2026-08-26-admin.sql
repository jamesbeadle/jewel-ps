-- ============================================================
-- Jewel Property Serve — admin expansion (added 2026-08-26)
-- Media library, brochure builder and RTW checks register.
--
-- Run this once in Supabase → SQL Editor → New query → Run.
-- Safe to re-run: every statement is "if not exists".
-- (Run supabase/schema.sql first if the enquiries table doesn't
-- exist yet.)
-- ============================================================

-- ---------- Storage bucket for uploaded images --------------------
-- Public bucket so uploaded photos can be served directly on the
-- site and in brochures. Uploads go through short-lived signed URLs
-- created by the server (see src/lib/server/db.js).

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ---------- Brochure builder --------------------------------------
-- A brochure is a document made of ordered, typed pages that mirror
-- the designed A4 print brochure (cover, intro, services, case
-- studies, process, testimonials, back cover ...). Page content is
-- stored as JSON so each template can carry its own fields.
--
-- Several brochures can exist at once (drafts, yearly editions); at
-- most ONE can be "active" — that's the one shown at /brochure and
-- served as the public PDF.

create table if not exists public.brochures (
	id uuid primary key default gen_random_uuid(),
	title text not null default 'Untitled brochure',
	status text not null default 'draft' check (status in ('draft', 'active')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- At most one active brochure at any time.
create unique index if not exists brochures_one_active
	on public.brochures ((true))
	where status = 'active';

create table if not exists public.brochure_pages (
	id uuid primary key default gen_random_uuid(),
	brochure_id uuid not null references public.brochures (id) on delete cascade,
	template text not null,
	content jsonb not null default '{}'::jsonb,
	sort_order int not null default 100,
	created_at timestamptz not null default now()
);

create index if not exists brochure_pages_brochure
	on public.brochure_pages (brochure_id, sort_order);

-- ---------- RTW submissions ---------------------------------------
-- One row per completed Right to Work check, written by the server
-- when a checker generates a register entry at /rtw. Viewed
-- (paginated) at /admin/rtw.

create table if not exists public.rtw_submissions (
	id uuid primary key default gen_random_uuid(),
	group_id uuid not null,                 -- groups the rows of one generate click
	entity text not null,                   -- engaging company, e.g. JPS
	full_name text not null,
	trade text not null default '',
	engagement_type text not null,
	start_date date,
	check_method text not null default '',
	document_seen text not null default '',
	check_date date,
	checked_by text not null default '',
	outcome text not null default '',
	permission_expiry date,
	followup_due date,
	evidence_ref text not null default '',
	notes text not null default '',
	created_at timestamptz not null default now()
);

create index if not exists rtw_submissions_created_at_idx
	on public.rtw_submissions (created_at desc);

-- ---------- Row Level Security ------------------------------------
-- RLS is ON with no policies: only the service_role key (used by the
-- website's server code) can read/write. The anon key has no access,
-- same as the enquiries table.

alter table public.brochures enable row level security;
alter table public.brochure_pages enable row level security;
alter table public.rtw_submissions enable row level security;
