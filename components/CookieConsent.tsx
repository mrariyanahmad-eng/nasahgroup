"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("nasah-cookie-consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("nasah-cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-nasah-border bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-nasah-dark-surface">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-nasah-gray">
          We use cookies for basic site functionality and analytics. See our{" "}
          <Link href="/privacy" className="font-semibold text-nasah-red">
            Privacy Policy
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-control bg-nasah-red px-5 py-2 text-sm font-semibold text-white hover:bg-nasah-red-dark"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
