/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://codewithlogs.com";

const blogDirectory = path.join(
  process.cwd(),
  "src",
  "content",
  "blog",
);

function getBlogSlugs() {
  try {
    return fs
      .readdirSync(blogDirectory)
      .filter((entry) => entry.endsWith(".mdx"))
      .map((entry) => entry.replace(/\.mdx$/, ""));
  } catch (error) {
    console.warn("Could not read blog directory:", error.message);
    return [];
  }
}

const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/disclaimer",
  "/privacy-policy",
  "/services",
  "/terms",
  "/tools",
];

/** @type {import("next-sitemap").IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,

  exclude: ["/admin", "/admin/*", "/api/*"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
  },

  additionalPaths: async (config) => {
    const blogPaths = getBlogSlugs().map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));

    const staticPaths = publicRoutes.map((route) => ({
      loc: route,
      changefreq: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.7,
      lastmod: new Date().toISOString(),
    }));

    return Promise.all(
      [...staticPaths, ...blogPaths].map(async (route) => {
        const defaultEntry = await config.transform(config, route.loc);

        return {
          ...defaultEntry,
          ...route,
        };
      }),
    );
  },
};