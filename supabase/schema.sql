-- Run this in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run — every statement is idempotent.

-- ─────────────────────────────────────────────
-- 0. Admins — who is allowed to use /admin.
-- IMPORTANT: signing in is not enough by itself (now that /sign-up is
-- public for regular site visitors). A user must ALSO have a row here.
-- ─────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  created_at timestamptz not null default now()
);

-- If this table already existed from before the Team page was added:
alter table public.admins add column if not exists email text not null default '';

alter table public.admins enable row level security;

-- Helper used by the policies below (defined before use since policies
-- reference it, and CREATE OR REPLACE below needs to run first).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "Users can check their own admin status" on public.admins;
drop policy if exists "Admins can view all admins" on public.admins;
create policy "Admins can view all admins"
  on public.admins for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can add admins" on public.admins;
create policy "Admins can add admins"
  on public.admins for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can remove admins" on public.admins;
create policy "Admins can remove admins"
  on public.admins for delete to authenticated using (public.is_admin());

-- After creating your FIRST login in Authentication → Users, copy that
-- user's UID and run (replace the UUID and email) — this one has to be
-- done by hand since no admin exists yet to use the Team page for it:
--   insert into public.admins (user_id, email) values ('paste-user-uuid-here', 'you@example.com');
-- Every existing admin user (from before this update) must be added
-- here manually too — being logged in alone no longer grants access.
-- After that first admin exists, add more from /admin/team.

-- ─────────────────────────────────────────────
-- 1. Page text (headlines, descriptions, buttons)
-- ─────────────────────────────────────────────
create table if not exists public.site_content (
  page_slug text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select to anon, authenticated using (true);

drop policy if exists "Authenticated users can write site content" on public.site_content;
drop policy if exists "Admins can insert site content" on public.site_content;
create policy "Admins can insert site content"
  on public.site_content for insert to authenticated with check (public.is_admin());

drop policy if exists "Authenticated users can update site content" on public.site_content;
drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────
-- 2. Products (homepage + /products grid)
-- ─────────────────────────────────────────────
create table if not exists public.site_products (
  id text primary key,
  name text not null default '',
  description text not null default '',
  icon_letter text not null default 'N',
  image_url text not null default '',
  status text not null default 'soon' check (status in ('live', 'beta', 'soon')),
  href text not null default '',
  sort_order integer not null default 0
);

-- If this table already existed from before image uploads were added:
alter table public.site_products add column if not exists image_url text not null default '';

alter table public.site_products enable row level security;

drop policy if exists "Public can read products" on public.site_products;
create policy "Public can read products"
  on public.site_products for select to anon, authenticated using (true);

drop policy if exists "Authenticated users can write products" on public.site_products;
drop policy if exists "Admins can insert products" on public.site_products;
create policy "Admins can insert products"
  on public.site_products for insert to authenticated with check (public.is_admin());

drop policy if exists "Authenticated users can update products" on public.site_products;
drop policy if exists "Admins can update products" on public.site_products;
create policy "Admins can update products"
  on public.site_products for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Authenticated users can delete products" on public.site_products;
drop policy if exists "Admins can delete products" on public.site_products;
create policy "Admins can delete products"
  on public.site_products for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────
-- 3. Links (nav bar + footer columns + social)
-- ─────────────────────────────────────────────
create table if not exists public.site_links (
  id text primary key,
  "group" text not null,
  label text not null default '',
  href text not null default '',
  sort_order integer not null default 0
);

alter table public.site_links enable row level security;

drop policy if exists "Public can read links" on public.site_links;
create policy "Public can read links"
  on public.site_links for select to anon, authenticated using (true);

drop policy if exists "Authenticated users can write links" on public.site_links;
drop policy if exists "Admins can insert links" on public.site_links;
create policy "Admins can insert links"
  on public.site_links for insert to authenticated with check (public.is_admin());

drop policy if exists "Authenticated users can update links" on public.site_links;
drop policy if exists "Admins can update links" on public.site_links;
create policy "Admins can update links"
  on public.site_links for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Authenticated users can delete links" on public.site_links;
drop policy if exists "Admins can delete links" on public.site_links;
create policy "Admins can delete links"
  on public.site_links for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────
-- 3b. Cards (AI page pillars + Developers page resources)
-- ─────────────────────────────────────────────
create table if not exists public.site_cards (
  id text primary key,
  section text not null,
  eyebrow text not null default '',
  title text not null default '',
  description text not null default '',
  href text not null default '',
  sort_order integer not null default 0
);

alter table public.site_cards enable row level security;

drop policy if exists "Public can read cards" on public.site_cards;
create policy "Public can read cards"
  on public.site_cards for select to anon, authenticated using (true);

drop policy if exists "Admins can insert cards" on public.site_cards;
create policy "Admins can insert cards"
  on public.site_cards for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update cards" on public.site_cards;
create policy "Admins can update cards"
  on public.site_cards for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete cards" on public.site_cards;
create policy "Admins can delete cards"
  on public.site_cards for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────
-- 5. Contact form submissions
-- ─────────────────────────────────────────────
create table if not exists public.site_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  message text not null default '',
  created_at timestamptz not null default now(),
  read boolean not null default false
);

alter table public.site_messages enable row level security;

-- Anyone (including logged-out visitors) can submit the contact form.
drop policy if exists "Anyone can submit a message" on public.site_messages;
create policy "Anyone can submit a message"
  on public.site_messages for insert to anon, authenticated with check (true);

-- Only admins can read submitted messages.
drop policy if exists "Admins can read messages" on public.site_messages;
create policy "Admins can read messages"
  on public.site_messages for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update messages" on public.site_messages;
create policy "Admins can update messages"
  on public.site_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete messages" on public.site_messages;
create policy "Admins can delete messages"
  on public.site_messages for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────
-- 6. Storage bucket for product images
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ─────────────────────────────────────────────
-- 7. Blog posts
-- ─────────────────────────────────────────────
create table if not exists public.site_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null default '',
  title text not null default '',
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.site_posts enable row level security;

drop policy if exists "Public can read published posts" on public.site_posts;
create policy "Public can read published posts"
  on public.site_posts for select to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "Admins can insert posts" on public.site_posts;
create policy "Admins can insert posts"
  on public.site_posts for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update posts" on public.site_posts;
create policy "Admins can update posts"
  on public.site_posts for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete posts" on public.site_posts;
create policy "Admins can delete posts"
  on public.site_posts for delete to authenticated using (public.is_admin());

-- Storage bucket for blog cover images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());

-- ─────────────────────────────────────────────
-- 8. Activity log
-- ─────────────────────────────────────────────
create table if not exists public.site_activity_log (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null default '',
  action text not null default '',
  details text not null default '',
  created_at timestamptz not null default now()
);

alter table public.site_activity_log enable row level security;

drop policy if exists "Admins can read activity log" on public.site_activity_log;
create policy "Admins can read activity log"
  on public.site_activity_log for select to authenticated using (public.is_admin());

-- Any signed-in admin can write a log entry for their own actions.
drop policy if exists "Admins can write activity log" on public.site_activity_log;
create policy "Admins can write activity log"
  on public.site_activity_log for insert to authenticated with check (public.is_admin());

-- ─────────────────────────────────────────────
-- 9. Site settings (singleton row) — logo, name, tagline, footer text
-- ─────────────────────────────────────────────
create table if not exists public.site_settings (
  id text primary key default 'default',
  site_name text not null default 'Nasah Group LTD',
  tagline text not null default '',
  footer_description text not null default '',
  copyright_text text not null default 'Nasah Group LTD. All rights reserved.',
  logo_mark_url text not null default '/logo-mark.jpg',
  logo_wordmark_url text not null default '/logo-wordmark.jpg',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Admins can insert settings" on public.site_settings;
create policy "Admins can insert settings"
  on public.site_settings for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update settings" on public.site_settings;
create policy "Admins can update settings"
  on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage bucket for logo uploads
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view site assets" on storage.objects;
create policy "Public can view site assets"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-assets');

drop policy if exists "Admins can upload site assets" on storage.objects;
create policy "Admins can upload site assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins can update site assets" on storage.objects;
create policy "Admins can update site assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-assets' and public.is_admin());

-- ─────────────────────────────────────────────
-- 10. Docs pages
-- ─────────────────────────────────────────────
create table if not exists public.site_docs (
  id text primary key,
  slug text unique not null default '',
  title text not null default '',
  description text not null default '',
  content text not null default '',
  sort_order integer not null default 0
);

alter table public.site_docs enable row level security;

drop policy if exists "Public can read docs" on public.site_docs;
create policy "Public can read docs"
  on public.site_docs for select to anon, authenticated using (true);

drop policy if exists "Admins can insert docs" on public.site_docs;
create policy "Admins can insert docs"
  on public.site_docs for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update docs" on public.site_docs;
create policy "Admins can update docs"
  on public.site_docs for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete docs" on public.site_docs;
create policy "Admins can delete docs"
  on public.site_docs for delete to authenticated using (public.is_admin());

-- ─────────────────────────────────────────────
-- 11. Entitlements — who has premium in which app
-- Written ONLY by the API's verify-purchase endpoint using the
-- SERVICE ROLE key (bypasses RLS) — regular users/apps can read their
-- own rows but can NEVER write here directly, even with a valid login.
-- This is what stops someone from just inserting a fake "active" row.
-- ─────────────────────────────────────────────
create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  app_id text not null,
  product_id text not null,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  platform text not null default 'google_play',
  purchase_token text not null,
  expiry_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, purchase_token)
);

alter table public.entitlements enable row level security;

drop policy if exists "Users can read their own entitlements" on public.entitlements;
create policy "Users can read their own entitlements"
  on public.entitlements for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Admins can manually grant/revoke (support cases — a gifted premium,
-- fixing a broken purchase, etc.) — this is separate from the
-- verify-purchase flow and intentionally still requires public.is_admin(),
-- so an ordinary logged-in user still can't write here.
drop policy if exists "Admins can insert entitlements" on public.entitlements;
create policy "Admins can insert entitlements"
  on public.entitlements for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update entitlements" on public.entitlements;
create policy "Admins can update entitlements"
  on public.entitlements for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete entitlements" on public.entitlements;
create policy "Admins can delete entitlements"
  on public.entitlements for delete to authenticated using (public.is_admin());

-- Regular authenticated users still have NO insert/update/delete policy
-- here — only the two admin policies above and the service_role
-- (bypasses RLS, used by verify-purchase) can write.

-- ─────────────────────────────────────────────
-- 12. Rate limiting for verify-purchase (tracked in Supabase — no
-- external Redis needed, good enough for this endpoint's traffic level)
-- ─────────────────────────────────────────────
create table if not exists public.rate_limit_attempts (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_attempts_key_created_idx
  on public.rate_limit_attempts (key, created_at desc);

alter table public.rate_limit_attempts enable row level security;

-- Only the service role (used inside nasah-api) touches this table.
-- No policies for anon/authenticated at all — default deny.

-- Housekeeping: old rows can be deleted periodically; not required for
-- correctness (queries only look at the last few minutes regardless),
-- just keeps the table from growing forever. Run occasionally:
--   delete from public.rate_limit_attempts where created_at < now() - interval '1 day';
