import type { Metadata } from "next";
import { openGraphDefaults } from "@/lib/open-graph";
import { siteUrl } from "@/lib/site-url";
import { archivePagePath } from "@/lib/blog-pagination";

export function blogArchiveMetadata(page: number): Metadata {
  const url = siteUrl + archivePagePath(page);
  const description = "Search Next.js debugging, Node.js/npm and Supabase troubleshooting articles, with supporting Windows, VS Code, Git and deployment guides.";
  return {
    title: page === 1 ? "Troubleshooting Guides & Articles" : `Troubleshooting Guides & Articles — Page ${page}`,
    description,
    alternates: { canonical: url },
    openGraph: { ...openGraphDefaults, title: "CodeWithLogs Troubleshooting Archive", description, url, type: "website" },
  };
}
