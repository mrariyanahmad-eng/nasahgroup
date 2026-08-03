"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_DOCS, type DocPage } from "@/lib/content-defaults";

export function DocsList() {
  const [docs, setDocs] = useState<DocPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_docs")
        .select("*")
        .order("sort_order", { ascending: true });
      setDocs(data && data.length > 0 ? (data as DocPage[]) : DEFAULT_DOCS);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Docs</h1>
          <p className="text-sm text-nasah-gray">Pages shown at /docs.</p>
        </div>
        <Link
          href="/admin/docs/new"
          className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
        >
          + New doc page
        </Link>
      </div>

      {loading && <p className="text-nasah-gray">Loading…</p>}

      <div className="divide-y divide-nasah-border overflow-hidden rounded-card border border-nasah-border bg-white dark:divide-white/10 dark:border-white/10 dark:bg-nasah-dark-surface">
        {docs.map((doc) => (
          <Link
            key={doc.id}
            href={`/admin/docs/${doc.id}`}
            className="flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors hover:bg-nasah-surface dark:hover:bg-white/5"
          >
            <span>
              {doc.title} <span className="text-nasah-gray">/docs/{doc.slug === "introduction" ? "" : doc.slug}</span>
            </span>
            <span className="text-nasah-gray">Edit →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
