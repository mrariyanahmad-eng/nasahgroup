import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function AdminBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogPostForm id={id} />;
}
