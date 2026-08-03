import { TeamManager } from "@/components/admin/TeamManager";

export default function AdminTeamPage() {
  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Team</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Who can sign in to /admin.
      </p>
      <TeamManager />
    </>
  );
}
