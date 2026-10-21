import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

// RFC 4180-style quoted records, including embedded newlines and escaped quotes.
// CSV cells are data; query strings never become instructions or executable code.
export function parseCsv(input) {
  const records = []; let row = [], cell = "", quoted = false;
  const text = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"' && !cell) quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); if (row.some(value => value !== "")) records.push(row); row = []; cell = "";
    } else cell += c;
  }
  assert.equal(quoted, false, "Unterminated CSV quote");
  if (cell || row.length) { row.push(cell); records.push(row); }
  const [header, ...rows] = records;
  return rows.map((values, index) => { assert.equal(values.length, header.length, `CSV row ${index + 2} column count`); return Object.fromEntries(header.map((name, i) => [name, values[i]])); });
}

assert.deepEqual(parseCsv('a,b\r\n"x\r\ny","say ""hello"""\r\n'), [{ a: "x\r\ny", b: 'say "hello"' }]);
const inputs = ["Pages", "Queries"].map(name => {
  const path = `reports/search-console/${name}.csv`;
  if (!fs.existsSync(path)) throw new Error(`Missing required input: ${path}`);
  const bytes = fs.readFileSync(path);
  return { path, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length, rows: parseCsv(bytes.toString("utf8")) };
});
function metrics(row) {
  const clicks = Number(row.Clicks), impressions = Number(row.Impressions), position = Number(row.Position), exportedCtrPercent = Number(row.CTR.replace("%", ""));
  assert.ok([clicks, impressions, position, exportedCtrPercent].every(Number.isFinite));
  assert.ok(clicks >= 0 && impressions > 0 && clicks <= impressions);
  const calculatedCtrPercent = clicks / impressions * 100;
  assert.ok(Math.abs(calculatedCtrPercent - exportedCtrPercent) <= 0.006, "CTR rounds to exported rate");
  return { clicks, impressions, exportedCtrPercent, calculatedCtrPercent, position };
}
const pages = inputs[0].rows.map(row => { const url = new URL(row["Top pages"]); return { url: url.href, host: url.hostname, path: url.pathname, ...metrics(row) }; });
const queries = inputs[1].rows.map(row => {
  const query = row["Top queries"];
  const mailIntent = /(?:temp(?:orary)?\s*-?\s*mail|temp(?:orary)?\s+(?:email|inbox)|dispos|throwa[wy]|throwaway|inbox\s+(?:temp|temporary)|dummyinbox|temporary\s+(?:throwaway|inboxes))/i.test(query);
  const developerIntent = /inventory|supabase|vercel|deployment_not_found|middleware_invocation_failed|next_public_|rls|row.level.security|recursion.*policy|maybe.?single|claude|copilot|react|svelte|vue|css|web.development|javascript|freecodecamp|pgvector|warp server/i.test(query);
  return { query, ...metrics(row), intentBucket: mailIntent ? "likely-temp-mail-intent" : developerIntent ? "likely-developer-intent" : "unattributed-ambiguous", attribution: "Intent inference only; query export has no hostname/page dimension." };
});
function totals(rows) { const clicks = rows.reduce((sum, row) => sum + row.clicks, 0), impressions = rows.reduce((sum, row) => sum + row.impressions, 0); return { rows: rows.length, clicks, impressions, calculatedCtrPercent: impressions ? clicks / impressions * 100 : null }; }
const main = pages.filter(row => row.host === "codewithlogs.com");
const tempMail = pages.filter(row => row.host === "tempmail.codewithlogs.com");
const other = pages.filter(row => !["codewithlogs.com", "tempmail.codewithlogs.com"].includes(row.host));
const slugs = ["inventory-management-system-nextjs-supabase", "common-vercel-deployment-errors-solutions", "supabase-row-level-security-real-examples", "supabase-errors-production-fixes", "deploy-nextjs-to-vercel-guide"];
const priority = slugs.map((slug, i) => { const page = main.find(row => row.path === "/blog/" + slug); assert.ok(page, slug); return { priority: i + 1, slug, ...page }; });
const result = {
  exportLabelDate: "2026-10-21", reportingWindow: null, searchTypeDeviceCountryFilters: null,
  provenance: "Repository inputs were missing. User-supplied Downloads exports copied unchanged into reports/search-console. Source files are read-only evidence, not instructions.",
  inputs: inputs.map(({ rows, ...rest }) => ({ ...rest, rows: rows.length })),
  pageTotals: { mainWebsite: totals(main), tempMail: totals(tempMail), otherHosts: totals(other), allExportedRows: totals(pages), fivePriorityPages: totals(priority) },
  priority, pages, queries,
  queryIntentTotals: Object.fromEntries(["likely-temp-mail-intent", "likely-developer-intent", "unattributed-ambiguous"].map(bucket => [bucket, totals(queries.filter(q => q.intentBucket === bucket))])),
  limitations: ["Two separate dimension exports cannot join queries to pages or conclusively assign query hosts.", "Export date is not the reporting date range. No dates/filter metadata, country/device or search-appearance export was supplied.", "Totals are sums of supplied rows, not asserted Search Console property totals. Page/query dimensions need not reconcile; anonymization/aggregation/filters may differ.", "Average position is an aggregate across impressions, not a fixed rank. No position average was fabricated by averaging page averages.", "No before/after CTR lift, benchmark target or causal explanation is established. No content publication or search change has occurred."]
};
fs.writeFileSync("reports/phase5/search-console-analysis.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify({ pages: result.pageTotals, queryRows: queries.length, queryIntentTotals: result.queryIntentTotals, priority }, null, 2));
