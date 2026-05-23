import Link from "next/link";
import { format } from "date-fns";

import { deletePostAction } from "@/app/(admin)/admin/actions";
import { getContactMessages, getDashboardMetrics, getRecentPosts } from "@/lib/admin";

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
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{metrics[key]}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
            <Link href="/admin/manage-posts" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-white/45">
                <tr>
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentPosts.map((post) => (
                  <tr key={post.slug}>
                    <td className="px-5 py-4 text-sm font-medium text-white">
                      {post.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-white/70">{post.category}</td>
                    <td className="px-5 py-4 text-sm capitalize text-white/70">
                      {post.status}
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
                        <form action={deletePostAction.bind(null, post.slug)}>
                          <button
                            type="submit"
                            className="rounded-full border border-red-500/30 px-3 py-1.5 text-red-200"
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

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Recent Contact Submissions</h2>
            <Link href="/admin/contact-messages" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-white/45">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {recentMessages.map((message) => (
                  <tr key={message.id}>
                    <td className="px-5 py-4 text-sm font-medium text-white">
                      {message.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-white/70">{message.email}</td>
                    <td className="px-5 py-4 text-sm text-white/70">{message.subject}</td>
                    <td className="px-5 py-4 text-sm text-white/70">
                      {format(new Date(message.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4 text-sm capitalize text-white/70">
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
