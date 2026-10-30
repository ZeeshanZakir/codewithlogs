import { redirect } from "next/navigation";

import { ManagePostsTable } from "@/components/admin/ManagePostsTable";
import { getAdminPosts } from "@/lib/admin";
import { getAdminUser } from "@/lib/admin-auth";
import { BlogPost } from "@/lib/blog-post";
import dbConnect from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function ManagePostsPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const posts = await getAdminPosts();
  const isAdmin = user.role === "admin";
  let ownSlugs: string[] = [];

  if (!isAdmin) {
    await dbConnect();
    ownSlugs = await BlogPost.distinct("slug", { createdBy: user.email });
  }

  return <ManagePostsTable posts={posts} canManage={isAdmin} editableSlugs={ownSlugs} />;
}
