/* eslint-disable @typescript-eslint/no-require-imports */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://codewithlogs.com";

/** @type {import("next-sitemap").IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,

  exclude: [
    "/admin",
    "/admin/*",
    "/api/*",
    "/blog/[slug]",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
  },

  transform: async (config, url) => ({
    loc: url,
    changefreq: url === "/" ? "daily" : "weekly",
    priority: url === "/" ? 1 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: config.alternateRefs ?? [],
  }),
};

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
};