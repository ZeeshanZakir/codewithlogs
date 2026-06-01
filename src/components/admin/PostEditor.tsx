"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  MonitorPlay,
  Save,
  SquareTerminal,
  Star,
  Upload,
} from "lucide-react";

import { savePostAction, type PostSaveInput } from "@/app/(admin)/admin/actions";
import type { BlogPost } from "@/lib/mdx";

type PostEditorProps = {
  initialPost: BlogPost | null;
};

type EditableAffiliateLink = {
  id: string;
  label: string;
  url: string;
  disclosure: string;
};

type ToastState =
  | {
      type: "success" | "error";
      message: string;
    }
  | null;

const categories = [
  "Next.js",
  "React",
  "MERN",
  "AI Tools",
  "Freelancing",
  "SaaS",
  "Tools",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getWordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function getReadTime(value: string) {
  return `${Math.max(1, Math.ceil(getWordCount(value) / 200))} min read`;
}

function createAffiliateLink(
  value: Partial<Omit<EditableAffiliateLink, "id">> = {},
): EditableAffiliateLink {
  const cryptoObject =
    typeof globalThis !== "undefined" && "crypto" in globalThis ? globalThis.crypto : undefined;
  const randomUuid =
    typeof cryptoObject?.randomUUID === "function"
      ? cryptoObject.randomUUID.bind(cryptoObject)
      : undefined;

  return {
    id: randomUuid?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    label: value.label ?? "",
    url: value.url ?? "",
    disclosure: value.disclosure ?? "",
  };
}

function renderInline(value: string) {
  const segments = value.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*|\[.*?\]\(.*?\))/g);

  return segments.map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={index}>{segment.slice(2, -2)}</strong>;
    }

    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-[#0f172a] px-1.5 py-0.5 text-sm text-emerald-200"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={index}>{segment.slice(1, -1)}</em>;
    }

    const linkMatch = /^\[(.*?)\]\((.*?)\)$/.exec(segment);

    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline underline-offset-4"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <span key={index}>{segment}</span>;
  });
}

function PreviewPane({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let inCodeBlock = false;

  function flushParagraph() {
    if (!paragraphBuffer.length) {
      return;
    }

    const value = paragraphBuffer.join(" ").trim();

    if (value) {
      elements.push(
        <p key={`p-${elements.length}`} className="text-sm leading-7 text-white/75">
          {renderInline(value)}
        </p>,
      );
    }

    paragraphBuffer = [];
  }

  function flushCodeBlock() {
    if (!codeBuffer.length) {
      return;
    }

    elements.push(
      <pre
        key={`code-${elements.length}`}
        className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b1020] p-4 text-xs text-emerald-200"
      >
        <code>{codeBuffer.join("\n")}</code>
      </pre>,
    );

    codeBuffer = [];
  }

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      if (inCodeBlock) {
        flushCodeBlock();
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-lg font-semibold text-white">
          {line.replace(/^###\s+/, "")}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-2xl font-semibold text-white">
          {line.replace(/^##\s+/, "")}
        </h2>,
      );
      continue;
    }

    const imageMatch = /^!\[(.*?)\]\((.*?)\)$/.exec(line.trim());

    if (imageMatch) {
      flushParagraph();
      elements.push(
        <div
          key={`img-${elements.length}`}
          className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60"
        >
          Image preview: {imageMatch[1] || "Untitled"} ({imageMatch[2]})
        </div>,
      );
      continue;
    }

    if (line.trim().startsWith("<AffiliateLink")) {
      flushParagraph();
      const label = /label="(.*?)"/.exec(line)?.[1] ?? "Affiliate Tool";
      const url = /url="(.*?)"/.exec(line)?.[1] ?? "#";
      const disclosure =
        /disclosure="(.*?)"/.exec(line)?.[1] ?? "Affiliate link disclosure";

      elements.push(
        <div
          key={`affiliate-${elements.length}`}
          className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm"
        >
          <p className="font-semibold text-white">Affiliate recommendation: {label}</p>
          <p className="mt-2 text-white/70">Link: {url}</p>
          <p className="mt-2 text-xs text-white/55">{disclosure}</p>
        </div>,
      );
      continue;
    }

    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  flushCodeBlock();

  if (!elements.length) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0b1020] px-6 text-center text-sm text-white/45">
        Start writing MDX to see a live preview.
      </div>
    );
  }

  return <div className="space-y-5">{elements}</div>;
}

export function PostEditor({ initialPost }: PostEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
  const [category, setCategory] = useState(initialPost?.category ?? "Next.js");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage ?? "");
  const [author, setAuthor] = useState(initialPost?.author ?? "Zeeshan Zakir");
  const [featured, setFeatured] = useState(initialPost?.featured ?? false);
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(
    initialPost?.status ?? "draft",
  );
  const [scheduledAt, setScheduledAt] = useState(initialPost?.scheduledAt ?? "");
  const [tags, setTags] = useState(initialPost?.tags.join(", ") ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [affiliateLinks, setAffiliateLinks] = useState<EditableAffiliateLink[]>(() =>
    initialPost?.affiliateLinks.length
      ? initialPost.affiliateLinks.map((link) => createAffiliateLink(link))
      : [createAffiliateLink()],
  );

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const wordCount = useMemo(() => getWordCount(content), [content]);
  const readTime = useMemo(() => getReadTime(content), [content]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, target: "cover" | "content") {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      if (target === "cover") {
        setCoverImage(result.url);
      } else {
        insertSnippet(`![${file.name}](${result.url})`, "", "");
      }

      setToast({ type: "success", message: "Image uploaded successfully" });
    } catch (error) {
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
      // Clear input
      event.target.value = "";
    }
  }

  function updateAffiliateLink(
    id: string,
    field: "label" | "url" | "disclosure",
    value: string,
  ) {
    setAffiliateLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    );
  }

  function insertSnippet(before: string, after = "", placeholder = "text") {
    const element = textareaRef.current;

    if (!element) {
      return;
    }

    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextValue =
      content.slice(0, start) + before + selected + after + content.slice(end);

    setContent(nextValue);

    requestAnimationFrame(() => {
      element.focus();
      const cursor = start + before.length + selected.length + after.length;
      element.setSelectionRange(cursor, cursor);
    });
  }

  function handleToolbarInsert(type: string) {
    if (type === "h2") {
      insertSnippet("## ", "", "Heading");
      return;
    }

    if (type === "h3") {
      insertSnippet("### ", "", "Heading");
      return;
    }

    if (type === "bold") {
      insertSnippet("**", "**", "bold text");
      return;
    }

    if (type === "italic") {
      insertSnippet("*", "*", "italic text");
      return;
    }

    if (type === "code") {
      insertSnippet("`", "`", "code");
      return;
    }

    if (type === "code-block") {
      insertSnippet("```ts\n", "\n```", "const example = true;");
      return;
    }

    if (type === "link") {
      const url = window.prompt("Enter the link URL:", "https://");
      if (!url) return;
      insertSnippet("[", `](${url})`, "Link text");
      return;
    }

    if (type === "image") {
      const url = window.prompt("Enter the image URL:", "/images/blog/example.svg");
      if (!url) return;
      insertSnippet("![", `](${url})`, "Image alt text");
      return;
    }

    if (type === "upload") {
      fileInputRef.current?.click();
      return;
    }

    if (type === "affiliate") {
      const label = window.prompt("Tool name:", "Cursor");
      const url = window.prompt("Affiliate URL:", "https://example.com");
      const disclosure = window.prompt(
        "Disclosure text:",
        "Affiliate link - I may earn a commission at no extra cost to you.",
      );

      if (!label || !url || !disclosure) {
        return;
      }

      insertSnippet(
        `<AffiliateLink label="${label}" url="${url}" disclosure="${disclosure}" />`,
        "",
        "",
      );
      return;
    }

    if (type === "ads") {
      insertSnippet("{/* AdSense placeholder */}", "", "");
    }
  }

  async function persistPost(nextStatus: "draft" | "published" | "scheduled") {
    const payload: PostSaveInput = {
      originalSlug: initialPost?.slug ?? undefined,
      title: title.trim(),
      slug: slug.trim(),
      category,
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim() || "/images/blog/default-cover.svg",
      author: author.trim() || "Zeeshan Zakir",
      featured,
      status: nextStatus,
      scheduledAt: nextStatus === "scheduled" ? scheduledAt : undefined,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      content,
      affiliateLinks: affiliateLinks
        .filter((link) => link.label || link.url || link.disclosure)
        .map(({ label, url, disclosure }) => ({
          label,
          url,
          disclosure,
        })),
    };

    startTransition(async () => {
      try {
        const result = await savePostAction(payload);
        setStatus(result.status);
        setToast({
          type: "success",
          message:
            result.status === "published"
              ? "Post published successfully."
              : "Draft saved successfully.",
        });
        router.replace(`/admin/new-post?slug=${result.slug}`);
        router.refresh();
      } catch (error) {
        setToast({
          type: "error",
          message:
            error instanceof Error ? error.message : "Unable to save the post.",
        });
      }
    });
  }

  function openPreview() {
    if (!slug.trim()) {
      setToast({
        type: "error",
        message: "Add a title first so a slug can be generated.",
      });
      return;
    }

    window.open(`/blog/${slug}`, "_blank", "noopener,noreferrer");
  }

  const toolbarButtons = [
    { type: "h2", label: "H2", icon: Heading2 },
    { type: "h3", label: "H3", icon: Heading3 },
    { type: "bold", label: "Bold", icon: Bold },
    { type: "italic", label: "Italic", icon: Italic },
    { type: "code", label: "Code", icon: Code },
    { type: "code-block", label: "Code Block", icon: SquareTerminal },
    { type: "link", label: "Link", icon: Link2 },
    { type: "image", label: "Image URL", icon: ImageIcon },
    { type: "upload", label: "Upload Image", icon: Upload },
    { type: "affiliate", label: "Affiliate", icon: Star },
    { type: "ads", label: "AdSense", icon: MonitorPlay },
  ] as const;

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "content")}
        disabled={isUploading}
      />
      {toast ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-500/15 text-emerald-200"
              : "bg-red-500/15 text-red-200"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-white/75">Title</label>
                <input
                  value={title}
                  onChange={(event) => {
                    const nextTitle = event.target.value;
                    setTitle(nextTitle);

                    if (!slugTouched) {
                      setSlug(slugify(nextTitle));
                    }
                  }}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Slug</label>
                <input
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(slugify(event.target.value));
                  }}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Category</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
                >
                  {categories.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-white/75">Excerpt</label>
                  <span className="text-xs text-white/45">{excerpt.length}/150</span>
                </div>
                <textarea
                  value={excerpt}
                  maxLength={150}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-white/75">Cover image URL</label>
                  <label className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      disabled={isUploading}
                    />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </label>
                </div>
                <input
                  value={coverImage}
                  onChange={(event) => setCoverImage(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Author</label>
                <input
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Read time</label>
                <div className="flex h-12 items-center rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white/70">
                  {readTime}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/75">Tags</label>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="nextjs, mern, saas"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-white/75">Status</p>
                <div className="flex flex-wrap gap-3">
                  {(["draft", "published", "scheduled"] as const).map((option) => (
                    <label
                      key={option}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020] px-4 py-2 text-sm text-white/75"
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={status === option}
                        onChange={() => setStatus(option)}
                      />
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {status === "scheduled" ? (
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-medium text-white/75">Schedule for</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => setScheduledAt(event.target.value)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 text-sm text-white outline-none focus:border-primary/40 [color-scheme:dark]"
                  />
                </div>
              ) : null}

              <div className="space-y-3 lg:col-span-2">
                <label className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-white/75">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                  />
                  Featured post
                </label>
              </div>

              {coverImage ? (
                <div className="lg:col-span-2">
                  <div className="relative aspect-[16/7] overflow-hidden rounded-xl border border-white/10 bg-[#0b1020]">
                    <Image
                      src={coverImage}
                      alt="Cover preview"
                      fill
                      loading="lazy"
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 50vw"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap gap-2">
              {toolbarButtons.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToolbarInsert(type)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020] px-4 py-2 text-xs font-medium text-white/75 transition hover:border-primary/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white/75">MDX Editor</p>
                  <span className="text-xs text-white/45">{wordCount} words</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={22}
                  className="min-h-[520px] w-full rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-4 font-mono text-sm leading-7 text-white outline-none focus:border-primary/40"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-white/75">Live Preview</p>
                <div className="min-h-[520px] rounded-2xl border border-white/10 bg-[#111827] p-5">
                  <PreviewPane content={content} />
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-white/50">
              Word count: {wordCount} · Read time: {readTime}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Affiliate Links</h2>
                <p className="mt-1 text-sm text-white/55">
                  These entries are saved into the post frontmatter as `affiliateLinks`.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAffiliateLinks((current) => [
                    ...current,
                    createAffiliateLink(),
                  ])
                }
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/75"
              >
                Add Link
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {affiliateLinks.map((link) => (
                <div
                  key={link.id}
                  className="grid gap-4 rounded-xl border border-white/10 bg-[#0b1020] p-4 lg:grid-cols-3"
                >
                  <input
                    value={link.label}
                    onChange={(event) =>
                      updateAffiliateLink(link.id, "label", event.target.value)
                    }
                    placeholder="Tool label"
                    className="h-11 rounded-xl border border-white/10 bg-transparent px-3 text-sm text-white outline-none focus:border-primary/40"
                  />
                  <input
                    value={link.url}
                    onChange={(event) =>
                      updateAffiliateLink(link.id, "url", event.target.value)
                    }
                    placeholder="https://affiliate-link.com"
                    className="h-11 rounded-xl border border-white/10 bg-transparent px-3 text-sm text-white outline-none focus:border-primary/40"
                  />
                  <div className="flex gap-3">
                    <input
                      value={link.disclosure}
                      onChange={(event) =>
                        updateAffiliateLink(link.id, "disclosure", event.target.value)
                      }
                      placeholder="Disclosure text"
                      className="h-11 flex-1 rounded-xl border border-white/10 bg-transparent px-3 text-sm text-white outline-none focus:border-primary/40"
                    />
                    {affiliateLinks.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setAffiliateLinks((current) =>
                            current.filter((currentLink) => currentLink.id !== link.id),
                          )
                        }
                        className="rounded-xl border border-red-500/30 px-4 text-sm text-red-200"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Post Actions</h2>
            <p className="mt-2 text-sm leading-7 text-white/55">
              Save drafts, publish updates, or preview the blog post in a new tab.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => persistPost("draft")}
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#0b1020] px-5 py-3 text-sm font-semibold text-white/80"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              {status === "scheduled" ? (
                <button
                  type="button"
                  onClick={() => persistPost("scheduled")}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
                >
                  Schedule
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => persistPost("published")}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
                >
                  {status === "published" ? "Update Post" : "Publish Now"}
                </button>
              )}
              <button
                type="button"
                onClick={openPreview}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80"
              >
                <MonitorPlay className="h-4 w-4" />
                Preview
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Post Summary</h2>
            <dl className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between gap-4">
                <dt>Status</dt>
                <dd className="capitalize">{status}</dd>
              </div>
              {status === "scheduled" && scheduledAt ? (
                <div className="flex items-center justify-between gap-4">
                  <dt>Scheduled for</dt>
                  <dd className="text-right">
                    {new Date(scheduledAt).toLocaleDateString()}
                    <br />
                    {new Date(scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <dt>Slug</dt>
                <dd className="max-w-[180px] truncate text-right">{slug || "n/a"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Read time</dt>
                <dd>{readTime}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Word count</dt>
                <dd>{wordCount}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Featured</dt>
                <dd>{featured ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
