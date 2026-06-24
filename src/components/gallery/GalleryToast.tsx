"use client";

import { CheckCircle2, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

type GalleryToastProps = {
  type: "success" | "error";
  message: string;
  onClose(): void;
};

export function GalleryToast({ type, message, onClose }: GalleryToastProps) {
  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-[90] flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl",
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900",
      )}
    >
      <div className="mt-0.5 shrink-0">
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <TriangleAlert className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
