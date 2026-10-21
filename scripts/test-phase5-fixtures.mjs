import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import { createRequire } from "node:module";
import { saleInput, recordSale } from "../fixtures/phase5-supabase/sale-client.mjs";
import { inspectSingle, inspectMaybeSingle } from "../fixtures/phase5-supabase/cardinality.mjs";

const fixtureRequire = createRequire(new URL("../fixtures/priority-articles/package.json", import.meta.url));
const { createClient } = fixtureRequire("@supabase/supabase-js");
const checks = [];
async function test(id, mode, run) { await run(); checks.push({ id, passed: true, mode }); }
const product = "11111111-1111-4111-8111-111111111111", requestId = "22222222-2222-4222-8222-222222222222", movement = "33333333-3333-4333-8333-333333333333";

await test("sale-input-valid-bounds", "Pure input validation, not SQL", () => {
  for (const quantity of [1, 10000]) assert.deepEqual(saleInput(product, quantity, requestId), { p_product_id: product, p_qty: quantity, p_request_id: requestId });
});
await test("sale-input-invalid-values", "Pure input validation, not SQL", () => {
  for (const quantity of [0, -1, 10001, 1.5, "1", null, NaN, Infinity]) assert.throws(() => saleInput(product, quantity, requestId));
  for (const id of ["", "bad", null, {}, product + "\n"]) assert.throws(() => saleInput(id, 1, requestId));
});
await test("anonymous-and-identity-errors-fail-before-rpc", "Mock identity boundary; not JWT validation", async () => {
  let writes = 0;
  for (const identity of [{ data: { user: null }, error: null }, { data: { user: { id: product } }, error: new Error("private-provider-error") }]) {
    await assert.rejects(() => recordSale({ auth: { getUser: async () => identity }, rpc: () => { writes++; } }, product, 1, requestId), /Authentication required/);
  }
  assert.equal(writes, 0);
});
await test("rpc-serializes-only-product-quantity-request", "Real SDK, simulated HTTP response and mocked identity", async () => {
  let actual;
  const client = createClient("https://phase5-fixture.invalid", "fixture-key-not-a-real-project", { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: async (url, options) => { actual = { url: String(url), method: options.method, body: JSON.parse(options.body) }; return new Response(JSON.stringify([{ remaining_after_sale: 0, movement_id: movement, replayed: false }]), { status: 200, headers: { "Content-Type": "application/json" } }); } } });
  const result = await recordSale({ auth: { getUser: async () => ({ data: { user: { id: product } }, error: null }) }, rpc: client.rpc.bind(client) }, product, 1, requestId);
  assert.equal(actual.url, "https://phase5-fixture.invalid/rest/v1/rpc/cwl_record_sale"); assert.equal(actual.method, "POST");
  assert.deepEqual(actual.body, { p_product_id: product, p_qty: 1, p_request_id: requestId });
  assert.deepEqual(result, { remainingAfterSale: 0, movementId: movement, replayed: false });
});
await test("rpc-errors-and-malformed-results-never-report-success", "Mock RPC responses, not database transactions", async () => {
  const identity = { getUser: async () => ({ data: { user: { id: product } }, error: null }) };
  for (const response of [{ data: null, error: { message: "private-token-host" } }, { data: [], error: null }, { data: [null], error: null }, { data: [{ remaining_after_sale: -1, movement_id: movement, replayed: false }], error: null }, { data: [{ remaining_after_sale: 0, movement_id: "bad", replayed: true }], error: null }]) {
    await assert.rejects(() => recordSale({ auth: identity, rpc: async () => response }, product, 1, requestId), error => !error.message.includes("private-token-host"));
  }
});
await test("replay-response-preserved-without-another-client-side-sale", "Mock RPC replay; not SQL idempotency proof", async () => {
  const result = await recordSale({ auth: { getUser: async () => ({ data: { user: { id: product } } }) }, rpc: async () => ({ data: [{ remaining_after_sale: 4, movement_id: movement, replayed: true }], error: null }) }, product, 1, requestId);
  assert.equal(result.replayed, true); assert.equal(result.remainingAfterSale, 4);
});

for (const maybe of [false, true]) for (const count of [0, 1, 2]) {
  await test(`${maybe ? "maybeSingle" : "single"}-${count}-rows`, "Real supabase-js with constructed HTTP; not a real table/RLS test", async () => {
    const rows = Array.from({ length: count }, (_, i) => ({ id: i + 1 }));
    const expectedError = maybe ? count > 1 : count !== 1;
    const body = maybe ? rows : count === 1 ? rows[0] : { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned", details: `The result contains ${count} rows`, hint: null };
    let accept;
    const client = createClient("https://phase5-fixture.invalid", "fixture-key-not-a-real-project", { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: async (url, options) => {
      assert.ok(String(url).includes("/rest/v1/cwl_cardinality?select=id")); accept = new Headers(options.headers).get("Accept");
      return new Response(JSON.stringify(body), { status: !maybe && expectedError ? 406 : 200, headers: { "Content-Type": "application/json" } });
    } } });
    const result = await (maybe ? inspectMaybeSingle(client) : inspectSingle(client));
    assert.equal(Boolean(result.error), expectedError);
    if (expectedError) assert.equal(result.error.code, "PGRST116");
    else assert.deepEqual(result.data, count === 0 ? null : rows[0]);
    assert.equal(accept, maybe ? null : "application/vnd.pgrst.object+json");
  });
}

fs.writeFileSync("reports/phase5/fixture-tests.json", JSON.stringify({ testedAt: new Date().toISOString(), environment: { os: os.version(), release: os.release(), architecture: os.arch(), node: process.version, supabaseJs: fixtureRequire("@supabase/supabase-js/package.json").version }, passed: checks.length, checks, limitations: ["No network requests or real Supabase project used. The fake host's fetch implementation returns constructed HTTP responses.", "Identity and RPC unit cases are mocks. They do not verify tokens, SQL privileges, RLS, concurrency, rollback or idempotency.", "SQL fixtures are NOT EXECUTED. No PostgreSQL version, Windows 11, Linux or Vercel environment was tested."] }, null, 2));
console.log(`Phase 5 fixture tests: ${checks.length} passed, with scopes recorded.`);
