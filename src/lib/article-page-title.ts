// Browser-title copy only: CMS titles, visible headings and article data stay intact.
const articlePageTitles: Readonly<Record<string, string>> = {
  "deploy-nextjs-to-vercel-guide": "Deploy Next.js to Vercel — Step-by-Step Guide",
  "what-is-code-with-logs": "Debugging with Logs — A Developer's Guide",
  "inventory-management-system-nextjs-supabase": "Next.js & Supabase Inventory Management System",
  "supabase-errors-production-fixes": "10 Common Supabase Errors & Fixes",
  "nextjs-folder-structure-large-projects": "Next.js Folder Structure for Large Projects",
  "nextjs-authentication-without-nextauth": "Next.js Authentication Without NextAuth",
  "debug-production-errors-nextjs": "Debug Next.js Production Errors — App Router",
  "supabase-row-level-security-real-examples": "Supabase Row Level Security — Policy Examples",
  "reduce-nextjs-website-loading-time": "Speed Up Next.js — 8 Practical Fixes",
  "common-vercel-deployment-errors-solutions": "Vercel Deployment Errors & Solutions",
  "nextjs-environment-variables-not-working-9-fixes": "Next.js Environment Variables — 9 Fixes",
  "fix-npmps1-cannot-be-loaded-on-windows-2026-guide": "Fix npm.ps1 Cannot Be Loaded on Windows",
  "how-to-fix-nextjs-hydration-errors-2026-guide": "Fix Next.js Hydration Errors",
  "how-to-fix-git-detected-dubious-ownership-on-windows-wsl": "Fix Git Dubious Ownership on Windows & WSL",
  "fix-nodejs-eaddrinuse-port-3000-windows": "Fix Node.js EADDRINUSE on Windows — Port 3000",
  "fix-nextjs-image-hostname-not-configured": "Fix Next.js Image Hostname Not Configured",
  "fix-nodejs-err-module-not-found-es-modules": "Fix Node.js ERR_MODULE_NOT_FOUND in ES Modules",
};

export function getArticlePageTitle(slug: string, title: string): string {
  const pageTitle = articlePageTitles[slug] ?? title;
  // The root metadata template owns branding, including for future CMS articles.
  return pageTitle.replace(/\s*[|—–-]?\s*Code\s*With\s*Logs\b/gi, "").trim();
}
