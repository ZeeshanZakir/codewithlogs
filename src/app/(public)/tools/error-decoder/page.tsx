import type { Metadata } from "next";
import Link from "next/link";
import { DiagnosticToolPage } from "@/components/tools/DiagnosticToolPage";
import { ErrorDecoderTool } from "@/components/tools/ErrorDecoderTool";
import { errorGuides } from "@/lib/error-decoder";
import { siteUrl } from "@/lib/site-url";
import styles from "@/components/tools/DiagnosticTools.module.css";

const title = "Developer Error Decoder";
const description = "Understand npm, PowerShell, Node, Git, Next.js and Vercel errors with local signature matching, practical diagnostics and explicit limits.";
export const metadata: Metadata = {
  title: "Developer Error Decoder — npm, Windows & Next.js | CodeWithLogs",
  description,
  alternates: { canonical: `${siteUrl}/tools/error-decoder` },
  openGraph: { title: `${title} | CodeWithLogs`, description, url: `${siteUrl}/tools/error-decoder`, type: "website" },
};

export default function ErrorDecoderPage() {
  return <DiagnosticToolPage slug="error-decoder" title={title} description="Start with the error you can see. Match a known signature, understand its limits, and work through the next diagnostic steps without sending your log to an AI service.">
    <ErrorDecoderTool />
    <section className={styles.reading} aria-labelledby="decoder-how"><h2 id="decoder-how">How to read an error without guessing</h2>
      <ol><li>Start at the first actionable error. A final “build exited with 1” message often hides the useful line above it.</li><li>Keep the code, failed operation and framework context. Redact secrets and identifying paths before pasting.</li><li>Compare the suggested checks with your OS, shell and dependency versions. Change one thing, then repeat the failing operation and the project’s tests.</li></ol>
      <p>This decoder uses fixed rules; it cannot inspect your machine, read your repository, resolve dependencies or prove a root cause. Multiple signatures can match the same log. Unknown messages get an unsupported result instead of an invented explanation. Input is limited to 20,000 characters, terminal styling is normalized, and pasted markup is never rendered as HTML.</p>
      <p>Matching tests check these rules, not every suggested repair. Evidence from local fixtures is scoped in each result. Current setup fixtures ran on Windows 10, not Windows 11. No screenshots, live Vercel repair or browser hydration fix are claimed.</p>
    </section>
    <section className={styles.reading} aria-labelledby="supported-errors"><h2 id="supported-errors">Supported errors and first checks</h2><p>These references are readable without using the tool. Open a signature to compare its example and diagnostic scope with your log.</p>
      {errorGuides.map(guide => <details key={guide.id}><summary>{guide.title}</summary><pre><code>{guide.example}</code></pre><p>{guide.explanation}</p><p><strong>First check: </strong>{guide.steps[0]}</p><p><strong>Limits: </strong>{guide.scope}</p><ul>{guide.references.map(ref => <li key={ref.href}><a href={ref.href}>{ref.label}</a></li>)}</ul></details>)}
    </section>
    <section className={styles.reading} aria-labelledby="decoder-reading"><h2 id="decoder-reading">Continue the investigation</h2>
      <p>For a dependency error, the <Link href="/tools/package-json-inspector">package.json inspector</Link> can show declared ranges and script hooks. It does not replace npm’s resolver or a lockfile review.</p>
      <ul><li><Link href="/blog/common-vercel-deployment-errors-solutions">Common Vercel deployment errors</Link> — existing article; unverified published version.</li><li><Link href="/blog/debug-production-errors-nextjs">Debugging production errors in Next.js</Link> — existing article; unverified published version.</li><li><Link href="/blog/nextjs-folder-structure-large-projects">Next.js folder structure</Link> — existing article; unverified published version.</li></ul>
      <p>Read <Link href="/editorial-policy">our evidence standard</Link> before treating an article as tested. Report an incorrect signature through <Link href="/contact">Contact</Link>, using a minimal redacted example. Do not include tokens or customer data.</p>
      <h3>What happens to pasted errors?</h3><p>The decoder keeps input only in this page’s current React state. Its analysis does not upload logs, persist them in storage or encode them in a share URL. Clear removes the input and displayed results; browsers can independently restore page state during navigation. Existing site analytics may still load; see the <Link href="/privacy-policy">privacy policy</Link>. Clipboard access happens only when you choose Copy, and copies the static checklist rather than your original log.</p>
    </section>
  </DiagnosticToolPage>;
}
