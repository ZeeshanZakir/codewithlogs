export const PACKAGE_INPUT_LIMIT = 100_000;
export const PACKAGE_ROWS_LIMIT = 200;
const DISPLAY_LIMIT = 1_000;
export type Finding = { level: "error" | "warning" | "note"; message: string };
export type DependencyRow = { name: string; spec: string; pattern: string };
export type DependencyGroup = { field: string; count: number; rows: DependencyRow[] };
export type ScriptRow = { name: string; command: string; lifecycle: boolean };
export type PackageInspection = {
  status: "empty" | "too-long" | "invalid" | "inspected";
  message?: string;
  name?: string;
  version?: string;
  private?: boolean;
  engine?: string;
  packageManager?: string;
  groups: DependencyGroup[];
  scripts: ScriptRow[];
  scriptCount: number;
  findings: Finding[];
};

const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const own = (value: Record<string, unknown>, key: string) => Object.prototype.hasOwnProperty.call(value, key);
const release = "(?:0|[1-9]\\d*)";
const pre = "(?:-(?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[A-Za-z-][0-9A-Za-z-]*))*)?";
const build = "(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?";
const exactVersion = new RegExp(`^${release}\\.${release}\\.${release}${pre}${build}$`);

// Pattern categories, not a complete npm package-spec or semver range parser.
export function classifyVersion(spec: string): string {
  const value = spec.trim();
  if (!value) return "Empty specification";
  if (exactVersion.test(value)) return "Exact version";
  if (value[0] === "^" && exactVersion.test(value.slice(1))) return "Caret range";
  if (value[0] === "~" && exactVersion.test(value.slice(1))) return "Tilde range";
  if (/^(?:\*|[xX]|\d+(?:\.(?:\d+|[xX*])){0,2})$/.test(value)) return "Wildcard / partial range";
  if (/^workspace:/.test(value)) return "Workspace protocol (manager-specific)";
  if (/^(?:file:|link:|\.\.?[\\/]|[\\/])/.test(value)) return "Local path / link";
  if (/^npm:/.test(value)) return "npm alias";
  if (/^(?:git(?:\+[^:]+)?:|git@|github:|gitlab:|bitbucket:)|^[\w.-]+\/[\w.-]+(?:#.*)?$/.test(value)) return "Git source";
  if (/^https?:\/\//.test(value)) return "Remote URL";
  if (/^(?:>=?|<=?|=|\^|~)|\s\|\|\s|\s-\s/.test(value)) return "Range expression (not evaluated)";
  if (/^[A-Za-z][A-Za-z0-9._-]*$/.test(value)) return "Registry tag";
  return "Unrecognized / complex specification";
}

export function inspectPackage(input: string): PackageInspection {
  const result: PackageInspection = { status: "inspected", groups: [], scripts: [], scriptCount: 0, findings: [] };
  const finding = (level: Finding["level"], message: string) => result.findings.push({ level, message });
  let shortened = false;
  const display = (text: string) => {
    // Remove invisible terminal/directional controls. React renders remaining text inertly.
    const clean = text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "");
    if (clean.length > DISPLAY_LIMIT) { shortened = true; return clean.slice(0, DISPLAY_LIMIT) + "… [display shortened]"; }
    return clean;
  };
  if (input.length > PACKAGE_INPUT_LIMIT) return { ...result, status: "too-long", message: "Input exceeds 100,000 characters. Inspect a smaller manifest." };
  if (!input.trim()) return { ...result, status: "empty", message: "Paste a package.json object to inspect." };
  let pkg: unknown;
  try { pkg = JSON.parse(input); } catch {
    return { ...result, status: "invalid", message: "Invalid JSON. Check quotes, commas, comments and trailing commas. No scripts were executed." };
  }
  if (!object(pkg)) return { ...result, status: "invalid", message: "A package.json manifest must be a JSON object, not an array, null or a primitive value." };

  for (const key of ["name", "version", "packageManager", "type"] as const) {
    if (own(pkg, key) && (typeof pkg[key] !== "string" || !pkg[key].trim())) finding("error", `${key} must be a nonempty string when supplied.`);
  }
  result.name = typeof pkg.name === "string" ? display(pkg.name) : "Unnamed package";
  result.version = typeof pkg.version === "string" ? display(pkg.version) : "Not declared";
  if (typeof pkg.version === "string" && !exactVersion.test(pkg.version)) finding("warning", "The package's own version is not a strict three-part semantic version. Publishing rules differ from dependency ranges.");
  if (own(pkg, "private") && typeof pkg.private !== "boolean") finding("error", "private must be a JSON boolean, not a quoted string.");
  result.private = typeof pkg.private === "boolean" ? pkg.private : undefined;
  if (pkg.private !== true) finding("note", "private is not true. For an application you do not intend to publish to npm, consider private: true.");
  if (typeof pkg.type === "string" && !["module", "commonjs"].includes(pkg.type)) finding("warning", 'type should be "module" or "commonjs" for Node.js module configuration.');
  if (typeof pkg.packageManager === "string") {
    result.packageManager = display(pkg.packageManager);
    if (!/^[a-z][a-z0-9-]*@\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.+-]+)?$/.test(pkg.packageManager)) finding("warning", "packageManager does not match the usual manager@version form; check the package manager's documentation.");
  }
  if (own(pkg, "engines")) {
    if (!object(pkg.engines)) finding("error", "engines must be an object of version requirement strings.");
    else for (const [key, value] of Object.entries(pkg.engines).slice(0, PACKAGE_ROWS_LIMIT)) {
      if (typeof value !== "string") finding("error", `engines.${display(key)} must be a string.`);
      else if (key === "node") result.engine = display(value);
    }
    if (object(pkg.engines) && Object.keys(pkg.engines).length > PACKAGE_ROWS_LIMIT) finding("warning", "Only the first 200 engines fields were inspected.");
  }
  if (!result.engine) finding("note", "No string engines.node requirement is declared. Compare the intended Node version with framework requirements; this tool cannot read your runtime.");

  for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    if (!own(pkg, field)) continue;
    const group = pkg[field];
    if (!object(group)) { finding("error", `${field} must be an object mapping package names to specification strings.`); continue; }
    const entries = Object.entries(group);
    const rows = entries.slice(0, PACKAGE_ROWS_LIMIT).map(([name, spec]) => {
      if (typeof spec !== "string") { finding("error", `${field}: ${display(name)} has a non-string specification.`); return { name: display(name), spec: "[not a string]", pattern: "Invalid field type" }; }
      const pattern = classifyVersion(spec);
      if (pattern === "Empty specification") finding("warning", `${field}: ${display(name)} has an empty specification, which does not pin a release.`);
      return { name: display(name), spec: display(spec), pattern };
    });
    result.groups.push({ field, count: entries.length, rows });
    const floating = rows.filter(row => ["Registry tag", "Wildcard / partial range"].includes(row.pattern)).length;
    const sources = rows.filter(row => ["Local path / link", "Git source", "Remote URL", "npm alias", "Workspace protocol (manager-specific)"].includes(row.pattern)).length;
    const unknown = rows.filter(row => row.pattern === "Unrecognized / complex specification").length;
    if (floating) finding("note", `${field}: ${floating} inspected specification(s) use a tag, wildcard or partial version. Review the lockfile for selected releases; these declarations do not pin one version.`);
    if (sources) finding("note", `${field}: ${sources} inspected specification(s) use an alias, workspace or non-registry source. Check source provenance and package-manager support separately.`);
    if (unknown) finding("warning", `${field}: ${unknown} specification(s) were not recognized by the limited pattern rules. Review the original text with your package manager's specification documentation.`);
    if (entries.length > PACKAGE_ROWS_LIMIT) finding("warning", `${field}: showing the first ${PACKAGE_ROWS_LIMIT} of ${entries.length} entries; remaining values were not inspected.`);
  }
  if (object(pkg.dependencies) && object(pkg.devDependencies)) {
    const duplicate = Object.keys(pkg.dependencies).filter(name => own(pkg.devDependencies as Record<string, unknown>, name));
    if (duplicate.length) finding("warning", `${duplicate.length} package(s) appear in both dependencies and devDependencies: ${duplicate.slice(0, 10).map(display).join(", ")}${duplicate.length > 10 ? ", …" : ""}. Review their intended role and specifications.`);
  }
  if (own(pkg, "scripts")) {
    if (!object(pkg.scripts)) finding("error", "scripts must be an object mapping script names to command strings.");
    else {
      const entries = Object.entries(pkg.scripts);
      result.scriptCount = entries.length;
      if (entries.length > 80) finding("warning", `Showing the first 80 of ${entries.length} scripts; remaining values were not inspected.`);
      for (const [name, command] of entries.slice(0, 80)) {
        if (typeof command !== "string") { finding("error", `scripts.${display(name)} must be a string.`); continue; }
        const lifecycle = ["preinstall", "install", "postinstall", "prepare"].includes(name);
        result.scripts.push({ name: display(name), command: display(command), lifecycle });
        if (lifecycle) finding("warning", `${display(name)} is an install/prepare lifecycle hook. Read its command and npm's lifecycle rules before installing an unfamiliar project.`);
        if (/^(?:\s*\w+=[^\s]+\s+)|(?:^|[;&|]\s*)export\s+\w+=/.test(command)) finding("note", `scripts.${display(name)} appears to use POSIX environment assignment. npm uses cmd.exe on Windows by default; review portability or the configured script-shell.`);
        if (/(?:^|[\s;&|])(?:sudo\s+|rm\s+-[a-z]*r[a-z]*f|Remove-Item\b)|(?:curl|wget)[^\n]{0,200}\|\s*(?:sh|bash|powershell|pwsh)/i.test(command)) finding("warning", `scripts.${display(name)} contains a command pattern worth reviewing for deletion, elevation or downloaded-code execution. This is a heuristic, not a security verdict.`);
      }
    }
  }
  for (const field of ["overrides", "resolutions", "workspaces"]) if (own(pkg, field)) finding("note", `${field} is present. Its dependency and package-manager effects are outside this inspection.`);
  if (shortened) finding("note", "Long display values were shortened to 1,000 characters. The report is not an exact copy of the source manifest.");
  return result;
}

export function packageReport(result: PackageInspection): string {
  return ["package.json static inspection — no commands executed", `${result.name} · ${result.version}`, "Declared Node: " + (result.engine || "not supplied"), "Compatibility, vulnerabilities and installed versions were not checked.", ...result.findings.map(f => `[${f.level}] ${f.message}`), ...result.groups.flatMap(g => [g.field + ` (${g.count})`, ...g.rows.map(row => `${row.name}: ${row.spec} — ${row.pattern}`)]), "Scripts (text only):", ...result.scripts.map(row => `${row.name}: ${row.command}`)].join("\n\n");
}
