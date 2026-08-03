"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/log-activity";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};

export function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessages((data as Message[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function markRead(id: string) {
    const supabase = createClient();
    await supabase.from("site_messages").update({ read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  async function handleDelete(id: string) {
    const msg = messages.find((m) => m.id === id);
    const supabase = createClient();
    await supabase.from("site_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    logActivity("message.delete", msg?.name || id);
  }

  if (loading) return <p className="text-nasah-gray">Loading…</p>;

  if (messages.length === 0) {
    return <p className="text-nasah-gray">No messages yet.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className="rounded-card border border-nasah-border bg-white p-5 dark:border-white/10 dark:bg-nasah-dark-surface"
        >
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="font-semibold">
                {m.name} {!m.read && <span className="text-nasah-red">•</span>}
              </p>
              <a href={`mailto:${m.email}`} className="text-sm text-nasah-red">
                {m.email}
              </a>
            </div>
            <span className="text-xs text-nasah-gray">
              {new Date(m.created_at).toLocaleString()}
            </span>
          </div>
          <p className="mb-3 whitespace-pre-wrap text-sm text-nasah-gray">{m.message}</p>
          <div className="flex gap-3">
            {!m.read && (
              <button
                onClick={() => markRead(m.id)}
                className="text-sm font-semibold text-nasah-red"
              >
                Mark read
              </button>
            )}
            <button
              onClick={() => handleDelete(m.id)}
              className="text-sm font-medium text-error hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
