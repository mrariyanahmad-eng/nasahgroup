import Link from "next/link";
import { PAGES } from "@/lib/content-defaults";

export default function AdminPagesList() {
  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Pages</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Choose a page to edit its headline, description, and button text.
      </p>

      <div className="divide-y divide-nasah-border overflow-hidden rounded-card border border-nasah-border bg-white dark:divide-white/10 dark:border-white/10 dark:bg-nasah-dark-surface">
        {PAGES.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className="flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors hover:bg-nasah-surface dark:hover:bg-white/5"
          >
            {page.label}
            <span className="text-nasah-gray">Edit →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
