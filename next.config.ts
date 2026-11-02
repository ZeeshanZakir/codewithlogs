import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.50.234"],
  compress: true,
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.codewithlogs.com" }],
      destination: "https://codewithlogs.com/:path*",
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
