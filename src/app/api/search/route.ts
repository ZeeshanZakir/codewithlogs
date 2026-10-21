import { searchPublicArticleSlugs } from "@/lib/article-search";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query || query.length > 160 || query.split(/\s+/).length > 12) {
    return Response.json({ error: "Use 1–160 characters and up to 12 search words." }, { status: 400 });
  }
  try {
    const slugs = await searchPublicArticleSlugs(query);
    return Response.json({ slugs }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Article search is temporarily unavailable." }, { status: 503 });
  }
}
