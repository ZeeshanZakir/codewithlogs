import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Clock3 } from "lucide-react";

import type { BlogPostMeta } from "@/lib/mdx";

type BlogCardProps = {
  post: BlogPostMeta;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-black/6 bg-white transition-colors hover:border-primary/20">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-surface">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </Link>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {post.category}
          </span>
          {post.featured ? (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Featured
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <Link href={`/blog/${post.slug}`} className="block">
            <h2 className="text-2xl font-semibold leading-8 text-text transition-colors hover:text-primary">
              {post.title}
            </h2>
          </Link>
          <p className="text-sm leading-7 text-text/70">{post.excerpt}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text/60">
          <span className="font-medium text-text/70">{post.author}</span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {format(new Date(post.date), "MMM d, yyyy")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          Read →
        </Link>
      </div>
    </article>
  );
}
