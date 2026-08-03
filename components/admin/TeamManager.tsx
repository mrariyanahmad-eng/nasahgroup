"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";

type AdminRow = { user_id: string; email: string; created_at: string };

export function TeamManager() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("admins")
      .select("*")
      .order("created_at", { ascending: true });
    setAdmins((data as AdminRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("admins")
      .insert({ user_id: newUserId.trim(), email: newEmail.trim() });

    if (error) {
      setError(error.message);
      return;
    }

    logActivity("admin.add", newEmail || newUserId);
    setNewUserId("");
    setNewEmail("");
    load();
  }

  async function handleRemove(userId: string, email: string) {
    if (!confirm(`Remove ${email || userId} as an admin?`)) return;
    const supabase = createClient();
    await supabase.from("admins").delete().eq("user_id", userId);
    logActivity("admin.remove", email || userId);
    load();
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  return (
    <>
      <div className="mb-8 divide-y divide-nasah-border overflow-hidden rounded-card border border-nasah-border bg-white dark:divide-white/10 dark:border-white/10 dark:bg-nasah-dark-surface">
        {admins.map((admin) => (
          <div key={admin.user_id} className="flex items-center justify-between px-6 py-3 text-sm">
            <div>
              <p className="font-medium">{admin.email || "(no email on file)"}</p>
              <p className="text-xs text-nasah-gray">{admin.user_id}</p>
            </div>
            <button
              onClick={() => handleRemove(admin.user_id, admin.email)}
              className="text-sm font-medium text-error hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-nasah-border bg-white p-5 dark:border-white/10 dark:bg-nasah-dark-surface">
        <h2 className="mb-1 font-semibold">Add an admin</h2>
        <p className="mb-4 text-sm text-nasah-gray">
          The person must already have an account (via /sign-up). Get their
          User UID from Supabase Dashboard → Authentication → Users.
        </p>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-nasah-gray">User UID</label>
            <input
              required
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              className="w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-nasah-gray">
              Email (for display only)
            </label>
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-bg"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
          >
            Add admin
          </button>
        </form>
      </div>
    </>
  );
}
