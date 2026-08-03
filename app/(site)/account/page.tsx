import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSignOutButton } from "@/components/AccountSignOutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-lg px-8 py-28">
      <h1 className="mb-2 font-display text-h2">Your account</h1>
      <p className="mb-8 text-nasah-gray">Signed in as {user.email}</p>
      <AccountSignOutButton />
    </div>
  );
}
