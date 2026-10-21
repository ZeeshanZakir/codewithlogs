import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/mdx";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 60;
const description = "Search CodeWithLogs troubleshooting guides and the existing development archive. Explore Windows setup, VS Code, Node.js and npm, and Next.js errors.";
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
        <p>Search by error message, tool, or topic. Windows verification status is shown on each guide. Earlier development articles remain available in the full archive.</p>
      </header>
      <Suspense fallback={<p className="journal-empty" role="status">Loading the article archive…</p>}><BlogIndexClient posts={posts} /></Suspense>
    </div>
  );
}
