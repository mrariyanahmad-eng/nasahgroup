import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/PageHeader";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of service for Nasah Group LTD.",
  path: "/terms",
});

export default async function TermsPage() {
  const content = await getPageContent("terms");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="mx-auto max-w-2xl px-8 pb-28 prose prose-neutral dark:prose-invert prose-a:text-nasah-red">
        <ReactMarkdown>{content.body_1}</ReactMarkdown>
      </section>
    </>
  );
}
