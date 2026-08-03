import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-nasah-surface dark:bg-nasah-dark-bg">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-nasah-border bg-white px-6 sm:px-10 dark:border-white/10 dark:bg-nasah-dark-surface">
          <span className="text-sm font-medium text-nasah-gray">nasahgroup.com</span>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="text-sm font-medium text-nasah-gray hover:text-nasah-red"
            >
              View site ↗
            </Link>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 px-6 py-8 sm:px-10">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
