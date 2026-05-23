import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays, ChevronRight, Clock3 } from "lucide-react";

import { auth } from "@/auth";
import { AdUnit } from "@/components/ads/AdUnit";
import { BlogCard } from "@/components/blog/BlogCard";
import { MDXRenderer } from "@/components/blog/MDXRenderer";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { TableOfContents } from "@/components/blog/TableOfContents";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/mdx";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function getAuthorInitials(author: string) {
  return author
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function getAugmentedRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3,
  includeDrafts = false,
) {
  const sameCategory = await getRelatedPosts(
    category,
    currentSlug,
    limit,
    includeDrafts,
  );

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  const allPosts = await getAllPosts(includeDrafts);
  const fallback = allPosts.filter(
    (post) =>
      post.slug !== currentSlug &&
      !sameCategory.some((related) => related.slug === post.slug),
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const session = await auth();
  const post = await getPostBySlug(slug, Boolean(session?.user));

  if (!post) {
    notFound();
  }

  const relatedPosts = await getAugmentedRelatedPosts(
    post.slug,
    post.category,
    3,
    Boolean(session?.user),
  );
  const shareUrl = `${siteUrl}/blog/${post.slug}`;
  const primaryAffiliate = post.affiliateLinks[0];

  return (
    <div className="bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)] lg:px-8 lg:py-16">
        <article className="min-w-0 space-y-10">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-text/55">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-primary">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>{post.category}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-text/75">{post.title}</span>
          </nav>

          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {post.category}
            </span>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-text/70 sm:text-lg">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 rounded-[12px] border border-black/6 bg-white p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {getAuthorInitials(post.author)}
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-text">{post.author}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text/60">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-text/60">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-black/6 bg-white p-4">
            <AdUnit slot="article-top" format="horizontal" />
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] border border-black/6 bg-surface">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority
            />
          </div>

          <div className="rounded-[12px] border border-black/6 bg-white p-6 sm:p-8 lg:p-10">
            <MDXRenderer source={post.content} />
          </div>

          <div className="rounded-[12px] border border-black/6 bg-white p-4">
            <AdUnit slot="article-mid" format="auto" />
          </div>

          <section className="rounded-[12px] border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-2xl font-semibold tracking-tight text-text">Conclusion</h2>
            <p className="mt-4 text-base leading-8 text-text/75">
              The key takeaway from this guide is that strong implementation comes from clarity,
              not complexity. Focus on shipping a clean version of the core idea, keep your
              architecture understandable, and build around the user outcome that matters most.
            </p>
          </section>

          <section className="rounded-[12px] bg-primary p-6 text-white sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Need help building this?
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              I offer full-stack development services for startups and product teams.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-white/80">
              If you want a faster path from idea to shipped product, I can help with architecture,
              frontend systems, backend APIs, and launch-ready builds.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary"
            >
              View Services
            </Link>
          </section>

          <div className="rounded-[12px] border border-black/6 bg-white p-4">
            <AdUnit slot="article-end" format="rectangle" />
          </div>

          <section className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-text">Share this post</h2>
            <ShareButtons title={post.title} url={shareUrl} />
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-text">Related posts</h2>
              <p className="text-base leading-8 text-text/70">
                More practical reading from the blog to keep your momentum going.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {post.headings.length > 0 ? (
              <TableOfContents headings={post.headings} />
            ) : null}

            <div className="rounded-[12px] border border-black/6 bg-white p-4">
              <AdUnit slot="sidebar" format="rectangle" />
            </div>

            {primaryAffiliate ? (
              <div className="rounded-[12px] border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Recommended Tool
                </p>
                <h2 className="mt-3 text-xl font-semibold text-text">
                  {primaryAffiliate.label}
                </h2>
                <p className="mt-3 text-sm leading-7 text-text/70">
                  A tool mentioned in this article that fits the workflow and stack being discussed.
                </p>
                <Link
                  href={primaryAffiliate.url}
                  className="mt-4 inline-flex text-sm font-semibold text-primary"
                >
                  Get started →
                </Link>
                <p className="mt-3 text-xs leading-6 text-text/55">
                  {primaryAffiliate.disclosure}
                </p>
              </div>
            ) : null}

            <div className="rounded-[12px] border border-black/6 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text/55">
                Hire Me
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-text">
                Need a developer? Let&apos;s work together.
              </h2>
              <p className="mt-3 text-sm leading-7 text-text/70">
                I build fast web apps, SaaS products, admin dashboards, and backend systems for
                founders and small teams.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
