import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { DocsArticle } from "@/components/DocsArticle";
import { buildMetadata } from "@/lib/seo";
import { getDocBySlug } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Documentation",
  description: "Documentation for the Nasah Group LTD platform and APIs.",
  path: "/docs",
  keywords: ["Nasah docs", "Nasah documentation", "API reference"],
});

export default async function DocsPage() {
  const doc = await getDocBySlug("introduction");

  if (!doc) {
    return <DocsArticle title="Introduction"><p>Coming soon.</p></DocsArticle>;
  }

  return (
    <DocsArticle title={doc.title}>
      <p>{doc.description}</p>
      <ReactMarkdown>{doc.content}</ReactMarkdown>
    </DocsArticle>
  );
}
