import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/mdx";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 60;
const description = "Explore practical web development articles, Next.js tutorials, Supabase workflows, and debugging notes from CodeWithLogs.";
export const metadata: Metadata = {
  title: "Articles — Web Development & Debugging",
  description,
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: { title: "The CodeWithLogs Archive", description, url: `${siteUrl}/blog`, type: "website" },
};
export default async function BlogPage() {
  const posts = await getAllPosts();
  const existing = [...new Set(posts.map((post) => post.category).filter(Boolean))];
  const priority = ["Next.js", "Supabase", "Debugging"];
  const categories = ["All", ...priority.filter((category) => existing.includes(category)), ...existing.filter((category) => !priority.includes(category)).sort()];
  return <div className="journal-container journal-section">
    <header className="archive-header"><p className="eyebrow">The archive / CodeWithLogs</p><h1>A little more clarity.<br /><em>One article at a time.</em></h1><p>Tutorials, implementation notes, and the occasional hard-earned fix. Find something useful for the thing you’re building.</p></header>
    <Suspense fallback={<p className="journal-empty" role="status">Loading the article archive…</p>}><BlogIndexClient posts={posts} categories={categories} /></Suspense>
  </div>;
}

