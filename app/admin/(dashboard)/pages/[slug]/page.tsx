import { AdminEditor } from "@/components/admin/AdminEditor";

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AdminEditor slug={slug} />;
}
