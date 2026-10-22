"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { FileText, ImageOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  deletePostAction,
  togglePostStatusAction,
} from "@/app/(admin)/admin/actions";
import type { BlogPostMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

type ManagePostsTableProps = {
  posts: BlogPostMeta[];
};

const statusTabs = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "all", label: "All" },
] as const;

const statusBadgeStyles: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  scheduled: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

function PostThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          unoptimized
          className="object-cover"
          sizes="80px"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          <ImageOff className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

export function ManagePostsTable({ posts }: ManagePostsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusTabs)[number]["value"]>("published");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [postToDelete, setPostToDelete] = useState<BlogPostMeta | null>(null);

  const categories = useMemo(
    () => ["all", ...new Set(posts.map((post) => post.category))],
    [posts],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    for (const post of posts) {
      counts[post.status] = (counts[post.status] ?? 0) + 1;
    }
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search.trim() ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : post.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" ? true : post.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, posts, search, statusFilter]);

  function toggleStatus(slug: string) {
    startTransition(async () => {
      await togglePostStatusAction(slug);
      router.refresh();
    });
  }

  function deletePost(slug: string) {
    startTransition(async () => {
      await deletePostAction(slug);
      setPostToDelete(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-auto">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    isActive ? "bg-primary/10 text-primary" : "bg-slate-200/70 text-slate-500",
                  )}
                >
                  {statusCounts[tab.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href="/admin/new-post"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_200px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
        </div>

        {filteredPosts.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Post</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.slug} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex min-w-[300px] items-center gap-4">
                        <PostThumbnail src={post.coverImage} alt={post.title} />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/new-post?slug=${post.slug}`}
                            className="line-clamp-2 font-medium text-slate-900 hover:text-primary"
                          >
                            {post.title}
                          </Link>
                          <p className="mt-0.5 truncate text-xs text-slate-500">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
                          statusBadgeStyles[post.status] ?? statusBadgeStyles.draft,
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {post.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {format(new Date(post.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => toggleStatus(post.slug)}
                          className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                        >
                          {post.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <Link
                          href={`/admin/new-post?slug=${post.slug}`}
                          aria-label={`Edit ${post.title}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${post.title}`}
                          onClick={() => setPostToDelete(post)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900">No posts found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different status, category, or search term.
              </p>
            </div>
          </div>
        )}
      </div>

      {postToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-50 p-3 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Delete post?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  <strong className="text-slate-900">{postToDelete.title}</strong> will be
                  permanently removed. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => deletePost(postToDelete.slug)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                Delete post
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
