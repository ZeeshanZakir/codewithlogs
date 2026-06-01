"use server";

import { promises as fs } from "node:fs";
import matter from "gray-matter";
import readingTime from "reading-time";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { ContactMessage } from "@/lib/contact-message";
import {
  getBlogPostPath,
  getPostBySlug,
  type AffiliateLink,
  type BlogPostStatus,
} from "@/lib/mdx";
import { connectToDatabase } from "@/lib/mongodb";

const affiliateLinkSchema = z.object({
  label: z.string().trim().min(1),
  url: z.string().trim().url(),
  disclosure: z.string().trim().min(1),
});

const postSaveSchema = z.object({
  originalSlug: z.string().trim().optional(),
  title: z.string().trim().min(3),
  slug: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(1),
  excerpt: z.string().trim().min(10).max(150),
  coverImage: z.string().trim().min(1),
  author: z.string().trim().min(1),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "scheduled"]),
  scheduledAt: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  content: z.string().trim().min(50),
  affiliateLinks: z.array(affiliateLinkSchema).default([]),
});

export type PostSaveInput = z.infer<typeof postSaveSchema>;

async function ensureAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return session;
}

function normalizeAffiliateLinks(affiliateLinks: AffiliateLink[]) {
  return affiliateLinks.filter(
    (link) => link.label.trim() && link.url.trim() && link.disclosure.trim(),
  );
}

async function removeFileIfExists(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

async function writePostFile(input: PostSaveInput) {
  const existingPost = await getPostBySlug(input.originalSlug ?? input.slug, true);
  const nextStatus: BlogPostStatus = input.status;
  const date =
    nextStatus === "published"
      ? new Date().toISOString()
      : existingPost?.date ?? new Date().toISOString();
  const readTime = readingTime(input.content).text;

  const data: Record<string, any> = {
    title: input.title,
    date,
    category: input.category,
    excerpt: input.excerpt,
    coverImage: input.coverImage,
    author: input.author,
    readTime,
    featured: input.featured,
    affiliateLinks: normalizeAffiliateLinks(input.affiliateLinks),
    status: nextStatus,
    tags: input.tags,
  };

  if (input.scheduledAt) {
    data.scheduledAt = input.scheduledAt;
  }

  const document = matter.stringify(input.content, data);

  const nextPath = getBlogPostPath(input.slug);
  await fs.writeFile(nextPath, document, "utf8");

  if (input.originalSlug && input.originalSlug !== input.slug) {
    await removeFileIfExists(getBlogPostPath(input.originalSlug));
  }

  return {
    slug: input.slug,
    status: nextStatus,
  };
}

function revalidatePostRoutes(slug: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/manage-posts");
  revalidatePath("/admin/new-post");
}

export async function savePostAction(input: PostSaveInput) {
  await ensureAdmin();
  const parsed = postSaveSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid post data.");
  }

  const result = await writePostFile(parsed.data);
  revalidatePostRoutes(result.slug);

  return {
    slug: result.slug,
    status: result.status,
  };
}

export async function deletePostAction(slug: string) {
  await ensureAdmin();
  await removeFileIfExists(getBlogPostPath(slug));
  revalidatePostRoutes(slug);
}

export async function togglePostStatusAction(slug: string) {
  await ensureAdmin();
  const post = await getPostBySlug(slug, true);

  if (!post) {
    throw new Error("Post not found.");
  }

  const nextStatus: BlogPostStatus =
    post.status === "published" ? "draft" : "published";

  await savePostAction({
    originalSlug: slug,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    author: post.author,
    featured: post.featured,
    status: nextStatus,
    tags: post.tags,
    content: post.content,
    affiliateLinks: post.affiliateLinks,
  });
}

export async function markMessageAsReadAction(id: string) {
  await ensureAdmin();
  await connectToDatabase();
  await ContactMessage.findByIdAndUpdate(id, { status: "read" }).exec();
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/contact-messages");
}

export async function deleteMessageAction(id: string) {
  await ensureAdmin();
  await connectToDatabase();
  await ContactMessage.findByIdAndDelete(id).exec();
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/contact-messages");
}
