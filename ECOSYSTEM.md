# Connecting a new app to the Nasah ecosystem

Paste the section below to Claude Code (or read it yourself) when
starting ANY new Nasah app — website, mobile app, or another
dashboard. It tells the AI exactly how to wire up shared login, shared
data, and (if relevant) premium purchases, instead of reinventing auth
and a database from scratch.

---

## 📋 Paste this to Claude Code

```
This app is part of the Nasah Group LTD ecosystem. It must NOT build
its own authentication or database — it connects to an existing shared
Supabase project so that one login and one dataset work across every
Nasah app.

SHARED SUPABASE PROJECT:
- URL: https://fhkbwkthglzrstdmqrzk.supabase.co
- Anon key: (get this from nasahgroup.com's admin — never hardcode it
  in a prompt or commit it to a public repo; I'll provide it separately)

WHAT ALREADY EXISTS (don't recreate these):
- Supabase Auth handles all user accounts — sign up, sign in, password
  reset. Every app uses the SAME user pool.
- A REST API at https://api.nasahgroup.com/v1/ for data that doesn't
  need a full Supabase SDK: GET /products, GET /posts, GET /me,
  POST /verify-purchase, GET /entitlements.
- An `entitlements` table tracks premium/purchases per user per app —
  if this app sells anything via Google Play, call
  POST https://api.nasahgroup.com/v1/verify-purchase after a purchase
  confirms, instead of tracking "is premium" locally.

HOW TO ADD LOGIN:
- If this is a WEB app: use @supabase/ssr, same pattern as
  nasah-web (createBrowserClient / createServerClient), with cookies
  scoped to domain ".nasahgroup.com" so a login on nasahgroup.com is
  already recognized here too. Ask me for nasah-web's
  lib/supabase/*.ts files to copy directly.
- If this is a NATIVE app (Android/iOS/Flutter/React Native): use
  Supabase's native SDK for that platform (supabase-kotlin,
  supabase-swift, or the JS SDK for RN/Flutter via supabase-flutter).
  This does NOT share browser cookies with the website — it's a
  separate session, but the same underlying Supabase user, so
  user_id stays consistent across web and app.

HOW TO CALL THE SHARED API:
  const res = await fetch("https://api.nasahgroup.com/v1/products");
  const { data } = await res.json();

  For anything needing to know who's logged in, pass the user's own
  Supabase access token:
  fetch("https://api.nasahgroup.com/v1/me", {
    headers: { Authorization: `Bearer ${session.access_token}` }
  });

IF THIS APP SELLS PREMIUM (Google Play Billing):
  After Google Play confirms a purchase, call:
  POST https://api.nasahgroup.com/v1/verify-purchase
  Authorization: Bearer <user's access token>
  Body: {
    "appId": "<a short slug for this app, e.g. 'my-new-app'>",
    "packageName": "<this app's Android package name>",
    "purchaseType": "product" | "subscription",
    "productId": "<the SKU from Play Console>",
    "purchaseToken": "<token from Google Play Billing>"
  }
  This independently re-verifies with Google — the app can't just
  claim "I'm premium" client-side. Then check status anytime with:
  GET https://api.nasahgroup.com/v1/entitlements (same Bearer token).

DO NOT:
- Create a new Supabase project or any other database for user
  accounts or shared data.
- Build a custom login/JWT system.
- Track premium status only on-device without going through
  verify-purchase — it won't show up in dashboard.nasahgroup.com or
  survive a reinstall.
```

---

## Quick reference (for you, not the AI)

| Need | Use |
|---|---|
| Show products/blog posts | `GET api.nasahgroup.com/v1/products` or `/v1/posts` — no login needed |
| Know who's logged in | `GET api.nasahgroup.com/v1/me` with the user's token |
| Record a Play Store purchase | `POST api.nasahgroup.com/v1/verify-purchase` |
| Check someone's premium status | `GET api.nasahgroup.com/v1/entitlements` |
| Add login to a new **website** | Copy `nasah-web/lib/supabase/*.ts` as-is |
| Add login to a new **native app** | Use Supabase's native SDK for that platform, same project URL + anon key |
| See/manage all users' premium | `nasahgroup.com/admin/entitlements` |
| See/manage products, content | `nasahgroup.com/admin` |

## Where to find things

- **Anon key**: Supabase Dashboard → Project Settings → API (safe to
  put in any app's `NEXT_PUBLIC_SUPABASE_ANON_KEY` — it's designed to
  be public, RLS policies do the real security work)
- **Never reuse**: the `service_role` key and `GOOGLE_SERVICE_ACCOUNT_JSON`
  — those live ONLY in `nasah-api`, never in a new app
