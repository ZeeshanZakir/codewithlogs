import { PostEditor } from "@/components/admin/PostEditor";
import { getPostBySlug } from "@/lib/mdx";

type NewPostPageProps = {
  searchParams: Promise<{ slug?: string }>;
};

export const dynamic = "force-dynamic";

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { slug } = await searchParams;
  const initialPost = slug ? await getPostBySlug(slug, true) : null;

  return <PostEditor initialPost={initialPost} />;
}
