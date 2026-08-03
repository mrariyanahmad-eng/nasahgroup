"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AccountSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-control border border-nasah-border px-4 py-2 text-sm font-semibold hover:bg-nasah-surface dark:border-white/10 dark:hover:bg-white/5"
    >
      Sign out
    </button>
  );
}
