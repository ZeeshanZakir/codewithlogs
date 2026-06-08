"use server";

import readingTime from "reading-time";
import { BlogPost } from "@/lib/blog-post";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { ContactMessage } from "@/lib/contact-message";
import { getPostBySlug, type BlogPostStatus } from "@/lib/mdx";
import dbConnect from "@/lib/mongodb";

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
  excerpt: z.string().trim().min(10).max(500),
  coverImage: z.string().trim().min(1),
  author: z.string().trim().min(1),
  featured: z.boolean(),
  status: z.enum(["draft", "published", "scheduled"]),
  scheduledAt: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  content: z.string().trim().min(50),
  affiliateLinks: z.array(affiliateLinkSchema).default([]),
}).superRefine((input, ctx) => {
  if (input.status === "scheduled" && !input.scheduledAt?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["scheduledAt"],
      message: "Scheduled posts require a schedule date.",
    });
  }
});

export type PostSaveInput = z.infer<typeof postSaveSchema>;

async function ensureAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  return session;
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+=,[\]{}|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-");
}

function extractHeadings(content: string) {
  const headings: {
  id: string;
  text: string;
  level: number;
}[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = /^(##|###)\s+(.*)$/.exec(line.trim());

    if (!match) continue;

    headings.push({
      id: slugifyHeading(match[2]),
      text: match[2],
      level: match[1].length,
    });
  }

  return headings;
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

  const data = parsed.data;

  await dbConnect();

  const existing = await BlogPost.findOne({
    slug: data.originalSlug ?? data.slug,
  });

  const scheduledAt = data.scheduledAt
    ? new Date(data.scheduledAt)
    : null;

    if (scheduledAt && Number.isNaN(scheduledAt.getTime())) {
  throw new Error("Invalid schedule date.");
}

  const publishedAt =
    data.status === "published"
      ? new Date()
      : data.status === "scheduled"
      ? scheduledAt
      : existing?.publishedAt ?? null;

      let coverImage = data.coverImage.trim();

if (
  !coverImage.startsWith("http://") &&
  !coverImage.startsWith("https://") &&
  !coverImage.startsWith("/")
) {
  coverImage = `/images/blog/${coverImage}`;
}

  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage,
    author: data.author,
    category: data.category,
    tags: data.tags,
    featured: data.featured,
    status: data.status,
    scheduledAt,
    publishedAt,
    readTime: readingTime(data.content).text,
    headings: extractHeadings(data.content),
    affiliateLinks: data.affiliateLinks,
  };

  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
  } else {
    await BlogPost.create(payload);
  }
  const slugTaken = await BlogPost.findOne({
  slug: data.slug,
  ...(existing ? { _id: { $ne: existing._id } } : {}),
});

if (slugTaken) {
  throw new Error("A post with this slug already exists.");
}

  revalidatePostRoutes(data.slug);

  return {
    slug: data.slug,
    status: data.status,
  };
}

export async function deletePostAction(slug: string) {
  await ensureAdmin();

  await dbConnect();

  await BlogPost.deleteOne({
    slug,
  });

  revalidatePostRoutes(slug);
}

export async function togglePostStatusAction(slug: string) {
  await ensureAdmin();

  await dbConnect();

  const post = await BlogPost.findOne({ slug });

  if (!post) {
    throw new Error("Post not found.");
  }

  post.status =
    post.status === "published"
      ? "draft"
      : "published";

  if (post.status === "published") {
    post.publishedAt = new Date();
  }

  await post.save();

  revalidatePostRoutes(slug);
}

export async function markMessageAsReadAction(id: string) {
  await ensureAdmin();
  await dbConnect();
  await ContactMessage.findByIdAndUpdate(id, { status: "read" }).exec();
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/contact-messages");
}

export async function deleteMessageAction(id: string) {
  await ensureAdmin();
  await dbConnect();
  await ContactMessage.findByIdAndDelete(id).exec();
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/contact-messages");
}

export async function deleteMessagesBulkAction(ids: string[]) {
  await ensureAdmin();
  await dbConnect();
  await ContactMessage.deleteMany({ _id: { $in: ids } }).exec();
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/contact-messages");
}
