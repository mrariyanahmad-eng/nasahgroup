import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/PageHeader";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Nasah Group LTD handles your data.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const content = await getPageContent("privacy");

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
