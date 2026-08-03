import { LinksEditor } from "@/components/admin/LinksEditor";

export default function AdminNavigationPage() {
  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Navigation</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Links shown in the top navigation bar, in order.
      </p>
      <LinksEditor group="nav" title="Nav links" />
    </>
  );
}
