import Link from "next/link";
import { format } from "date-fns";

import { deletePostAction } from "@/app/(admin)/admin/actions";
import {
  getContactMessages,
  getDashboardMetrics,
  getRecentPosts,
} from "@/lib/admin";

export const dynamic = "force-dynamic";

const metricConfig = [
  { key: "totalPosts", label: "Total Posts" },
  { key: "publishedPosts", label: "Published" },
  { key: "draftPosts", label: "Draft" },
  { key: "contactMessages", label: "Contact Messages" },
] as const;

export default async function AdminDashboardPage() {
  const [metrics, recentPosts, recentMessages] = await Promise.all([
    getDashboardMetrics(),
    getRecentPosts(5),
    getContactMessages(5),
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 xl:grid-cols-4">
        {metricConfig.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics[key]}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Posts</h2>
            <Link href="/admin/manage-posts" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-white shadow-sm text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPosts.map((post) => (
                  <tr key={post.slug}>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {post.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{post.category}</td>
                    <td className="px-5 py-4 text-sm capitalize text-slate-600">
                      {post.status}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {format(new Date(post.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Link
                          href={`/admin/new-post?slug=${post.slug}`}
                          className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700"
                        >
                          Edit
                        </Link>
                        <form action={deletePostAction.bind(null, post.slug)}>
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-3 py-1.5 text-red-600"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Contact Submissions</h2>
            <Link href="/admin/contact-messages" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-white shadow-sm text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">
                      {message.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{message.email}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{message.subject}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {format(new Date(message.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4 text-sm capitalize text-slate-600">
                      {message.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
