import type { BlogPostMeta } from "@/lib/mdx";

export const troubleshootingTopics = [
  { id: "windows-setup", title: "Windows Developer Setup", shortTitle: "Windows setup", code: "01", description: "PATH, PowerShell, Git, and the environment your tools depend on." },
  { id: "vscode", title: "VS Code Troubleshooting", shortTitle: "VS Code", code: "02", description: "Terminal launch failures, extensions, settings, and editor diagnostics." },
  { id: "node-npm", title: "Node.js and npm Errors", shortTitle: "Node.js & npm", code: "03", description: "Installation failures, dependency conflicts, permissions, and package scripts." },
  { id: "nextjs", title: "Next.js Error Fixes", shortTitle: "Next.js", code: "04", description: "Build errors, imports, hydration, and differences between development and production." },
] as const;

export type TroubleshootingTopicId = typeof troubleshootingTopics[number]["id"];
type VerificationRecord = {
  status: "verified";
  testedOn: string;
  environment: string;
  evidence: string;
  reviewer: string;
};
// Add a record only after reproducing the failure and independently validating
// the fix. Evidence must identify a reviewable test log/fixture, not a claim.
const verificationRecords: Readonly<Record<string, VerificationRecord>> = {};

export function getVerification(slug: string): VerificationRecord | undefined {
  return Object.prototype.hasOwnProperty.call(verificationRecords, slug) ? verificationRecords[slug] : undefined;
}

export function isTopicId(value: string): value is TroubleshootingTopicId {
  return troubleshootingTopics.some((topic) => topic.id === value);
}

export function getTroubleshootingTopic(post: Pick<BlogPostMeta, "slug" | "title" | "category" | "tags">): TroubleshootingTopicId | undefined {
  const explicit = troubleshootingTopics.find((topic) => topic.title === post.category || post.tags.includes(topic.id));
  if (explicit) return explicit.id;
  const existingNextGuides = ["common-vercel-deployment-errors-solutions", "debug-production-errors-nextjs", "deploy-nextjs-to-vercel-guide", "nextjs-folder-structure-large-projects", "nextjs-authentication-without-nextauth", "reduce-nextjs-website-loading-time"];
  if (existingNextGuides.includes(post.slug)) return "nextjs";
  const title = post.title.toLowerCase();
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
