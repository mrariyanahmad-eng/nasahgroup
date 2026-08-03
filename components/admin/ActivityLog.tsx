"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LogEntry = {
  id: string;
  admin_email: string;
  action: string;
  details: string;
  created_at: string;
};

export function ActivityLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setEntries((data as LogEntry[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="text-nasah-gray">Loading…</p>;
  if (entries.length === 0) return <p className="text-nasah-gray">No activity yet.</p>;

  return (
    <div className="divide-y divide-nasah-border overflow-hidden rounded-card border border-nasah-border bg-white dark:divide-white/10 dark:border-white/10 dark:bg-nasah-dark-surface">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between px-6 py-3 text-sm">
          <div>
            <span className="font-medium">{entry.admin_email}</span>{" "}
            <span className="text-nasah-gray">{entry.action}</span>{" "}
            <span className="text-nasah-gray">— {entry.details}</span>
          </div>
          <span className="shrink-0 text-xs text-nasah-gray">
            {new Date(entry.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
