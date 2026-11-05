"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/mdx";
import { getTroubleshootingTopic, isTopicId, matchesArticleSearch, troubleshootingTopics } from "@/lib/troubleshooting";
import { getInsightCategory, insightCategories, isInsightCategoryId } from "@/lib/insights";
import { BlogCard } from "./BlogCard";
import { POSTS_PER_PAGE, archivePagePath } from "@/lib/blog-pagination";

type Initial = { query: string; category: string; topic: string };

export function BlogIndexClient({ posts, initialPage = 1 }: { posts: BlogPostMeta[]; initialPage?: number }) {
  return <Suspense fallback={<ArticleArchive posts={posts} initialPage={initialPage} initial={{ query: "", category: "all", topic: "all" }} />}>
    <SearchAwareArchive posts={posts} initialPage={initialPage} />
  </Suspense>;
}

function SearchAwareArchive({ posts, initialPage }: { posts: BlogPostMeta[]; initialPage: number }) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const topicParam = params.get("topic") ?? "all";
  const topic = isTopicId(topicParam) ? topicParam : "all";
  const categoryParam = params.get("category") ?? "all";
  // Old ?topic= links keep working: a topic implies the troubleshooting category.
  const category = topic !== "all" ? "development-troubleshooting" : isInsightCategoryId(categoryParam) ? categoryParam : "all";
  const initial = { query, category, topic };
  return <ArticleArchive key={JSON.stringify([initial, initialPage])} posts={posts} initialPage={initialPage} initial={initial} />;
}

function ArticleArchive({ posts, initial, initialPage }: { posts: BlogPostMeta[]; initial: Initial; initialPage: number }) {
  const [query, setQuery] = useState(initial.query);
  const [category, setCategory] = useState(initial.category);
  const [topic, setTopic] = useState(initial.topic);
  const [page, setPage] = useState(initialPage);
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

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const post of posts) {
      const id = getInsightCategory(post);
      result[id] = (result[id] ?? 0) + 1;
    }
    return result;
  }, [posts]);

  const isSearching = Boolean(query.trim()) && remoteResult?.query !== query && failedQuery !== query;
  const filteredPosts = useMemo(() => posts.filter((post) =>
    (category === "all" || getInsightCategory(post) === category)
    && (topic === "all" || getTroubleshootingTopic(post) === topic)
    && (remoteResult?.query === query ? remoteResult.slugs.includes(post.slug) : matchesArticleSearch(post, query))
  ), [posts, query, category, topic, remoteResult]);
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const filtered = Boolean(query) || category !== "all" || topic !== "all";
  const showTopics = category === "all" || category === "development-troubleshooting";

  function resetFilters() { setQuery(""); setCategory("all"); setTopic("all"); setPage(1); }
  function chooseCategory(id: string) { setCategory(id); setTopic("all"); setPage(1); }
  function chooseTopic(id: string) { setTopic(id); if (id !== "all") setCategory("development-troubleshooting"); setPage(1); }

  return (
    <div className="article-archive">
      <div className="archive-toolbar">
        <label className="archive-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Search articles by topic, error message or tool</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search articles, errors or tools…" maxLength={160} /></label>
      </div>
      <div className="ag-cat-row" role="group" aria-label="Filter articles by category">
        <button type="button" aria-pressed={category === "all"} onClick={() => chooseCategory("all")}>All articles <small>{posts.length}</small></button>
        {insightCategories.map((item) => {
          const count = counts[item.id] ?? 0;
          return <button key={item.id} type="button" aria-pressed={category === item.id} disabled={count === 0} onClick={() => chooseCategory(item.id)} title={count === 0 ? "Articles coming soon" : undefined}>{item.title} <small>{count === 0 ? "soon" : count}</small></button>;
        })}
      </div>
      {showTopics && (
        <div className="ag-subfilters" role="group" aria-label="Filter troubleshooting guides by topic">
          <span>Troubleshooting topics</span>
          {[{ id: "all", shortTitle: "All topics" }, ...troubleshootingTopics].map((item) => <button key={item.id} type="button" aria-pressed={topic === item.id} onClick={() => chooseTopic(item.id)}>{item.shortTitle}</button>)}
        </div>
      )}
      <div className="archive-status"><p role="status" aria-live="polite">{isSearching ? "Searching article text…" : `${filteredPosts.length} ${filteredPosts.length === 1 ? "article" : "articles"}${query ? ` matching “${query}”` : ""}`}</p>{filtered && <button type="button" onClick={resetFilters}>Clear filters <X size={14} /></button>}</div>
      {failedQuery === query && <p role="alert" className="search-failure">Full article search is unavailable. Showing matches from titles and summaries.</p>}
      {isSearching ? <div className="journal-empty" role="status">Looking through article text…</div> : paginatedPosts.length ? <div className="archive-grid">{paginatedPosts.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="journal-empty"><h2>No matching articles.</h2><p>Try fewer words or another topic, or clear the filters to browse everything.</p><button type="button" onClick={resetFilters} className="journal-button">Browse all articles</button><p><Link href="/contact">Suggest a topic</Link></p></div>}
      {pageCount > 1 && <nav className="archive-pagination" aria-label="Article pages">
        {!filtered ? <>
          {currentPage > 1 ? <Link href={archivePagePath(currentPage - 1)} prefetch={false} rel="prev">Previous</Link> : <span aria-disabled="true">Previous</span>}
          <span>Page {currentPage} of {pageCount}</span>
          {currentPage < pageCount ? <Link href={archivePagePath(currentPage + 1)} prefetch={false} rel="next">Next</Link> : <span aria-disabled="true">Next</span>}
        </> : <><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</button></>}
      </nav>}
    </div>
  );
}
