import "server-only";

import { cache } from "react";

import dbConnect from "@/lib/mongodb";
import { BlogPost as BlogPostModel } from "@/lib/blog-post";

export type AffiliateLink = {
  label: string;
  url: string;
  disclosure: string;
};

export type BlogPostStatus = "draft" | "published" | "scheduled";

export type BlogPostFrontmatter = {
  title: string;
  date: string;
  scheduledAt?: string;
  category: string;
  excerpt: string;
  coverImage: string;
  author: string;
  readTime: string;
  featured: boolean;
  affiliateLinks: AffiliateLink[];
  status: BlogPostStatus;
  tags: string[];
};

export type BlogPostMeta = BlogPostFrontmatter & {
  slug: string;
};

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  headings: TocHeading[];
};

function isPastScheduledPublishTime(scheduledAt?: Date | null) {
  return Boolean(scheduledAt && scheduledAt.getTime() <= Date.now());
}

function getEffectiveStatus(doc: { status: BlogPostStatus; scheduledAt?: Date | null }) {
  if (doc.status === "scheduled" && isPastScheduledPublishTime(doc.scheduledAt)) {
    return "published" as const;
  }

  return doc.status;
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = content.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = /^(##|###)\s+(.*)$/.exec(line.trim());

    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\[(.*?)\]\(.*?\)/g, "$1").trim();

    headings.push({
      id: slugifyHeading(text),
      text,
      level,
    });
  }

  return headings;
}

function publicFilter() {
  return {
    $or: [
      { status: "published" as const },
      {
        status: "scheduled" as const,
        scheduledAt: { $lte: new Date() },
      },
    ],
  };
}

function normalizeCoverImageUrl(value?: string) {
  if (!value) {
    return "/images/blog/default-cover.svg";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
    return value;
  }

  return `/images/blog/${value}`;
}

function mapPost(doc: any): BlogPost {
  const effectiveStatus = getEffectiveStatus(doc);
  const effectiveDate =
    doc.publishedAt?.toISOString() ||
    (effectiveStatus === "published" ? doc.scheduledAt?.toISOString() : undefined) ||
    doc.createdAt?.toISOString() ||
    new Date().toISOString();

  return {
    slug: doc.slug,
    title: doc.title,
    date: effectiveDate,
    scheduledAt: doc.scheduledAt?.toISOString(),
    category: doc.category,
    excerpt: doc.excerpt,
    coverImage: normalizeCoverImageUrl(doc.coverImage),
    author: doc.author,
    readTime: doc.readTime,
    featured: doc.featured ?? false,
    affiliateLinks: doc.affiliateLinks ?? [],
    status: effectiveStatus,
    tags: doc.tags ?? [],
    content: doc.content,
    headings: extractHeadings(doc.content ?? ""),
  };
}

export const getAllPosts = cache(
  async (includeDrafts = false): Promise<BlogPostMeta[]> => {
    await dbConnect();

    const filter: any = includeDrafts
  ? {}
  : publicFilter();

const docs = await BlogPostModel.find(filter)
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .lean();

    return docs.map((doc: any) => {
      const post = mapPost(doc);

      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        scheduledAt: post.scheduledAt,
        category: post.category,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        author: post.author,
        readTime: post.readTime,
        featured: post.featured,
        affiliateLinks: post.affiliateLinks,
        status: post.status,
        tags: post.tags,
      };
    });
  }
);

export const getPostBySlug = cache(
  async (
    slug: string,
    includeDrafts = false
  ): Promise<BlogPost | null> => {
    await dbConnect();

    const filter: any = includeDrafts
  ? { slug }
  : {
      slug,
      ...publicFilter(),
    };

const doc = await BlogPostModel.findOne(filter).lean();

    if (!doc) return null;

    return mapPost(doc);
  }
);

export async function getPostsByCategory(
  category: string,
  includeDrafts = false
) {
  const posts = await getAllPosts(includeDrafts);

  return posts.filter(
    (post) =>
      post.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getFeaturedPosts(
  limit = 3,
  includeDrafts = false
) {
  const posts = await getAllPosts(includeDrafts);

  const featured = posts.filter((post) => post.featured);

  return (featured.length ? featured : posts).slice(0, limit);
}

export async function getRelatedPosts(
  category: string,
  currentSlug: string,
  limit = 3,
  includeDrafts = false
) {
  const posts = await getPostsByCategory(
    category,
    includeDrafts
  );

  return posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit);
}

export async function getPostCount(includeDrafts = false) {
  const posts = await getAllPosts(includeDrafts);
  return posts.length;
}

export function getBlogPostPath() {
  return "";
}
