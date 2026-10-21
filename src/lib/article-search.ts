import "server-only";

import dbConnect from "@/lib/mongodb";
import { BlogPost } from "@/lib/blog-post";

export async function searchPublicArticleSlugs(query: string): Promise<string[]> {
  const terms = query.trim().split(/\s+/).filter(Boolean).slice(0, 12);
  if (!terms.length) return [];
  await dbConnect();
  const expressions = terms.map((term) => {
    const metacharacters = ".*+?^$()[]{}|" + String.fromCharCode(92);
    const literal = Array.from(term, (character) => metacharacters.includes(character) ? String.fromCharCode(92) + character : character).join("");
    return { $or: ["title", "excerpt", "content", "category", "tags"].map((field) => ({ [field]: { $regex: literal, $options: "i" } })) };
  });
  const documents = await BlogPost.find({
    $or: [{ status: "published" }, { status: "scheduled", scheduledAt: { $lte: new Date() } }],
    $and: expressions,
  }).select({ slug: 1, _id: 0 }).lean();
  return documents.map((document) => document.slug);
}
