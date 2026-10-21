import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllPosts, getPostBySlug, getRelatedPosts, type BlogPostMeta } from "@/lib/mdx";
import { AdUnit } from "@/components/ads/AdUnit";
import { BlogCard } from "@/components/blog/BlogCard";
import { MDXRenderer } from "@/components/blog/MDXRenderer";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { siteUrl } from "@/lib/site-url";
import { getTroubleshootingTopic, getVerification } from "@/lib/troubleshooting";

export const dynamic = "force-static";
export const revalidate = 60;
export const dynamicParams = true;
type BlogPostPageProps = { params: Promise<{ slug: string; }>; };

async function getAugmentedRelatedPosts(currentSlug: string, category: string, limit = 3): Promise<BlogPostMeta[]> {
  const allPosts = await getAllPosts();
  const current = allPosts.find((post) => post.slug === currentSlug);
  const topic = current ? getTroubleshootingTopic(current) : undefined;
  const sameTopic = topic ? allPosts.filter((post) => post.slug !== currentSlug && getTroubleshootingTopic(post) === topic) : [];
  const sameCategory = await getRelatedPosts(category, currentSlug, limit);
  const ordered = [...sameTopic, ...sameCategory, ...allPosts.filter((post) => post.slug !== currentSlug)];
  return [...new Map(ordered.map((post) => [post.slug, post])).values()].slice(0, limit);
}
export async function generateStaticParams() { return []; }
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: true } };
  return {
    title: post.title, description: post.excerpt,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, url: `${siteUrl}/blog/${post.slug}`, type: "article", publishedTime: post.date, authors: [post.author], images: [{ url: post.coverImage, alt: post.title }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();
  const relatedPosts = await getAugmentedRelatedPosts(post.slug, post.category);
  const verification = getVerification(post.slug);
  const shareUrl = `${siteUrl}/blog/${post.slug}`;
  const initials = post.author.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BlogPosting", "@id": `${shareUrl}#article`, headline: post.title, description: post.excerpt, datePublished: post.date, image: new URL(post.coverImage, siteUrl).href, mainEntityOfPage: shareUrl, author: { "@type": "Person", name: post.author }, publisher: { "@type": "Organization", name: "CodeWithLogs", url: siteUrl }, articleSection: post.category, keywords: post.tags.join(", "), inLanguage: "en" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Guides & archive", item: `${siteUrl}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: shareUrl }] },
    ],
  };
  return <div className="journal-container article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <nav aria-label="Breadcrumb" className="article-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog"><ArrowLeft size={15} /> Guides & archive</Link><span aria-hidden="true">/</span><span aria-current="page">{post.title}</span></nav>
    <header className="article-header"><p className="eyebrow">{post.category} / {post.readTime}</p><h1>{post.title}</h1><p className="article-deck">{post.excerpt}</p><div className="article-byline"><span className="author-initials" aria-hidden="true">{initials}</span><div><span className="author-name">{post.author}</span><p>Published <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time><span aria-hidden="true"> · </span>{post.readTime}</p></div></div></header>
    <section className="article-verification" aria-label="Article verification status"><span className="review-status">{verification ? "Windows-verified" : "Windows verification pending"}</span><p>{verification ? `Tested on ${verification.testedOn} · ${verification.environment} · Reviewed by ${verification.reviewer}` : "This existing article does not yet have a recorded Windows test environment or independently verified fix."}</p><Link href="/editorial-policy">How we verify guides</Link></section>
    <div className="article-layout">
      <article className="article-main" aria-label={post.title}>
        <div className="article-cover"><Image src={post.coverImage} alt={post.title} width={1600} height={900} sizes="(max-width: 1024px) 100vw, 740px" priority /></div>
        {post.headings.length > 0 && <details className="mobile-toc"><summary>On this page</summary><TableOfContents headings={post.headings} /></details>}
        {post.affiliateLinks.length > 0 && <p className="article-disclosure">This article includes affiliate links. Purchases through those links may earn a commission at no extra cost to you. <Link href="/disclaimer">Read the disclosure.</Link></p>}
        <div className="article-prose"><MDXRenderer source={post.content} /></div>
        <AdUnit slot="article-end" format="horizontal" />
        <section className="article-endnote"><p className="eyebrow">Keep the conversation useful</p><h2>Found a different result?</h2><p>Include your framework version, the error, and the steps to reproduce it. Specific details help improve the article for the next reader.</p><Link href="/contact" className="journal-text-link">Send a correction or question <ArrowUpRight size={16} /></Link></section>
        <section className="article-share"><h2>Share this article</h2><ShareButtons title={post.title} url={shareUrl} /></section>
      </article>
      <aside className="article-sidebar"><div className="article-sidebar-inner">{post.headings.length > 0 && <TableOfContents headings={post.headings} />}<div className="sidebar-note"><p className="eyebrow">A useful companion</p><h2>Inspect. Format. Debug.</h2><p>Small tools for working with JSON, tokens, regular expressions, and more.</p><Link href="/tools" className="journal-text-link">Open developer tools <ArrowUpRight size={15} /></Link></div><Link href="/about" className="journal-text-link">About CodeWithLogs <ArrowUpRight size={15} /></Link></div></aside>
    </div>
    {relatedPosts.length > 0 && <section className="related-section"><div className="section-heading"><div><p className="eyebrow">Follow your curiosity</p><h2>Related troubleshooting & reading<span>.</span></h2></div><Link href="/blog" className="journal-text-link">The full archive <ArrowUpRight size={16} /></Link></div><div className="archive-grid">{relatedPosts.map((related) => <BlogCard key={related.slug} post={related} />)}</div></section>}
  </div>;
}
