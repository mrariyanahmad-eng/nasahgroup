"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STATIC_SEARCH_INDEX, type SearchEntry } from "@/lib/search-index";
import { DEFAULT_PRODUCTS } from "@/lib/content-defaults";

export function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchEntry[]>([]);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onCustomOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("nasah:open-search", onCustomOpen);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("nasah:open-search", onCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (!open || products.length > 0) return;

    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_products")
        .select("name, description, href")
        .order("sort_order", { ascending: true });

      const list = data && data.length > 0 ? data : DEFAULT_PRODUCTS;
      setProducts(
        list.map((p) => ({
          title: p.name,
          description: p.description,
          href: p.href,
          group: "Pages" as const,
        }))
      );
    }
    loadProducts();
  }, [open, products.length]);

  const results = useMemo(() => {
    const all = [...STATIC_SEARCH_INDEX, ...products];
    if (!query.trim()) return all.slice(0, 8);

    const q = query.toLowerCase();
    return all.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    if (href.startsWith("http")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="hidden items-center gap-2 rounded-control border border-nasah-border bg-nasah-surface px-3 py-1.5 text-sm text-nasah-gray transition-colors hover:border-nasah-red/40 sm:flex dark:border-white/10 dark:bg-white/5"
      >
        Search
        <kbd className="rounded border border-nasah-border bg-white px-1.5 text-xs dark:border-white/10 dark:bg-nasah-dark-bg">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-24 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-card border border-nasah-border bg-white shadow-2xl dark:border-white/10 dark:bg-nasah-dark-surface"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, docs, pages…"
              className="w-full border-b border-nasah-border bg-transparent px-5 py-4 text-base outline-none dark:border-white/10"
            />
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-nasah-gray">No results.</p>
              )}
              {results.map((entry) => (
                <button
                  key={entry.href + entry.title}
                  onClick={() => go(entry.href)}
                  className="block w-full rounded-control px-3 py-2.5 text-left transition-colors hover:bg-nasah-surface dark:hover:bg-white/5"
                >
                  <p className="text-sm font-medium">{entry.title}</p>
                  <p className="truncate text-xs text-nasah-gray">{entry.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
