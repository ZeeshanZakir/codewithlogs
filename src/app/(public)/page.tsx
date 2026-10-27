import { FaqSection } from "@/components/FaqSection";
import { pageFaqs } from "@/lib/faq-content";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search, Terminal, Database, Package, Braces } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { getAllPosts } from "@/lib/mdx";
import { getTroubleshootingTopic, getVerification, troubleshootingTopics } from "@/lib/troubleshooting";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 60;
const description = "Modern JavaScript developer troubleshooting and tools. Investigate Next.js, Node.js/npm and Supabase errors with clear diagnostic steps and evidence limits.";
export const metadata: Metadata = {
  title: "JavaScript Troubleshooting & Developer Tools",
  description,
  alternates: { canonical: siteUrl },
  openGraph: { title: "CodeWithLogs — Fix Your Development Errors. Step by Step.", description, url: siteUrl, type: "website" },
};
const primaryTopics = troubleshootingTopics.filter(topic => ["nextjs", "node-npm", "supabase"].includes(topic.id));
const topicIcons = [Braces, Package, Database];
const topicReferences = ["https://nextjs.org/docs", "https://docs.npmjs.com/common-errors", "https://supabase.com/docs"];
const recommendations = [
  { slug: "common-vercel-deployment-errors-solutions", summary: "Compare local build failures with deployment logs. The existing article needs the version corrections documented in its review draft." },
  { slug: "debug-production-errors-nextjs", summary: "Work out whether the failure is in the browser or on the server, then follow the relevant logs. A version-specific revision is awaiting review." },
];

export default async function HomePage() {
  const posts = await getAllPosts();
  const featured = recommendations.flatMap(({ slug, summary }) => {
    const post = posts.find((post) => post.slug === slug);
    return post ? [{ ...post, excerpt: summary }] : [];
  });
  const verified = posts.filter((post) => getVerification(post.slug)?.status === "verified").slice(0, 3);
  return (
    <div className="journal-home troubleshooting-home">
      <section className="journal-container journal-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> JavaScript troubleshooting & tools</p>
          <h1>Fix your development errors.<br /><em>Step by step.</em></h1>
          <p className="hero-description">For the error that stopped your build or broke your data flow. Investigate Next.js, Node.js, npm, and Supabase, with practical checks for the environment around them.</p>
          <form action="/blog" method="get" role="search" className="hero-search">
            <label htmlFor="troubleshooting-search" className="sr-only">Search troubleshooting guides by error message or tool</label>
            <Search size={20} aria-hidden="true" />
            <input id="troubleshooting-search" type="search" name="q" placeholder="Paste an error or name a tool…" maxLength={160} required />
            <button type="submit" aria-label="Search troubleshooting guides"><ArrowUpRight size={21} /></button>
          </form>
          <p className="search-hint">Try <Link href="/blog?q=module">module not found</Link>, <Link href="/blog?q=hydration">hydration</Link>, or <Link href="/blog?q=deployment">deployment errors</Link>.</p>
          <p className="search-hint">Start locally with the <Link href="/tools/error-decoder">error decoder</Link> or <Link href="/tools/package-json-inspector">package.json inspector</Link>.</p>
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
      <section className="topic-strip" aria-label="Three primary troubleshooting topics">
        <div className="journal-container topic-grid">
          {primaryTopics.map((topic, index) => {
            const Icon = topicIcons[index];
            const count = posts.filter((post) => getTroubleshootingTopic(post) === topic.id).length;
            return (
              <Link key={topic.id} href={count ? `/blog?topic=${topic.id}` : topicReferences[index]} className="topic-link">
                <div className="topic-heading"><Icon size={19} /><h2>{topic.shortTitle}</h2><ArrowUpRight size={16} /></div>
                <p>{topic.description}</p>
                <span className="topic-count">{topic.code} / {count ? `${count} existing ${count === 1 ? "guide" : "guides"}` : "Official reference"}</span>
              </Link>
            );
          })}
        </div>
      </section>
      {featured.length > 0 && <section className="journal-container journal-section">
        <div className="section-heading"><div><p className="eyebrow">Start with evidence</p><h2>Find the failure before the fix<span>.</span></h2></div><Link href="/blog" className="journal-text-link">Browse the archive <ArrowUpRight size={16} /></Link></div>
        <p className="section-intro">Begin with build logs and client-versus-server diagnosis. These existing public articles remain unverified; review their scope and the official references before adopting a fix.</p>
        <div className="featured-solutions">{featured.map((post) => <BlogCard key={post.slug} post={post} featured />)}</div>
      </section>}
      {verified.length > 0 && <section className="journal-container verification-desk">
        <div><p className="eyebrow">The verification desk</p><h2>Latest verified troubleshooting guides</h2><p>A verified label requires a recorded environment, a reproduced failure, a working fix, and reviewed evidence for the published version.</p></div>
        <div className="archive-grid">{verified.map((post) => <BlogCard key={post.slug} post={post} />)}</div>
      </section>}
      <section className="journal-container editor-note"><p className="eyebrow">Behind CodeWithLogs</p><div><h2>Useful answers. Clear limits.</h2><p>CodeWithLogs is written by Zeeshan Zakir. The focus is modern JavaScript developer troubleshooting and tools: explaining what failed, why it failed, and how to check a change. <Link href="/blog?topic=windows-setup">Windows and Git setup</Link>, <Link href="/blog?topic=vscode">VS Code</Link>, and Vercel deployment support that work. The existing archive is retained.</p><Link href="/about" className="journal-text-link">About the author <ArrowUpRight size={16} /></Link></div></section>
      <FaqSection items={pageFaqs["/"]} className="journal-container journal-section" editorial />
      <section id="newsletter" className="journal-container newsletter-section"><div><p className="eyebrow">Article updates</p><h2>Register your interest<br />in development notes.</h2><p>Leave your email and article-update preference. <Link href="/contact">Contact us</Link> to change your signup or request removal.</p></div><div><NewsletterSignup /><p className="newsletter-privacy">Signup records your interest; automatic email delivery is not currently offered. Read our <Link href="/privacy-policy">privacy policy</Link>.</p></div></section>
    </div>
  );
}
