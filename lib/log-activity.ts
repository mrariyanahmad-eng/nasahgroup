import { createClient } from "@/lib/supabase/client";

export async function logActivity(action: string, details: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("site_activity_log").insert({
    admin_email: user?.email ?? "unknown",
    action,
    details,
  });
}
