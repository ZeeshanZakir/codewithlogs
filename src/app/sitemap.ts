import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { siteUrl } from "@/lib/site-url";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts(false);
  const toolSlugs = ["error-decoder", "package-json-inspector", "base64", "cron-builder", "css-minifier", "json-formatter", "jwt-decoder", "password-generator", "regex-tester", "token-counter", "word-counter"];
  const routes = ["/", "/about", "/blog", "/contact", "/gallery", "/disclaimer", "/privacy-policy", "/services", "/terms", "/tools", "/editorial-policy"];
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: route === "/" ? siteUrl + "/" : siteUrl + route,
    changeFrequency: route === "/blog" || route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/blog" ? 0.9 : 0.5,
  }));
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: siteUrl + "/tools/" + slug,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  // Publication time is the only trustworthy content timestamp exposed by
  // the existing read model. Do not fabricate a new modification date.
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: siteUrl + "/blog/" + post.slug,
    ...(post.date && !Number.isNaN(Date.parse(post.date)) ? { lastModified: new Date(post.date) } : {}),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticPages, ...toolPages, ...blogPages];
}
