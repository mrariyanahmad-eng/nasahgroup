import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-8 pb-28 pt-36">
      <p className="mb-3 text-sm text-nasah-gray">
        {post.published_at &&
          new Date(post.published_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </p>
      <h1 className="mb-6 font-display text-h1">{post.title}</h1>

      {post.cover_image_url && (
        <Image
          src={post.cover_image_url}
          alt={post.title}
          width={800}
          height={420}
          className="mb-8 w-full rounded-card object-cover"
        />
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-nasah-red prose-headings:font-display">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
