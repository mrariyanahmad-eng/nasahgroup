import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Careers at Nasah Group LTD.",
  path: "/careers",
  keywords: ["Nasah careers", "Nasah jobs"],
});

export default async function CareersPage() {
  const content = await getPageContent("careers");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="mx-auto max-w-2xl px-8 pb-28 text-center">
        <p className="leading-relaxed text-nasah-gray">{content.body_1}</p>
      </section>
    </>
  );
}
