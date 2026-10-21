import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-url";
export const metadata: Metadata = {
  title: "Editorial & Verification Policy",
  description: "How CodeWithLogs distinguishes unverified articles, partial test coverage, verified scopes, and unpublished drafts.",
  alternates: { canonical: `${siteUrl}/editorial-policy` },
};
export default function EditorialPolicyPage() {
  return (
    <div className="journal-container policy-page">
      <p className="eyebrow">The standard behind a solution</p>
      <h1>Evidence before a verified label.</h1>
      <p className="policy-lead">CodeWithLogs focuses on modern JavaScript developer troubleshooting and tools: Next.js debugging, Node.js/npm errors and Supabase troubleshooting, supported by Windows, VS Code, Git and deployment guides. Existing articles are retained. Publication dates do not establish technical verification.</p>
      <section><h2>What the labels mean</h2><dl><dt>Unverified</dt><dd>No reproducible solution test has been approved for this published version. A publication date or author byline is not test evidence.</dd><dt>Partially verified</dt><dd>Only explicitly listed steps and environments have passing evidence. Other solutions, platforms or security boundaries remain untested.</dd><dt>Verified within stated scope</dt><dd>The stated failure and fix have passing evidence for the identified article version, operating system and dependencies. It is not a promise about other environments.</dd><dt>Draft</dt><dd>A local proposed guide or replacement. Drafts are separate from published content and absent from public routes and the sitemap. Passing tests on a revised draft do not verify an older published article.</dd></dl><p>No current published article has been assigned a verified or partially verified label. Local draft test records are not presented as live article evidence.</p></section>
      <section><h2>What a troubleshooting guide needs</h2><ol><li>The exact error, affected command, and scope of the problem.</li><li>The actual operating system, shell, runtime and relevant application/dependency versions.</li><li>Reproduction steps in a disposable project or test environment.</li><li>A root-cause explanation that connects the evidence to the change.</li><li>A complete solution with readable commands or code, and the expected result.</li><li>A verification procedure, supported alternatives, common mistakes, and official references.</li></ol></section>
      <section><h2>Testing and publication</h2><p>A proposed solution stays in draft until its failure case and fix have been exercised, its limitations documented, and its evidence reviewed. We do not treat AI-generated prose, a successful website build, or an official documentation link as proof that an article’s fix works.</p><p>Commands must identify their shell and explain relevant side effects. A guide should not ask readers to disable security protections or delete project data as a routine first step.</p></section>
      <section><h2>Authorship, corrections, and older content</h2><p><Link href="/about">Zeeshan Zakir</Link> is the author identified by CodeWithLogs. Older articles retain their original authorship and URLs. Personal experiences and performance claims in those articles require author confirmation during review.</p><p>If a step is incorrect, include the article URL, the exact error, your versions, and a minimal reproduction when you <Link href="/contact">send a correction</Link>. Remove secrets and personal data from logs first.</p></section>
      <section><h2>Advertising and affiliate links</h2><p>Educational explanations take priority over promotional placements. Affiliate links may earn a commission and should be disclosed. Advertising does not turn an unverified article into a verified guide. See the <Link href="/disclaimer">disclaimer</Link> and <Link href="/privacy-policy">privacy policy</Link>.</p></section>
    </div>
  );
}
