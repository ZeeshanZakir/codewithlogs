import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";

const base = new URL(process.argv[2] || "http://127.0.0.1:3000");
if (!["127.0.0.1", "localhost", "[::1]"].includes(base.hostname)) throw new Error("Only a local validation server is allowed.");
const checks = [], assets = new Set(), pages = [];
const get = async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60_000), redirect: "manual" });
  return { status: response.status, html: await response.text() };
};
function check(id, pass) { assert.ok(pass, id); checks.push({ id, passed: true }); }
const sitemap = await get("/sitemap.xml");
const index = await get("/tools");
const descriptors = [
  { slug: "error-decoder", title: "Developer Error Decoder", id: "error-message", limit: 20000, content: ["Supported errors and first checks", "npm ERESOLVE", "PowerShell", "Hydration", "Vercel", "No screenshots", "fixed rules"] },
  { slug: "package-json-inspector", title: "package.json Inspector", id: "package-json", limit: 100000, content: ["A manifest explains intent", "devDependencies", "peerDependencies", "Duplicate JSON keys", "compatibility", "lockfile", "Official references"] },
];
for (const descriptor of descriptors) {
  const route = `/tools/${descriptor.slug}`;
  const started = performance.now();
  const { status, html } = await get(route);
  pages.push({ route, status, localResponseMilliseconds: Math.round(performance.now() - started), htmlBytes: Buffer.byteLength(html) });
  check(`${descriptor.slug}-status`, status === 200);
  check(`${descriptor.slug}-h1`, (html.match(/<h1[ >]/g) || []).length === 1 && html.includes(descriptor.title));
  check(`${descriptor.slug}-description`, /<meta name="description" content="[^"]{70,}/.test(html));
  check(`${descriptor.slug}-canonical`, new RegExp(`<link rel="canonical" href="https://codewithlogs\\.com${route}"`).test(html));
  check(`${descriptor.slug}-indexable`, !/<meta name="robots" content="[^"]*noindex/.test(html));
  check(`${descriptor.slug}-sitemap-and-discovery`, sitemap.html.includes(route) && index.html.includes(`href="${route}"`));
  check(`${descriptor.slug}-input-label`, html.includes(`for="${descriptor.id}"`) && html.includes(`id="${descriptor.id}"`) && new RegExp(`maxLength="${descriptor.limit}"`, "i").test(html));
  check(`${descriptor.slug}-crawlable-docs`, descriptor.content.every(term => html.includes(term)) && html.includes("<noscript>"));
  check(`${descriptor.slug}-privacy-and-draft-boundary`, html.includes("Client-side analysis") && !html.includes("/reports/phase3/") && /unverified published version|articles remain unverified/.test(html));
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const graph = jsonLd.flatMap(entry => entry["@graph"] || [entry]);
  check(`${descriptor.slug}-application-schema`, graph.some(entry => entry["@type"] === "WebApplication" && entry.applicationCategory === "DeveloperApplication" && entry.offers.price === "0" && !entry.aggregateRating));
  check(`${descriptor.slug}-breadcrumb-schema`, graph.some(entry => entry["@type"] === "BreadcrumbList" && entry.itemListElement.length === 3 && entry.itemListElement[2].item.endsWith(route)));
  for (const match of html.matchAll(/<script[^>]+src="([^"?]+\.js)[^"]*"/g)) if (match[1].startsWith("/_next/")) assets.add(match[1]);
  const reflected = await get(route + "?input=" + encodeURIComponent("phase4-private-input-marker"));
  check(`${descriptor.slug}-query-not-reflected`, reflected.status === 200 && !reflected.html.includes("phase4-private-input-marker"));
}
const baseline = JSON.parse(fs.readFileSync("reports/phase4/baseline.json", "utf8"));
const preserved = Object.keys(baseline.hashes).filter(path => path.startsWith("reports/phase3/") || path.startsWith("reports/priority-article-revisions/") || path.startsWith("reports/priority-article-tests/") || path.startsWith("fixtures/priority-articles/") || ["package.json", "package-lock.json"].includes(path));
const changedPreserved = preserved.filter(path => !fs.existsSync(path) || crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex") !== baseline.hashes[path]);
check("phase3-drafts-evidence-fixtures-dependencies-unchanged", changedPreserved.length === 0);
const originalRecords = JSON.parse(fs.readFileSync("reports/content-preservation.json", "utf8"));
const currentRecords = JSON.parse(fs.readFileSync("reports/content-preservation-latest.json", "utf8"));
check("stored-article-records-preserved", currentRecords.count === 58 && JSON.stringify(originalRecords.records) === JSON.stringify(currentRecords.records));
const assetRecords = await Promise.all([...assets].map(async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60_000) });
  assert.equal(response.status, 200, path);
  return { path, decodedBytes: (await response.arrayBuffer()).byteLength };
}));
fs.writeFileSync("reports/phase4/route-seo-tests.json", JSON.stringify({ checkedAt: new Date().toISOString(), origin: base.origin, checks, pages, preservedFilesChecked: preserved.length, changedPreserved, initialScriptAssets: assetRecords, totalDistinctDecodedScriptBytes: assetRecords.reduce((total, asset) => total + asset.decodedBytes, 0), limitations: "Local HTTP and source integrity only. Asset sizes include shared site scripts and are decoded bytes, not a mobile performance score or transfer measurement. Structured data was parsed and shape-checked locally, not submitted to Google's Rich Results Test. No actual browser interaction or field Core Web Vitals measured." }, null, 2));
console.log(`Phase 4 route/SEO checks: ${checks.length} passed; ${preserved.length} prior draft/evidence/fixture/dependency files unchanged.`);
