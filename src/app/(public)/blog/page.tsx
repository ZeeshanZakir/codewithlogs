import type { Metadata } from "next";

import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { getAllPosts } from "@/lib/mdx";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";
const categories = [
  "All",
  "Next.js",
  "React",
  "MERN",
  "AI Tools",
  "Freelancing",
  "SaaS",
];

export const metadata: Metadata = {
  title: "The Developer Blog",
  description:
    "Practical posts on Next.js, React, MERN, AI tools, SaaS, and freelancing from a full-stack developer building fast web apps.",
  openGraph: {
    title: "The Developer Blog",
    description:
      "Tutorials, guides, and practical lessons on modern web development, SaaS, and developer tooling.",
    url: `${siteUrl}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="bg-background">
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Blog
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
              The Developer Blog
            </h1>
            <p className="text-base leading-8 text-text/70 sm:text-lg">
              Deep-dive tutorials, practical product notes, and real-world engineering advice
              for developers building modern web apps.
            </p>
            <div className="inline-flex rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-medium text-text/65">
              {posts.length} posts published
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <BlogIndexClient posts={posts} categories={categories} />
      </section>
    </div>
  );
}
