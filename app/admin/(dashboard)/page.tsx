import Link from "next/link";
import {
  FileText,
  Package,
  BookOpen,
  FileCode,
  Sparkles,
  Code2,
  Navigation as NavigationIcon,
  PanelBottom,
  Palette,
  Mail,
  Activity,
  BadgeCheck,
  Users,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import { PAGES, DEFAULT_PRODUCTS } from "@/lib/content-defaults";

const groups: {
  label: string;
  cards: { href: string; title: string; description: string; count: string; icon: LucideIcon }[];
}[] = [
  {
    label: "Content",
    cards: [
      {
        href: "/admin/pages",
        title: "Pages",
        description: "Headline, description, and button text for every page.",
        count: `${PAGES.length} pages`,
        icon: FileText,
      },
      {
        href: "/admin/products",
        title: "Products",
        description: "Add, edit, or remove products on the homepage and /products.",
        count: `${DEFAULT_PRODUCTS.length} products`,
        icon: Package,
      },
      {
        href: "/admin/blog",
        title: "Blog",
        description: "Write and publish posts at /blog.",
        count: "",
        icon: BookOpen,
      },
      {
        href: "/admin/docs",
        title: "Docs",
        description: "Every page at /docs, including sidebar order.",
        count: "",
        icon: FileCode,
      },
      {
        href: "/admin/ai",
        title: "AI Cards",
        description: "The pillar cards on the /ai page.",
        count: "",
        icon: Sparkles,
      },
      {
        href: "/admin/developers",
        title: "Developer Cards",
        description: "The resource cards on the /developers page.",
        count: "",
        icon: Code2,
      },
    ],
  },
  {
    label: "Site",
    cards: [
      {
        href: "/admin/navigation",
        title: "Navigation",
        description: "Links in the top navigation bar.",
        count: "",
        icon: NavigationIcon,
      },
      {
        href: "/admin/footer",
        title: "Footer",
        description: "Every footer column and social link.",
        count: "",
        icon: PanelBottom,
      },
      {
        href: "/admin/branding",
        title: "Branding",
        description: "Logo, site name, tagline, footer text.",
        count: "",
        icon: Palette,
      },
    ],
  },
  {
    label: "Admin",
    cards: [
      {
        href: "/admin/messages",
        title: "Messages",
        description: "Submissions from the /contact form.",
        count: "",
        icon: Mail,
      },
      {
        href: "/admin/entitlements",
        title: "Entitlements",
        description: "Who has premium in which app — view, grant, or revoke.",
        count: "",
        icon: BadgeCheck,
      },
      {
        href: "/admin/activity",
        title: "Activity Log",
        description: "Recent changes made from the admin panel.",
        count: "",
        icon: Activity,
      },
      {
        href: "/admin/team",
        title: "Team",
        description: "Add or remove who can access /admin.",
        count: "",
        icon: Users,
      },
      {
        href: "/admin/settings",
        title: "Settings",
        description: "Password and two-factor authentication.",
        count: "",
        icon: SettingsIcon,
      },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="mb-10">
        <span className="mb-3 inline-block h-1 w-10 rounded-full bg-nasah-red" />
        <h1 className="mb-2 font-display text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-nasah-gray">
          Everything on nasahgroup.com can be edited from here.
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-nasah-gray">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {group.cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-card border border-nasah-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-nasah-red/30 hover:shadow-card dark:border-white/10 dark:bg-nasah-dark-surface"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-nasah-red/10 text-nasah-red">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    {card.count && <span className="text-xs text-nasah-gray">{card.count}</span>}
                  </div>
                  <h3 className="mb-1 font-semibold group-hover:text-nasah-red">{card.title}</h3>
                  <p className="text-sm text-nasah-gray">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
