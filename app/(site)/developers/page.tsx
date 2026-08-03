import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPageContent } from "@/lib/content";
import { getCards } from "@/lib/site-data";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Developers",
  description: "Build on the Nasah Group LTD platform — API, SDKs, and auth.",
  path: "/developers",
  keywords: ["Nasah API", "Nasah SDK", "developer platform", "Nasah developers"],
});

const codeSnippet = `const res = await fetch("https://api.nasahgroup.com/v1/products");
const { data: products } = await res.json();`;

export default async function DevelopersPage() {
  const content = await getPageContent("developers");
  const resources = await getCards("developers");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <section className="px-8">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-card border border-nasah-border dark:border-white/10">
          <div className="flex items-center gap-1.5 border-b border-nasah-border bg-nasah-surface px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <span className="h-2.5 w-2.5 rounded-full bg-nasah-border dark:bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-nasah-border dark:bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-nasah-border dark:bg-white/20" />
            <span className="ml-3 text-xs text-nasah-gray">quickstart.ts</span>
          </div>
          <pre className="overflow-x-auto bg-white p-6 text-sm leading-relaxed text-nasah-ink dark:bg-nasah-dark-surface dark:text-white/90">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      </section>

      <section className="px-8 py-28">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {resource.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-nasah-gray">
                {resource.description}
              </p>
              {resource.href && (
                <a href={resource.href} className="text-sm font-semibold text-nasah-red">
                  Read more →
                </a>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button href="/docs">
            Read the docs
          </Button>
        </div>
      </section>
    </>
  );
}
