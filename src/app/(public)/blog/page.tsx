import { BlogArchivePage } from "@/components/blog/BlogArchivePage";
import { blogArchiveMetadata } from "@/lib/blog-archive-metadata";

export const dynamic = "force-static";
export const revalidate = 60;
export const metadata = blogArchiveMetadata(1);

export default function BlogPage() {
  return <BlogArchivePage page={1} />;
}
