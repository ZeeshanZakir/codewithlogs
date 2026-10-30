import { redirect } from "next/navigation";

import { PostEditor } from "@/components/admin/PostEditor";
import { getAdminUser } from "@/lib/admin-auth";
import { BlogPost } from "@/lib/blog-post";
import { getPostBySlug } from "@/lib/mdx";
import dbConnect from "@/lib/mongodb";
import { WRITER_HOME } from "@/lib/roles";

type NewPostPageProps = {
  searchParams: Promise<{ slug?: string }>;
};

export const dynamic = "force-dynamic";

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { slug } = await searchParams;
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Writers can only open posts they created themselves.
  if (slug && user.role === "writer") {
    await dbConnect();
    const ownPost = await BlogPost.exists({ slug, createdBy: user.email });

    if (!ownPost) {
      redirect(WRITER_HOME);
    }
  }

  const initialPost = slug ? await getPostBySlug(slug, true) : null;

  return <PostEditor initialPost={initialPost} />;
}
