import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const root = process.cwd();
const run = path.join(root, "fixtures/windows-guides/runs", "eresolve-" + Date.now());
const evidence = path.join(root, "reports/phase3/tests/eresolve");
fs.mkdirSync(evidence, { recursive: true });
const npmCli = path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");
assert.ok(fs.existsSync(npmCli), "Use the installed npm CLI path for this Node distribution.");
const environment = { os: os.version(), release: os.release(), architecture: os.arch(), node: process.version, npm: JSON.parse(fs.readFileSync(path.join(path.dirname(process.execPath), "node_modules/npm/package.json"), "utf8")).version, verificationDate: new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()), timezone: "Asia/Karachi" };
const steps = [];
function invoke(id, args, cwd) {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, encoding: "utf8", windowsHide: true, env: { ...process.env, npm_config_cache: path.join(run, "cache") } });
  const output = (result.stdout || "") + (result.stderr || "");
  fs.writeFileSync(path.join(evidence, id + ".log"), output);
  steps.push({ id, command: ["node", "<installed npm-cli.js>", ...args], exitCode: result.status, actualResult: output, verifiedAtUtc: new Date().toISOString(), ...environment });
  return { code: result.status, output };
}
function pack(folder, name, version, peers = {}) {
  const dir = path.join(run, folder); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name, version, main: "index.js", peerDependencies: peers }, null, 2));
  fs.writeFileSync(path.join(dir, "index.js"), name === "cwl-peer-plugin" ? "module.exports = require('cwl-peer-host').version;\n" : "exports.version = '" + version + "';\n");
  const result = invoke("pack-" + folder, ["pack", "--offline", "--ignore-scripts", "--json"], dir);
  assert.equal(result.code, 0);
  const filename = JSON.parse(result.output.slice(result.output.indexOf("[")))[0].filename;
  return "file:../" + folder + "/" + filename;
}
let outcome;
try {
  const host1 = pack("host1", "cwl-peer-host", "1.0.0");
  const host2 = pack("host2", "cwl-peer-host", "2.0.0");
  const plugin = pack("plugin", "cwl-peer-plugin", "1.0.0", { "cwl-peer-host": "^2.0.0" });
  const app = path.join(run, "app"); fs.mkdirSync(app, { recursive: true });
  const manifest = { name: "cwl-conflict-fixture", version: "1.0.0", private: true, dependencies: { "cwl-peer-host": host1, "cwl-peer-plugin": plugin } };
  fs.writeFileSync(path.join(app, "package.json"), JSON.stringify(manifest, null, 2));
  const before = invoke("01-conflict-before", ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"], app);
  assert.notEqual(before.code, 0); assert.match(before.output, /ERESOLVE/);
  manifest.dependencies["cwl-peer-host"] = host2;
  fs.writeFileSync(path.join(app, "package.json"), JSON.stringify(manifest, null, 2));
  const after = invoke("02-aligned-after", ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"], app);
  assert.equal(after.code, 0);
  const tree = invoke("03-dependency-tree", ["ls", "--all"], app); assert.equal(tree.code, 0);
  const ci = invoke("04-lockfile-repeat", ["ci", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"], app); assert.equal(ci.code, 0);
  const appRequire = createRequire(path.join(app, "package.json"));
  assert.equal(appRequire("cwl-peer-plugin"), "2.0.0");
  outcome = { passed: true, actualLoadedVersion: appRequire("cwl-peer-plugin"), initialError: before.output, solution: "Align direct host dependency to 2.0.0, satisfying plugin's ^2.0.0 peer range; install, inspect tree and repeat npm ci." };
  console.log("Real npm ERESOLVE reproduced; aligned local tarballs install, dependency tree and npm ci pass.");
} finally {
  fs.writeFileSync(path.join(evidence, "results.json"), JSON.stringify({ environment, run, steps, outcome: outcome ?? { passed: false }, limitations: "Real npm offline resolver, real local tarball packages and installed module execution; not mocked resolver output. Synthetic packages do not prove compatibility of a reader's React/framework dependencies. No force/legacy-peer-deps, root dependency change, network install or production write." }, null, 2));
}
