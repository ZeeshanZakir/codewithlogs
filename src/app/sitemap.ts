import type { MetadataRoute } from "next";
import { BlogPost } from "@/lib/blog-post";
import dbConnect from "@/lib/mongodb";
import { siteUrl } from "@/lib/site-url";
import { publicFilter } from "@/lib/mdx";
import { services } from "@/lib/services";
import { publishedCaseStudies } from "@/lib/work";

// Metadata routes are cached by default. Read the CMS on each request so new
// publications and drafts are reflected without waiting for a site rebuild.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();
  const posts = await BlogPost.find(publicFilter())
    .select("slug updatedAt publishedAt scheduledAt")
    .lean();
  const toolSlugs = ["error-decoder", "package-json-inspector", "base64", "cron-builder", "css-minifier", "json-formatter", "jwt-decoder", "password-generator", "regex-tester", "token-counter", "word-counter"];
  const routes = ["/", "/services", "/work", "/about", "/blog", "/contact", "/gallery", "/disclaimer", "/privacy-policy", "/terms", "/tools", "/editorial-policy"];
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: route === "/" ? siteUrl + "/" : siteUrl + route,
    changeFrequency: route === "/blog" || route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : ["/blog", "/services"].includes(route) ? 0.9 : ["/about", "/contact", "/work"].includes(route) ? 0.7 : 0.5,
  }));
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: siteUrl + "/services/" + service.slug,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  // Placeholder case studies are never listed.
  const workPages: MetadataRoute.Sitemap = publishedCaseStudies.map((study) => ({
    url: siteUrl + "/work/" + study.slug,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: siteUrl + "/tools/" + slug,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  // Use stored timestamps, never the time the sitemap was requested.
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: siteUrl + "/blog/" + post.slug,
    ...((post.updatedAt ?? post.publishedAt ?? post.scheduledAt)
      ? { lastModified: post.updatedAt ?? post.publishedAt ?? post.scheduledAt }
      : {}),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...new Map(
    [...staticPages, ...servicePages, ...workPages, ...toolPages, ...blogPages].map((entry) => [entry.url, entry])
  ).values()];
}
