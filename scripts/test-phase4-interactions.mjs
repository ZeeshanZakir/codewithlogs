import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
const checks = [];

// A controlled hook host runs actual component event callbacks. There is no DOM,
// browser, real clipboard, layout or keyboard here. Record those limits explicitly.
function harness(path, mappings = {}, globals = {}) {
  const slots = [];
  let cursor = 0;
  const state = {
    useState: initial => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === "function" ? value(slots[index]) : value; }];
    },
    useRef: initial => {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
  };
  const compiledModule = { exports: {} };
  const context = { module: compiledModule, exports: compiledModule.exports, require: name => name === "react" ? state : name.endsWith(".module.css") ? { __esModule: true, default: {} } : name in mappings ? mappings[name] : require(name), requestAnimationFrame: () => 1, ...globals };
  const output = ts.transpileModule(fs.readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(output, context, { filename: path, timeout: 5000 });
  return { render: props => { cursor = 0; return Object.values(compiledModule.exports)[0](props); }, context };
}
function logic(path) {
  const compiledModule = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("exports", "module", output)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}
function nodes(element) {
  if (element == null || typeof element === "boolean") return [];
  if (Array.isArray(element)) return element.flatMap(nodes);
  if (typeof element !== "object") return [];
  return [element, ...nodes(element.props?.children)];
}
function text(element) {
  if (element == null || typeof element === "boolean") return "";
  if (Array.isArray(element)) return element.map(text).join(" ");
  return typeof element === "object" ? text(element.props?.children) : String(element);
}
function button(tree, label) { const match = nodes(tree).find(node => node.type === "button" && text(node) === label); assert.ok(match, label); return match; }
function input(tree) { return nodes(tree).find(node => node.type === "textarea"); }
async function test(name, run) { await run(); checks.push({ name, passed: true }); }
const decoder = logic("src/lib/error-decoder.ts");
const inspector = logic("src/lib/package-inspector.ts");
const errorHarness = () => harness("src/components/tools/ErrorDecoderTool.tsx", { "@/lib/error-decoder": decoder, "next/link": { __esModule: true, default: "a" }, "./DiagnosticCopyButton": { DiagnosticCopyButton: "copy-control" } });
const packageHarness = () => harness("src/components/tools/PackageJsonInspectorTool.tsx", { "@/lib/package-inspector": inspector, "./DiagnosticCopyButton": { DiagnosticCopyButton: "copy-control" } });

await test("Decoder example -> explicit submit -> result -> clear callbacks", () => {
  const host = errorHarness(); let tree = host.render();
  assert.equal(button(tree, "Decode error").props.disabled, true);
  button(tree, "Load example").props.onClick(); tree = host.render();
  assert.ok(input(tree).props.value.includes("ERESOLVE")); assert.ok(!text(tree).includes("Matching signatures"));
  nodes(tree).find(n => n.type === "form").props.onSubmit({ preventDefault() {} }); tree = host.render();
  assert.ok(text(tree).includes("Matching signatures")); assert.ok(text(tree).includes("npm ERESOLVE: dependency resolution conflict"));
  button(tree, "Clear").props.onClick(); tree = host.render(); assert.equal(input(tree).props.value, ""); assert.ok(!text(tree).includes("Matching signatures"));
});
await test("Decoder unsupported input and edits invalidate an old result", () => {
  const host = errorHarness(); let tree = host.render(); input(tree).props.onChange({ target: { value: "Unknown application code 123" } }); tree = host.render();
  nodes(tree).find(n => n.type === "form").props.onSubmit({ preventDefault() {} }); tree = host.render(); assert.ok(text(tree).includes("No cause or fix has been inferred"));
  input(tree).props.onChange({ target: { value: "npm error code ERESOLVE" } }); tree = host.render(); assert.ok(!text(tree).includes("No cause or fix has been inferred"));
});
await test("Decoder selector loads each example without automatic execution", () => {
  const host = errorHarness();
  for (const guide of decoder.errorGuides) {
    let tree = host.render(); nodes(tree).find(n => n.type === "select").props.onChange({ target: { value: guide.id } }); tree = host.render();
    button(tree, "Load example").props.onClick(); tree = host.render(); assert.equal(input(tree).props.value, guide.example);
  }
});
await test("Inspector sample -> submit -> grouped output -> clear callbacks", () => {
  const host = packageHarness(); let tree = host.render(); assert.equal(button(tree, "Inspect package.json").props.disabled, true);
  button(tree, "Load example").props.onClick(); tree = host.render(); nodes(tree).find(n => n.type === "form").props.onSubmit({ preventDefault() {} }); tree = host.render();
  assert.ok(text(tree).includes("Static inspection")); assert.ok(text(tree).includes("POSIX environment assignment")); assert.ok(text(tree).includes("next"));
  button(tree, "Clear").props.onClick(); tree = host.render(); assert.equal(input(tree).props.value, ""); assert.ok(!text(tree).includes("Static inspection"));
});
await test("Inspector malformed JSON produces input guidance and no stale output", () => {
  const host = packageHarness(); let tree = host.render(); input(tree).props.onChange({ target: { value: "{not json" } }); tree = host.render();
  nodes(tree).find(n => n.type === "form").props.onSubmit({ preventDefault() {} }); tree = host.render(); assert.ok(text(tree).includes("Invalid JSON"));
  input(tree).props.onChange({ target: { value: "{}" } }); tree = host.render(); assert.ok(!text(tree).includes("Invalid JSON"));
});
await test("Hostile pasted script remains displayed text without evaluation", () => {
  const host = packageHarness(); let tree = host.render();
  input(tree).props.onChange({ target: { value: JSON.stringify({ scripts: { test: "<script>globalThis.pwned=true</script>" } }) } }); tree = host.render();
  nodes(tree).find(n => n.type === "form").props.onSubmit({ preventDefault() {} }); tree = host.render(); assert.ok(text(tree).includes("<script>")); assert.equal(host.context.pwned, undefined); assert.ok(!nodes(tree).some(n => n.props?.dangerouslySetInnerHTML));
});
await test("Copy success uses only an explicit click and supplied text (mock clipboard)", async () => {
  const writes = [];
  const host = harness("src/components/tools/DiagnosticCopyButton.tsx", {}, { navigator: { clipboard: { writeText: async value => writes.push(value) } } });
  let tree = host.render({ text: "diagnostic commands", label: "Copy diagnostics" }); assert.equal(writes.length, 0);
  await button(tree, "Copy diagnostics").props.onClick(); tree = host.render({ text: "diagnostic commands", label: "Copy diagnostics" }); assert.deepEqual(writes, ["diagnostic commands"]); assert.ok(text(tree).includes("Copied."));
});
await test("Copy permission rejection and unavailable API offer a manual fallback (mocks)", async () => {
  for (const navigator of [{}, { clipboard: { writeText: async () => { throw new Error("permission denied"); } } }]) {
    const host = harness("src/components/tools/DiagnosticCopyButton.tsx", {}, { navigator }); let tree = host.render({ text: "diagnostics", label: "Copy" });
    await button(tree, "Copy").props.onClick(); tree = host.render({ text: "diagnostics", label: "Copy" }); assert.ok(text(tree).includes("copy it manually"));
  }
});

fs.writeFileSync("reports/phase4/interaction-unit-tests.json", JSON.stringify({ checkedAt: new Date().toISOString(), counts: { passed: checks.length, failed: 0 }, checks, method: "Actual TSX event callbacks in a controlled hook host; mocked clipboard and animation scheduling. No DOM or real browser.", limitations: "Does not verify hydration, real focus, keyboard navigation, layout/mobile rendering, real clipboard permissions, browser network behavior or screen readers." }, null, 2));
console.log(`Phase 4 interaction unit tests: ${checks.length} passed (controlled hooks and clipboard mocks, not browser tests).`);
