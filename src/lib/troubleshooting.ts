import type { BlogPostMeta } from "@/lib/mdx";

export const troubleshootingTopics = [
  { id: "nextjs", title: "Next.js Error Fixes", shortTitle: "Next.js debugging", code: "01", description: "Build errors, imports, hydration, and differences between development and production." },
  { id: "node-npm", title: "Node.js and npm Errors", shortTitle: "Node.js & npm", code: "02", description: "Installation failures, dependency conflicts, permissions, and package scripts." },
  { id: "supabase", title: "Supabase Troubleshooting", shortTitle: "Supabase", code: "03", description: "Row policies, query results, sessions, and database connection diagnostics." },
  { id: "windows-setup", title: "Windows Developer Setup", shortTitle: "Windows setup", code: "04", description: "PATH, PowerShell, Git, and the environment your tools depend on." },
  { id: "vscode", title: "VS Code Troubleshooting", shortTitle: "VS Code", code: "05", description: "Terminal launch failures, extensions, settings, and editor diagnostics." },
] as const;

export type TroubleshootingTopicId = typeof troubleshootingTopics[number]["id"];
type VerificationRecord = {
  status: "verified" | "partially-verified";
  testedOn: string;
  environment: string;
  evidence: string;
  reviewer: string;
  publishedBodySha256: string;
  limitations: string;
};
// Add a record only after reproducing the failure and independently validating
// the fix. Evidence must identify a reviewable test log/fixture, not a claim.
const verificationRecords: Readonly<Record<string, VerificationRecord>> = {};

export function getArticleReview(slug: string) {
  const record = getVerification(slug);
  if (!record) return { status: "unverified", label: "Unverified", detail: "No reproducible test record has been approved for this published version. Check its commands against your software versions before using them." };
  return {
    status: record.status,
    label: record.status === "verified" ? "Verified within stated scope" : "Partially verified",
    detail: `Tested on ${record.testedOn}: ${record.environment}. Reviewed by ${record.reviewer}. ${record.limitations}`,
  };
}

// Draft-fixture evidence never labels an older, different published body.
const articleSummaries: Readonly<Record<string, string>> = {
  "what-is-code-with-logs": "Use context-rich logs to trace missing values and failed operations while keeping credentials out of diagnostic output.",
  "debug-production-errors-nextjs": "Separate browser exceptions from server failures, locate relevant logs and investigate hydration or environment differences. Version review required.",
  "common-vercel-deployment-errors-solutions": "Compare import, type and environment failures between local builds and deployment. Older commands and platform limits require version review.",
  "deploy-nextjs-to-vercel-guide": "Follow the repository, environment and hosting setup for a Next.js deployment. Review network-access advice before changing database settings.",
  "nextjs-folder-structure-large-projects": "Locate routing, shared components and data access, and understand the @/ source alias. Folder organization does not itself enforce authorization.",
  "nextjs-authentication-without-nextauth": "Understand browser/server cookie clients and session handling. The published authentication example requires security review before adoption.",
  "supabase-errors-production-fixes": "Investigate row-policy failures, query cardinality, expired sessions and connection limits. Validate permission-sensitive fixes in a disposable project.",
  "supabase-row-level-security-real-examples": "Compare own-row and team access policies. The published examples need grant, privilege and negative-test review before adoption.",
  "inventory-management-system-nextjs-supabase": "Explore a stock ledger and Next.js/Supabase workflow. The published sale-locking and permission examples need substantial technical correction.",
};
export function getArticleSummary(post: Pick<BlogPostMeta, "slug" | "excerpt">) {
  return articleSummaries[post.slug] ?? post.excerpt;
}
const relatedReading: Readonly<Record<string, readonly string[]>> = {
  "inventory-management-system-nextjs-supabase": ["supabase-row-level-security-real-examples", "supabase-errors-production-fixes", "nextjs-authentication-without-nextauth"],
  "supabase-row-level-security-real-examples": ["supabase-errors-production-fixes", "nextjs-authentication-without-nextauth", "inventory-management-system-nextjs-supabase"],
  "supabase-errors-production-fixes": ["supabase-row-level-security-real-examples", "debug-production-errors-nextjs", "common-vercel-deployment-errors-solutions"],
  "common-vercel-deployment-errors-solutions": ["debug-production-errors-nextjs", "nextjs-folder-structure-large-projects", "deploy-nextjs-to-vercel-guide"],
  "debug-production-errors-nextjs": ["what-is-code-with-logs", "common-vercel-deployment-errors-solutions", "deploy-nextjs-to-vercel-guide"],
  "deploy-nextjs-to-vercel-guide": ["common-vercel-deployment-errors-solutions", "debug-production-errors-nextjs", "nextjs-folder-structure-large-projects"],
  "nextjs-folder-structure-large-projects": ["common-vercel-deployment-errors-solutions", "what-is-code-with-logs", "debug-production-errors-nextjs"],
  "nextjs-authentication-without-nextauth": ["supabase-errors-production-fixes", "supabase-row-level-security-real-examples", "debug-production-errors-nextjs"],
};
export function getRelatedReadingSlugs(slug: string): readonly string[] {
  return relatedReading[slug] ?? [];
}

export function getVerification(slug: string): VerificationRecord | undefined {
  return Object.prototype.hasOwnProperty.call(verificationRecords, slug) ? verificationRecords[slug] : undefined;
}

export function isTopicId(value: string): value is TroubleshootingTopicId {
  return troubleshootingTopics.some((topic) => topic.id === value);
}

export function getTroubleshootingTopic(post: Pick<BlogPostMeta, "slug" | "title" | "category" | "tags">): TroubleshootingTopicId | undefined {
  if (["inventory-management-system-nextjs-supabase", "supabase-row-level-security-real-examples", "supabase-errors-production-fixes"].includes(post.slug)) return "supabase";
  const explicit = troubleshootingTopics.find((topic) => topic.title === post.category || topic.shortTitle === post.category || post.tags.includes(topic.id));
  if (explicit) return explicit.id;
  const existingNextGuides = ["common-vercel-deployment-errors-solutions", "debug-production-errors-nextjs", "deploy-nextjs-to-vercel-guide", "nextjs-folder-structure-large-projects", "nextjs-authentication-without-nextauth", "reduce-nextjs-website-loading-time"];
  if (existingNextGuides.includes(post.slug)) return "nextjs";
  const title = post.title.toLowerCase();
  if (/supabase/.test(title) || post.category.toLowerCase() === "supabase") return "supabase";
  if (/vs code|vscode|visual studio code/.test(title) && /error|fail|terminal|not |troubleshoot/.test(title)) return "vscode";
  if (/windows|powershell/.test(title) || /git.*(error|path|not recognized)/.test(title)) return "windows-setup";
  if (/npm|node\.js|nodejs/.test(title) && /error|install|fail|eperm|eaddrinuse|eresolve/.test(title)) return "node-npm";
  if (/next\.js|nextjs/.test(title) && /error|fail|debug|hydration|not found/.test(title)) return "nextjs";
  return undefined;
}

export function getTopicTitle(post: BlogPostMeta): string {
  const id = getTroubleshootingTopic(post);
  return troubleshootingTopics.find((topic) => topic.id === id)?.shortTitle ?? post.category;
}

export function matchesArticleSearch(post: BlogPostMeta, query: string): boolean {
  const text = [post.title, post.excerpt, post.category, ...post.tags].join(" ").toLowerCase();
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean).every((term) => text.includes(term));
}
