"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
  Users,
  Settings as SettingsIcon,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/docs", label: "Docs", icon: FileCode },
      { href: "/admin/ai", label: "AI Cards", icon: Sparkles },
      { href: "/admin/developers", label: "Developer Cards", icon: Code2 },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/navigation", label: "Navigation", icon: NavigationIcon },
      { href: "/admin/footer", label: "Footer", icon: PanelBottom },
      { href: "/admin/branding", label: "Branding", icon: Palette },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/messages", label: "Messages", icon: Mail },
      { href: "/admin/entitlements", label: "Entitlements", icon: BadgeCheck },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-nasah-black sm:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-6 py-5">
        <Image src="/logo-mark.jpg" alt="Nasah" width={28} height={28} className="rounded-full" />
        <span className="font-display text-[15px] font-bold text-white">Nasah Admin</span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-control px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-nasah-red text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon size={16} strokeWidth={2} className="shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
