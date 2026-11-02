import { notFound } from "next/navigation";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/mdx";
import { POSTS_PER_PAGE } from "@/lib/blog-pagination";

export async function BlogArchivePage({ page }: { page: number }) {
  const posts = await getAllPosts();
  if (page > Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))) notFound();
  return <div className="journal-container journal-section">
    <header className="archive-header">
      <p className="eyebrow">The troubleshooting archive</p>
      <h1>Find the error.<br /><em>Understand the next step.</em></h1>
      <p>Search by error message, tool, or topic. Each guide shows the evidence status of its published version. Existing development articles remain available in the full archive.</p>
    </header>
    <BlogIndexClient posts={posts} initialPage={page} />
  </div>;
}
