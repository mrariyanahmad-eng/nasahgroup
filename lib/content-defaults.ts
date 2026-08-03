/**
 * Every string here is editable from /admin. This file is the single
 * source of truth for *which* fields exist on each page and what they
 * show before an editor has changed anything in Supabase.
 *
 * Keep this file free of server-only imports — it's used by both
 * Server Components (pages) and the admin editor (a Client Component).
 */

export type PageContent = Record<string, string>;

export const PAGES: { slug: string; label: string }[] = [
  { slug: "home", label: "Home" },
  { slug: "products", label: "Products" },
  { slug: "ai", label: "AI" },
  { slug: "developers", label: "Developers" },
  { slug: "docs", label: "Docs" },
  { slug: "about", label: "About" },
  { slug: "careers", label: "Careers" },
  { slug: "contact", label: "Contact" },
  { slug: "privacy", label: "Privacy" },
  { slug: "terms", label: "Terms" },
  { slug: "get-started", label: "Get Started" },
];

export type Product = {
  id: string;
  name: string;
  description: string;
  icon_letter: string;
  image_url: string;
  status: "live" | "beta" | "soon";
  href: string;
  sort_order: number;
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Nasah Apps",
    description:
      "The consumer application suite — everyday tools built for speed, clarity, and reliability.",
    icon_letter: "N",
    image_url: "",
    status: "live",
    href: "https://apps.nasahgroup.com",
    sort_order: 1,
  },
  {
    id: "2",
    name: "Nasah AI",
    description:
      "Applied AI tools and models built for real, everyday use cases across the ecosystem.",
    icon_letter: "N",
    image_url: "",
    status: "beta",
    href: "https://ai.nasahgroup.com",
    sort_order: 2,
  },
  {
    id: "3",
    name: "Developer Platform",
    description: "APIs, SDKs, and authentication for building on top of the Nasah ecosystem.",
    icon_letter: "D",
    image_url: "",
    status: "live",
    href: "https://developer.nasahgroup.com",
    sort_order: 3,
  },
  {
    id: "4",
    name: "Dashboard",
    description: "A unified control center for accounts, billing, teams, and organization settings.",
    icon_letter: "D",
    image_url: "",
    status: "live",
    href: "https://dashboard.nasahgroup.com",
    sort_order: 4,
  },
  {
    id: "5",
    name: "Nasah Labs",
    description: "Experimental products and early releases — where new ideas ship first.",
    icon_letter: "N",
    image_url: "",
    status: "beta",
    href: "https://labs.nasahgroup.com",
    sort_order: 5,
  },
  {
    id: "6",
    name: "Status",
    description: "Live, transparent uptime and incident history across every Nasah product.",
    icon_letter: "S",
    image_url: "",
    status: "live",
    href: "https://status.nasahgroup.com",
    sort_order: 6,
  },
];

export type SiteLink = {
  id: string;
  group: "nav" | "footer_products" | "footer_developers" | "footer_company" | "footer_legal" | "social";
  label: string;
  href: string;
  sort_order: number;
};

export const DEFAULT_LINKS: SiteLink[] = [
  { id: "n1", group: "nav", label: "Products", href: "/products", sort_order: 1 },
  { id: "n2", group: "nav", label: "AI", href: "/ai", sort_order: 2 },
  { id: "n3", group: "nav", label: "Developers", href: "/developers", sort_order: 3 },
  { id: "n4", group: "nav", label: "Docs", href: "/docs", sort_order: 4 },
  { id: "n5", group: "nav", label: "Blog", href: "/blog", sort_order: 5 },
  { id: "n6", group: "nav", label: "Company", href: "/about", sort_order: 6 },

  { id: "fp1", group: "footer_products", label: "Apps", href: "https://apps.nasahgroup.com", sort_order: 1 },
  { id: "fp2", group: "footer_products", label: "AI", href: "https://ai.nasahgroup.com", sort_order: 2 },
  { id: "fp3", group: "footer_products", label: "Labs", href: "https://labs.nasahgroup.com", sort_order: 3 },
  { id: "fp4", group: "footer_products", label: "Dashboard", href: "https://dashboard.nasahgroup.com", sort_order: 4 },

  { id: "fd1", group: "footer_developers", label: "Documentation", href: "/docs", sort_order: 1 },
  { id: "fd2", group: "footer_developers", label: "API Reference", href: "https://developer.nasahgroup.com", sort_order: 2 },
  { id: "fd3", group: "footer_developers", label: "Status", href: "https://status.nasahgroup.com", sort_order: 3 },

  { id: "fc1", group: "footer_company", label: "About", href: "/about", sort_order: 1 },
  { id: "fc2", group: "footer_company", label: "Careers", href: "/careers", sort_order: 2 },
  { id: "fc3", group: "footer_company", label: "Blog", href: "/blog", sort_order: 3 },
  { id: "fc4", group: "footer_company", label: "Contact", href: "/contact", sort_order: 4 },

  { id: "fl1", group: "footer_legal", label: "Privacy", href: "/privacy", sort_order: 1 },
  { id: "fl2", group: "footer_legal", label: "Terms", href: "/terms", sort_order: 2 },

  { id: "s1", group: "social", label: "X", href: "https://x.com/nasahgroup", sort_order: 1 },
  { id: "s2", group: "social", label: "LinkedIn", href: "https://linkedin.com/company/nasahgroup", sort_order: 2 },
  { id: "s3", group: "social", label: "GitHub", href: "https://github.com/nasahgroup", sort_order: 3 },
];

export type SiteCard = {
  id: string;
  section: "ai" | "developers";
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  sort_order: number;
};

export const DEFAULT_CARDS: SiteCard[] = [
  {
    id: "ai1",
    section: "ai",
    eyebrow: "AI Tools",
    title: "Applied, not experimental.",
    description:
      "AI features built into real Nasah products — search, assistance, and automation people actually use every day.",
    href: "",
    sort_order: 1,
  },
  {
    id: "ai2",
    section: "ai",
    eyebrow: "AI Platform",
    title: "One platform, every product.",
    description:
      "A shared AI layer that every Nasah app can call into, instead of each product building its own from scratch.",
    href: "",
    sort_order: 2,
  },
  {
    id: "ai3",
    section: "ai",
    eyebrow: "Research",
    title: "Grounded in real problems.",
    description:
      "Research directions are pulled from what people actually struggle with across the Nasah ecosystem, not novelty for its own sake.",
    href: "",
    sort_order: 3,
  },
  {
    id: "ai4",
    section: "ai",
    eyebrow: "Responsible AI",
    title: "Safe by default.",
    description:
      "Every AI feature ships with clear limits, human oversight, and transparency about what it can and can't do.",
    href: "",
    sort_order: 4,
  },
  {
    id: "dev1",
    section: "developers",
    eyebrow: "",
    title: "API Reference",
    description: "Every endpoint across the Nasah ecosystem, with live examples.",
    href: "/docs/products-api",
    sort_order: 1,
  },
  {
    id: "dev2",
    section: "developers",
    eyebrow: "",
    title: "SDKs",
    description: "Official client libraries for JavaScript, Python, and Go.",
    href: "/docs/sdk-js",
    sort_order: 2,
  },
  {
    id: "dev3",
    section: "developers",
    eyebrow: "",
    title: "Authentication",
    description: "How the shared login and API tokens work across every product.",
    href: "/docs/authentication",
    sort_order: 3,
  },
  {
    id: "dev4",
    section: "developers",
    eyebrow: "",
    title: "Examples",
    description: "Sample apps and recipes for common integrations.",
    href: "/docs/quick-start",
    sort_order: 4,
  },
];

export type SiteSettings = {
  site_name: string;
  tagline: string;
  footer_description: string;
  copyright_text: string;
  logo_mark_url: string;
  logo_wordmark_url: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Nasah Group LTD",
  tagline: "Building technology that simplifies everyday life.",
  footer_description:
    "Building technology that simplifies everyday life — one connected ecosystem.",
  copyright_text: "Nasah Group LTD. All rights reserved.",
  logo_mark_url: "/logo-mark.jpg",
  logo_wordmark_url: "/logo-wordmark.jpg",
};

export type DocPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  sort_order: number;
};

export const DEFAULT_DOCS: DocPage[] = [
  {
    id: "d0",
    slug: "introduction",
    title: "Introduction",
    description:
      "Nasah Group LTD exposes one API and one authentication model across every product in the ecosystem. This guide covers what you need to make your first request.",
    content: `## Base URL

All requests are made against a single base URL:

\`\`\`
https://api.nasahgroup.com/v1
\`\`\`

## Next steps

- Follow the [Quick Start](/docs/quick-start) guide to make your first request.
- Explore the [Products API](/docs/products-api) reference.`,
    sort_order: 0,
  },
  {
    id: "d1",
    slug: "quick-start",
    title: "Quick Start",
    description:
      "Step-by-step guide to making your first request against the Nasah API.",
    content: `The Nasah API lives at \`https://api.nasahgroup.com\`. Public data — products and blog posts — needs no API key at all.

\`\`\`
curl https://api.nasahgroup.com/v1/products
\`\`\`

That returns:

\`\`\`
{
  "data": [
    { "id": "1", "name": "Nasah Apps", "status": "live", "href": "..." }
  ]
}
\`\`\`

## From JavaScript

\`\`\`
const res = await fetch("https://api.nasahgroup.com/v1/products");
const { data } = await res.json();
\`\`\`

## From Python

\`\`\`
import requests
res = requests.get("https://api.nasahgroup.com/v1/products")
data = res.json()["data"]
\`\`\`

## Next steps

- See [Products API](/docs/products-api) for the full field reference.
- If you need to know which user is calling, see [Authentication](/docs/authentication).`,
    sort_order: 1,
  },
  {
    id: "d2",
    slug: "authentication",
    title: "Authentication",
    description: "API keys and OAuth 2.0, shared across every product.",
    content: `Nasah Group LTD uses one login (Supabase Auth) shared across every app in the ecosystem. There's no separate API-key system yet.

## Public endpoints

\`/v1/products\` and \`/v1/posts\` need no auth — the same data your website already shows visitors.

## User-specific endpoints

Endpoints like \`/v1/me\` expect the caller's own access token:

\`\`\`
Authorization: Bearer <access_token>
\`\`\`

Because every app points at the same Supabase project, a token from any one of them is valid on the API too.

## Coming later

API keys for third-party developers aren't built yet — this page will be updated when that ships.`,
    sort_order: 2,
  },
  {
    id: "d3",
    slug: "products-api",
    title: "Products API",
    description: "Endpoints for listing and querying products.",
    content: `## List products

\`GET /v1/products\` — no auth required. Supports \`?limit=\` (max 100, default 50) and \`?offset=\`.

\`\`\`
curl "https://api.nasahgroup.com/v1/products?limit=20&offset=0"
\`\`\`

### Fields

- \`id\`, \`name\`, \`description\` — string
- \`icon_letter\`, \`image_url\` — string
- \`status\` — one of "live", "beta", "soon"
- \`href\` — string, \`sort_order\` — number

## Blog posts

\`GET /v1/posts\` — list of published posts.

\`GET /v1/posts/:slug\` — a single post, including full content.`,
    sort_order: 3,
  },
  {
    id: "d4",
    slug: "webhooks",
    title: "Webhooks",
    description: "Subscribe to real-time events from the Nasah platform.",
    content: `Webhooks aren't built yet — there's currently no way to subscribe to events from the Nasah API.

If you need this, it's a well-scoped addition: a webhooks table (endpoint URL + which events to send) plus a dispatch step wherever the action already happens. Ask if you want it built.`,
    sort_order: 4,
  },
  {
    id: "d5",
    slug: "rate-limits",
    title: "Rate Limits",
    description: "Request limits per plan and how to handle them.",
    content: `There are no rate limits enforced yet — every endpoint can be called as often as you like right now.

This is fine at current traffic levels, but worth revisiting before real outside usage — a shared store like Upstash Redis is the usual way to rate-limit serverless functions.`,
    sort_order: 5,
  },
  {
    id: "d6",
    slug: "sdk-js",
    title: "JavaScript SDK",
    description: "Official @nasah/sdk client for Node.js and the browser.",
    content: `No published \`@nasah/sdk\` package yet — plain \`fetch\` works today:

\`\`\`
async function getProducts() {
  const res = await fetch("https://api.nasahgroup.com/v1/products");
  const { data } = await res.json();
  return data;
}
\`\`\`

A dedicated npm package is a future addition, not built yet.`,
    sort_order: 6,
  },
  {
    id: "d7",
    slug: "sdk-python",
    title: "Python SDK",
    description: "Official nasah Python package.",
    content: `No published pip package yet — plain \`requests\` works today:

\`\`\`
import requests

def get_products():
    res = requests.get("https://api.nasahgroup.com/v1/products")
    return res.json()["data"]
\`\`\`

A real package is a future addition, not built yet.`,
    sort_order: 7,
  },
  {
    id: "d8",
    slug: "sdk-go",
    title: "Go SDK",
    description: "Official Go client for the Nasah API.",
    content: `No published Go module yet — plain \`net/http\` works today.

A real module is a future addition, not built yet.`,
    sort_order: 8,
  },
];

export const DEFAULT_CONTENT: Record<string, PageContent> = {
  home: {
    hero_eyebrow: "Nasah Group LTD — Technology Ecosystem",
    hero_title_pre: "Building technology that ",
    hero_title_highlight: "simplifies",
    hero_title_post: " everyday life.",
    hero_description:
      "One connected ecosystem of products, AI, and developer tools — designed with the same care, from the first click to the last line of code.",
    hero_button_primary: "Explore Products",
    hero_button_secondary: "Learn More",
    cta_title: "Start building on the Nasah ecosystem today.",
    cta_button_primary: "Get Started",
    cta_button_secondary: "Read the Docs",
  },
  products: {
    eyebrow: "Products",
    title: "Everything Nasah Group LTD builds.",
    description:
      "Consumer apps, AI tools, developer infrastructure, and internal platforms — one design system, one account, one ecosystem.",
  },
  ai: {
    eyebrow: "Nasah AI",
    title: "AI that fits into your day, not around it.",
    description: "Applied AI across the Nasah ecosystem — built for real use, not demos.",
  },
  developers: {
    eyebrow: "Developer Platform",
    title: "Build on the Nasah ecosystem.",
    description:
      "One API, one auth model, one set of SDKs — for every product Nasah Group LTD ships.",
  },
  docs: {
    eyebrow: "Documentation",
    title: "Introduction",
    description:
      "Nasah Group LTD exposes one API and one authentication model across every product in the ecosystem. This guide covers what you need to make your first request.",
  },
  about: {
    eyebrow: "Company",
    title: "About Nasah Group LTD",
    description: "Building technology that simplifies everyday life.",
    body_1:
      "Nasah Group LTD is building a connected ecosystem of products, AI tools, and developer infrastructure — designed so that everything works like one platform, not a collection of separate apps.",
    body_2:
      "We're early. This page will grow as the team, mission, and story do.",
  },
  careers: {
    eyebrow: "Careers",
    title: "Help build the Nasah ecosystem.",
    description: "We're not hiring publicly yet — check back soon, or reach out directly.",
    body_1: "There are no open roles listed right now.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Get in touch.",
    description: "Questions, partnerships, or press — we'd like to hear from you.",
    email: "hello@nasahgroup.com",
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    description: "Last updated: August 2026.",
    body_1: `**This is a genuine draft, not filler text — but it isn't legal advice. Have a lawyer review it before you consider it final, especially if you'll have users in the EU (GDPR) or California (CCPA).**

## What we collect

- **Account info**: if you create an account, we store your email address and an encrypted password (we never see your actual password — Supabase Auth handles that).
- **Contact form submissions**: your name, email, and message when you use the /contact form.
- **Basic analytics**: page views and general usage patterns via Vercel Analytics, which does not use cookies to track you individually across sites.
- **Cookies**: a small cookie to remember you've dismissed our cookie notice, plus session cookies to keep you signed in.

## What we don't do

We don't sell your data. We don't share it with advertisers.

## How we store it

Your data is stored with Supabase, our database and authentication provider, which acts as a data processor on our behalf. We don't run our own servers for this data.

## Your rights

You can update your account details from **/account**, or ask us to delete your account and associated data by emailing us via **/contact**. We'll respond within a reasonable time.

## Children

This site isn't directed at children under 13, and we don't knowingly collect data from them.

## Changes

We may update this policy as the product changes. Material changes will be reflected here with an updated date at the top of this page.

## Contact

Questions about this policy: see **/contact**.`,
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    description: "Last updated: August 2026.",
    body_1: `**This is a genuine draft, not filler text — but it isn't legal advice. Have a lawyer review it before you consider it final.**

## Using our services

By creating an account or using Nasah Group LTD's products, you agree to these terms. If you don't agree, please don't use the service.

## Accounts

You're responsible for keeping your login credentials secure and for activity that happens under your account. Let us know right away if you suspect unauthorized access.

## Acceptable use

Don't use our services to break the law, harm others, attempt to disrupt or gain unauthorized access to our systems, or misuse the API beyond what's documented at **/docs**.

## Content you submit

If you submit content (like a contact form message), you're responsible for it, and you confirm you have the right to send it to us.

## Availability

We aim to keep the service running reliably but don't guarantee it will always be available or error-free. We may update, suspend, or discontinue features as the product evolves.

## Termination

We may suspend or terminate accounts that violate these terms. You can stop using the service and request account deletion at any time via **/contact**.

## Liability

Nasah Group LTD provides its services "as is," without warranties of any kind, to the extent permitted by law. We aren't liable for indirect or consequential damages arising from your use of the service.

## Changes

We may update these terms as the product changes. Continued use after a change means you accept the updated terms.

## Contact

Questions about these terms: see **/contact**.`,
  },
  "get-started": {
    eyebrow: "Get Started",
    title: "Create your Nasah account.",
    description: "Create a free account to get started with the Nasah ecosystem.",
  },
};
