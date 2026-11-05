import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { Breadcrumbs, Eyebrow, JsonLd } from "@/components/agency/ui";
import { getAllPosts } from "@/lib/mdx";
import { POSTS_PER_PAGE, archivePagePath } from "@/lib/blog-pagination";
import { breadcrumbSchema } from "@/lib/site-config";

export async function BlogArchivePage({ page }: { page: number }) {
  const posts = await getAllPosts();
  if (page > Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))) notFound();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, ...(page > 1 ? [{ name: `Page ${page}`, path: archivePagePath(page) }] : [])];
  return <div className="ag-page">
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbSchema(crumbs)] }} />
    <section className="ag-page-hero ag-blog-hero">
      <div className="ag-container">
        <Breadcrumbs items={crumbs.map((crumb, index) => index === crumbs.length - 1 ? { name: crumb.name } : crumb)} />
        <div className="ag-page-hero-grid">
          <div>
            <Eyebrow>Blog &amp; insights</Eyebrow>
            <h1 className="ag-page-title">Insights on Building, Designing and <span className="ag-hl">Growing Online.</span></h1>
          </div>
          <p className="ag-page-intro">Practical articles on web development, design, search, marketing and AI, plus our development troubleshooting archive. Each troubleshooting guide shows the evidence status of its published version.</p>
        </div>
      </div>
    </section>
    <div className="ag-container ag-section" style={{ paddingTop: "clamp(32px, 4vw, 56px)" }}>
      <BlogIndexClient posts={posts} initialPage={page} />
      <section id="newsletter" className="ag-blog-newsletter" aria-labelledby="newsletter-title">
        <div>
          <Eyebrow>Article updates</Eyebrow>
          <h2 id="newsletter-title">Register your interest in new articles.</h2>
          <p>Leave your email and article-update preference. <Link href="/contact" className="ag-inline-link">Contact us</Link> to change your signup or request removal.</p>
        </div>
        <div>
          <NewsletterSignup />
          <p className="newsletter-privacy">Signup records your interest; automatic email delivery is not currently offered. Read our <Link href="/privacy-policy">privacy policy</Link>.</p>
        </div>
      </section>
    </div>
  </div>;
}
