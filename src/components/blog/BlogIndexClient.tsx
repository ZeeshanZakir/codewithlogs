"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { BlogPostMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

import { BlogCard } from "./BlogCard";

const POSTS_PER_PAGE = 9;

type BlogIndexClientProps = {
  posts: BlogPostMeta[];
  categories: string[];
};

export function BlogIndexClient({
  posts,
  categories,
}: BlogIndexClientProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const searchable = `${post.title} ${post.excerpt}`.toLowerCase();
      const matchesQuery = searchable.includes(query.trim().toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [posts, query, selectedCategory]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setSelectedCategory(category);
              setPage(1);
            }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              selectedCategory === category
                ? "border-primary bg-primary text-white"
                : "border-black/8 bg-white text-text/70 hover:border-primary/20 hover:text-primary",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text/45" />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search posts by title or excerpt"
          className="h-14 w-full rounded-[12px] border border-black/8 bg-white pl-11 pr-4 text-sm text-text outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
        />
      </label>

      {paginatedPosts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-[12px] border border-dashed border-black/10 bg-white px-6 py-12 text-center text-text/60">
          No posts match your current filter or search.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-text/60">
          Showing {paginatedPosts.length} of {filteredPosts.length} matching posts
        </p>

        <div className="flex items-center gap-2">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={cn(
                  "h-10 min-w-10 rounded-full border px-4 text-sm font-medium transition-colors",
                  pageNumber === currentPage
                    ? "border-primary bg-primary text-white"
                    : "border-black/8 bg-white text-text/70 hover:border-primary/20 hover:text-primary",
                )}
              >
                {pageNumber}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
