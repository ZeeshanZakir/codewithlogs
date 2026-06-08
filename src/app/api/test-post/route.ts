import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import { BlogPost } from "@/lib/blog-post";

export async function GET() {
  await dbConnect();

  const post = await BlogPost.create({
    title: "Test Post",
    slug: "test-post",
    excerpt: "Testing MongoDB",
    content: "# Hello World",
    coverImage: "/test.jpg",
    author: "Admin",
    category: "Test",
    status: "published",
    readTime: "1 min read",
  });

  return NextResponse.json(post);
}