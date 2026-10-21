"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/mdx";
import { getTroubleshootingTopic, isTopicId, matchesArticleSearch, troubleshootingTopics } from "@/lib/troubleshooting";
import { BlogCard } from "./BlogCard";

const POSTS_PER_PAGE = 9;
export function BlogIndexClient({ posts }: { posts: BlogPostMeta[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const candidate = searchParams.get("topic") ?? "all";
  const initialTopic = isTopicId(candidate) ? candidate : "all";
  return <ArticleArchive key={JSON.stringify([initialQuery, initialTopic])} initialQuery={initialQuery} initialTopic={initialTopic} posts={posts} />;
}
function ArticleArchive({ posts, initialQuery, initialTopic }: { posts: BlogPostMeta[]; initialQuery: string; initialTopic: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [page, setPage] = useState(1);
  const [remoteResult, setRemoteResult] = useState<{ query: string; slugs: string[] } | null>(null);
  const [failedQuery, setFailedQuery] = useState<string | null>(null);
  useEffect(() => {
    if (!query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/search?q=" + encodeURIComponent(query), { signal: controller.signal });
        if (!response.ok) throw new Error("Search unavailable");
        const payload = await response.json() as { slugs: string[] };
        if (!controller.signal.aborted) { setRemoteResult({ query, slugs: payload.slugs }); setFailedQuery(null); }
      } catch {
        if (!controller.signal.aborted) setFailedQuery(query);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  const isSearching = Boolean(query.trim()) && remoteResult?.query !== query && failedQuery !== query;
  const filteredPosts = useMemo(() => posts.filter((post) =>
    (selectedTopic === "all" || getTroubleshootingTopic(post) === selectedTopic) && (remoteResult?.query === query ? remoteResult.slugs.includes(post.slug) : matchesArticleSearch(post, query))
  ), [posts, query, selectedTopic, remoteResult]);
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  function resetFilters() { setQuery(""); setSelectedTopic("all"); setPage(1); }
  return (
    <div className="article-archive">
      <div className="archive-toolbar">
        <div className="category-filters" role="group" aria-label="Filter guides by specialist topic">
          {[{ id: "all", shortTitle: "Full archive" }, ...troubleshootingTopics].map((topic) => <button key={topic.id} type="button" aria-pressed={selectedTopic === topic.id} onClick={() => { setSelectedTopic(topic.id); setPage(1); }}>{topic.shortTitle}</button>)}
        </div>
        <label className="archive-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search guides by error message or tool</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Error, tool, or keyword…" maxLength={160} /></label>
      </div>
      <div className="archive-status"><p role="status" aria-live="polite">{isSearching ? "Searching article text…" : `${filteredPosts.length} ${filteredPosts.length === 1 ? "article" : "articles"}${query ? ` matching “${query}”` : ""}`}</p>{(query || selectedTopic !== "all") && <button type="button" onClick={resetFilters}>Clear filters <X size={14} /></button>}</div>
      {failedQuery === query && <p role="alert" className="search-failure">Full article search is unavailable. Showing matches from titles and summaries.</p>}
      {isSearching ? <div className="journal-empty" role="status">Looking through article text…</div> : paginatedPosts.length ? <div className="archive-grid">{paginatedPosts.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="journal-empty"><h2>No matching articles.</h2><p>Try fewer words or another tool name, or clear the filters to browse the full archive.</p><button type="button" onClick={resetFilters} className="journal-button">Browse the full archive</button><p><Link href="/contact">Suggest an error to investigate</Link></p></div>}
      {pageCount > 1 && <nav className="archive-pagination" aria-label="Article pages"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button></nav>}
    </div>
  );
}
