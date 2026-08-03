import Link from "next/link";
import { getDocs } from "@/lib/site-data";

export async function DocsSidebar() {
  const docs = await getDocs();

  return (
    <nav className="w-full shrink-0 sm:w-56">
      <h5 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-nasah-gray">
        Documentation
      </h5>
      <ul className="space-y-1">
        {docs.map((doc) => (
          <li key={doc.id}>
            <Link
              href={doc.slug === "introduction" ? "/docs" : `/docs/${doc.slug}`}
              className="block rounded-md px-2.5 py-1.5 text-sm text-nasah-ink transition-colors hover:bg-nasah-surface hover:text-nasah-red dark:text-white/80 dark:hover:bg-white/5"
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
