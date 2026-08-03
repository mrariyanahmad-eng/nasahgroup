"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import { DEFAULT_PRODUCTS, type Product } from "@/lib/content-defaults";

function emptyProduct(sortOrder: number): Product {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    icon_letter: "N",
    image_url: "",
    status: "soon",
    href: "",
    sort_order: sortOrder,
  };
}

export function ProductsEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_products")
        .select("*")
        .order("sort_order", { ascending: true });

      setProducts(data && data.length > 0 ? (data as Product[]) : DEFAULT_PRODUCTS);
      setLoading(false);
    }
    load();
  }, []);

  function updateField<K extends keyof Product>(id: string, key: K, value: Product[K]) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  }

  async function handleSave(product: Product) {
    setSavingId(product.id);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("site_products").upsert(product);
    setSavingId(null);
    setMessage(error ? "Couldn't save — try again." : "Saved ✓");
    if (!error) logActivity("product.save", product.name || product.id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const product = products.find((p) => p.id === id);
    const supabase = createClient();
    await supabase.from("site_products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logActivity("product.delete", product?.name || id);
  }

  async function handleImageUpload(product: Product, file: File) {
    setUploadingId(product.id);
    setMessage(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${product.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploadingId(null);
      setMessage("Upload failed — try again.");
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    updateField(product.id, "image_url", data.publicUrl);
    setUploadingId(null);
  }

  function handleAdd() {
    setProducts((prev) => [...prev, emptyProduct(prev.length + 1)]);
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-nasah-gray">
            Shown on the homepage and /products. Each is saved individually.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
        >
          + Add product
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-success">{message}</p>}

      <div className="space-y-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-card border border-nasah-border bg-white p-5 dark:border-white/10 dark:bg-nasah-dark-surface"
          >
            <div className="mb-4 flex items-center gap-4">
              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image_url}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-nasah-red font-display text-base font-bold text-white">
                  {product.icon_letter}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-nasah-gray">
                  Icon / app image (e.g. your Play Store icon)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(product, file);
                  }}
                  className="mt-1 text-xs text-nasah-gray"
                />
                {uploadingId === product.id && (
                  <p className="mt-1 text-xs text-nasah-gray">Uploading…</p>
                )}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-nasah-gray">
                  Icon letter (fallback if no image)
                </label>
                <input
                  value={product.icon_letter}
                  maxLength={2}
                  onChange={(e) => updateField(product.id, "icon_letter", e.target.value)}
                  className="w-full rounded-control border border-nasah-border px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-nasah-gray">Status</label>
                <select
                  value={product.status}
                  onChange={(e) =>
                    updateField(product.id, "status", e.target.value as Product["status"])
                  }
                  className="w-full rounded-control border border-nasah-border px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
                >
                  <option value="live">Live</option>
                  <option value="beta">Beta</option>
                  <option value="soon">Coming soon</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-nasah-gray">Sort order</label>
                <input
                  type="number"
                  value={product.sort_order}
                  onChange={(e) => updateField(product.id, "sort_order", Number(e.target.value))}
                  className="w-full rounded-control border border-nasah-border px-2.5 py-1.5 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
                />
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-nasah-gray">Name</label>
            <input
              value={product.name}
              onChange={(e) => updateField(product.id, "name", e.target.value)}
              className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />

            <label className="mb-1 block text-xs font-medium text-nasah-gray">Description</label>
            <textarea
              rows={2}
              value={product.description}
              onChange={(e) => updateField(product.id, "description", e.target.value)}
              className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />

            <label className="mb-1 block text-xs font-medium text-nasah-gray">
              Link (where "Learn more" goes — e.g. https://apps.nasahgroup.com)
            </label>
            <input
              value={product.href}
              onChange={(e) => updateField(product.id, "href", e.target.value)}
              className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(product)}
                disabled={savingId === product.id}
                className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
              >
                {savingId === product.id ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => handleDelete(product.id)}
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
