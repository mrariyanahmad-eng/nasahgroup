"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-8 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-nasah-border p-8 dark:border-white/10"
      >
        <h1 className="mb-1 font-display text-2xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-nasah-gray">to Nasah Group LTD</p>

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
        />

        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
        />
        <div className="mb-4 text-right">
          <Link href="/forgot-password" className="text-xs text-nasah-gray hover:text-nasah-red">
            Forgot password?
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-control bg-nasah-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nasah-red-dark disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="mt-5 text-center text-sm text-nasah-gray">
          No account?{" "}
          <Link href="/sign-up" className="font-semibold text-nasah-red">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
