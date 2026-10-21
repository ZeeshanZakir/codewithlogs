import fs from "node:fs";

import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { MongoClient } from "mongodb";

const mergePairs = {
  "typescript-for-beginners-why-learn-it": "what-is-typescript",
  "what-is-typescript": "what-is-typescript-why-developers-switching",
  "what-is-typescript-why-developers-switching": "what-is-typescript",
  "mongodb-vs-postgresql": "mongodb-vs-postgresql-which-database-2026",
  "mongodb-vs-postgresql-which-database-2026": "mongodb-vs-postgresql",
};
const specificFindings = {
  "common-vercel-deployment-errors-solutions": ["The claim that next build runs ESLint is outdated for this installed Next.js 16 project.", "The NODE_OPTIONS=... command uses POSIX syntax; a Windows version needs shell-specific examples.", "Reproduce case-only renames in a disposable Windows Git repository and validate the tracked path in a case-sensitive environment.", "Review platform limits against current official docs instead of hardcoding plan assumptions."],
  "debug-production-errors-nextjs": ["The error component snippet has untyped props and needs a complete pinned TypeScript fixture.", "The hydration section needs a minimal reproducible mismatch and explicit post-fix checks.", "Confirm anecdotal client stories with the author; no supporting evidence was found in the repository."],
  "nextjs-folder-structure-large-projects": ["The directory tree is useful supporting material but is not a specific troubleshooting solution.", "Focus a revision on resolving aliases, file casing and module boundaries; preserve the existing URL.", "Do not turn folder-count anecdotes into verified claims without author confirmation."],
  "nextjs-authentication-without-nextauth": ["The sample imports an updateSession helper without supplying its implementation.", "Review middleware versus proxy conventions for the pinned Next.js version.", "Layout-only authorization claims need security review; protect each data/action boundary and verify access tests."],
  "deploy-nextjs-to-vercel-guide": ["Separate ordinary deployment setup from a specific Windows-to-production failure.", "Do not offer a global database network allowlist as a routine connection fix.", "Verify current image configuration, environment behavior and Windows shell commands against the pinned version."],
  "reduce-nextjs-website-loading-time": ["The claimed 52-to-94 score and LCP/CLS/JS-size improvements need original reports and author confirmation.", "Distinguish Lighthouse laboratory results from real-user Core Web Vitals.", "Review the installed version docs for image preloading conventions; provide a complete before/after fixture."],
  "what-is-code-with-logs": ["Useful logging background, but it needs a narrow reproducible Windows debugging example.", "Avoid treating anecdotal production experience as independently verified test evidence."],
};
const improve = new Set([
  "deploy-nextjs-to-vercel-guide", "what-is-code-with-logs",

  "nextjs-folder-structure-large-projects", "nextjs-authentication-without-nextauth",
  "debug-production-errors-nextjs",
 "reduce-nextjs-website-loading-time",
  "common-vercel-deployment-errors-solutions",
]);
async function main() {
  loadEnvConfig(process.cwd());
  const client = new MongoClient(process.env.MONGODB_URI, {serverSelectionTimeoutMS:10000});
  try {
    await client.connect();
    const docs = await client.db().collection("posts").find({}, {projection:{_id:0,title:1,slug:1,content:1,category:1,status:1,publishedAt:1,scheduledAt:1,author:1,excerpt:1,coverImage:1}}).sort({publishedAt:-1,createdAt:-1}).toArray();
    fs.mkdirSync(".next", {recursive:true});
    fs.writeFileSync(".next/editorial-source.json", JSON.stringify(docs));
    const posts = docs.map(post => {
      const content = post.content || "";
      const headings = [...content.matchAll(/^#{1,3}\s+(.+)$/gm)].map(m=>m[1]);
      const officialLinks = [...new Set((content.match(/https?:\/\/[^\s)>"']+/g)||[]).filter(url=>/^https:\/\/(learn\.microsoft\.com|code\.visualstudio\.com|nodejs\.org|docs\.npmjs\.com|git-scm\.com|nextjs\.org)\//.test(url)))];
      const action = mergePairs[post.slug] ? "MERGE" : improve.has(post.slug) ? "IMPROVE" : "ARCHIVE";
      const reason = action === "MERGE"
        ? "Overlapping search intent with the paired article. Compare examples and Search Console performance before choosing a primary URL; no redirect or deletion authorized."
        : action === "IMPROVE"
        ? "Useful adjacent technical material. Rework around a specific Windows development failure, document the environment, reproduce and verify each fix, and retain the existing URL."
        : "Outside the Windows developer troubleshooting niche. Recommend a legacy editorial archive, preserving the live URL and content until an approved migration plan exists.";
      const missing = ["Independent Windows test evidence and exact tested environment are not recorded in the repository verification registry."];
      if (!/reproduc|steps to reproduce/i.test(content)) missing.push("No explicit reproduction section detected.");
      if (!/verif|expected (output|result)|confirm/i.test(content)) missing.push("No explicit verification/expected-result wording detected.");
      if (!officialLinks.length) missing.push("No relevant Windows/VS Code/Node/npm/Git/Next official reference detected.");
      return {slug:post.slug,url:"https://codewithlogs.com/blog/"+post.slug,title:post.title,status:post.status,category:post.category,action,reason,mergeWith:mergePairs[post.slug]||null,windowsVerification:"NOT VERIFIED",specificFindings:specificFindings[post.slug] || (action === "MERGE" ? ["Compare the complete examples and search intent in this overlapping group before proposing a consolidation; keep every URL until approved."] : ["This is an editorial scope decision, not a finding that the content is worthless or plagiarized. No archival status change has been made."]),wordCount:content.split(/\s+/).filter(Boolean).length,headings,codeBlocks:Math.floor((content.match(/^```/gm)||[]).length/2),officialLinks,missing,bodyPreserved:true};
    });
    const result = {generatedAt:new Date().toISOString(),method:"Read-only database snapshot, automated body/heading/reference signals, editorial topical/duplicate-intent triage, and manual review of selected relevant article bodies. Signals are triage evidence, not proof of correctness, originality, plagiarism, or successful testing.",publicationChanges:false,counts:Object.fromEntries(["KEEP","IMPROVE","MERGE","ARCHIVE"].map(action=>[action,posts.filter(p=>p.action===action).length])),posts};
    fs.writeFileSync("reports/content-audit.json",JSON.stringify(result,null,2)+"\n");
    console.log(JSON.stringify({total:posts.length,counts:result.counts,statuses:docs.reduce((a,p)=>(a[p.status]=(a[p.status]||0)+1,a),{})}));

  } finally {await client.close();}
}
main().catch(error=>{console.error(error.name+": read-only content audit failed; no database writes performed.");process.exitCode=1;});
