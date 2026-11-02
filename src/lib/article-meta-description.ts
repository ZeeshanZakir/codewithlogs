// Search descriptions only; CMS excerpts and visible article content stay intact.
const articleDescriptions: Readonly<Record<string, string>> = {
  "fix-nextjs-image-hostname-not-configured": "Fix the Next.js image hostname error with remotePatterns. Check external image URLs, CDN hosts, and path rules without weakening image security.",
  "fix-nodejs-eaddrinuse-port-3000-windows": "Fix Node.js EADDRINUSE on Windows: identify the process using port 3000, check before stopping it, or run your development server on another port.",
  "how-to-fix-git-detected-dubious-ownership-on-windows-wsl": "Fix Git dubious ownership errors on Windows and WSL. Inspect repository ownership, trust a specific directory, and avoid broad safe.directory rules.",
  "how-to-fix-supabase-403-forbidden-errors": "Diagnose Supabase 403 Forbidden and PostgreSQL 42501 errors. Check table grants, review RLS policies, and test access with the correct user identity.",
  "deploy-nextjs-to-vercel-guide": "Deploy Next.js to Vercel step by step. Connect GitHub, configure environment variables, review preview deployments, add a domain, and diagnose errors.",
  "what-is-code-with-logs": "Learn how developers use logs to debug JavaScript apps. Follow examples of useful logging, inspect runtime values, and narrow down the cause of errors."
};

export function getArticleMetaDescription(slug: string, excerpt: string): string {
  return articleDescriptions[slug] ?? excerpt;
}
