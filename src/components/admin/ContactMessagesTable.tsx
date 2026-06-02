"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { Eye, MailOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteMessageAction, deleteMessagesBulkAction, markMessageAsReadAction } from "@/app/(admin)/admin/actions";
import type { AdminContactMessage } from "@/lib/admin";

type ContactMessagesTableProps = {
  messages: AdminContactMessage[];
};

export function ContactMessagesTable({ messages }: ContactMessagesTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessage | null>(
    null,
  );

  const unreadCount = useMemo(
    () => messages.filter((message) => message.status === "unread").length,
    [messages],
  );

  function markAsRead(id: string) {
    startTransition(async () => {
      await markMessageAsReadAction(id);
      router.refresh();
    });
  }

  function deleteMessage(id: string) {
    startTransition(async () => {
      await deleteMessageAction(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      router.refresh();
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === messages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((m) => m.id)));
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

  function deleteSelected() {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} messages?`)) return;

    startTransition(async () => {
      await deleteMessagesBulkAction(Array.from(selectedIds));
      setSelectedIds(new Set());
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-white/60">
          Total messages: <span className="font-semibold text-white">{messages.length}</span>
          {" · "}
          Unread: <span className="font-semibold text-amber-200">{unreadCount}</span>
        </p>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <span className="text-sm text-white/60">
              {selectedIds.size} selected
            </span>
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
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-white/45">
              <tr>
                <th className="px-5 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={messages.length > 0 && selectedIds.size === messages.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-white/10 bg-[#0b1020] text-primary focus:ring-0 focus:ring-offset-0"
                  />
                </th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {messages.map((message) => (
                <tr
                  key={message.id}
                  className={selectedIds.has(message.id) ? "bg-primary/5" : ""}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(message.id)}
                      onChange={() => toggleSelect(message.id)}
                      className="h-4 w-4 rounded border-white/10 bg-[#0b1020] text-primary focus:ring-0 focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-white">
                    {message.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-white/70">{message.email}</td>
                  <td className="px-5 py-4 text-sm text-white/70">{message.subject}</td>
                  <td className="px-5 py-4 text-sm text-white/70">{message.budget}</td>
                  <td className="px-5 py-4 text-sm text-white/70">
                    {format(new Date(message.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        message.status === "read"
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-amber-500/15 text-amber-200"
                      }`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedMessage(message)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/75"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedMessage.subject}
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  From {selectedMessage.name} · {selectedMessage.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-[#0b1020] p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Budget</p>
                <p className="mt-2 text-sm text-white/75">{selectedMessage.budget}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Date</p>
                <p className="mt-2 text-sm text-white/75">
                  {format(new Date(selectedMessage.createdAt), "PPP")}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Status</p>
                <p className="mt-2 text-sm capitalize text-white/75">
                  {selectedMessage.status}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1020] p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
                {selectedMessage.message}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {selectedMessage.status === "unread" ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => markAsRead(selectedMessage.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/75"
                >
                  <MailOpen className="h-4 w-4" />
                  Mark as read
                </button>
              ) : null}
              <button
                type="button"
                disabled={isPending}
                onClick={() => deleteMessage(selectedMessage.id)}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
