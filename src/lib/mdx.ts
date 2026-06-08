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

function mapPost(doc: any): BlogPost {
  return {
    slug: doc.slug,
    title: doc.title,
    date:
      doc.publishedAt?.toISOString() ||
      doc.createdAt?.toISOString() ||
      new Date().toISOString(),
    scheduledAt: doc.scheduledAt?.toISOString(),
    category: doc.category,
    excerpt: doc.excerpt,
    coverImage: doc.coverImage,
    author: doc.author,
    readTime: doc.readTime,
    featured: doc.featured ?? false,
    affiliateLinks: doc.affiliateLinks ?? [],
    status: doc.status,
    tags: doc.tags ?? [],
    content: doc.content,
    headings: doc.headings ?? [],
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