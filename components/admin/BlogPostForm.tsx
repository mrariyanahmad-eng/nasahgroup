"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import type { Post } from "@/lib/site-data";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const emptyPost: Post = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  published: false,
  published_at: null,
};

export function BlogPostForm({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === "new";

  const [post, setPost] = useState<Post>(emptyPost);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isNew) return;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_posts").select("*").eq("id", id).maybeSingle();
      if (data) {
        setPost(data as Post);
        setSlugEdited(true);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updateField<K extends keyof Post>(key: K, value: Post[K]) {
    setPost((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    updateField("title", title);
    if (!slugEdited) updateField("slug", slugify(title));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
      updateField("cover_image_url", data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const record = {
      ...post,
      id: post.id || crypto.randomUUID(),
      published_at: post.published && !post.published_at ? new Date().toISOString() : post.published_at,
    };

    const { error } = await supabase.from("site_posts").upsert(record);
    setSaving(false);

    if (error) {
      setMessage("Couldn't save — try again.");
      return;
    }

    if (isNew) {
      router.push(`/admin/blog/${record.id}`);
    } else {
      setPost(record);
      setMessage("Saved ✓");
    }
    logActivity("blog.save", record.title || record.id);
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("site_posts").delete().eq("id", post.id);
    logActivity("blog.delete", post.title || post.id);
    router.push("/admin/blog");
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{isNew ? "New post" : "Edit post"}</h1>
        {!isNew && (
          <button onClick={handleDelete} className="text-sm font-medium text-error hover:underline">
            Delete post
          </button>
        )}
      </div>

      <label className="mb-1 block text-sm font-medium">Title</label>
      <input
        value={post.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Slug (URL: /blog/...)</label>
      <input
        value={post.slug}
        onChange={(e) => {
          setSlugEdited(true);
          updateField("slug", e.target.value);
        }}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Excerpt (shown on the blog list)</label>
      <textarea
        rows={2}
        value={post.excerpt}
        onChange={(e) => updateField("excerpt", e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Cover image</label>
      <div className="mb-4 flex items-center gap-4">
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image_url} alt="" className="h-16 w-28 rounded-control object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="text-xs text-nasah-gray"
        />
        {uploading && <span className="text-xs text-nasah-gray">Uploading…</span>}
      </div>

      <label className="mb-1 block text-sm font-medium">
        Content — supports Markdown (**bold**, *italic*, [link](url), ## heading, - list)
      </label>
      <textarea
        rows={14}
        value={post.content}
        onChange={(e) => updateField("content", e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-6 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={post.published}
          onChange={(e) => updateField("published", e.target.checked)}
        />
        Published (visible at /blog)
      </label>

      {message && <p className="mb-4 text-sm text-success">{message}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-control bg-nasah-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </>
  );
}
