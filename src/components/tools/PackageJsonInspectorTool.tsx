"use client";

import { useRef, useState } from "react";
import { inspectPackage, packageReport, PACKAGE_INPUT_LIMIT, type PackageInspection } from "@/lib/package-inspector";
import { DiagnosticCopyButton } from "./DiagnosticCopyButton";
import styles from "./DiagnosticTools.module.css";

const sample = JSON.stringify({ name: "windows-debugging-example", version: "1.0.0", private: true, engines: { node: ">=22" }, scripts: { dev: "next dev", build: "next build", start: "next start", preview: "NODE_ENV=production next start" }, dependencies: { next: "16.2.6", react: "19.2.4", "react-dom": "19.2.4" }, devDependencies: { typescript: "^5.9.3" } }, null, 2);

export function PackageJsonInspectorTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PackageInspection | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const editor = useRef<HTMLTextAreaElement>(null);
  const output = useRef<HTMLDivElement>(null);

  function inspect() {
    const next = inspectPackage(input);
    setResult(next);
    setAnnouncement(next.status === "inspected" ? `JSON parsed. ${next.findings.filter(f => f.level === "error").length} field errors and ${next.findings.filter(f => f.level === "warning").length} warnings found. Dependency compatibility was not checked.` : next.message || "Unable to inspect input.");
    requestAnimationFrame(() => output.current?.focus());
  }

  return <>
    <form className={styles.workspace} onSubmit={event => { event.preventDefault(); inspect(); }} aria-label="Package JSON inspection">
      <label htmlFor="package-json">Paste your package.json</label><p className={styles.help} id="package-help">Read locally; nothing is installed or executed. No manifest text is sent by this tool, stored in the browser or placed in the URL. Remove private registry credentials and other secrets first. The site may still load its existing analytics.</p>
      <textarea id="package-json" ref={editor} className={styles.input} value={input} maxLength={PACKAGE_INPUT_LIMIT} aria-describedby="package-help package-count" spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off" placeholder={'{\n  "name": "my-project",\n  "private": true,\n  "scripts": { "dev": "next dev" }\n}'} onChange={event => { setInput(event.target.value); setResult(null); setAnnouncement(""); }} />
      <p className={styles.count} id="package-count">{input.length.toLocaleString("en-US")} / 100,000 characters</p>
      <div className={styles.actions}><button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!input.trim()}>Inspect package.json</button><button type="button" className={styles.button} onClick={() => { setInput(sample); setResult(null); setAnnouncement("Example loaded. Choose Inspect package.json to review it."); editor.current?.focus(); }}>Load example</button><button type="button" className={styles.button} onClick={() => { setInput(""); setResult(null); setAnnouncement("Input and results cleared."); editor.current?.focus(); }}>Clear</button></div>
      <p className={styles.status} role="status" aria-live="polite">{announcement}</p><noscript><p>Enable JavaScript for local parsing. The reference below remains readable.</p></noscript>
    </form>
    {result && <div className={styles.result} ref={output} tabIndex={-1} aria-labelledby="package-results">
      <h2 id="package-results">{result.status === "inspected" ? "Static inspection" : "Check the input"}</h2>
      {result.message && <p className={styles.notice}>{result.message}</p>}
      {result.status === "inspected" && <>
        <p className={styles.notice}>JSON parsed successfully. This is a field and pattern review, not a compatibility, security or publishability certificate.</p>
        <dl className={styles.summary}><div><dt>Package / own version</dt><dd>{result.name} · {result.version}</dd></div><div><dt>Declared Node requirement</dt><dd>{result.engine || "Not supplied"} (not evaluated)</dd></div><div><dt>npm publication guard</dt><dd>{result.private === true ? "private: true" : result.private === false ? "private: false" : "Not declared as a boolean"}</dd></div><div><dt>Package manager declaration</dt><dd>{result.packageManager || "Not supplied"}</dd></div></dl>
        <DiagnosticCopyButton key={input} text={packageReport(result)} label="Copy inspection report" /><p className={styles.help}>The copied report includes displayed package names and script text. Review it before sharing.</p>
        <h3 className="mt-7">Configuration findings</h3><ul className={styles.findings}>{result.findings.map((finding, i) => <li key={i}><span className={styles.badge}>{finding.level}</span>{finding.message}</li>)}</ul>{!result.findings.length && <p>No findings from these limited rules. Review the limitations below.</p>}
        <h3 className="mt-8">Dependency declarations</h3><p className={styles.help}>Counts are per field, not unique installed packages. Ranges are categorized, not resolved. Up to 200 entries per field are inspected.</p>
        {!result.groups.length && <p>No dependency maps to summarize.</p>}
        {result.groups.map(group => <section key={group.field} aria-label={group.field}><h4>{group.field} · {group.count} declaration{group.count === 1 ? "" : "s"}</h4><div className={styles.tableWrap}><table className={styles.table}><caption className="sr-only">{group.field}: package name, declared specification and pattern</caption><thead><tr><th scope="col">Package</th><th scope="col">Specification</th><th scope="col">Pattern</th></tr></thead><tbody>{group.rows.map((row, index) => <tr key={index}><th scope="row">{row.name}</th><td><code>{row.spec}</code></td><td>{row.pattern}</td></tr>)}</tbody></table></div></section>)}
        <h3>Scripts · {result.scriptCount} declaration{result.scriptCount === 1 ? "" : "s"}</h3><p className={styles.help}>Text only. This tool never runs scripts. npm can run lifecycle hooks during an install, including scripts in dependencies that are not visible in this manifest.</p>
        {result.scripts.map((script, index) => <section className={styles.script} key={index}><h4>{script.name} {script.lifecycle && <span className={styles.badge}>Install / prepare hook</span>}</h4><pre className={styles.code}><code>{script.command}</code></pre></section>)}
        {!result.scripts.length && <p>No string scripts to display.</p>}
      </>}
    </div>}
  </>;
}
