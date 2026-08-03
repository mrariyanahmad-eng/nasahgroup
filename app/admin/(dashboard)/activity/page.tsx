import { ActivityLog } from "@/components/admin/ActivityLog";

export default function AdminActivityPage() {
  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Activity Log</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Recent changes made from the admin panel.
      </p>
      <ActivityLog />
    </>
  );
}
