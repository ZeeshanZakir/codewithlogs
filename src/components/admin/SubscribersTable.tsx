"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  deleteSubscriberAction,
  deleteSubscribersBulkAction,
  updateSubscriberAction,
} from "@/app/(admin)/admin/actions";
import type { AdminSubscriber } from "@/lib/admin";

type SubscribersTableProps = {
  subscribers: AdminSubscriber[];
};

export function SubscribersTable({ subscribers }: SubscribersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingSubscriber, setEditingSubscriber] = useState<AdminSubscriber | null>(null);
  const [email, setEmail] = useState("");
  const [blogUpdates, setBlogUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const homepageCount = useMemo(
    () => subscribers.filter((subscriber) => subscriber.source === "homepage").length,
    [subscribers],
  );

  function toggleSelectAll() {
    if (selectedIds.size === subscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(subscribers.map((subscriber) => subscriber.id)));
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setSelectedIds(next);
  }

  function openEditModal(subscriber: AdminSubscriber) {
    setEditingSubscriber(subscriber);
    setEmail(subscriber.email);
    setBlogUpdates(subscriber.blogUpdates);
    setPromotions(subscriber.promotions);
    setErrorMessage("");
  }

  function closeEditModal() {
    setEditingSubscriber(null);
    setErrorMessage("");
  }

  function deleteSubscriber(id: string) {
    if (!window.confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }

    startTransition(async () => {
      await deleteSubscriberAction(id);
      setSelectedIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      router.refresh();
    });
  }

  function deleteSelected() {
    if (selectedIds.size === 0) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} subscribers?`)) {
      return;
    }

    startTransition(async () => {
      await deleteSubscribersBulkAction(Array.from(selectedIds));
      setSelectedIds(new Set());
      router.refresh();
    });
  }

  function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingSubscriber) {
      return;
    }

    startTransition(async () => {
      try {
        await updateSubscriberAction({
          id: editingSubscriber.id,
          email,
          blogUpdates,
          promotions,
        });
        closeEditModal();
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to update subscriber right now.",
        );
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/60">
          Total subscribers: <span className="font-semibold text-white">{subscribers.length}</span>
          {" · "}
          Homepage: <span className="font-semibold text-emerald-200">{homepageCount}</span>
        </p>

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">{selectedIds.size} selected</span>
            <button
              type="button"
              disabled={isPending}
              onClick={deleteSelected}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-white/45">
              <tr>
                <th className="w-10 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={subscribers.length > 0 && selectedIds.size === subscribers.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-white/10 bg-[#0b1020] text-primary focus:ring-0 focus:ring-offset-0"
                  />
                </th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Preferences</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {subscribers.length ? (
                subscribers.map((subscriber) => {
                  const preferences = [
                    subscriber.blogUpdates ? "Blogs" : null,
                    subscriber.promotions ? "Promotions" : null,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr
                      key={subscriber.id}
                      className={selectedIds.has(subscriber.id) ? "bg-primary/5" : ""}
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(subscriber.id)}
                          onChange={() => toggleSelect(subscriber.id)}
                          className="h-4 w-4 rounded border-white/10 bg-[#0b1020] text-primary focus:ring-0 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-white">
                        {subscriber.email}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/70">{preferences}</td>
                      <td className="px-5 py-4 text-sm capitalize text-white/70">
                        {subscriber.source}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/70">
                        {format(new Date(subscriber.subscribedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-3 text-sm">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => openEditModal(subscriber)}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-white/75"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => deleteSubscriber(subscriber.id)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-3 py-1.5 text-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-6 text-sm text-white/60">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingSubscriber ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Edit Subscriber</h2>
                <p className="mt-2 text-sm text-white/60">
                  Update the subscriber email and notification preferences.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={blogUpdates}
                  onChange={(event) => setBlogUpdates(event.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-[#0b1020] text-primary focus:ring-0 focus:ring-offset-0"
                />
                Blog updates
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={promotions}
                  onChange={(event) => setPromotions(event.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-[#0b1020] text-primary focus:ring-0 focus:ring-offset-0"
                />
                Promotions
              </label>

              {errorMessage ? <p className="text-sm text-red-300">{errorMessage}</p> : null}

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
