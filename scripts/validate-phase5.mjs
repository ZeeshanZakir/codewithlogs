import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import ts from "typescript";

const checks = [];
function check(id, pass) { assert.ok(pass, id); checks.push({ id, passed: true }); }
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const base = new URL(process.argv[2] || "http://127.0.0.1:3000");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Local validation only");
const baseline = JSON.parse(fs.readFileSync("reports/phase5/baseline.json"));
const priorPaths = Object.keys(baseline.hashes).filter(path => path.startsWith("reports/phase3/") || path.startsWith("reports/phase4/") || path.startsWith("reports/priority-article-revisions/") || path.startsWith("reports/priority-article-tests/") || path.startsWith("fixtures/priority-articles/") || ["package.json", "package-lock.json"].includes(path));
check("prior-drafts-evidence-fixtures-dependencies-preserved", priorPaths.every(path => fs.existsSync(path) && hash(fs.readFileSync(path)) === baseline.hashes[path]));
const original = JSON.parse(fs.readFileSync("reports/content-preservation.json"));
const latest = JSON.parse(fs.readFileSync("reports/content-preservation-latest.json"));
check("all-58-records-preserved", latest.count === 58 && JSON.stringify(original.records) === JSON.stringify(latest.records));
const posts = JSON.parse(fs.readFileSync(".next/editorial-source.json"));
const manifest = JSON.parse(fs.readFileSync("reports/phase5/drafts/manifest.json"));
const analysis = JSON.parse(fs.readFileSync("reports/phase5/search-console-analysis.json"));
check("five-distinct-priority-drafts", manifest.length === 5 && new Set(manifest.map(d => d.slug)).size === 5 && manifest.every(d => analysis.priority.some(p => p.slug === d.slug)));
for (const input of analysis.inputs) check("input-integrity-" + input.path, hash(fs.readFileSync(input.path)) === input.sha256);
for (const name of ["Pages", "Queries"]) check("original-export-copy-" + name, hash(fs.readFileSync(`reports/search-console/${name}.csv`)) === hash(fs.readFileSync(`C:/Users/zeesh/Downloads/codewithlogs.com-Performance-on-Search-2026-10-21/${name}.csv`)));
check("observed-page-opportunities-exact", analysis.priority.map(p => p.impressions).join(",") === "4611,1377,258,203,201");
check("main-and-temp-mail-separated", analysis.pageTotals.mainWebsite.impressions === 7334 && analysis.pageTotals.tempMail.impressions === 273 && analysis.queries.every(q => q.attribution.includes("Intent inference")));

async function get(path) {
  const response = await fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(60_000) });
  return { status: response.status, html: await response.text() };
}
const home = await get("/");
check("approved-primary-focus", home.status === 200 && home.html.includes("JavaScript troubleshooting &amp; tools") && home.html.includes('href="/blog?topic=supabase"') && home.html.includes('href="/tools/error-decoder"') && home.html.includes('href="/tools/package-json-inspector"'));
check("supporting-topic-urls-retained", home.html.includes('href="/blog?topic=windows-setup"') && home.html.includes('href="/blog?topic=vscode"'));
check("no-new-inventory-rls-home-promotion", !/href="\/blog\/(?:inventory-management-system-nextjs-supabase|supabase-row-level-security-real-examples)"/.test(home.html));
const sitemap = await get("/sitemap.xml");
const snapshots = [];
for (const draft of manifest) {
  const source = posts.find(p => p.slug === draft.slug);
  const text = fs.readFileSync(draft.file, "utf8");
  check("draft-integrity-" + draft.slug, hash(fs.readFileSync(draft.file)) === draft.sha256 && draft.status === "DRAFT" && !draft.published && !draft.wholeGuideVerified && text.includes("Status: DRAFT") && !text.includes("{{fixture:"));
  check("source-record-and-url-" + draft.slug, source.status === draft.sourceRecordStatus && hash(source.content) === draft.sourceBodySha256 && draft.publicUrl.endsWith("/blog/" + draft.slug));
  const page = await get("/blog/" + draft.slug);
  check("public-canonical-and-status-" + draft.slug, page.status === 200 && page.html.includes(`rel="canonical" href="${draft.publicUrl}"`) && page.html.includes('data-review-status="unverified"') && sitemap.html.includes(draft.publicUrl));
  check("proposed-title-not-applied-" + draft.slug, !page.html.includes(`<h1>${draft.proposedTitle}</h1>`));
  const graph = [...page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1])["@graph"] || []);
  check("article-schema-preserved-" + draft.slug, graph.some(g => g["@type"] === "BlogPosting" && g.headline === source.title && !g.dateModified) && graph.some(g => g["@type"] === "BreadcrumbList"));
  const hidden = await get("/" + draft.file);
  check("draft-not-served-" + draft.slug, hidden.status === 404);
  const internal = [...new Set([...text.matchAll(/\/blog\/([a-z0-9-]+)/g)].map(m => m[1]))];
  check("draft-internal-targets-exist-" + draft.slug, internal.every(slug => posts.some(p => p.slug === slug && p.status !== "draft")));
  snapshots.push({ slug: draft.slug, status: page.status, bodyPreserved: true, sourceStatus: source.status, revisionStatus: "DRAFT" });
}
for (const [file, slug, language] of [["inventory.sql", "inventory-management-system-nextjs-supabase", "sql"], ["sale-client.mjs", "inventory-management-system-nextjs-supabase", "js"], ["rls-notes.sql", "supabase-row-level-security-real-examples", "sql"], ["cardinality.mjs", "supabase-errors-production-fixes", "js"]]) {
  const body = fs.readFileSync(`reports/phase5/drafts/${slug}.txt`, "utf8");
  check("embedded-complete-source-" + file, body.includes("```" + language + "\n" + fs.readFileSync("fixtures/phase5-supabase/" + file, "utf8").trim() + "\n```"));
}
const toolSource = fs.readFileSync("src/lib/troubleshooting.ts", "utf8");
const compiled = ts.transpileModule(toolSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const compiledModule = { exports: {} }; new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
const topics = compiledModule.exports;
check("old-topic-ids-and-supabase-valid", ["nextjs", "node-npm", "windows-setup", "vscode", "supabase"].every(id => topics.isTopicId(id)));
check("priority-supabase-classification", ["inventory-management-system-nextjs-supabase", "supabase-row-level-security-real-examples", "supabase-errors-production-fixes"].every(slug => topics.getTroubleshootingTopic(posts.find(p => p.slug === slug)) === "supabase"));
check("related-reading-navigable-and-public", manifest.every(d => topics.getRelatedReadingSlugs(d.slug).every(slug => posts.some(p => p.slug === slug && p.status !== "draft"))));
const sql = fs.readFileSync("fixtures/phase5-supabase/inventory.sql", "utf8");
check("sql-fixture-structure-only-not-execution", sql.includes("set search_path = ''") && sql.includes("for update") && sql.includes("p.stock >= p_qty") && sql.includes("unique (owner_id, request_id)") && !/sum\([\s\S]*for update/i.test(sql));
for (const route of ["/tools/error-decoder", "/tools/package-json-inspector"]) {
  const page = await get(route);
  check("existing-tool-seo-" + route, page.status === 200 && page.html.includes(`rel="canonical" href="https://codewithlogs.com${route}"`) && page.html.includes('"@type":"WebApplication"'));
}
fs.writeFileSync("reports/phase5/content-seo-tests.json", JSON.stringify({ testedAt: new Date().toISOString(), checks, count: checks.length, priorFilesChecked: priorPaths.length, snapshots, limitations: "HTTP/content/hash/structure checks only. SQL text guards do not parse or execute SQL. No browser, live database, Google indexing, CTR change or security certification." }, null, 2));
console.log(`Phase 5 content/SEO: ${checks.length} checks passed; ${priorPaths.length} prior evidence/fixture/dependency files unchanged; 58 records preserved.`);
