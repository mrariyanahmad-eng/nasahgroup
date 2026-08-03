import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { DocsArticle } from "@/components/DocsArticle";
import { getDocBySlug } from "@/lib/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}

export default async function DocSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) notFound();

  return (
    <DocsArticle title={doc.title}>
      <p>{doc.description}</p>
      <ReactMarkdown>{doc.content}</ReactMarkdown>
    </DocsArticle>
  );
}
