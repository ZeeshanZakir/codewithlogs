import "server-only";

import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIRECTORY = path.join(process.cwd(), "src", "content", "blog");

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

type PartialFrontmatter = Partial<BlogPostFrontmatter>;

async function getMdxFileNames() {
  try {
    const entries = await fs.readdir(BLOG_DIRECTORY);
    return entries.filter((entry) => entry.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function fallbackExcerpt(content: string, excerpt?: string) {
  if (excerpt?.trim()) {
    return excerpt.trim();
  }

  return content.replace(/\s+/g, " ").trim().slice(0, 180);
}

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=,[\]{}|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-");
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

function normalizeFrontmatter(
  data: PartialFrontmatter,
  slug: string,
  content: string,
): BlogPostFrontmatter {
  const computedReadTime = readingTime(content).text;

  let status: BlogPostStatus = "published";
  if (data.status === "draft") {
    status = "draft";
  } else if (data.status === "scheduled") {
    status = "scheduled";
  }

  return {
    title: data.title ?? slug.replace(/-/g, " "),
    date: data.date ?? "2026-01-01",
    scheduledAt: data.scheduledAt,
    category: data.category ?? "General",
    excerpt: fallbackExcerpt(content, data.excerpt),
    coverImage: data.coverImage ?? "/images/blog/default-cover.svg",
    author: data.author ?? "Zeesh",
    readTime: data.readTime ?? computedReadTime,
    featured: data.featured ?? false,
    affiliateLinks: Array.isArray(data.affiliateLinks) ? data.affiliateLinks : [],
    status,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
  };
}

async function readPostFile(fileName: string) {
  const slug = fileName.replace(/\.mdx$/, "");
  const fullPath = path.join(BLOG_DIRECTORY, fileName);
  const source = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = normalizeFrontmatter(data as PartialFrontmatter, slug, content);

  return {
    slug,
    content,
    frontmatter,
    headings: extractHeadings(content),
  };
}

export const getAllPosts = cache(
  async (includeDrafts = false): Promise<BlogPostMeta[]> => {
    const fileNames = await getMdxFileNames();
    const posts = await Promise.all(fileNames.map(readPostFile));

    const now = new Date();

    return posts
      .map(({ slug, frontmatter }) => ({
        slug,
        ...frontmatter,
      }))
      .filter((post) => {
        if (includeDrafts) {
          return true;
        }

        if (post.status === "draft") {
          return false;
        }

        if (post.status === "scheduled" && post.scheduledAt) {
          return new Date(post.scheduledAt) <= now;
        }

        return post.status === "published";
      })
      .sort(
        (left, right) =>
          new Date(right.date).getTime() - new Date(left.date).getTime(),
      );
  },
);

export const getPostBySlug = cache(
  async (slug: string, includeDrafts = false): Promise<BlogPost | null> => {
    const fileNames = await getMdxFileNames();
    const fileName = fileNames.find((entry) => entry === `${slug}.mdx`);

    if (!fileName) {
      return null;
    }

    const post = await readPostFile(fileName);

    if (!includeDrafts) {
      if (post.frontmatter.status === "draft") {
        return null;
      }

      if (
        post.frontmatter.status === "scheduled" &&
        post.frontmatter.scheduledAt &&
        new Date(post.frontmatter.scheduledAt) > new Date()
      ) {
        return null;
      }
    }

    return {
      slug: post.slug,
      content: post.content,
      headings: post.headings,
      ...post.frontmatter,
    };
  },
);

export async function getPostsByCategory(category: string, includeDrafts = false) {
  const posts = await getAllPosts(includeDrafts);
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  );
}

export async function getFeaturedPosts(limit = 3, includeDrafts = false) {
  const posts = await getAllPosts(includeDrafts);
  const featured = posts.filter((post) => post.featured);
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}

export async function getRelatedPosts(
  category: string,
  currentSlug: string,
  limit = 3,
  includeDrafts = false,
) {
  const posts = await getPostsByCategory(category, includeDrafts);
  return posts.filter((post) => post.slug !== currentSlug).slice(0, limit);
}

export async function getPostCount(includeDrafts = false) {
  const posts = await getAllPosts(includeDrafts);
  return posts.length;
}

export function getBlogPostPath(slug: string) {
  return path.join(BLOG_DIRECTORY, `${slug}.mdx`);
}
