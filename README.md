# Nasah Group LTD — Web

Official marketing site for `nasahgroup.com`, built as the foundation for
the full Nasah ecosystem (`apps.`, `api.`, `docs.`, `dashboard.`, `developer.`,
`blog.`, `labs.`, `status.` subdomains).

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Framer Motion (for future page transitions / scroll reveals)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Brand

Colors, type scale, and radii live in `tailwind.config.ts` under the
`nasah.*` namespace, sourced from the official logo (`public/logo-mark.jpg`,
`public/logo-wordmark.jpg`). Replace those two files with the vector
originals (SVG) as soon as you have them — JPGs are a placeholder and will
look soft at small sizes.

| Token             | Value     | Use                          |
|-------------------|-----------|-------------------------------|
| `nasah-red`       | `#E4231D` | Primary brand color           |
| `nasah-red-dark`  | `#C11B17` | Hover/active states           |
| `nasah-black`     | `#0A0A0A` | Wordmark, dark backgrounds    |
| `nasah-ink`       | `#111111` | Body text                     |
| `nasah-gray`      | `#6B7280` | Secondary text                |

> The exact red hex above is estimated from the logo image. Swap it for the
> real brand hex once you have the original design file — it's the single
> source of truth for the whole `nasah.red` token, so one change updates
> every button, badge, and accent across the site.

## How this connects to the rest of the ecosystem

`lib/api.ts` is a single typed fetch client every page/component should go
through instead of calling `fetch` directly. It reads its base URL from
`NEXT_PUBLIC_API_BASE_URL`, so:

- Locally it can point at `http://localhost:PORT` for a mock API
- In staging/production it points at `api.nasahgroup.com`
- Auth tokens get attached in one place once `account.nasahgroup.com` ships

The homepage's product list (`lib/utils.ts` → `products`) is static data
today. Once `api.nasahgroup.com` exposes `/v1/products`, swap the import in
`components/ProductGrid.tsx` for `await api.get<Product[]>("/v1/products")`
— no component markup needs to change, since the shape (`Product` type in
`lib/api.ts`) is already defined.

## Admin panel — editing site content

`/admin` is a real dashboard with a sidebar: **Pages**, **Products**,
**Navigation**, **Footer** — every headline, product card (including its
image/icon), nav link, and footer link is editable there, backed by
Supabase.

There's also a separate, public-facing account system for regular site
visitors: **`/sign-up`** and **`/sign-in`** create a normal Supabase Auth
account and land on **`/account`**. This is a *different* thing from
`/admin` — see the security note below, it matters.

| Section | What it controls |
|---|---|
| **Pages** | Headline, subtitle, description, button text for each page |
| **Products** | Cards on the homepage/`/products` — add/edit/delete, upload an image (e.g. your Play Store icon), set name, description, status, link |
| **Navigation** | Links in the top nav bar — add/remove/reorder |
| **Footer** | All 4 footer columns + social links |

If Supabase has no data yet for something, the site shows sensible
defaults (`lib/content-defaults.ts`) so it never breaks — but everything
is editable from `/admin` the moment you sign in as an admin.

### ⚠️ Security: `/admin` access is now separate from "logged in"

Because `/sign-up` lets *anyone* create an account, being logged in is
**not** enough to reach `/admin` — there's a separate `admins` table.
Only users listed in it can open `/admin`; everyone else who signs in
there gets bounced back with an error. This is enforced in
`middleware.ts` and in Supabase's row-level security policies (so even a
non-admin poking at the API directly can't write data, not just the UI).

### 1. Run the database migration

Supabase Dashboard → **SQL Editor** → New query → paste the full contents
of `supabase/schema.sql` → **Run**. This creates `admins`, `site_content`,
`site_products`, `site_links`, and a `product-images` storage bucket, all
with row-level security. Safe to re-run any time.

### 2. Create your admin login — and add it to `admins`

1. Supabase Dashboard → **Authentication** → **Users** → **Add user** →
   email + password
2. Click that user in the list and **copy their User UID**
3. SQL Editor → run (replacing the UUID):
   ```sql
   insert into public.admins (user_id) values ('paste-the-uuid-here');
   ```
4. Sign in at `https://nasahgroup.com/admin/login`

**If you already created an admin login before this update:** it still
works for signing in, but you must run step 3 for that same user now —
otherwise `/admin` will redirect you back to the login page with a "not
an admin" message, since the old setup didn't have this check yet.

### 3. Set the environment variables

In **Vercel** → your project → **Settings** → **Environment Variables**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fhkbwkthglzrstdmqrzk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (your anon key) |

Redeploy after adding these — Vercel doesn't apply new env vars to an
already-built deployment.

### Email confirmation for `/sign-up`

By default, a new Supabase project requires visitors to click a
confirmation link before they can sign in. That email is sent
automatically — no setup needed — but check **Authentication** →
**Email Templates** in Supabase if you want to customize its wording, or
**Authentication** → **Providers** → **Email** if you want to turn
confirmation off entirely (not recommended for a real launch).

### Required: allow the auth callback URL in Supabase

Password reset (`/forgot-password` → `/reset-password`) and the sign-up
confirmation link both redirect through `/auth/callback`. Supabase
rejects redirects to URLs it doesn't recognize, so add this once:

Supabase Dashboard → **Authentication** → **URL Configuration** →
**Redirect URLs** → add:
```
https://nasahgroup.com/auth/callback
```
(and `http://localhost:3000/auth/callback` too, if you'll test locally).
Without this, clicking the emailed link will fail with an error instead
of signing the person in.

**Still code-defined, not yet in the admin panel:** the AI and
Developers pages' supporting cards (the 4 pillar cards on `/ai`, the 4
resource cards on `/developers`) are still in `app/ai/page.tsx` and
`app/developers/page.tsx` directly. Same pattern as Products if you want
those editable too — say the word.

## What's new: analytics, blog, team management, 2FA

### Analytics
[Vercel Analytics](https://vercel.com/docs/analytics) is wired in
(`<Analytics />` in `app/layout.tsx`) — turn it on in your Vercel project
→ **Analytics** tab. No extra code or env vars needed. If you'd rather
use Google Analytics or Plausible instead/as well, that's a separate
small addition — ask if you want it.

### Cookie consent
`components/CookieConsent.tsx` shows a basic "we use cookies" banner on
first visit and remembers the choice in `localStorage`. **This is not a
full GDPR consent-management platform** — it doesn't block
analytics/cookies until accepted, and has no granular categories. If you
need formal EU compliance, use a real CMP (Cookiebot, OneTrust, etc.)
instead of relying on this banner alone.

### Blog
`/blog` (list) and `/blog/[slug]` (post) are now real, backed by a new
`site_posts` table. Manage posts from **`/admin/blog`** — title, slug,
excerpt, cover image (uploaded to a `blog-images` Storage bucket), and
content written in **Markdown** (bold, links, headings, lists). Draft
posts (`published` unchecked) don't show on the public `/blog`. The
About/Privacy/Terms page bodies also now render as Markdown — edit them
from `/admin/pages` the same as before, just with formatting support.

### Team management
**`/admin/team`** lets an existing admin add or remove other admins —
no more raw SQL for this after the first one. The person must already
have signed up (`/sign-up`) since we only have the anon key, not the
service-role key needed to create accounts directly; you paste in their
User UID from Supabase's dashboard once, and future admins can be
managed from the UI. Removing an admin here revokes their `/admin`
access immediately but does not delete their account.

### Activity log
**`/admin/activity`** shows the last 100 admin actions (who changed
what, and when) — pages, products, cards, links, and blog post saves are
logged. **Not every possible action is captured yet** — messages
delete/mark-read and a few edge cases aren't logged — but the pattern
(`lib/log-activity.ts`) is there to extend.

### Password change & two-factor authentication
**`/admin/settings`** lets any admin change their own password, and
enroll a TOTP authenticator app via a QR code.

**2FA is now actually enforced at sign-in**, not just enrollment: once
an admin turns it on, `/admin/login` requires the 6-digit code after
the password step, and `middleware.ts` double-checks this server-side
on every `/admin` request (so a stale session can't skip it either).

### Contact form email notifications (optional)
Contact form submissions always save to `site_messages` regardless.
If you also want an email when one comes in: sign up at
[resend.com](https://resend.com), verify your sending domain, and add
`RESEND_API_KEY` + `ADMIN_NOTIFY_EMAIL` in Vercel's environment
variables — no code changes needed, `app/api/contact-notify/route.ts`
picks them up automatically. Leave them unset and the form still works
exactly the same, it just won't email you.

### Blog RSS feed
`/feed.xml` — auto-generated from published posts, linked from `/blog`
and referenced in its page metadata.



You'll eventually have several kinds of keys across several subdomains.
The one rule that matters more than any other:

> **If an environment variable name starts with `NEXT_PUBLIC_`, it ends
> up in the browser's JavaScript — anyone can view it in DevTools.**
> Only put values there that are *meant* to be public (like the Supabase
> anon key, which is designed to be safe client-side because RLS policies
> do the actual security work).

**Never prefix a real secret with `NEXT_PUBLIC_`** — payment provider
secret keys, the Supabase **service role** key (different from the anon
key — it bypasses RLS entirely), third-party API secrets, signing keys.
Those go in a plain env var name (e.g. `STRIPE_SECRET_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`) and are only ever read inside server-side
code — a Route Handler (`app/api/.../route.ts`) or Server Action — never
in a Client Component, never in anything under `"use client"`.

**As you add subdomains** (`dashboard.`, `developer.`, `api.` etc.), each
one is its own Vercel project with its own Environment Variables — a
secret set on `nasah-web` (this project) is *not* automatically available
to a `dashboard.nasahgroup.com` project. Set each project's own secrets
in its own Vercel dashboard. If several apps need the same secret,
you're re-adding it per project (or using Vercel's shared/team-level env
var feature if your plan includes it — check Vercel's own docs for the
current UI, it's changed over time).

**For the future `api.nasahgroup.com` backend specifically:** that
service should be the *only* place holding privileged keys (database
service-role key, payment secrets, etc.). This public website
(`nasahgroup.com`) should only ever hold the anon/public keys — it talks
to `api.nasahgroup.com` over HTTPS via `lib/api.ts`, which is exactly the
pattern already wired up for that reason.

## One login across every subdomain (like Google)

The goal: sign in once on `nasahgroup.com`, and you're already signed in
on `dashboard.nasahgroup.com`, `apps.nasahgroup.com`, etc. once those
exist. Two things make that work, both already set up here:

1. **Every app uses the same Supabase project** — same
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env
   vars in every app's Vercel project. One user table, one set of
   sessions, shared by all of them.
2. **The login cookie is scoped to the whole domain**, not just
   `nasahgroup.com`. See `lib/supabase/cookie-options.ts` —
   `domain: ".nasahgroup.com"` (the leading dot matters) makes the
   browser send that cookie to every subdomain automatically.

**When you build the next app** (e.g. a real `dashboard.nasahgroup.com`
project): copy `lib/supabase/client.ts`, `server.ts`, `middleware.ts`,
and `cookie-options.ts` into it as-is, point it at the same Supabase
project via the same two env vars, and anyone already signed in on
`nasahgroup.com` will land there already authenticated — no separate
login system to build per app.

**This is not the same thing as "Sign in with Google"-style OAuth** —
you're not becoming an identity provider for *other companies'* apps.
It's simpler: one shared auth backend (Supabase) behind every app you
personally control, which is exactly what gives the Google-style feel
for your own ecosystem.

**For a future `api.nasahgroup.com` backend:** it doesn't need its own
login system either. Each app sends the user's existing Supabase access
token in an `Authorization: Bearer <token>` header; the API verifies
that token against the same Supabase project (`supabase.auth.getUser(token)`
or JWT verification) instead of maintaining separate credentials. One
identity, reused everywhere it's needed — apps, dashboard, and API alike.



```
app/            routes (App Router) — layout.tsx, page.tsx per route
app/admin/      dashboard: pages, products, navigation, footer editors
components/     shared UI: Navbar, Footer, Hero, ProductGrid — all data-driven
components/ui/  design-system primitives: Button, Card, StatusBadge
components/admin/  admin sidebar, editors, sign-out button (Client Components)
lib/api.ts      shared API client + domain types (for the future api.nasahgroup.com)
lib/content*.ts editable-content defaults + Supabase-backed loaders
lib/site-data.ts  products + nav/footer link loaders
lib/supabase/   browser/server Supabase clients + middleware session helper
supabase/schema.sql  one-time DB migration — see "Admin panel" above
public/         logo assets, static files
```

## Roadmap to the full ecosystem

This repo is deliberately a single Next.js app, not yet a monorepo — it's
the fastest path to a real, deployable homepage today. When you're ready to
add `dashboard.`, `docs.`, `developer.` etc. as separate deployables that
share this design system, the natural next step is a Turborepo:

```
apps/
  web/          this app → nasahgroup.com
  docs/         → docs.nasahgroup.com
  dashboard/    → dashboard.nasahgroup.com
  developer/    → developer.nasahgroup.com
packages/
  ui/           components/ui/* moves here, imported by every app
  config/       tailwind.config.ts, tsconfig base, eslint config
  types/        lib/api.ts types move here
```

Say the word when you want that split — moving `components/ui` and
`lib/api.ts` into shared packages is a mechanical refactor once there's a
second app that needs them.
