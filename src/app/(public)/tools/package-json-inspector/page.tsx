import type { Metadata } from "next";
import Link from "next/link";
import { DiagnosticToolPage } from "@/components/tools/DiagnosticToolPage";
import { PackageJsonInspectorTool } from "@/components/tools/PackageJsonInspectorTool";
import { siteUrl } from "@/lib/site-url";
import styles from "@/components/tools/DiagnosticTools.module.css";

const title = "package.json Inspector";
const description = "Inspect package.json locally: validate JSON, summarize dependency declarations, review npm scripts and understand version patterns without running commands.";
export const metadata: Metadata = {
  title: "package.json Inspector — Dependencies & Scripts | CodeWithLogs",
  description,
  alternates: { canonical: `${siteUrl}/tools/package-json-inspector` },
  openGraph: { title: `${title} | CodeWithLogs`, description, url: `${siteUrl}/tools/package-json-inspector`, type: "website" },
};

export default function PackageJsonInspectorPage() {
  return <DiagnosticToolPage slug="package-json-inspector" title={title} description="See what a project declares before you install it. Review dependency patterns, configuration fields and script commands in one local, read-only inspection.">
    <PackageJsonInspectorTool />
    <section className={styles.reading} aria-labelledby="inspector-how"><h2 id="inspector-how">A manifest explains intent, not the installed tree</h2>
      <p>Paste the contents of package.json, then choose Inspect. This tool uses JSON.parse and fixed field checks. It summarizes dependencies, devDependencies, peerDependencies and optionalDependencies separately; counts are declarations rather than unique installed packages. It displays scripts as inert text, marks common install/prepare hooks and flags a few portability and command patterns for review.</p>
      <p>A valid JSON document can still contain unsuitable package configuration. The inspector distinguishes JSON errors, field errors, warnings and informational notes. It does not look up packages, execute scripts, install dependencies, query a registry, or alter the manifest.</p>
      <h3>What do version patterns mean?</h3>
      <ul><li><code>1.2.3</code> is an exact declared release; <code>^1.2.3</code> and <code>~1.2.3</code> are ranges with different update boundaries.</li><li><code>*</code>, partial versions and tags such as <code>latest</code> do not identify one immutable dependency tree.</li><li><code>file:</code>, Git sources, remote URLs, npm aliases and manager-specific workspace protocols need their own source and tool checks.</li><li>Compound expressions are labeled without calculating which versions satisfy them. Unknown patterns are not silently accepted as valid.</li></ul>
      <p>Range categories are descriptive. Caret behavior differs for zero-major releases, and transitive dependencies can change even when direct declarations are pinned. Check the <a href="https://github.com/npm/node-semver#ranges">npm semantic versioning reference</a> for full range rules.</p>
    </section>
    <section className={styles.reading} aria-labelledby="inspector-limits"><h2 id="inspector-limits">What this inspection cannot establish</h2>
      <ul><li>Dependency or peer compatibility: that requires package metadata, a resolver, a lockfile and actual tests.</li><li>Installed versions, vulnerabilities, package authenticity, license compliance, or whether a script is safe.</li><li>Complete npm schema/publish validation, all lifecycle hooks, workspace graph effects, overrides or manager-specific behavior.</li><li>Duplicate JSON keys: JSON.parse keeps the last value. Review source diffs or a duplicate-key-aware linter if that is a concern.</li><li>Your actual Node version. An engines declaration is shown without checking whether your runtime satisfies it.</li></ul>
      <p>Input is capped at 100,000 characters. Up to 200 entries per dependency field and 80 scripts are inspected; long displayed strings are shortened at 1,000 characters. Truncation is disclosed. No data is posted, stored or added to a URL by this tool. Existing site analytics may still load. Review the copied report for private names or script text before sharing it.</p>
      <h3>What to do after inspection</h3><p>If npm reports ERESOLVE, compare the required peer range with the version in the log using the <Link href="/tools/error-decoder">developer error decoder</Link>. Review the lockfile diff and test a focused change in a trusted checkout. A successful install does not replace application tests.</p>
      <p>For build configuration, see <Link href="/blog/common-vercel-deployment-errors-solutions">Vercel deployment troubleshooting</Link> and <Link href="/blog/nextjs-folder-structure-large-projects">Next.js project structure</Link>. These existing public articles remain unverified; local revised drafts have not been published.</p>
    </section>
    <section className={styles.reading} aria-labelledby="inspector-refs"><h2 id="inspector-refs">Official references</h2><ul>
      <li><a href="https://docs.npmjs.com/cli/v10/configuring-npm/package-json/">npm: package.json fields and dependency specifications</a></li>
      <li><a href="https://docs.npmjs.com/cli/v10/using-npm/scripts/">npm: lifecycle scripts and script-shell behavior</a></li>
      <li><a href="https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json/">npm: the role of package-lock.json</a></li>
      <li><Link href="/editorial-policy">CodeWithLogs editorial standard</Link> and <Link href="/privacy-policy">privacy information</Link></li>
    </ul></section>
  </DiagnosticToolPage>;
}
