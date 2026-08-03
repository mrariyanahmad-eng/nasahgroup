"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Factor = { id: string; status: string; factor_type: string };

export function TwoFactorSetup() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadFactors() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors((data?.totp as Factor[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadFactors();
  }, []);

  const verifiedFactor = factors.find((f) => f.status === "verified");

  async function startEnroll() {
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });

    if (error) {
      setError(error.message);
      return;
    }

    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrolling(true);
  }

  async function confirmEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setError(null);

    const supabase = createClient();
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (challengeError) {
      setError(challengeError.message);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    setEnrolling(false);
    setCode("");
    loadFactors();
  }

  async function handleRemove(id: string) {
    if (!confirm("Turn off two-factor authentication?")) return;
    const supabase = createClient();
    await supabase.auth.mfa.unenroll({ factorId: id });
    loadFactors();
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  if (verifiedFactor) {
    return (
      <div>
        <p className="mb-3 text-sm text-success">Two-factor authentication is on.</p>
        <button
          onClick={() => handleRemove(verifiedFactor.id)}
          className="text-sm font-medium text-error hover:underline"
        >
          Turn off
        </button>
      </div>
    );
  }

  if (enrolling && qrCode) {
    return (
      <form onSubmit={confirmEnroll} className="max-w-sm">
        <p className="mb-3 text-sm text-nasah-gray">
          Scan this with an authenticator app (Google Authenticator, Authy, etc.)
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrCode} alt="2FA QR code" className="mb-3 h-40 w-40" />
        {secret && (
          <p className="mb-4 break-all text-xs text-nasah-gray">
            Can&apos;t scan? Enter manually: <code>{secret}</code>
          </p>
        )}
        <label className="mb-1 block text-sm font-medium">Enter the 6-digit code</label>
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className="mb-3 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
        />
        {error && <p className="mb-3 text-sm text-error">{error}</p>}
        <button
          type="submit"
          className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
        >
          Confirm
        </button>
      </form>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-nasah-gray">
        Two-factor authentication is off.
      </p>
      {error && <p className="mb-3 text-sm text-error">{error}</p>}
      <button
        onClick={startEnroll}
        className="rounded-control bg-nasah-red px-4 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
      >
        Turn on 2FA
      </button>
    </div>
  );
}
