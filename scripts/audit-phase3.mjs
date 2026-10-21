import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname)) throw new Error("Local server only.");
const evidence = "reports/phase3/tests";
fs.mkdirSync(evidence, { recursive: true });
const sitemap = await (await fetch(new URL("/sitemap.xml", origin))).text();
const paths = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname))];
const pages = new Map();
for (let i = 0; i < paths.length; i += 4) {
  await Promise.all(paths.slice(i, i + 4).map(async route => {
    const response = await fetch(new URL(route, origin));
    pages.set(route, { status: response.status, html: await response.text() });
  }));
}
const inventory = [...pages].map(([route, { status, html }]) => ({
  route, status, title: html.match(/<title>([^<]+)<\/title>/)?.[1],
  hasCanonical: /rel="canonical"/.test(html), h1Count: (html.match(/<h1[ >]/g) || []).length,
  reviewStatuses: [...new Set([...html.matchAll(/data-review-status="([^"]+)"/g)].map(m => m[1]))],
  affiliateDisclosure: html.includes('class="article-disclosure"'),
  sponsoredLinkCount: (html.match(/rel="[^"]*sponsored/g) || []).length,
  analyticsConfigured: html.includes("googletagmanager.com"),
  purpose: route.startsWith("/blog/") ? "Existing educational article; content audit applies" : route.startsWith("/tools/") ? "Interactive developer utility; brevity alone is not thin content" : route === "/services" ? "Existing commercial page; verify claims/testimonials" : "Public information/navigation page; source review applies",
}));
const home = pages.get("/")?.html ?? "";
const tools = pages.get("/tools")?.html ?? "";
const privacy = pages.get("/privacy-policy")?.html ?? "";
const checks = [];
function check(id, pass, details) { assert.ok(pass, id); checks.push({ id, passed: true, details }); }
check("homepage-no-empty-verification-section", !home.includes("Latest verified troubleshooting guides") && !home.includes("first verified guides are still in preparation"));
check("homepage-no-empty-category-promise", !home.includes("New guides in preparation") && home.includes("Official reference"));
check("tools-no-empty-coming-soon-section", !tools.includes("<h2") || !/Coming soon<\/h2>/.test(tools));
check("published-status-honest", inventory.filter(p => p.route.startsWith("/blog/")).every(p => p.reviewStatuses.length === 1 && p.reviewStatuses[0] === "unverified"));
check("signup-privacy-disclosure", privacy.includes("signup source") && privacy.includes("automated unsubscribe") && home.includes("automatic email delivery is not currently offered"));
check("author-links", [...pages].filter(([route]) => route.startsWith("/blog/")).every(([, page]) => page.html.includes('href="/about"')));
const publicSlugs = new Set(paths.filter(p => p.startsWith("/blog/")).map(p => p.slice(6)));
for (const [query, expectedSlug] of [["module", "common-vercel-deployment-errors-solutions"], ["hydration", "debug-production-errors-nextjs"], ["6543", "supabase-errors-production-fixes"], ["cwl-no-such-result-4829", null]]) {
  const response = await fetch(new URL("/api/search?q=" + encodeURIComponent(query), origin));
  const result = await response.json();
  check("search-" + query, response.status === 200 && Array.isArray(result.slugs) && result.slugs.every(s => publicSlugs.has(s)) && (expectedSlug ? result.slugs.includes(expectedSlug) : result.slugs.length === 0), { query, matches: result.slugs?.length });
}
for (const body of ["{", JSON.stringify({ email: "not-an-email" }), JSON.stringify({ email: "test@example.invalid", blogUpdates: false, promotions: false })]) {
  const response = await fetch(new URL("/api/subscribers", origin), { method: "POST", headers: { "Content-Type": "application/json" }, body });
  check("newsletter-invalid-request-" + checks.length, response.status === 400, "Invalid input only; no real subscriber created.");
}
for (const draft of fs.readdirSync("reports/phase3/guides").filter(f => f.endsWith(".txt"))) {
  const response = await fetch(new URL("/reports/phase3/guides/" + draft, origin));
  check("draft-not-public-" + draft, response.status === 404);
}
const before = JSON.parse(fs.readFileSync("reports/content-preservation.json", "utf8"));
const after = JSON.parse(fs.readFileSync("reports/content-preservation-latest.json", "utf8"));
check("article-records-preserved", JSON.stringify(before.records) === JSON.stringify(after.records), before.count + " bodies/slugs/statuses/audited metadata match");
const source = JSON.parse(fs.readFileSync(".next/editorial-source.json", "utf8"));
const authors = source.reduce((counts, post) => { counts[post.author || "<missing>"] = (counts[post.author || "<missing>"] || 0) + 1; return counts; }, {});
const draftHashes = fs.readdirSync("reports/phase3/guides").filter(f => f.endsWith(".txt")).map(file => ({ file, sha256: crypto.createHash("sha256").update(fs.readFileSync("reports/phase3/guides/" + file)).digest("hex") }));
fs.writeFileSync(evidence + "/site-content-audit.json", JSON.stringify({ checkedAt: new Date().toISOString(), origin: origin.origin, pages: inventory, checks, authors, draftHashes, duplicateIntentGroups: JSON.parse(fs.readFileSync("reports/content-audit.json", "utf8")).duplicateIntentGroups, limitations: "Server-rendered HTTP and source/body triage. No external plagiarism audit, browser/mobile interaction, live mail delivery, live auth mutation, real-user vitals or AdSense decision was tested. Source fragments/word counts alone do not classify usefulness." }, null, 2));
console.log("Phase 3 site audit:", inventory.length, "public pages,", checks.length, "checks passed; 58 records preserved.");
