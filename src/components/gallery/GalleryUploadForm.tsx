"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageUp, LoaderCircle, Upload, X } from "lucide-react";

import { GalleryToast } from "@/components/gallery/GalleryToast";
import { cn } from "@/lib/utils";

type LocalImageFile = {
  id: string;
  file: File;
  previewUrl: string;
};

type ToastState =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

function createLocalImageFile(file: File) {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export function GalleryUploadForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<LocalImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    return () => {
      for (const item of files) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
  }, [files]);

  const canSubmit = useMemo(() => {
    return Boolean(title.trim()) && files.length > 0 && !isSubmitting;
  }, [files.length, isSubmitting, title]);

  function appendFiles(nextFiles: FileList | File[]) {
    const imageFiles = Array.from(nextFiles).filter((file) => file.type.startsWith("image/"));

    if (!imageFiles.length) {
      setToast({
        type: "error",
        message: "Please select image files only.",
      });
      return;
    }

    setFiles((current) => [...current, ...imageFiles.map(createLocalImageFile)]);
  }

  function removeFile(id: string) {
    setFiles((current) => {
      const fileToRemove = current.find((item) => item.id === id);

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  }

  function resetForm() {
    for (const item of files) {
      URL.revokeObjectURL(item.previewUrl);
    }

    setTitle("");
    setDescription("");
    setFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setToast({
        type: "error",
        message: "Title is required.",
      });
      return;
    }

    if (!files.length) {
      setToast({
        type: "error",
        message: "Add at least one image before publishing.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setToast(null);

      const uploadFormData = new FormData();

      for (const item of files) {
        uploadFormData.append("files", item.file);
      }

      const uploadResponse = await fetch("/api/gallery/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadPayload = (await uploadResponse.json()) as {
        error?: string;
        urls?: string[];
      };

      if (!uploadResponse.ok || !uploadPayload.urls?.length) {
        throw new Error(uploadPayload.error ?? "Unable to upload images.");
      }

      const createResponse = await fetch("/api/gallery/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          images: uploadPayload.urls,
        }),
      });

      const createPayload = (await createResponse.json()) as { error?: string; message?: string };

      if (!createResponse.ok) {
        throw new Error(createPayload.error ?? "Unable to publish gallery pin.");
      }

      resetForm();
      setToast({
        type: "success",
        message: createPayload.message ?? "Gallery pin published successfully.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to publish gallery pin right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {toast ? (
        <GalleryToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                appendFiles(event.dataTransfer.files);
              }}
              className={cn(
                "rounded-[28px] border border-dashed bg-[#f5f7fb] p-8 transition-colors",
                isDragging ? "border-primary/40 bg-primary/5" : "border-black/10",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) {
                    appendFiles(event.target.files);
                  }
                }}
              />

              <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <Upload className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-medium text-slate-900">
                    Choose a file or drag and drop it here
                  </p>
                  <p className="text-sm text-slate-500">
                    Upload multiple images for one gallery pin. First image becomes the cover.
                  </p>
                </div>
              </div>
            </div>

            {files.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {files.map((item) => (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-[20px] border border-black/8 bg-[#f5f7fb]"
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(item.id)}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="px-3 py-2 text-xs text-slate-600">
                      {item.file.name.length > 24
                        ? `${item.file.name.slice(0, 24)}...`
                        : item.file.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="border-t border-black/8" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Add a title"
                className="h-12 w-full rounded-2xl border border-black/8 bg-[#f5f7fb] px-4 text-sm text-slate-900 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a detailed description"
                rows={10}
                className="w-full rounded-2xl border border-black/8 bg-[#f5f7fb] px-4 py-3 text-sm text-slate-900 outline-none transition-shadow focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="rounded-2xl border border-black/8 bg-[#f5f7fb] p-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <ImageUp className="mt-0.5 h-5 w-5 text-primary" />
                <div className="space-y-2">
                  <p className="font-medium text-slate-900">Upload Notes</p>
                  <p>
                    This route uploads images to Vercel Blob. Keep `BLOB_READ_WRITE_TOKEN`
                    configured in production for gallery uploads to work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Publishing..." : "Publish to Gallery"}
          </button>
        </div>
      </form>
    </>
  );
}
