"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import { DEFAULT_LINKS, type SiteLink } from "@/lib/content-defaults";

function emptyLink(group: SiteLink["group"], sortOrder: number): SiteLink {
  return { id: crypto.randomUUID(), group, label: "", href: "", sort_order: sortOrder };
}

export function LinksEditor({ group, title }: { group: SiteLink["group"]; title: string }) {
  const [links, setLinks] = useState<SiteLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_links")
        .select("*")
        .eq("group", group)
        .order("sort_order", { ascending: true });

      const defaults = DEFAULT_LINKS.filter((l) => l.group === group);
      setLinks(data && data.length > 0 ? (data as SiteLink[]) : defaults);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  function updateField<K extends keyof SiteLink>(id: string, key: K, value: SiteLink[K]) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  }

  function handleAdd() {
    setLinks((prev) => [...prev, emptyLink(group, prev.length + 1)]);
  }

  async function handleDelete(id: string) {
    const link = links.find((l) => l.id === id);
    const supabase = createClient();
    await supabase.from("site_links").delete().eq("id", id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
    logActivity("link.delete", link?.label || id);
  }

  async function handleSaveAll() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("site_links").upsert(links);
    setSaving(false);
    setMessage(error ? "Couldn't save — try again." : "Saved ✓");
    if (!error) logActivity("links.save", group);
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={handleAdd} className="text-sm font-semibold text-nasah-red">
          + Add link
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-2">
            <input
              placeholder="Label"
              value={link.label}
              onChange={(e) => updateField(link.id, "label", e.target.value)}
              className="w-32 rounded-control border border-nasah-border px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
            />
            <input
              placeholder="https:// or /path"
              value={link.href}
              onChange={(e) => updateField(link.id, "href", e.target.value)}
              className="flex-1 rounded-control border border-nasah-border px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
            />
            <input
              type="number"
              title="Sort order"
              value={link.sort_order}
              onChange={(e) => updateField(link.id, "sort_order", Number(e.target.value))}
              className="w-16 rounded-control border border-nasah-border px-2 py-1.5 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
            />
            <button
              onClick={() => handleDelete(link.id)}
              className="text-sm text-error hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : `Save ${title}`}
        </button>
        {message && <span className="text-sm text-success">{message}</span>}
      </div>
    </div>
  );
}
