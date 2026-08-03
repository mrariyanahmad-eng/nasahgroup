/**
 * Optional email notification when a contact form message comes in.
 * Does nothing (returns 200) until you set RESEND_API_KEY and
 * ADMIN_NOTIFY_EMAIL in your environment — the contact form still works
 * either way, this just adds an email ping on top.
 *
 * Sign up at https://resend.com, verify your domain (or use their
 * shared test domain while developing), grab an API key, then add:
 *   RESEND_API_KEY=re_...
 *   ADMIN_NOTIFY_EMAIL=you@nasahgroup.com
 * to Vercel → Project Settings → Environment Variables. No code
 * changes needed — this route picks them up automatically.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    // Not configured — silently succeed so the contact form UX is unaffected.
    return Response.json({ skipped: true });
  }

  const { name, email, message } = await request.json();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nasah Website <notifications@nasahgroup.com>",
        to: notifyEmail,
        reply_to: email,
        subject: `New contact form message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to send" }, { status: 502 });
    }
    return Response.json({ sent: true });
  } catch {
    return Response.json({ error: "Failed to send" }, { status: 502 });
  }
}
