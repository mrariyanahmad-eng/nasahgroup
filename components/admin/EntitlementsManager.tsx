"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import { DEFAULT_PRODUCTS, type Product } from "@/lib/content-defaults";

type Entitlement = {
  id: string;
  user_id: string;
  app_id: string;
  product_id: string;
  status: "active" | "expired" | "cancelled";
  platform: string;
  expiry_date: string | null;
  created_at: string;
};

const emptyGrant = {
  user_id: "",
  app_id: "",
  product_id: "manual_grant",
};

export function EntitlementsManager() {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [grant, setGrant] = useState(emptyGrant);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const [entitlementsRes, productsRes] = await Promise.all([
      supabase.from("entitlements").select("*").order("created_at", { ascending: false }),
      supabase.from("site_products").select("*").order("sort_order", { ascending: true }),
    ]);
    setEntitlements((entitlementsRes.data as Entitlement[]) ?? []);
    setProducts(
      productsRes.data && productsRes.data.length > 0
        ? (productsRes.data as Product[])
        : DEFAULT_PRODUCTS
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id: string, status: Entitlement["status"]) {
    const supabase = createClient();
    await supabase.from("entitlements").update({ status }).eq("id", id);
    logActivity("entitlement.update", `${id} → ${status}`);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this entitlement?")) return;
    const supabase = createClient();
    await supabase.from("entitlements").delete().eq("id", id);
    logActivity("entitlement.delete", id);
    load();
  }

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("entitlements").insert({
      user_id: grant.user_id.trim(),
      app_id: grant.app_id.trim(),
      product_id: grant.product_id.trim() || "manual_grant",
      platform: "manual",
      purchase_token: `manual-${crypto.randomUUID()}`,
      status: "active",
    });

    if (error) {
      setError(error.message);
      return;
    }

    logActivity("entitlement.grant", `${grant.app_id} → ${grant.user_id}`);
    setGrant(emptyGrant);
    load();
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Entitlements</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Who has premium in which app — from real Play Store purchases
        (via the API) or granted manually below.
      </p>

      <div className="mb-8 divide-y divide-nasah-border overflow-hidden rounded-card border border-nasah-border bg-white dark:divide-white/10 dark:border-white/10 dark:bg-nasah-dark-surface">
        {entitlements.length === 0 && (
          <p className="px-5 py-6 text-sm text-nasah-gray">No entitlements yet.</p>
        )}
        {entitlements.map((e) => (
          <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
            <div>
              <p className="font-medium">{e.app_id}</p>
              <p className="text-xs text-nasah-gray">
                user: {e.user_id} · {e.product_id} · {e.platform}
                {e.expiry_date && ` · expires ${new Date(e.expiry_date).toLocaleDateString()}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={e.status}
                onChange={(ev) => handleStatusChange(e.id, ev.target.value as Entitlement["status"])}
                className="rounded-control border border-nasah-border px-2 py-1 text-xs dark:border-white/10 dark:bg-nasah-dark-bg"
              >
                <option value="active">active</option>
                <option value="expired">expired</option>
                <option value="cancelled">cancelled</option>
              </select>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-xs font-medium text-error hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-nasah-border bg-white p-5 dark:border-white/10 dark:bg-nasah-dark-surface">
        <h2 className="mb-1 font-semibold">Manually grant premium</h2>
        <p className="mb-4 text-sm text-nasah-gray">
          For support cases — a gift, or fixing a broken purchase. Get the
          User UID from Supabase Dashboard → Authentication → Users.
        </p>
        <form onSubmit={handleGrant} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            required
            placeholder="User UID"
            value={grant.user_id}
            onChange={(e) => setGrant({ ...grant, user_id: e.target.value })}
            className="rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
          />
          <input
            required
            list="product-app-ids"
            placeholder="App (pick or type one)"
            value={grant.app_id}
            onChange={(e) => setGrant({ ...grant, app_id: e.target.value })}
            className="rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
          />
          <datalist id="product-app-ids">
            {products.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
          <input
            placeholder="Product ID (optional)"
            value={grant.product_id}
            onChange={(e) => setGrant({ ...grant, product_id: e.target.value })}
            className="rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
          />
          {error && <p className="col-span-full text-sm text-error">{error}</p>}
          <button
            type="submit"
            className="col-span-full rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark sm:col-span-1"
          >
            Grant
          </button>
        </form>
      </div>
    </>
  );
}
