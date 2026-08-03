"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import { DEFAULT_CONTENT, PAGES, type PageContent } from "@/lib/content-defaults";

export function AdminEditor({ slug }: { slug: string }) {
  const page = PAGES.find((p) => p.slug === slug);
  const defaults = DEFAULT_CONTENT[slug] ?? {};

  const [fields, setFields] = useState<PageContent>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("page_slug", slug)
        .maybeSingle();

      if (!cancelled) {
        setFields({ ...defaults, ...((data?.content as PageContent) ?? {}) });
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");

    const supabase = createClient();
    const { error } = await supabase
      .from("site_content")
      .upsert({ page_slug: slug, content: fields, updated_at: new Date().toISOString() });

    setSaving(false);
    setStatus(error ? "error" : "saved");
    if (!error) logActivity("page.save", slug);
  }

  if (!page) {
    return <p className="text-nasah-gray">Unknown page: {slug}</p>;
  }

  if (loading) {
    return <p className="text-nasah-gray">Loading…</p>;
  }

  return (
    <>
      <Link href="/admin/pages" className="mb-6 inline-block text-sm text-nasah-gray hover:text-nasah-red">
        ← All pages
      </Link>
      <h1 className="mb-8 font-display text-2xl font-bold">{page.label}</h1>

      <div className="space-y-6">
        {Object.keys(defaults).map((key) => {
          const value = fields[key] ?? "";
          const isLong = value.length > 70 || key.includes("description") || key.includes("body");

          return (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium capitalize">
                {key.replace(/_/g, " ")}
                {key.includes("body") && (
                  <span className="ml-2 text-xs font-normal text-nasah-gray">
                    (supports Markdown: **bold**, [link](url), ## heading)
                  </span>
                )}
              </label>
              {isLong ? (
                <textarea
                  rows={3}
                  value={value}
                  onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
                  className="w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setFields({ ...fields, [key]: e.target.value })}
                  className="w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-control bg-nasah-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && <span className="text-sm text-success">Saved ✓</span>}
        {status === "error" && (
          <span className="text-sm text-error">Couldn&apos;t save — try again.</span>
        )}
      </div>
    </>
  );
}
