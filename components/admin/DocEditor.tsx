"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import type { DocPage } from "@/lib/content-defaults";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const emptyDoc: DocPage = {
  id: "",
  slug: "",
  title: "",
  description: "",
  content: "",
  sort_order: 99,
};

export function DocEditor({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === "new";

  const [doc, setDoc] = useState<DocPage>(emptyDoc);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_docs").select("*").eq("id", id).maybeSingle();
      if (data) {
        setDoc(data as DocPage);
        setSlugEdited(true);
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function updateField<K extends keyof DocPage>(key: K, value: DocPage[K]) {
    setDoc((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(title: string) {
    updateField("title", title);
    if (!slugEdited) updateField("slug", slugify(title));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const record = { ...doc, id: doc.id || crypto.randomUUID() };

    const { error } = await supabase.from("site_docs").upsert(record);
    setSaving(false);

    if (error) {
      setMessage("Couldn't save — try again.");
      return;
    }

    logActivity("doc.save", record.title || record.id);

    if (isNew) {
      router.push(`/admin/docs/${record.id}`);
    } else {
      setDoc(record);
      setMessage("Saved ✓");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this doc page?")) return;
    const supabase = createClient();
    await supabase.from("site_docs").delete().eq("id", doc.id);
    logActivity("doc.delete", doc.title || doc.id);
    router.push("/admin/docs");
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{isNew ? "New doc page" : "Edit doc page"}</h1>
        {!isNew && (
          <button onClick={handleDelete} className="text-sm font-medium text-error hover:underline">
            Delete
          </button>
        )}
      </div>

      <label className="mb-1 block text-sm font-medium">Title</label>
      <input
        value={doc.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">
        Slug (URL: /docs/... — use "introduction" for the main /docs page)
      </label>
      <input
        value={doc.slug}
        onChange={(e) => {
          setSlugEdited(true);
          updateField("slug", e.target.value);
        }}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Short description</label>
      <textarea
        rows={2}
        value={doc.description}
        onChange={(e) => updateField("description", e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">
        Content — supports Markdown (**bold**, [link](url), ## heading, ```code```)
      </label>
      <textarea
        rows={16}
        value={doc.content}
        onChange={(e) => updateField("content", e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">
        Sort order (lower shows first in the sidebar)
      </label>
      <input
        type="number"
        value={doc.sort_order}
        onChange={(e) => updateField("sort_order", Number(e.target.value))}
        className="mb-6 w-32 rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

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
