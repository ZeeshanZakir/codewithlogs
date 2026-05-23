import { MDXRenderer } from "@/components/blog/MDXRenderer";

type AdminPreviewPageProps = {
  searchParams: Promise<{ source?: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminPreviewPage({
  searchParams,
}: AdminPreviewPageProps) {
  const { source } = await searchParams;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
      <MDXRenderer
        source={
          source ??
          "## Preview\n\nYour live preview route is ready. Paste MDX content into the editor to render it here."
        }
      />
    </div>
  );
}
