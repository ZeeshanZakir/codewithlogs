import { ManagePostsTable } from "@/components/admin/ManagePostsTable";
import { getAdminPosts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function ManagePostsPage() {
  const posts = await getAdminPosts();

  return <ManagePostsTable posts={posts} />;
}
