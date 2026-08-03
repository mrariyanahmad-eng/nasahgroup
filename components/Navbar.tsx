import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchPalette } from "@/components/SearchPalette";
import { getLinks, getSettings } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const [links, settings] = await Promise.all([getLinks("nav"), getSettings()]);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="glass fixed inset-x-0 top-0 z-50 border-b border-nasah-border bg-white/70 dark:border-white/10 dark:bg-nasah-dark-bg/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={settings.logo_mark_url}
            alt={settings.site_name}
            width={26}
            height={26}
            className="rounded-full"
          />
          <span className="font-display text-[17px] font-bold tracking-tight">
            {settings.site_name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-nasah-gray transition-colors hover:bg-nasah-surface hover:text-nasah-ink dark:hover:bg-white/5 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SearchPalette />
          {user ? (
            <Button href="/account" variant="ghost" size="sm">
              My Account
            </Button>
          ) : (
            <>
              <Button href="/sign-in" variant="ghost" size="sm">
                Sign In
              </Button>
              <Button href="/get-started" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
