import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAdSense } from "nextjs-google-adsense";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zeeshan Zakir — Full Stack Developer",
    template: "%s | Zeeshan Zakir — Full Stack Developer",
  },
  description:
    "Full-stack MERN developer blog. Tutorials on Next.js, React, Node.js, MongoDB, SaaS development, and developer tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zeeshan Zakir — Full Stack Developer",
    description:
      "Full-stack MERN developer blog with practical tutorials on Next.js, React, Node.js, MongoDB, SaaS development, and developer tools.",
    url: siteUrl,
    siteName: "CodeWithLogs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeeshan Zakir — Full Stack Developer",
    description:
      "Full-stack MERN developer blog. Tutorials on Next.js, React, Node.js, MongoDB, SaaS development, and developer tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldLoadAdsense =
    process.env.NODE_ENV === "production" &&
    Boolean(process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID);

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-text antialiased">
        {shouldLoadAdsense ? (
          <GoogleAdSense publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID!} />
        ) : null}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
