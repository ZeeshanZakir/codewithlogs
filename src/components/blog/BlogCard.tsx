import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostMeta } from "@/lib/mdx";
import { getTopicTitle, getVerification } from "@/lib/troubleshooting";

type BlogCardProps = { post: BlogPostMeta; featured?: boolean; compact?: boolean; };
export function BlogCard({ post, featured = false, compact = false }: BlogCardProps) {
  return (
    <article className={`journal-card ${featured ? "journal-card-featured" : ""} ${compact ? "journal-card-compact" : ""}`}>
      {!compact && <Link href={`/blog/${post.slug}`} className="journal-card-image" aria-label={`Read ${post.title}`} tabIndex={-1}>
        <Image src={post.coverImage} alt={post.title} fill loading="lazy" className="object-cover" sizes={featured ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"} />
      </Link>}
      <div className="journal-card-body">
        <div className="journal-card-meta"><span>{getTopicTitle(post)}</span><span>{post.readTime}</span></div>
        <h3><Link href={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={19} aria-hidden="true" /></Link></h3>
        <p className="journal-card-excerpt">{post.excerpt}</p>
        <p className="card-review-status">{getVerification(post.slug) ? "Windows-verified" : "Windows verification pending"}</p>
        <div className="journal-card-byline"><span>{post.author}</span><span aria-hidden="true">·</span><time dateTime={post.date}>{format(new Date(post.date), "MMM d, yyyy")}</time></div>
      </div>
    </article>
  );
}
