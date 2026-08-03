"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdmin = searchParams.get("error") === "not_admin";
  const mfaRequired = searchParams.get("error") === "mfa_required";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set once password sign-in succeeds AND the account has 2FA on —
  // this is the step that actually enforces it (enrolling alone doesn't).
  const [needsMfa, setNeedsMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Password was correct. Now check if this account also has a
    // verified 2FA factor that hasn't been satisfied this session yet.
    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    setLoading(false);

    if (aalError) {
      setError(aalError.message);
      return;
    }

    if (aal.nextLevel === "aal2" && aal.currentLevel !== aal.nextLevel) {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      const factor = factors?.totp.find((f) => f.status === "verified");

      if (factorsError || !factor) {
        setError("2FA is required but no verified factor was found. Contact another admin.");
        return;
      }

      setMfaFactorId(factor.id);
      setNeedsMfa(true);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleMfaSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mfaFactorId) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: mfaFactorId,
    });

    if (challengeError) {
      setLoading(false);
      setError(challengeError.message);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: challenge.id,
      code: mfaCode,
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (needsMfa) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8">
        <form
          onSubmit={handleMfaSubmit}
          className="w-full max-w-sm rounded-card border border-nasah-border p-8 dark:border-white/10"
        >
          <h1 className="mb-1 font-display text-xl font-bold">Two-factor code</h1>
          <p className="mb-6 text-sm text-nasah-gray">
            Enter the 6-digit code from your authenticator app.
          </p>

          <input
            required
            autoFocus
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            maxLength={6}
            className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
          />

          {error && <p className="mb-4 text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-control bg-nasah-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nasah-red-dark disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-8">
      <form
        onSubmit={handlePasswordSubmit}
        className="w-full max-w-sm rounded-card border border-nasah-border p-8 dark:border-white/10"
      >
        <h1 className="mb-1 font-display text-xl font-bold">Nasah Admin</h1>
        <p className="mb-6 text-sm text-nasah-gray">
          Sign in to edit site content.
        </p>

        {notAdmin && (
          <p className="mb-4 rounded-control bg-error/10 px-3 py-2 text-sm text-error">
            That account isn&apos;t an admin. Ask an existing admin to add
            your user ID to the <code>admins</code> table in Supabase.
          </p>
        )}

        {mfaRequired && (
          <p className="mb-4 rounded-control bg-warning/10 px-3 py-2 text-sm text-warning">
            Please sign in again to complete your two-factor check.
          </p>
        )}

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

        <p className="mt-5 text-xs text-nasah-gray">
          No account? Admin users are created from the Supabase dashboard —
          see the README.
        </p>
      </form>
    </div>
  );
}
