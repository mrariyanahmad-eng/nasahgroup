"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.from("site_messages").insert({ name, email, message });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");

    // Best-effort — if this fails or isn't configured, the message is
    // still safely saved in site_messages; this is just a convenience ping.
    fetch("/api/contact-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    }).catch(() => {});
  }

  if (status === "sent") {
    return (
      <p className="mx-auto max-w-sm text-center text-nasah-gray">
        Thanks — we got your message and will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm text-left">
      <label className="mb-1 block text-sm font-medium">Name</label>
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      <label className="mb-1 block text-sm font-medium">Message</label>
      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mb-4 w-full rounded-control border border-nasah-border px-3 py-2 text-sm dark:border-white/10 dark:bg-nasah-dark-surface"
      />

      {status === "error" && (
        <p className="mb-4 text-sm text-error">Couldn&apos;t send — try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-control bg-nasah-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-nasah-red-dark disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
