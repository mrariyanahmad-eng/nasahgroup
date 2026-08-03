import Image from "next/image";
import Link from "next/link";
import { getLinks, getSettings } from "@/lib/site-data";

export async function Footer() {
  const [products, developers, company, legal, social, settings] = await Promise.all([
    getLinks("footer_products"),
    getLinks("footer_developers"),
    getLinks("footer_company"),
    getLinks("footer_legal"),
    getLinks("social"),
    getSettings(),
  ]);

  const columns = [
    { heading: "Products", links: products },
    { heading: "Developers", links: developers },
    { heading: "Company", links: company },
    { heading: "Legal", links: legal },
  ];

  return (
    <footer className="border-t border-nasah-border dark:border-white/10">
      <div className="mx-auto max-w-6xl px-8 py-16">
        <div className="grid grid-cols-2 gap-8 pb-14 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={settings.logo_mark_url}
                alt={settings.site_name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-display text-base font-bold">{settings.site_name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-nasah-gray">
              {settings.footer_description}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h5 className="mb-4 text-xs font-semibold uppercase tracking-wide text-nasah-gray">
                {col.heading}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-sm text-nasah-ink transition-colors hover:text-nasah-red dark:text-white/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-nasah-border pt-7 text-sm text-nasah-gray sm:flex-row dark:border-white/10">
          <span>© {new Date().getFullYear()} {settings.copyright_text}</span>
          <div className="flex gap-5">
            {social.map((link) => (
              <Link key={link.id} href={link.href} className="hover:text-nasah-red">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
