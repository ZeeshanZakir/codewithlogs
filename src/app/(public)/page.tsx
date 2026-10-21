import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Braces, Bug, Database } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { getAllPosts } from "@/lib/mdx";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const revalidate = 60;
const description = "Practical web development tutorials, Next.js guides, Supabase workflows, and debugging notes. Understand the problem, follow the code, and build with confidence.";
export const metadata: Metadata = {
  title: "Next.js Tutorials & Practical Debugging Notes",
  description,
  alternates: { canonical: siteUrl },
  openGraph: { title: "CodeWithLogs — Notes from the build", description, url: siteUrl, type: "website" },
};

const topics = [
  { name: "Next.js", icon: Braces, query: "Next.js", description: "Routing, rendering, and the decisions between browser and server." },
  { name: "Supabase", icon: Database, query: "Supabase", description: "Authentication, data access, and the permissions behind your app." },
  { name: "Debugging", icon: Bug, query: "debug", description: "Follow the error, isolate the cause, and understand the fix." },
];

export default async function HomePage() {
  const posts = await getAllPosts();
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const latest = posts.filter((post) => post.slug !== featured?.slug).slice(0, 4);
  return (
    <div className="journal-home">
      <section className="journal-container journal-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> An independent developer publication</p>
          <h1>Less guesswork.<br />More <em>understanding.</em></h1>
          <p className="hero-description">Notes from building for the web. Practical tutorials on Next.js, Supabase, and working through the bugs that documentation doesn’t always explain.</p>
          <div className="hero-actions">
            <Link href="/blog" className="journal-button">Explore the articles <ArrowUpRight size={17} /></Link>
            <a href="#latest" className="journal-text-link">See what’s new <ArrowDown size={15} /></a>
          </div>
          <p className="hero-footnote">Read the code. Understand the why. Make it your own.</p>
        </div>
        <div className="field-note" aria-label="A practical debugging approach">
          <div className="field-note-bar"><span>FIELD NOTES / DEBUGGING</span><Bug size={17} /></div>
          <p className="field-note-title">A bug is a clue.<br />Start there.</p>
          <ol>
            <li><span>01</span><div><strong>Reproduce it.</strong><p>Find the smallest case that fails.</p></div></li>
            <li><span>02</span><div><strong>Follow the evidence.</strong><p>Inspect the inputs, logs, and boundaries.</p></div></li>
            <li><span>03</span><div><strong>Verify the fix.</strong><p>Test the failure and the working path.</p></div></li>
          </ol>
          <div className="field-note-bottom"><span className="status-dot" /> A method, not a magic snippet.</div>
        </div>
      </section>
      <section className="topic-strip" aria-label="Explore topics">
        <div className="journal-container topic-grid">
          {topics.map(({ name, icon: Icon, query, description }, index) => {
            const count = posts.filter((post) => `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).length;
            return <Link key={name} href={`/blog?q=${encodeURIComponent(query)}`} className="topic-link">
              <div className="topic-heading"><Icon size={19} /><h2>{name}</h2><ArrowUpRight size={17} /></div>
              <p>{description}</p><span className="topic-count">0{index + 1} / {count ? `${count} ${count === 1 ? "article" : "articles"}` : "Explore the archive"}</span>
            </Link>;
          })}
        </div>
      </section>
      <section id="latest" className="journal-container journal-section">
        <div className="section-heading"><div><p className="eyebrow">The reading desk</p><h2>Fresh from the logs<span>.</span></h2></div><Link href="/blog" className="journal-text-link">All articles <ArrowUpRight size={16} /></Link></div>
        {featured ? <div className="home-articles"><div><p className="article-label">{featured.featured ? "EDITOR’S PICK" : "LATEST ARTICLE"}</p><BlogCard post={featured} featured /></div><div className="article-stack">{latest.map((post) => <BlogCard key={post.slug} post={post} compact />)}{latest.length === 0 ? <p className="muted">More articles will appear here as they’re published.</p> : null}</div></div> : <div className="journal-empty"><h3>The archive is getting started.</h3><p>Explore the developer tools or learn about the person behind CodeWithLogs.</p><Link href="/tools" className="journal-text-link">Open developer tools <ArrowUpRight size={16} /></Link></div>}
      </section>
      <section className="journal-container editor-note"><p className="eyebrow">Behind the logs</p><div><h2>A place to work things out.</h2><p>I’m Zeeshan Zakir, the developer behind CodeWithLogs. This publication is focused on making web development easier to understand: the implementation, the tradeoffs, and what to check when something breaks.</p><Link href="/about" className="journal-text-link">Meet the author <ArrowUpRight size={16} /></Link></div></section>
      <section id="newsletter" className="journal-container newsletter-section"><div><p className="eyebrow">Keep learning</p><h2>The next useful read,<br />in your inbox.</h2><p>Subscribe to new articles and development notes.</p></div><div><NewsletterSignup /><p className="newsletter-privacy">Article updates only. Read our <Link href="/privacy-policy">privacy policy</Link>.</p></div></section>
    </div>
  );
}

