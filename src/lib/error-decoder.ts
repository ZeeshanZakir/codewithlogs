export const ERROR_INPUT_LIMIT = 20_000;

export type ErrorGuide = {
  id: string;
  title: string;
  example: string;
  explanation: string;
  causes: readonly string[];
  steps: readonly string[];
  commands: string;
  scope: string;
  caution: string;
  references: readonly { label: string; href: string }[];
  related: readonly { label: string; href: string }[];
};

const debugGuide = { label: "Next.js debugging checklist (unverified article)", href: "/blog/debug-production-errors-nextjs" };
const deployGuide = { label: "Vercel build troubleshooting (unverified article)", href: "/blog/common-vercel-deployment-errors-solutions" };

// Fixed, bounded signatures only. Never compile or execute visitor-provided text.
// A match identifies a symptom, not a proven cause or a guarantee of a fix.
export const errorGuides: readonly ErrorGuide[] = [
  {
    id: "npm-eresolve", title: "npm ERESOLVE: dependency resolution conflict",
    example: "npm error code ERESOLVE\nnpm error ERESOLVE unable to resolve dependency tree",
    explanation: "npm could not construct the requested dependency tree. A conflicting peer requirement is one common reason; read the conflicting package names and ranges in the full log.",
    causes: ["A direct dependency falls outside another package's peer range.", "An upgrade changed the dependency or peer requirements recorded for the project."],
    steps: ["Find the Found, Could not resolve dependency and peer lines. Record both versions and the required range.", "Inspect the manifest and lockfile together. Use the package maintainer's compatibility information to choose matching releases.", "Change the smallest relevant dependency set on a branch; install it and review the lockfile diff. Run the project's tests and build before adoption."],
    commands: "node --version\nnpm --version\nnpm ls --all",
    scope: "npm 7+ installs enforce peer requirements by default. The local Phase 3 fixture reproduced a conflict and a compatible-version repair with npm 10.9.3; that does not prove your dependency set is compatible. npm ls can exit nonzero when the tree is invalid.",
    caution: "Do not treat --force or --legacy-peer-deps as a compatibility fix. Do not delete a lockfile or upgrade everything without reviewing the resulting changes. npm install can run lifecycle scripts.",
    references: [{ label: "npm peer dependency configuration", href: "https://docs.npmjs.com/cli/v10/using-npm/config/#legacy-peer-deps" }],
    related: [{ label: "Inspect version patterns in package.json", href: "/tools/package-json-inspector" }],
  },
  {
    id: "npm-eperm", title: "npm EPERM: an operation was not permitted",
    example: "npm error code EPERM\nnpm error syscall rename",
    explanation: "The operating system refused a filesystem operation. EPERM alone does not identify the responsible process, permission or security policy.",
    causes: ["A development server or editor process holds a file open on Windows.", "The target directory is protected or access is restricted by permissions or endpoint security."],
    steps: ["Read the syscall and path lines; distinguish the project directory from the npm cache or a global install.", "Save your work and stop only processes you recognize that use that path. Retry the original trusted operation as your normal user.", "Check that the project is in a writable directory and review security-product logs with your administrator. A cache problem requires cache-specific evidence."],
    commands: "node --version\nnpm --version\nnpm config get cache",
    scope: "Filesystem checks only. This decoder cannot inspect locks, ACLs, antivirus or your disk. These EPERM remedies have not been reproduced in the local fixtures.",
    caution: "Do not disable antivirus, grant Everyone full control, run arbitrary installs as administrator, or recursively delete a path copied from an error log. Review the actual path first.",
    references: [{ label: "Node.js system error definitions", href: "https://nodejs.org/docs/latest-v22.x/api/errors.html#common-system-errors" }],
    related: [{ label: "Inspect package configuration", href: "/tools/package-json-inspector" }],
  },
  {
    id: "powershell-npm-policy", title: "PowerShell blocked the npm.ps1 launcher",
    example: "npm.ps1 cannot be loaded because running scripts is disabled on this system.",
    explanation: "PowerShell selected a script launcher that the effective execution policy did not allow. This differs from Node not being installed or a failed npm install.",
    causes: ["The effective script policy blocks the launcher.", "A downloaded script needs signature or origin review under the applicable policy."],
    steps: ["Inspect launcher resolution and the effective policies in the failing shell.", "If your administrator permits the npm workflow and npm.cmd resolves to the trusted Node installation, try npm.cmd --version.", "If policy is centrally managed or the script origin is unclear, ask the administrator. Diagnose missing executables separately."],
    commands: "Get-Command npm -All\nGet-Command npm.cmd -All\nGet-ExecutionPolicy -List\nGet-ExecutionPolicy\nnpm.cmd --version",
    scope: "PowerShell on Windows. A Restricted child-process case and explicit npm.cmd invocation passed on Windows 10 / PowerShell 7.6.5 / npm 10.9.3. Windows 11 and managed-policy cases remain untested.",
    caution: "No persistent policy change is recommended here. Do not set global Bypass/Unrestricted or evade organizational controls. A valid launcher still runs the npm command you request.",
    references: [{ label: "Microsoft: PowerShell execution policies", href: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies" }],
    related: [{ label: "Inspect npm scripts before using them", href: "/tools/package-json-inspector" }],
  },
  {
    id: "node-not-recognized", title: "The shell cannot resolve the node command",
    example: "'node' is not recognized as an internal or external command, operable program or batch file.",
    explanation: "The current shell cannot find the requested command. That does not establish whether Node is absent, installed elsewhere or hidden by a stale PATH.",
    causes: ["Node is not installed or its executable directory is absent from this process's PATH.", "The terminal inherited an older environment or an active version manager points at a missing installation."],
    steps: ["In PowerShell, check all command matches and the executable search path.", "If you recently installed Node, fully close the terminal application and reopen it. Inspect the selected version in your version manager if you use one.", "Confirm the actual installation path before repairing PATH. If absent, use the official installer or your organization's approved setup."],
    commands: "Get-Command node -All -ErrorAction SilentlyContinue\nwhere.exe node\n$env:Path -split ';'",
    scope: "Windows shell lookup. A process-only missing/restored PATH case passed on Windows 10 with Node 22.18.0. Installer repair and Windows 11 behavior were not tested.",
    caution: "Do not overwrite PATH or download an executable from a random mirror. These diagnostics may print usernames and installation paths; redact before sharing. Verify node --version after the repair.",
    references: [{ label: "Microsoft: Node.js development on Windows", href: "https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows" }],
    related: [{ label: "Inspect declared Node requirements", href: "/tools/package-json-inspector" }],
  },
  {
    id: "git-not-recognized", title: "The shell cannot resolve the git command",
    example: "git: The term 'git' is not recognized as a name of a cmdlet, function, script file, or executable program.",
    explanation: "Git did not start because the shell could not resolve its command. Repository contents and credentials are not the initial cause of a command lookup failure.",
    causes: ["Git is missing from this shell's PATH or is not installed.", "The terminal inherited an older environment after installation."],
    steps: ["Inspect command resolution in the failing PowerShell session.", "If Git was just installed, fully restart the terminal application and compare a fresh shell.", "Check the actual Git for Windows installation or approved installer. After correcting lookup, run git --version before repository commands."],
    commands: "Get-Command git -All -ErrorAction SilentlyContinue\nwhere.exe git\n$env:Path -split ';'",
    scope: "A process-only missing/restored PATH case passed on Windows 10 with Git 2.55.0.windows.4. Windows Terminal UI, installer repair and Windows 11 were not tested.",
    caution: "Do not reset repositories, remove .git, or overwrite PATH to solve command lookup. Never paste credentials or tokens into a tool.",
    references: [{ label: "Git: Windows installation options", href: "https://git-scm.com/install/windows" }],
    related: [{ label: "Next.js project structure (unverified article)", href: "/blog/nextjs-folder-structure-large-projects" }],
  },
  {
    id: "next-hydration", title: "React / Next.js hydration mismatch",
    example: "Hydration failed because the server rendered HTML didn't match the client.",
    explanation: "The server-rendered HTML and the client's initial render disagree. The message identifies the mismatch, not which component caused it.",
    causes: ["Time, random values or browser-only state changes the initial rendered output.", "Invalid HTML nesting, locale differences or an extension modifies the markup."],
    steps: ["Use the component stack and HTML diff to locate the first differing output.", "Make the initial render deterministic. Read browser-only values after mount when appropriate; correct invalid HTML nesting.", "Retest a production build in a clean browser profile. Check that the content remains useful before hydration and test the affected interaction."],
    commands: "node --version\nnpm ls next react react-dom",
    scope: "React hydration guidance applicable to Next.js. This pattern is not proof that the log came from Next.js. No browser mismatch/fix has been verified in the local fixtures.",
    caution: "Do not hide every mismatch with suppressHydrationWarning or disable server rendering for the whole page. 'use client' alone does not prevent prerendering.",
    references: [{ label: "Next.js: hydration errors", href: "https://nextjs.org/docs/messages/react-hydration-error" }], related: [debugGuide],
  },
  {
    id: "next-module", title: "Module resolution failure: Next.js checklist",
    example: "Module not found: Can't resolve '@/components/Status'",
    explanation: "The resolver could not locate an imported module. A missing package is only one possibility; inspect the import trace and exact path first.",
    causes: ["The file path, exported package entry or letter casing differs from the import.", "A dependency is absent, an alias is misconfigured, or a Node-only module enters browser code."],
    steps: ["Classify the import as a relative file, configured alias or installed package; check spelling and tracked filename case.", "Review tsconfig paths and the import trace. Keep server-only dependencies outside client imports.", "For a package, inspect the manifest and lockfile before installing the intended dependency. Rebuild in the target environment after the smallest correction."],
    commands: "git ls-files\nnpm ls --depth=0",
    scope: "Module-not-found signatures also appear outside Next.js; this is a Next.js-oriented checklist. Local import/alias/type failure-and-repair fixtures passed on Next 16.2.6 / Windows 10; Linux casing behavior was not run.",
    caution: "Do not install a package named after an untrusted import automatically, ignore type errors, or assume a missing Node built-in belongs in browser code.",
    references: [{ label: "Next.js: module not found", href: "https://nextjs.org/docs/messages/module-not-found" }],
    related: [deployGuide, { label: "Next.js project structure (unverified article)", href: "/blog/nextjs-folder-structure-large-projects" }],
  },
  {
    id: "vercel-deployment", title: "Vercel build or deployment failure",
    example: 'Vercel: Error: Command "npm run build" exited with 1',
    explanation: "A build exit message summarizes failure; it usually is not the underlying error. A named Vercel platform error needs its own deployment context.",
    causes: ["An earlier install, type, import or prerender error caused the build command to fail.", "Project root/build/output settings or required environment values differ from local setup.", "A function timeout is a runtime issue and needs invocation logs rather than a build-only fix."],
    steps: ["In the failed deployment, locate the first actionable error above the final exit summary. Distinguish build logs from function invocation logs.", "Compare Node/package-manager versions, lockfile, project root, build/output settings and environment-variable names without sharing secret values.", "Reproduce the command locally only in a trusted project. For NO_OUTPUT_DIRECTORY inspect output settings; for FUNCTION_INVOCATION_TIMEOUT inspect the slow invocation and current plan/runtime limits."],
    commands: "node --version\nnpm --version\nnpm ls next --depth=0",
    scope: "Matches explicit Vercel context with a build failure, or the listed platform codes. It cannot see a deployment, its settings, plan limits or logs. No Vercel deployment was tested locally.",
    caution: "Do not redeploy production, expose environment secrets, increase arbitrary limits, or change the output directory without understanding the actual error. A failed build command alone is not a diagnosis.",
    references: [{ label: "Vercel: troubleshoot build failures", href: "https://vercel.com/docs/deployments/troubleshoot-a-build" }, { label: "Vercel: platform error list", href: "https://vercel.com/docs/errors/error-list" }], related: [deployGuide, debugGuide],
  },
];

export function sanitizeErrorText(input: string): string {
  return input
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "") // ANSI terminal styling
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/\r\n?/g, "\n");
}

const signatures: Readonly<Record<string, (text: string) => boolean>> = {
  "npm-eresolve": (text) => /\bERESOLVE\b/i.test(text) && /\bnpm\b|unable to resolve dependency tree|could not resolve/i.test(text),
  "npm-eperm": (text) => /\bnpm\b/i.test(text) && /\bEPERM\b/i.test(text),
  "powershell-npm-policy": (text) => /npm\.ps1/i.test(text) && /running scripts is disabled|not digitally signed|execution polic|PSSecurityException|UnauthorizedAccess/i.test(text),
  "node-not-recognized": (text) => /(?:^|\n)\s*(?:node\s*:\s*(?:The term\s*)?|The term\s*)?['"‘’]?node['"‘’]?\s+(?:is not recognized|was not found)/im.test(text),
  "git-not-recognized": (text) => /(?:^|\n)\s*(?:git\s*:\s*(?:The term\s*)?|The term\s*)?['"‘’]?git['"‘’]?\s+(?:is not recognized|was not found)/im.test(text),
  "next-hydration": (text) => /hydration (?:failed|mismatch)|text content (?:does not|did not) match server-rendered html|a tree hydrated but some attributes/i.test(text),
  "next-module": (text) => /module not found\s*:\s*(?:error\s*:\s*)?(?:can(?:not|'t) resolve|cannot find)|cannot find module\s+['"]/i.test(text),
  "vercel-deployment": (text) => /\b(?:NO_OUTPUT_DIRECTORY|FUNCTION_INVOCATION_TIMEOUT)\b/.test(text) || (/\bvercel\b|\/vercel\/path\d/i.test(text) && /build (?:failed|error)|command[^\n]{0,180}exited with|build step did not complete/i.test(text)),
};

export type DecodeResult = { status: "empty" | "too-long" | "unsupported" | "matched"; matches: readonly ErrorGuide[]; removedFormatting: boolean };
export function decodeError(input: string): DecodeResult {
  if (input.length > ERROR_INPUT_LIMIT) return { status: "too-long", matches: [], removedFormatting: false };
  const text = sanitizeErrorText(input);
  const removedFormatting = text !== input;
  if (!text.trim()) return { status: "empty", matches: [], removedFormatting };
  const matches = errorGuides.filter(guide => signatures[guide.id](text));
  return { status: matches.length ? "matched" : "unsupported", matches, removedFormatting };
}

export function errorReport(matches: readonly ErrorGuide[]): string {
  return matches.map(guide => [guide.title, guide.explanation, "Diagnostic steps:", ...guide.steps.map((step, i) => `${i + 1}. ${step}`), "Diagnostic commands (review before running):", guide.commands, "Scope: " + guide.scope, "Caution: " + guide.caution, "Official references:", ...guide.references.map(ref => ref.href)].join("\n\n")).join("\n\n---\n\n");
}
