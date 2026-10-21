import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/mdx";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 60;
const description = "Search Next.js debugging, Node.js/npm and Supabase troubleshooting articles, with supporting Windows, VS Code, Git and deployment guides.";
export const metadata: Metadata = {
  title: "Troubleshooting Guides & Article Archive",
  description,
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: { title: "CodeWithLogs Troubleshooting Archive", description, url: `${siteUrl}/blog`, type: "website" },
};
export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <div className="journal-container journal-section">
      <header className="archive-header">
        <p className="eyebrow">The troubleshooting archive</p>
        <h1>Find the error.<br /><em>Understand the next step.</em></h1>
        <p>Search by error message, tool, or topic. Each guide shows the evidence status of its published version. Existing development articles remain available in the full archive.</p>
      </header>
      <Suspense fallback={<p className="journal-empty" role="status">Loading the article archive…</p>}><BlogIndexClient posts={posts} /></Suspense>
    </div>
  );
}
