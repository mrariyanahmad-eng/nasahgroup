"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 1500);
  }

  if (done) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-8 py-20 text-center">
        <p className="text-nasah-gray">Password updated — redirecting…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-8 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-nasah-border p-8 dark:border-white/10"
      >
        <h1 className="mb-1 font-display text-2xl font-bold">Set a new password</h1>
        <p className="mb-6 text-sm text-nasah-gray">
          Choose a new password for your account.
        </p>

        <label className="mb-1 block text-sm font-medium">New password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
        />

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-control bg-nasah-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nasah-red-dark disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
