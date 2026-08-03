import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPageContent } from "@/lib/content";
import { getCards } from "@/lib/site-data";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI",
  description: "Nasah AI — applied AI tools and platform, built responsibly.",
  path: "/ai",
  keywords: ["Nasah AI", "applied AI", "responsible AI", "AI platform"],
});

export default async function AiPage() {
  const content = await getPageContent("ai");
  const pillars = await getCards("ai");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <section className="px-8 pb-28">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <Card key={pillar.id}>
              {pillar.eyebrow && (
                <span className="mb-4 inline-block text-xs font-semibold tracking-wide text-nasah-red">
                  {pillar.eyebrow}
                </span>
              )}
              <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-nasah-gray">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button href="/contact" variant="secondary">
            Talk to us about AI
          </Button>
        </div>
      </section>
    </>
  );
}
