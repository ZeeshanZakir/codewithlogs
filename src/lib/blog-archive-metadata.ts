import type { Metadata } from "next";
import { openGraphDefaults } from "@/lib/open-graph";
import { siteUrl } from "@/lib/site-url";
import { archivePagePath } from "@/lib/blog-pagination";

export function blogArchiveMetadata(page: number): Metadata {
  const url = siteUrl + archivePagePath(page);
  const description = "Articles and insights on web development, UI/UX, SEO, digital marketing and AI, plus Next.js, Node.js/npm and Supabase troubleshooting guides from CodeWithLogs.";
  const title = page === 1 ? "Blog & Insights: Web Development, Design & Troubleshooting" : `Blog & Insights — Page ${page}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...openGraphDefaults, title: `${title} | CodeWithLogs`, description, url, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} | CodeWithLogs`, description },
  };
}
