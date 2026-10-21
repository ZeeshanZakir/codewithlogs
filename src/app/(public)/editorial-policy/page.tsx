import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-url";
export const metadata: Metadata = {
  title: "Editorial & Verification Policy",
  description: "How CodeWithLogs distinguishes existing articles, unverified drafts, and Windows-verified troubleshooting guides.",
  alternates: { canonical: `${siteUrl}/editorial-policy` },
};
export default function EditorialPolicyPage() {
  return (
    <div className="journal-container policy-page">
      <p className="eyebrow">The standard behind a solution</p>
      <h1>Evidence before a verified label.</h1>
      <p className="policy-lead">CodeWithLogs focuses on Windows developer troubleshooting. Existing articles are retained in the archive. Their publication dates do not mean their fixes have been independently tested on Windows.</p>
      <section><h2>What the labels mean</h2><dl><dt>Windows verification pending</dt><dd>An existing article without a recorded Windows test. Check the official documentation and your environment before applying its suggestions.</dd><dt>Draft</dt><dd>A proposed or unfinished guide. Drafts are not included in the public article list or sitemap.</dd><dt>Windows-verified</dt><dd>A guide with a documented environment, reproduced failure, independently checked solution, review date, and reviewable evidence. No current article has been assigned this label.</dd></dl></section>
      <section><h2>What a troubleshooting guide needs</h2><ol><li>The exact error, affected command, and scope of the problem.</li><li>The Windows build, shell, application versions, and relevant project dependencies.</li><li>Reproduction steps in a disposable project or test environment.</li><li>A root-cause explanation that connects the evidence to the change.</li><li>A complete solution with readable commands or code, and the expected result.</li><li>A verification procedure, supported alternatives, common mistakes, and official references.</li></ol></section>
      <section><h2>Testing and publication</h2><p>A proposed solution stays in draft until its failure case and fix have been exercised, its limitations documented, and its evidence reviewed. We do not treat AI-generated prose, a successful website build, or an official documentation link as proof that an article’s fix works.</p><p>Commands must identify their shell and explain relevant side effects. A guide should not ask readers to disable security protections or delete project data as a routine first step.</p></section>
      <section><h2>Authorship, corrections, and older content</h2><p><Link href="/about">Zeeshan Zakir</Link> is the author identified by CodeWithLogs. Older articles retain their original authorship and URLs. Personal experiences and performance claims in those articles require author confirmation during review.</p><p>If a step is incorrect, include the article URL, the exact error, your versions, and a minimal reproduction when you <Link href="/contact">send a correction</Link>. Remove secrets and personal data from logs first.</p></section>
      <section><h2>Advertising and affiliate links</h2><p>Educational explanations take priority over promotional placements. Affiliate links may earn a commission and should be disclosed. Advertising does not turn an unverified article into a verified guide. See the <Link href="/disclaimer">disclaimer</Link> and <Link href="/privacy-policy">privacy policy</Link>.</p></section>
    </div>
  );
}
