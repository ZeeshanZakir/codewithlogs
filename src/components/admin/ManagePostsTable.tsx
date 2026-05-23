"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  deletePostAction,
  togglePostStatusAction,
} from "@/app/(admin)/admin/actions";
import type { BlogPostMeta } from "@/lib/mdx";

type ManagePostsTableProps = {
  posts: BlogPostMeta[];
};

export function ManagePostsTable({ posts }: ManagePostsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [postToDelete, setPostToDelete] = useState<BlogPostMeta | null>(null);

  const categories = useMemo(
    () => ["all", ...new Set(posts.map((post) => post.category))],
    [posts],
  );

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
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] pl-11 pr-4 text-sm text-white outline-none focus:border-primary/40"
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-12 rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-12 rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All categories" : category}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-white/45">
              <tr>
                <th className="px-5 py-4">Post</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPosts.map((post) => (
                <tr key={post.slug}>
                  <td className="px-5 py-4">
                    <div className="flex min-w-[280px] items-center gap-4">
                      <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-white/10 bg-[#0b1020]">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          loading="lazy"
                          unoptimized
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{post.title}</p>
                        <p className="text-sm text-white/45">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">{post.category}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        post.status === "published"
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-amber-500/15 text-amber-200"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">
                    {format(new Date(post.date), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-3 text-sm">
                      <Link
                        href={`/admin/new-post?slug=${post.slug}`}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-white/75"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => toggleStatus(post.slug)}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-white/75"
                      >
                        {post.status === "published" ? "Move to Draft" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostToDelete(post)}
                        className="rounded-full border border-red-500/30 px-3 py-1.5 text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {postToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-red-500/15 p-3 text-red-200">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Delete post?</h2>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  This will remove <strong>{postToDelete.title}</strong> from
                  `src/content/blog/` and cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => deletePost(postToDelete.slug)}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
