import { notFound, permanentRedirect } from "next/navigation";
import { BlogArchivePage } from "@/components/blog/BlogArchivePage";
import { blogArchiveMetadata } from "@/lib/blog-archive-metadata";

export const dynamic = "force-static";
export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() { return []; }
type Props = { params: Promise<{ page: string }> };

async function pageNumber(params: Props["params"]) {
  const { page } = await params;
  const number = Number(page);
  if (!/^[1-9]\d*$/.test(page) || !Number.isSafeInteger(number)) notFound();
  return number;
}

export async function generateMetadata({ params }: Props) {
  return blogArchiveMetadata(await pageNumber(params));
}

export default async function ArchivePage({ params }: Props) {
  const page = await pageNumber(params);
  if (page === 1) permanentRedirect("/blog");
  return <BlogArchivePage page={page} />;
}
