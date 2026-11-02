import { openGraphDefaults } from "@/lib/open-graph";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { searchPublicArticleSlugs } from "@/lib/article-search";
import { POSTS_PER_PAGE, parseArchivePage, archivePagePath } from "@/lib/blog-pagination";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/mdx";
import { siteUrl } from "@/lib/site-url";


export const revalidate = 60;
const description = "Search Next.js debugging, Node.js/npm and Supabase troubleshooting articles, with supporting Windows, VS Code, Git and deployment guides.";
const archiveMetadata: Metadata = {
  title: "Troubleshooting Guides & Articles",
  description,
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: { ...openGraphDefaults, title: "CodeWithLogs Troubleshooting Archive", description, url: `${siteUrl}/blog`, type: "website" },
};
type ArchiveProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
export async function generateMetadata({ searchParams }: ArchiveProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parseArchivePage(params.page);
  const filtered = params.q !== undefined || params.topic !== undefined;
  const canonical = siteUrl + (filtered ? "/blog" : archivePagePath(page));
  return {
    ...archiveMetadata,
    ...(page > 1 && !filtered ? { title: `Troubleshooting Guides & Articles — Page ${page}` } : {}),
    alternates: { canonical },
    openGraph: { ...archiveMetadata.openGraph, url: canonical },
    ...(filtered ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function BlogPage({ searchParams }: ArchiveProps) {
  const params = await searchParams;
  const initialPage = parseArchivePage(params.page);
  const initialQuery = (first(params.q) ?? "").slice(0, 160);
  const candidate = first(params.topic) ?? "all";
  let initialSlugs: string[] | undefined;
  let searchFailed = false;
  if (initialQuery.trim()) {
    try { initialSlugs = await searchPublicArticleSlugs(initialQuery); }
    catch { searchFailed = true; }
  }
  const posts = await getAllPosts();
  if (!initialQuery && candidate === "all" && initialPage > Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))) notFound();
  return (
    <div className="journal-container journal-section">
      <header className="archive-header">
        <p className="eyebrow">The troubleshooting archive</p>
        <h1>Find the error.<br /><em>Understand the next step.</em></h1>
        <p>Search by error message, tool, or topic. Each guide shows the evidence status of its published version. Existing development articles remain available in the full archive.</p>
      </header>
      <BlogIndexClient posts={posts} initialPage={initialPage} initialQuery={initialQuery} candidate={candidate} initialSlugs={initialSlugs} searchFailed={searchFailed} />
    </div>
  );
}
