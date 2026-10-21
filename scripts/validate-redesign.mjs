import fs from "node:fs";

const base = new URL(process.argv[2] || "http://localhost:3000");
if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) throw new Error("Validation is restricted to a local server.");
const origin = base.origin;
const results = [];
const pages = new Map();
async function check(route) {
  const started = Date.now();
  try {
    const response = await fetch(origin + route, { redirect: "manual", signal: AbortSignal.timeout(60000) });
    const body = await response.text();
    const result = { route, status: response.status, milliseconds: Date.now() - started };
    pages.set(route, body);
    if (route.startsWith("/blog/") && response.status === 200) {
      const ids = [...body.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
      const anchors = [...body.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
      result.h1Count = (body.match(/<h1[ >]/g) || []).length;
      result.canonical = /<link[^>]*rel="canonical"/.test(body);
      result.verificationStatusVisible = body.includes("Windows verification pending");
      result.missingTOCTargets = [...new Set(anchors.filter(id => !ids.includes(id)))];
      const scripts = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      result.structuredDataValid = scripts.length > 0 && scripts.every(match => {
        try { return JSON.parse(match[1])["@context"] === "https://schema.org"; } catch { return false; }
      });
      result.codeCopyControls = (body.match(/aria-label="Copy code to clipboard"/g) || []).length;
    }
    if (response.headers.get("location")) result.location = response.headers.get("location");
    results.push(result);
  } catch (error) { results.push({ route, error: error.message }); }
}
await check("/sitemap.xml");
const sitemap = pages.get("/sitemap.xml") || "";
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
const routes = [...new Set(["/", "/blog", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer", "/editorial-policy", "/robots.txt", ...urls])];
for (let index = 0; index < routes.length; index += 3) await Promise.all(routes.slice(index, index + 3).map(check));
for (const route of ["/api", "/api/debug", "/api/test-db", "/admin/dashboard", "/blog/codewithlogs-nonexistent-validation-slug"]) await check(route);

const articleResults = results.filter(result => result.route.startsWith("/blog/") && result.status === 200);
const links = [...new Set([...pages.values()].flatMap(html => [...html.matchAll(/href="(\/[^"#?]*)"/g)].map(match => match[1])))].filter(route => !route.startsWith("/_next/") && !route.startsWith("/api/") && !routes.includes(route));
const unresolvedLinks = [];
for (const route of links) {
  const response = await fetch(origin + route, { redirect: "manual", signal: AbortSignal.timeout(60000) });
  if (response.status >= 400) unresolvedLinks.push({ route, status: response.status });
}
const failures = results.filter(result => {
  if (result.error) return true;
  if (["/api", "/api/debug", "/api/test-db"].includes(result.route)) return result.status !== 401;
  if (result.route === "/admin/dashboard") return result.status !== 307;
  if (result.route.endsWith("codewithlogs-nonexistent-validation-slug")) return result.status !== 404;
  return result.status !== 200 || result.missingTOCTargets?.length || (result.h1Count !== undefined && result.h1Count !== 1) || result.canonical === false || result.verificationStatusVisible === false || result.structuredDataValid === false;
});
const publicSlugs = new Set(urls.filter(route => route.startsWith("/blog/")).map(route => route.slice(6)));
const searchChecks = [];
for (const query of ["module", "^.*$", "", "a".repeat(161)]) {
  const response = await fetch(origin + "/api/search?q=" + encodeURIComponent(query));
  const payload = await response.json();
  const expectedStatus = !query || query.length > 160 ? 400 : 200;
  const privateLeak = payload.slugs?.some(slug => !publicSlugs.has(slug)) ?? false;
  const expectedMatch = query === "module" ? payload.slugs?.includes("common-vercel-deployment-errors-solutions") : true;
  const literalOnly = query === "^.*$" ? payload.slugs?.length === 0 : true;
  const passed = response.status === expectedStatus && !privateLeak && expectedMatch && literalOnly;
  searchChecks.push({ query: query.length > 160 ? "overlength" : query, status: response.status, privateLeak, passed });
}
const output = { searchChecks, origin, checkedAt: new Date().toISOString(), totalChecks: results.length, publicArticleCount: articleResults.length, sitemapHasPrivateRoutes: /<loc>[^<]*\/(admin|api)\b/.test(sitemap), unresolvedLinks, failures, results, limitations: "HTTP/server-rendered markup checks only. These do not verify browser interactions, visual layout, clipboard permissions, real-user Core Web Vitals, tutorial solutions, authenticated admin mutations, or form delivery." };
fs.writeFileSync("reports/route-validation.json", JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({checks: results.length, publicArticles: articleResults.length, failures, unresolvedLinks, searchChecks}, null, 2));
if (failures.length || unresolvedLinks.length || output.sitemapHasPrivateRoutes || searchChecks.some(check => !check.passed)) process.exitCode = 1;
