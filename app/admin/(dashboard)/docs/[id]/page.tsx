import { DocEditor } from "@/components/admin/DocEditor";

export default async function AdminDocEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DocEditor id={id} />;
}
