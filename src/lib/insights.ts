import type { BlogPostMeta } from "@/lib/mdx";
import { getTroubleshootingTopic } from "@/lib/troubleshooting";

/**
 * Blog / Insights categories. Development Troubleshooting holds the existing
 * troubleshooting archive; the other categories are ready for future articles.
 */
export const insightCategories = [
  { id: "web-development", title: "Web Development", aliases: ["web development", "web dev", "next.js", "nextjs", "react", "mern", "software development", "saas", "vercel"] },
  { id: "ui-ux-design", title: "UI/UX Design", aliases: ["ui/ux design", "ui/ux", "ux", "ui design", "design"] },
  { id: "seo", title: "SEO", aliases: ["seo", "search"] },
  { id: "digital-marketing", title: "Digital Marketing", aliases: ["digital marketing", "marketing"] },
  { id: "branding", title: "Branding", aliases: ["branding", "brand"] },
  { id: "ecommerce", title: "E-commerce", aliases: ["e-commerce", "ecommerce"] },
  { id: "ai-automation", title: "AI & Automation", aliases: ["ai & automation", "ai tools", "automation", "ai"] },
  { id: "business-growth", title: "Business Growth", aliases: ["business growth", "freelancing", "career", "career & skills", "productivity"] },
  { id: "development-troubleshooting", title: "Development Troubleshooting", aliases: ["development troubleshooting", "troubleshooting"] },
] as const;

export type InsightCategoryId = typeof insightCategories[number]["id"];

export function isInsightCategoryId(value: string): value is InsightCategoryId {
  return insightCategories.some((category) => category.id === value);
}

export function getInsightCategory(post: Pick<BlogPostMeta, "slug" | "title" | "category" | "tags">): InsightCategoryId {
  const category = post.category.trim().toLowerCase();
  // Existing troubleshooting guides stay grouped together.
  if (getTroubleshootingTopic(post)) return "development-troubleshooting";
  const explicit = insightCategories.find((item) => item.title.toLowerCase() === category);
  if (explicit) return explicit.id;
  const alias = insightCategories.find((item) => (item.aliases as readonly string[]).includes(category));
  return alias?.id ?? "web-development";
}

export function getInsightCategoryTitle(id: InsightCategoryId) {
  return insightCategories.find((category) => category.id === id)?.title ?? "Insights";
}
