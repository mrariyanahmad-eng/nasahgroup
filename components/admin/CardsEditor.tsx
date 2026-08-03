"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import { DEFAULT_CARDS, type SiteCard } from "@/lib/content-defaults";

function emptyCard(section: SiteCard["section"], sortOrder: number): SiteCard {
  return {
    id: crypto.randomUUID(),
    section,
    eyebrow: "",
    title: "",
    description: "",
    href: "",
    sort_order: sortOrder,
  };
}

export function CardsEditor({
  section,
  title,
  showEyebrow,
  showHref,
}: {
  section: SiteCard["section"];
  title: string;
  showEyebrow?: boolean;
  showHref?: boolean;
}) {
  const [cards, setCards] = useState<SiteCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_cards")
        .select("*")
        .eq("section", section)
        .order("sort_order", { ascending: true });

      const defaults = DEFAULT_CARDS.filter((c) => c.section === section);
      setCards(data && data.length > 0 ? (data as SiteCard[]) : defaults);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  function updateField<K extends keyof SiteCard>(id: string, key: K, value: SiteCard[K]) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  async function handleSave(card: SiteCard) {
    setSavingId(card.id);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("site_cards").upsert(card);
    setSavingId(null);
    setMessage(error ? "Couldn't save — try again." : "Saved ✓");
    if (!error) logActivity("card.save", card.title || card.id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this card?")) return;
    const card = cards.find((c) => c.id === id);
    const supabase = createClient();
    await supabase.from("site_cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
    logActivity("card.delete", card?.title || id);
  }

  function handleAdd() {
    setCards((prev) => [...prev, emptyCard(section, prev.length + 1)]);
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <button
          onClick={handleAdd}
          className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
        >
          + Add card
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-success">{message}</p>}

      <div className="space-y-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-card border border-nasah-border bg-white p-5 dark:border-white/10 dark:bg-nasah-dark-surface"
          >
            {showEyebrow && (
              <>
                <label className="mb-1 block text-xs font-medium text-nasah-gray">
                  Small label (e.g. "AI Tools")
                </label>
                <input
                  value={card.eyebrow}
                  onChange={(e) => updateField(card.id, "eyebrow", e.target.value)}
                  className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
                />
              </>
            )}

            <label className="mb-1 block text-xs font-medium text-nasah-gray">Title</label>
            <input
              value={card.title}
              onChange={(e) => updateField(card.id, "title", e.target.value)}
              className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />

            <label className="mb-1 block text-xs font-medium text-nasah-gray">Description</label>
            <textarea
              rows={2}
              value={card.description}
              onChange={(e) => updateField(card.id, "description", e.target.value)}
              className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />

            {showHref && (
              <>
                <label className="mb-1 block text-xs font-medium text-nasah-gray">
                  Link ("Read more" goes here)
                </label>
                <input
                  value={card.href}
                  onChange={(e) => updateField(card.id, "href", e.target.value)}
                  className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
                />
              </>
            )}

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => handleSave(card)}
                disabled={savingId === card.id}
                className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
              >
                {savingId === card.id ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="text-sm font-medium text-error hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
