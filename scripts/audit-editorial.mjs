import fs from "node:fs";
import crypto from "node:crypto";
import nextEnv from "@next/env";
import { MongoClient } from "mongodb";
const notes = JSON.parse(fs.readFileSync("reports/article-review-notes.json", "utf8"));
const groups = [
 ["what-is-typescript","what-is-typescript-why-developers-switching","typescript-for-beginners-why-learn-it"],
 ["mongodb-vs-postgresql","mongodb-vs-postgresql-which-database-2026"],
 ["what-are-ai-agents","what-are-ai-agents-how-they-work"],
 ["learn-web-development-free-2026","best-free-websites-learn-web-development-2026"]
];
const priority = [
 ["common-vercel-deployment-errors-solutions","Exact errors and direct Windows-to-Linux casing intent; correct Next 16 lint and shell guidance.","Medium"],
 ["debug-production-errors-nextjs","Useful client/server triage; supply one complete failure/recovery fixture.","Medium"],
 ["nextjs-authentication-without-nextauth","Useful cookie workflow; supply missing helpers and protect each data/action boundary.","High"],
 ["deploy-nextjs-to-vercel-guide","Preserve setup intent; correct network access advice and environment diagnostics.","Medium"],
 ["nextjs-folder-structure-large-projects","Useful concrete tree; add alias/casing debugging with pinned versions.","Medium"],
 ["supabase-errors-production-fixes","Retain useful exact-error content; complete schemas/auth fixtures and harden helpers.","High"],
 ["supabase-row-level-security-real-examples","Retain useful security education; add two-user denied-access tests and harden helpers.","High"],
 ["inventory-management-system-nextjs-supabase","Retain distinct concurrency content; invalid aggregate locking and authorization need correction.","High"],
 ["build-rest-api-nodejs-beginners","Substantial CRUD draft; complete field/error validation and local-only scope.","Medium"],
 ["what-is-code-with-logs","Brand-relevant logging foundation; add a full redacted debugging exercise.","Medium"]
];
async function snapshot() {
 if(!process.argv.includes("--refresh")) return JSON.parse(fs.readFileSync(".next/editorial-source.json","utf8"));
 nextEnv.loadEnvConfig(process.cwd());
 if(!process.env.MONGODB_URI) throw new Error("Database configuration unavailable");
 const client=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
 try {
  await client.connect();
  const posts=await client.db().collection("posts").find({},{projection:{_id:0,title:1,slug:1,content:1,category:1,status:1,publishedAt:1,scheduledAt:1,author:1,excerpt:1}}).toArray();
  fs.mkdirSync(".next",{recursive:true});
  fs.writeFileSync(".next/editorial-source.json",JSON.stringify(posts,null,2));
  return posts;
 } finally {await client.close();}
}
const docs=await snapshot();
const hash=value=>crypto.createHash("sha256").update(value).digest("hex");
const fence=String.fromCharCode(96).repeat(3);
const posts=docs.map(post=>{
 if(!notes[post.slug]) throw new Error("Article needs review: "+post.slug);
 const content=post.content||"";
 const group=groups.find(g=>g.includes(post.slug));
 const links=[...new Set(content.match(/https?:\/\/[^\s)>"']+/g)||[])];
 const officialLinks=links.filter(link=>/https:\/\/(learn\.microsoft\.com|code\.visualstudio\.com|nodejs\.org|docs\.npmjs\.com|git-scm\.com|nextjs\.org|supabase\.com|www\.postgresql\.org|docs\.n8n\.io|react\.dev|www\.typescriptlang\.org)\//.test(link));
 const headings=[...content.matchAll(/^#{1,4}\s+(.+)$/gm)].map(m=>m[1]);
 const codeBlocks=Math.floor(content.split(fence).length/2);
 return {
  slug:post.slug,title:post.title,url:"https://codewithlogs.com/blog/"+post.slug,status:post.status,category:post.category,
  action:group?"MERGE":"IMPROVE",
  reason:group?"Potential overlapping search intent; differentiation or a merge requires unique-content and traffic review. No action authorized.":"Retain URL and useful material; correct article-specific quality gaps. Niche fit is not an archival criterion.",
  mergeWith:group?group.filter(s=>s!==post.slug):[],
  specificFindings:[notes[post.slug]],
  localRevisionDraft:fs.existsSync("reports/priority-article-revisions/"+post.slug+".txt") ? "reports/priority-article-revisions/"+post.slug+".txt" : null,
  assessment:{
   originality:"Provenance not independently established; no external plagiarism audit or AI-authorship inference. "+(group?"In-site intent overlap identified.":"No confirmed duplicate-intent group; this is not proof of uniqueness."),
   usefulness:notes[post.slug].split(". ")[0]+".",
   completeness:codeBlocks?codeBlocks+" fenced examples; complete fixture and expected outputs still require review.":"No fenced executable example. Explanatory intent may justify this; a promised build/test needs an exercise.",
   technicalAccuracy:"Static review, not execution certification. "+notes[post.slug],
   duplication:group?"Potential search-intent overlap: "+group.filter(s=>s!==post.slug).join(", "):"No consolidation proposed; related supporting topics can legitimately overlap.",
   searchIntent:"Assess the title's own reader task independently of new Windows category placement. "+(priority.some(([s])=>s===post.slug)?"Priority problem-solving/educational candidate.":"Retain existing URL and traffic potential; traffic data unavailable."),
   firstHandEvidence:"No linked reproducible artifact or verification-registry entry establishes personal claims. Request author records; missing repository evidence does not establish that the experience is false."
  },
  windowsVerification:"NOT VERIFIED",bodyPreserved:true,wordCount:content.split(/\s+/).filter(Boolean).length,headings,codeBlocks,officialLinks,links,
  evidenceToReview:content.split(/\n\n/).filter(t=>!t.startsWith(fence)&&/I (built|tested|used|spent|saved|pay)|my (client|first|project)|\d+%|\$\d/.test(t)).slice(0,3).map(t=>t.slice(0,280)),
  missing:["Exact supported versions and reproducible fixture where applicable.","Traceable evidence for author/personal claims.",...(officialLinks.length?[]:["No relevant official technical link detected; domain detection is only a signal."])],
  bodySha256:hash(content)
 };
});
const counts=Object.fromEntries(["KEEP","IMPROVE","MERGE","ARCHIVE"].map(a=>[a,posts.filter(p=>p.action===a).length]));
const ranked=priority.map(([slug,rationale,effort],index)=>({rank:index+1,...posts.find(p=>p.slug===slug),rationale,effort,trafficEvidence:"Search Console unavailable; ranking reflects editorial utility/correctability, not measured traffic."}));
const audit={generatedAt:new Date().toISOString(),method:"Read-only full stored-body snapshot; structural/code/claim extraction for all 58; article-specific editorial review and targeted official-documentation checks. Not execution testing of all snippets or external plagiarism review. Topic mismatch never produces ARCHIVE.",publicationChanges:false,counts,duplicateIntentGroups:groups,posts};
fs.writeFileSync("reports/content-audit.json",JSON.stringify(audit,null,2));
fs.writeFileSync("reports/priority-articles.json",JSON.stringify(ranked,null,2));
const preservation={capturedAt:audit.generatedAt,count:docs.length,records:docs.map(p=>({slug:p.slug,status:p.status,bodySha256:hash(p.content||""),recordSha256:hash(JSON.stringify(p))})).sort((a,b)=>a.slug.localeCompare(b.slug))};
if(!fs.existsSync("reports/content-preservation.json")) fs.writeFileSync("reports/content-preservation.json",JSON.stringify(preservation,null,2));
else fs.writeFileSync("reports/content-preservation-latest.json",JSON.stringify(preservation,null,2));
fs.writeFileSync("reports/CONTENT_AUDIT.txt",[
 "CODEWITHLOGS — CONTENT QUALITY REASSESSMENT",
 "Supersedes the earlier niche-first 46-ARCHIVE recommendation. No database records changed.",
 "Coverage: "+posts.length+" stored articles; recommendations: "+JSON.stringify(counts),
 "KEEP means no substantive correction identified; none certified at that standard. IMPROVE retains useful content. MERGE is intent comparison only; differentiation may be preferable. ARCHIVE=0.",
 "All seven dimensions assessed below. No claim of plagiarism, generated authorship, fabricated author experience or verified execution. Traffic evidence unavailable.",
 "TOP 10 EXISTING ARTICLES TO IMPROVE",
 ...ranked.map(p=>p.rank+". "+p.title+"\n"+p.url+"\nStored status: "+p.status+" | Effort: "+p.effort+"\n"+p.rationale),
 "READER-SAFETY PRIORITY: inventory locking, authentication/data/action boundaries, Supabase definer helpers and Sheets view permissions must be corrected and tested before promoting those guides. No live corrections applied.",
 "FIVE NEW DRAFTS: first five existing roadmap topics developed separately in reports/guides/*.txt. Node PATH, npm.ps1, Git PATH, Git line endings, VS Code terminal launch. These do not replace top-10 URLs or enter the CMS.",
 "ALL 58 ARTICLE ASSESSMENTS",
 ...posts.map(p=>[p.title,p.url,"Stored status: "+p.status+" | Recommendation: "+p.action,...(p.localRevisionDraft ? ["Local revision DRAFT (not applied/published): "+p.localRevisionDraft] : []),...Object.entries(p.assessment).map(([k,v])=>k+": "+v),"Selected claims needing evidence: "+(p.evidenceToReview.join(" / ")||"None extracted; author review still required."),""].join("\n")),
 "Official accuracy checks: https://www.postgresql.org/docs/current/sql-select.html ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://supabase.com/docs/guides/database/functions ; https://nextjs.org/docs/app/guides/upgrading/version-16 ; https://docs.n8n.io/hosting/installation/docker/"
].join("\n\n"));
console.log("Reassessed",posts.length,"articles:",counts);
