"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { decodeError, errorGuides, errorReport, ERROR_INPUT_LIMIT, type DecodeResult } from "@/lib/error-decoder";
import { DiagnosticCopyButton } from "./DiagnosticCopyButton";
import styles from "./DiagnosticTools.module.css";

export function ErrorDecoderTool() {
  const [input, setInput] = useState("");
  const [example, setExample] = useState(errorGuides[0].id);
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const output = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);

  function analyze() {
    const next = decodeError(input);
    setResult(next);
    setAnnouncement(next.status === "matched" ? `${next.matches.length} known error signature${next.matches.length === 1 ? "" : "s"} matched. See the diagnostic results.` : "No troubleshooting match. See the input guidance below.");
    requestAnimationFrame(() => output.current?.focus());
  }

  return <>
    <form className={styles.workspace} onSubmit={event => { event.preventDefault(); analyze(); }} aria-label="Development error analysis">
      <label htmlFor="error-message">Paste the error, keep the context</label>
      <p className={styles.help} id="error-help">Include the error code and a few surrounding lines. Remove tokens, passwords, personal paths and customer data. Analysis happens in this page; no pasted text is sent by this tool, saved to browser storage or added to the URL.</p>
      <textarea ref={editor} id="error-message" className={styles.input} value={input} maxLength={ERROR_INPUT_LIMIT} spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off" aria-describedby="error-help error-count" placeholder={'For example:\nnpm error code ERESOLVE\nnpm error ERESOLVE unable to resolve dependency tree'} onChange={event => { setInput(event.target.value); setResult(null); setAnnouncement(""); }} />
      <p className={styles.count} id="error-count">{input.length.toLocaleString("en-US")} / 20,000 characters</p>
      <div className={styles.actions}><button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!input.trim()}>Decode error</button><button type="button" className={styles.button} onClick={() => { setInput(""); setResult(null); setAnnouncement("Input and results cleared."); editor.current?.focus(); }}>Clear</button></div>
      <div className={styles.sample}><label htmlFor="error-example">Try an example</label><select id="error-example" value={example} onChange={event => setExample(event.target.value)}>{errorGuides.map(guide => <option key={guide.id} value={guide.id}>{guide.title}</option>)}</select><button type="button" className={styles.button} onClick={() => { setInput(errorGuides.find(guide => guide.id === example)!.example); setResult(null); setAnnouncement("Example loaded. Choose Decode error to inspect it."); editor.current?.focus(); }}>Load example</button></div>
      <p role="status" aria-live="polite" className={styles.status}>{announcement}</p>
      <noscript><p>JavaScript is required for local matching. The supported-error reference below remains readable.</p></noscript>
    </form>

    {result && <div className={styles.result} ref={output} tabIndex={-1} aria-labelledby="decoder-results">
      <h2 id="decoder-results">{result.status === "matched" ? "Matching signatures" : "No matching signature"}</h2>
      {result.removedFormatting && <p className={styles.notice}>Terminal formatting and invisible control characters were normalized before matching. Your input was not executed.</p>}
      {result.status === "unsupported" && <div className={styles.notice}><p>This message is outside the reviewed rules. No cause or fix has been inferred.</p><p>Find the first error above any final exit summary. Compare its exact code with the supported examples below. An npm code, framework name or deployment context can help distinguish errors.</p></div>}
      {result.status === "empty" && <p className={styles.notice}>Enter a readable error message, not just terminal formatting or whitespace.</p>}
      {result.status === "too-long" && <p className={styles.notice}>Input is too long. Use at most 20,000 characters around the first relevant error.</p>}
      {result.status === "matched" && <><p className={styles.help}>A signature match is a starting point. The actual cause needs the checks below. Several matches can occur in one log.</p><DiagnosticCopyButton key={input} text={errorReport(result.matches)} label="Copy troubleshooting checklist" /></>}
      {result.matches.map(guide => <section key={guide.id} className={styles.match} aria-labelledby={`result-${guide.id}`}>
        <h3 id={`result-${guide.id}`}>{guide.title}</h3><p>{guide.explanation}</p>
        <h4>Possible causes to check</h4><ul>{guide.causes.map(cause => <li key={cause}>{cause}</li>)}</ul>
        <h4>Diagnostic steps</h4><ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <h4>Diagnostic commands</h4><p>PowerShell syntax for Windows setup checks. Review the commands and their output before sharing.</p><pre className={styles.code}><code>{guide.commands}</code></pre><DiagnosticCopyButton text={guide.commands} label={`Copy ${guide.id} diagnostics`} />
        <p className={styles.notice}><strong>Evidence and limits. </strong>{guide.scope}</p><p className={`${styles.notice} ${styles.caution}`}><strong>Safety. </strong>{guide.caution}</p>
        <div className={styles.links}>{guide.references.map(ref => <a key={ref.href} href={ref.href}>{ref.label} ↗</a>)}{guide.related.map(link => <Link key={link.href} href={link.href}>{link.label} →</Link>)}</div>
      </section>)}
    </div>}
  </>;
}
