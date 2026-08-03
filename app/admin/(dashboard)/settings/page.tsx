import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { TwoFactorSetup } from "@/components/admin/TwoFactorSetup";

export default function AdminSettingsPage() {
  return (
    <>
      <h1 className="mb-8 font-display text-2xl font-bold">Settings</h1>

      <div className="mb-10">
        <h2 className="mb-3 font-semibold">Change password</h2>
        <ChangePasswordForm />
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Two-factor authentication</h2>
        <TwoFactorSetup />
      </div>
    </>
  );
}
