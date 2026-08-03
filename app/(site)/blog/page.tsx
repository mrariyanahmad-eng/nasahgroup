import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { getPosts } from "@/lib/site-data";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Blog",
    description: "News and updates from Nasah Group LTD.",
    path: "/blog",
    keywords: ["Nasah blog", "Nasah news", "Nasah updates"],
  }),
  alternates: {
    canonical: "https://nasahgroup.com/blog",
    types: { "application/rss+xml": "https://nasahgroup.com/feed.xml" },
  },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="News from Nasah Group LTD."
        description="Product updates, engineering notes, and announcements."
      />

      <div className="mx-auto mb-8 max-w-3xl px-8 text-right">
        <Link href="/feed.xml" className="text-sm text-nasah-gray hover:text-nasah-red">
          RSS feed
        </Link>
      </div>

      <section className="mx-auto max-w-3xl px-8 pb-28">
        {posts.length === 0 ? (
          <p className="text-center text-nasah-gray">No posts yet — check back soon.</p>
        ) : (
          <div className="space-y-10">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                {post.cover_image_url && (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="mb-4 w-full rounded-card object-cover"
                  />
                )}
                <p className="mb-1 text-xs text-nasah-gray">
                  {post.published_at &&
                    new Date(post.published_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </p>
                <h2 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-nasah-red">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed text-nasah-gray">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
