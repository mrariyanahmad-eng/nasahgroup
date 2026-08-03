import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "@/components/PageHeader";
import { getPageContent } from "@/lib/content";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "About Nasah Group LTD — building technology that simplifies everyday life.",
  path: "/about",
  keywords: ["about Nasah Group LTD", "Nasah company"],
});

export default async function AboutPage() {
  const content = await getPageContent("about");

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <section className="mx-auto max-w-2xl px-8 pb-28 prose prose-neutral dark:prose-invert prose-a:text-nasah-red">
        <ReactMarkdown>{content.body_1}</ReactMarkdown>
        <ReactMarkdown>{content.body_2}</ReactMarkdown>
      </section>
    </>
  );
}
