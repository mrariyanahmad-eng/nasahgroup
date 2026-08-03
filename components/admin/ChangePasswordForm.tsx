"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setPassword("");
    setStatus("saved");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <label className="mb-1 block text-sm font-medium">New password</label>
      <input
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />
      {error && <p className="mb-3 text-sm text-error">{error}</p>}
      {status === "saved" && <p className="mb-3 text-sm text-success">Password updated ✓</p>}
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
      >
        {status === "saving" ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
