import Link from "next/link";

import { SubscribersTable } from "@/components/admin/SubscribersTable";
import { getSubscribers } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/45">Subscribers</p>
          <p className="mt-3 text-3xl font-semibold text-white">{subscribers.length}</p>
          <p className="mt-2 text-sm text-white/60">
            People who subscribed for blog updates and promotions.
          </p>
        </div>

        <Link
          href="/api/admin/subscribers/export"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Export CSV
        </Link>
      </section>

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
