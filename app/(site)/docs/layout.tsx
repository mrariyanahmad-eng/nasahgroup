import { DocsSidebar } from "@/components/DocsSidebar";
import { DocsSearchButton } from "@/components/DocsSearchButton";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-8 pb-28 pt-32">
      <DocsSearchButton />

      <div className="flex flex-col gap-12 sm:flex-row">
        <DocsSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
