"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-8 py-20 text-center">
        <div className="max-w-sm">
          <h1 className="mb-3 font-display text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-nasah-gray">
            If an account exists for <strong>{email}</strong>, we sent a link to reset your
            password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-8 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-nasah-border p-8 dark:border-white/10"
      >
        <h1 className="mb-1 font-display text-2xl font-bold">Reset password</h1>
        <p className="mb-6 text-sm text-nasah-gray">
          We'll email you a link to reset it.
        </p>

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
        />

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-control bg-nasah-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nasah-red-dark disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <p className="mt-5 text-center text-sm text-nasah-gray">
          <Link href="/sign-in" className="font-semibold text-nasah-red">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
