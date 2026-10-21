import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const confirmation = process.argv.includes("--confirm");
const fixture = path.join(root, "fixtures/priority-articles");
const evidenceOption = process.argv.indexOf("--evidence-dir");
const evidence = path.resolve(root, evidenceOption >= 0 ? process.argv[evidenceOption + 1] ?? "" : "reports/priority-article-tests");
if (!evidence.startsWith(path.join(root, "reports") + path.sep)) throw new Error("Fixture evidence must stay inside this repository's reports directory.");
fs.mkdirSync(evidence, { recursive: true });
const fixtureRequire = createRequire(path.join(fixture, "package.json"));
const nextCli = fixtureRequire.resolve("next/dist/bin/next");
const env = {
  ...process.env, NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_FIXTURE_LABEL: "fixture-build-a", FIXTURE_SERVER_LABEL: "fixture-build-server",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:9",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "fixture-public-key-not-a-real-project",
};
const results = [];
const originals = new Map(["src/app/page.tsx", "src/components/Status.tsx", "tsconfig.json"].map(file => [file, fs.readFileSync(path.join(fixture, file), "utf8")]));
function restore() { for (const [file, value] of originals) fs.writeFileSync(path.join(fixture, file), value); }
async function run(label, command, args, options = {}) {
  const started = Date.now();
  const child = spawn(command, args, { cwd: fixture, env, windowsHide: true, ...options });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk; });
  child.stderr.on("data", chunk => { output += chunk; });
  const code = await new Promise((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  fs.writeFileSync(path.join(evidence, label + ".log"), output);
  return { code, output, milliseconds: Date.now() - started };
}
function record(id, assertions, details = {}) {
  assert.ok(assertions, id + " failed"); results.push({ id, passed: true, ...details });
  console.log("PASS", id);
}
function loadTs(relative, mocks = {}) {
  const file = path.join(fixture, relative);
  const source = fs.readFileSync(file, "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => name in mocks ? mocks[name] : fixtureRequire(name), compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
let server;
let serverOutput = "";
try {
  if (!confirmation) {
  fs.writeFileSync(path.join(fixture, "src/app/page.tsx"), 'import Missing from "@/components/DoesNotExist"; export default function Page() { return <Missing />; }\n');
  const missing = await run("01-missing-import-before", process.execPath, [nextCli, "build"]);
  record("missing-import-reproduced", missing.code !== 0 && /Module not found|Can't resolve/.test(missing.output), { exitCode: missing.code });
  restore();
  fs.writeFileSync(path.join(fixture, "src/components/Status.tsx"), 'export function Status() { const quantity: number = "three"; return <p>{quantity}</p>; }\n');
  const typeError = await run("02-type-error-before", process.execPath, [nextCli, "build"]);
  record("build-type-error-reproduced", typeError.code !== 0 && /not assignable to type 'number'/.test(typeError.output), { exitCode: typeError.code });
  restore();
  const config = JSON.parse(originals.get("tsconfig.json")); config.compilerOptions.paths["@/*"] = ["./nonexistent/*"];
  fs.writeFileSync(path.join(fixture, "tsconfig.json"), JSON.stringify(config, null, 2));
  const alias = await run("03-alias-before", process.execPath, [nextCli, "build"]);
  record("alias-error-reproduced", alias.code !== 0 && /Module not found|Can't resolve/.test(alias.output), { exitCode: alias.code });
  restore();
  fs.writeFileSync(path.join(fixture, "src/components/Status.tsx"), 'export function Status() { const label: any = "lint fixture"; return <p>{label}</p>; }\n');
  const lintOnly = await run("04-lint-only-before", process.execPath, [path.join(root, "node_modules/eslint/bin/eslint.js"), path.join(fixture, "src/components/Status.tsx")], { cwd: root });
  record("separate-eslint-error-reproduced", lintOnly.code !== 0 && /no-explicit-any/.test(lintOnly.output), { exitCode: lintOnly.code });
  const lintBuild = await run("05-build-does-not-run-eslint", process.execPath, [nextCli, "build"]);
  record("next16-build-does-not-run-eslint", lintBuild.code === 0, { exitCode: lintBuild.code });
  restore();
  }
  const fixed = await run("06-fixed-production-build", process.execPath, [nextCli, "build"]);
  record("imports-types-alias-corrected-build", fixed.code === 0, { exitCode: fixed.code });
  const types = await run("07-fixed-typecheck", process.execPath, [fixtureRequire.resolve("typescript/bin/tsc"), "--noEmit"]);
  record("fixture-typecheck", types.code === 0, { exitCode: types.code });

  if (!confirmation) {
  const gitDir = path.join(root, ".next", "priority-casing-" + Date.now());
  fs.mkdirSync(gitDir, { recursive: true });
  const gitEnv = { ...env, GIT_CONFIG_GLOBAL: os.platform() === "win32" ? "NUL" : "/dev/null", GIT_CONFIG_NOSYSTEM: "1" };
  const git = async (label, args) => run(label, "git", ["-C", gitDir, ...args], { env: gitEnv });
  assert.equal((await git("08-git-init", ["init"])).code, 0);
  fs.writeFileSync(path.join(gitDir, "button.tsx"), "export default function Button() { return null; }\n");
  assert.equal((await git("09-git-add", ["add", "--", "button.tsx"])).code, 0);
  const before = await git("10-git-index-before", ["ls-files"]);
  assert.ok(!before.output.split(/\r?\n/).includes("Button.tsx"));
  assert.equal((await git("11-git-hop-one", ["mv", "button.tsx", "button-case-temp.tsx"])).code, 0);
  assert.equal((await git("12-git-hop-two", ["mv", "button-case-temp.tsx", "Button.tsx"])).code, 0);
  const after = await git("13-git-index-after", ["ls-files"]);
  record("windows-two-hop-git-casing", after.output.split(/\r?\n/).includes("Button.tsx"), { limitation: "Tracked case corrected on Windows; no Linux build was run." });
  }

  const authorization = loadTs("src/lib/authorization.ts");
  let identity = null;
  let identityError = null;
  const writes = [];
  const filters = [];
  const client = {
    auth: { getUser: async () => ({ data: { user: identity }, error: identityError }) },
    from: () => ({ insert: async row => { writes.push(row); return { error: null }; }, select: () => ({ eq: async (column, value) => { filters.push({ column, value }); return { data: [], error: null }; } }) }),
  };
  const mocks = { "server-only": {}, "@/lib/authorization": authorization, "@/lib/supabase/server": { createClient: async () => client }, "next/cache": { revalidatePath: () => {} } };
  const { addNote } = loadTs("src/app/dashboard/actions.ts", mocks);
  const { readOwnNotes } = loadTs("src/lib/notes.ts", mocks);
  const form = new FormData(); form.set("body", "A safe fixture note"); form.set("user_id", "another-user");
  await assert.rejects(() => addNote(form), authorization.AuthenticationRequired);
  await assert.rejects(() => readOwnNotes(), authorization.AuthenticationRequired);
  record("anonymous-direct-action-and-data-denied", writes.length === 0 && filters.length === 0, { mode: "Mocked identity and data transport; actual guard/action modules." });
  identity = { id: "authenticated-user" };
  await addNote(form); await readOwnNotes();
  record("identity-not-taken-from-form", writes[0].user_id === identity.id && filters[0].value === identity.id, { mode: "Mocked transport; not a database RLS test." });
  identityError = new Error("Invalid identity");
  await assert.rejects(() => addNote(form), authorization.AuthenticationRequired);
  record("identity-error-fails-closed", writes.length === 1);

  const { createClient } = fixtureRequire("@supabase/supabase-js");
  const errorResponse = { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned", details: "The result contains 0 rows", hint: null };
  const sdk = createClient("http://127.0.0.1:9", "synthetic-public-key", { auth: { persistSession: false }, global: { fetch: async () => new Response(JSON.stringify(errorResponse), { status: 406, headers: { "Content-Type": "application/json" } }) } });
  const single = await sdk.from("notes").select().single();
  record("supabase-single-returns-error-object", single.error?.code === "PGRST116" && single.data === null, { mode: "Real SDK with simulated HTTP response; not a database test." });
  const emptySdk = createClient("http://127.0.0.1:9", "synthetic-public-key", { auth: { persistSession: false }, global: { fetch: async () => new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } }) } });
  const maybe = await emptySdk.from("notes").select().maybeSingle();
  record("supabase-maybe-single-accepts-empty", maybe.error === null && maybe.data === null, { mode: "Real SDK with simulated HTTP response; not a database test." });

  const port = 3107;
  server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: fixture, env: { ...env, NEXT_PUBLIC_FIXTURE_LABEL: "fixture-runtime-b", FIXTURE_SERVER_LABEL: "fixture-runtime-server" }, windowsHide: true });
  server.stdout.on("data", data => { serverOutput += data; }); server.stderr.on("data", data => { serverOutput += data; });
  const base = "http://127.0.0.1:" + port;
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, "Fixture server failed to start");
  const home = await (await fetch(base)).text();
  record("fixed-alias-renders", home.includes("Alias resolution works."));
  record("public-env-is-build-time", home.includes("fixture-build-a") && !home.includes("fixture-runtime-b"));
  const runtime = await (await fetch(base + "/api/runtime-env")).json();
  record("dynamic-server-env-is-runtime", runtime.label === "fixture-runtime-server");
  const denied = await fetch(base + "/api/private");
  record("anonymous-direct-http-api-denied", denied.status === 401, { mode: "Real Next + Supabase SDK; no session, synthetic loopback configuration, no live Supabase project." });
  record("auth-response-not-publicly-cacheable", /private/.test(denied.headers.get("cache-control") ?? "") && /no-store/.test(denied.headers.get("cache-control") ?? ""));
  const dashboard = await fetch(base + "/dashboard", { redirect: "manual" });
  record("anonymous-dashboard-redirect", dashboard.status === 307 && dashboard.headers.get("location")?.endsWith("/login"));
  const failure = await fetch(base + "/failure"); const failureBody = await failure.text();
  record("production-server-error-redacted", !failureBody.includes("fixture_server_failure_private_marker") && /digest/.test(failureBody));
  record("server-error-retains-original-log", serverOutput.includes("fixture_server_failure_private_marker"));
} finally {
  restore();
  if (server) server.kill();
  fs.writeFileSync(path.join(evidence, "14-server.log"), serverOutput);
  const report = {
    testedAt: new Date().toISOString(), environment: { node: process.version, os: os.version(), release: os.release(), architecture: os.arch(), next: fixtureRequire("next/package.json").version, react: fixtureRequire("react/package.json").version, typescript: fixtureRequire("typescript/package.json").version, supabaseSsr: fixtureRequire("@supabase/ssr/package.json").version, supabaseJs: fixtureRequire("@supabase/supabase-js/package.json").version },
    results, limitations: ["No Windows 11 or Linux runtime tested.", "No Vercel deployment, DNS or hosting limits verified.", "No real Supabase project, account login/refresh or database RLS test.", "No browser hydration, error fallback interaction or retry-click test.", "Whole article revisions remain DRAFT; evidence applies only to named fixture cases."]
  };
  fs.writeFileSync(path.join(evidence, confirmation ? "confirmation-results.json" : "results.json"), JSON.stringify(report, null, 2));
}
