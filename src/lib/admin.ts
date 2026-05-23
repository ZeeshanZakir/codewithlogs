import "server-only";

import { ContactMessage } from "@/lib/contact-message";
import { getAllPosts, type BlogPostMeta } from "@/lib/mdx";
import { connectToDatabase } from "@/lib/mongodb";

export type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  budget: string;
  status: "read" | "unread";
  createdAt: string;
};

function normalizeMessage(document: {
  _id: { toString(): string };
  name: string;
  email: string;
  subject: string;
  message: string;
  budget: string;
  status: "read" | "unread";
  createdAt: Date;
}): AdminContactMessage {
  return {
    id: document._id.toString(),
    name: document.name,
    email: document.email,
    subject: document.subject,
    message: document.message,
    budget: document.budget,
    status: document.status,
    createdAt: document.createdAt.toISOString(),
  };
}

export async function getAdminPosts() {
  return getAllPosts(true);
}

export async function getDashboardMetrics() {
  const [posts, contactMessages] = await Promise.all([
    getAllPosts(true),
    getContactMessages(),
  ]);

  return {
    totalPosts: posts.length,
    publishedPosts: posts.filter((post) => post.status === "published").length,
    draftPosts: posts.filter((post) => post.status === "draft").length,
    contactMessages: contactMessages.length,
  };
}

export async function getContactMessages(limit?: number) {
  await connectToDatabase();

  const query = ContactMessage.find().sort({ createdAt: -1 });

  if (typeof limit === "number") {
    query.limit(limit);
  }

  const messages = await query.lean();

  return messages.map((message) =>
    normalizeMessage(message as Parameters<typeof normalizeMessage>[0]),
  );
}

export async function getRecentPosts(limit = 5): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts(true);
  return posts.slice(0, limit);
}
