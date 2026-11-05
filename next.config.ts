import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.50.234"],
  compress: true,
  async headers() {
    return ["q", "topic", "category"].map((key) => ({
      source: "/blog/:path*",
      has: [{ type: "query" as const, key }],
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    }));
  },
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.codewithlogs.com" }],
      destination: "https://codewithlogs.com/:path*",
      permanent: true,
    }, {
      source: "/blog/page/1",
      destination: "/blog",
      permanent: true,
    }];
  },
  turbopack: { root: process.cwd() },
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
