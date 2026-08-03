"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/site-data";

export function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false });
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Blog</h1>
          <p className="text-sm text-nasah-gray">Posts shown at /blog.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
        >
          + New post
        </Link>
      </div>

      {loading && <p className="text-nasah-gray">Loading…</p>}
      {!loading && posts.length === 0 && <p className="text-nasah-gray">No posts yet.</p>}

      <div className="divide-y divide-nasah-border overflow-hidden rounded-card border border-nasah-border bg-white dark:divide-white/10 dark:border-white/10 dark:bg-nasah-dark-surface">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/blog/${post.id}`}
            className="flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors hover:bg-nasah-surface dark:hover:bg-white/5"
          >
            <span>
              {post.title || <span className="text-nasah-gray">Untitled</span>}
              {!post.published && (
                <span className="ml-2 rounded-full bg-nasah-surface px-2 py-0.5 text-xs text-nasah-gray dark:bg-white/10">
                  Draft
                </span>
              )}
            </span>
            <span className="text-nasah-gray">Edit →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
