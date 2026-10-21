import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search, Terminal, Monitor, Package, Braces } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { getAllPosts } from "@/lib/mdx";
import { getTroubleshootingTopic, getVerification, troubleshootingTopics } from "@/lib/troubleshooting";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 60;
const description = "Windows developer troubleshooting for Windows 11, VS Code, Node.js, npm, Git, and Next.js. Find the cause of development errors and follow a clear verification path.";
export const metadata: Metadata = {
  title: "Windows Developer Troubleshooting",
  description,
  alternates: { canonical: siteUrl },
  openGraph: { title: "CodeWithLogs — Fix Your Development Errors. Step by Step.", description, url: siteUrl, type: "website" },
};
const topicIcons = [Monitor, Terminal, Package, Braces];
const featuredSlugs = ["common-vercel-deployment-errors-solutions", "debug-production-errors-nextjs"];

export default async function HomePage() {
  const posts = await getAllPosts();
  const featured = featuredSlugs.flatMap((slug) => posts.find((post) => post.slug === slug) ?? []);
  const verified = posts.filter((post) => getVerification(post.slug)).slice(0, 3);
  return (
    <div className="journal-home troubleshooting-home">
      <section className="journal-container journal-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Windows developer troubleshooting</p>
          <h1>Fix your development errors.<br /><em>Step by step.</em></h1>
          <p className="hero-description">For the error that stopped your build, broke your terminal, or interrupted your day. Find a clear path through Windows 11, VS Code, Node.js, npm, Git, and Next.js.</p>
          <form action="/blog" method="get" role="search" className="hero-search">
            <label htmlFor="troubleshooting-search" className="sr-only">Search troubleshooting guides by error message or tool</label>
            <Search size={20} aria-hidden="true" />
            <input id="troubleshooting-search" type="search" name="q" placeholder="Paste an error or name a tool…" maxLength={160} required />
            <button type="submit" aria-label="Search troubleshooting guides"><ArrowUpRight size={21} /></button>
          </form>
          <p className="search-hint">Try <Link href="/blog?q=module">module not found</Link>, <Link href="/blog?q=hydration">hydration</Link>, or <Link href="/blog?q=deployment">deployment errors</Link>.</p>
        </div>
        <aside className="field-note">
          <div className="field-note-bar"><span>THE TROUBLESHOOTING METHOD</span><Terminal size={18} /></div>
          <p className="field-note-title">Understand the error.<br />Then change the code.</p>
          <ol>
            <li><span>01</span><div><strong>Capture the failure.</strong><p>The exact message, command, and environment.</p></div></li>
            <li><span>02</span><div><strong>Find the cause.</strong><p>Follow the evidence before changing settings.</p></div></li>
            <li><span>03</span><div><strong>Check the result.</strong><p>Repeat the failing step and verify the outcome.</p></div></li>
          </ol>
          <Link href="/editorial-policy" className="field-note-bottom">How verification works <ArrowUpRight size={14} /></Link>
        </aside>
      </section>
      <section className="topic-strip" aria-label="Four specialist troubleshooting categories">
        <div className="journal-container topic-grid">
          {troubleshootingTopics.map((topic, index) => {
            const Icon = topicIcons[index];
            const count = posts.filter((post) => getTroubleshootingTopic(post) === topic.id).length;
            return (
              <Link key={topic.id} href={`/blog?topic=${topic.id}`} className="topic-link">
                <div className="topic-heading"><Icon size={19} /><h2>{topic.shortTitle}</h2><ArrowUpRight size={16} /></div>
                <p>{topic.description}</p>
                <span className="topic-count">{topic.code} / {count ? `${count} existing ${count === 1 ? "guide" : "guides"}` : "New guides in preparation"}</span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="journal-container journal-section">
        <div className="section-heading"><div><p className="eyebrow">Start with a failure</p><h2>From error to explanation<span>.</span></h2></div><Link href="/blog" className="journal-text-link">Browse the archive <ArrowUpRight size={16} /></Link></div>
        <p className="section-intro">Existing troubleshooting guides from the archive. Windows-specific verification is still pending; each article shows its review status.</p>
        <div className="featured-solutions">{featured.map((post) => <BlogCard key={post.slug} post={post} featured />)}</div>
        {!featured.length && <p className="journal-empty">No published troubleshooting guides are available yet. <Link href="/blog">Browse the existing archive.</Link></p>}
      </section>
      <section className="journal-container verification-desk">
        <div><p className="eyebrow">The verification desk</p><h2>Latest verified troubleshooting guides</h2><p>A Windows-verified label requires a recorded environment, a reproduced failure, a working fix, and a reviewable test record.</p></div>
        {verified.length ? <div className="archive-grid">{verified.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="verification-empty"><span className="review-status">Verification pending</span><h3>The first verified guides are still in preparation.</h3><p>Existing articles remain available. They have not been relabeled as tested Windows solutions.</p><Link href="/editorial-policy" className="journal-text-link">Read the editorial standard <ArrowUpRight size={16} /></Link></div>}
      </section>
      <section className="journal-container editor-note"><p className="eyebrow">Behind CodeWithLogs</p><div><h2>Useful answers. Clear limits.</h2><p>CodeWithLogs is written by Zeeshan Zakir. The focus is Windows development troubleshooting: explaining what failed, why it failed, and how to check whether a change helped. Older web development articles remain in the archive.</p><Link href="/about" className="journal-text-link">About the author <ArrowUpRight size={16} /></Link></div></section>
      <section id="newsletter" className="journal-container newsletter-section"><div><p className="eyebrow">Stay in the loop</p><h2>Development notes,<br />without the interruption.</h2><p>Get article updates from CodeWithLogs.</p></div><div><NewsletterSignup /><p className="newsletter-privacy">Article updates only. Read our <Link href="/privacy-policy">privacy policy</Link>.</p></div></section>
    </div>
  );
}
