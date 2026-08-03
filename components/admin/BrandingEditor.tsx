"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/content-defaults";

export function BrandingEditor() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"mark" | "wordmark" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
      setLoading(false);
    }
    load();
  }, []);

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(file: File, field: "logo_mark_url" | "logo_wordmark_url") {
    setUploading(field === "logo_mark_url" ? "mark" : "wordmark");
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${field}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("site-assets").upload(path, file, {
      upsert: true,
    });

    if (!error) {
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      updateField(field, data.publicUrl);
    }
    setUploading(null);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: "default", ...settings, updated_at: new Date().toISOString() });
    setSaving(false);
    setMessage(error ? "Couldn't save — try again." : "Saved ✓");
    if (!error) logActivity("settings.save", "branding");
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Branding</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Logo, site name, and the text shown in the footer everywhere on the site.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Logo mark (icon)</label>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.logo_mark_url}
              alt=""
              className="h-14 w-14 rounded-full border border-nasah-border object-cover dark:border-white/10"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file, "logo_mark_url");
                }}
                className="text-xs text-nasah-gray"
              />
              {uploading === "mark" && <p className="text-xs text-nasah-gray">Uploading…</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Logo wordmark</label>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={settings.logo_wordmark_url}
              alt=""
              className="h-14 w-28 rounded-control border border-nasah-border object-contain dark:border-white/10"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file, "logo_wordmark_url");
                }}
                className="text-xs text-nasah-gray"
              />
              {uploading === "wordmark" && <p className="text-xs text-nasah-gray">Uploading…</p>}
            </div>
          </div>
        </div>
      </div>

      <label className="mb-1 block text-sm font-medium">Site name</label>
      <input
        value={settings.site_name}
        onChange={(e) => updateField("site_name", e.target.value)}
        className="mb-4 w-full max-w-sm rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Tagline</label>
      <input
        value={settings.tagline}
        onChange={(e) => updateField("tagline", e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Footer description</label>
      <textarea
        rows={2}
        value={settings.footer_description}
        onChange={(e) => updateField("footer_description", e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">
        Copyright text (shown after "© 2026")
      </label>
      <input
        value={settings.copyright_text}
        onChange={(e) => updateField("copyright_text", e.target.value)}
        className="mb-6 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
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
