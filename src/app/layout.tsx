import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";
const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const googleTagId = "G-NMGJP556HE";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zeeshan Zakir — Full Stack Developer",
    template: "%s | Zeeshan Zakir — Full Stack Developer",
  },
  description:
    "Full-stack MERN developer blog. Tutorials on Next.js, React, Node.js, MongoDB, SaaS development, and developer tools.",
  openGraph: {
    title: "Zeeshan Zakir — Full Stack Developer",
    description:
      "Full-stack MERN developer blog with practical tutorials on Next.js, React, Node.js, MongoDB, SaaS development, and developer tools.",
    url: siteUrl,
    siteName: "Code With Logs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeeshan Zakir — Full Stack Developer",
    description:
      "Full-stack MERN developer blog. Tutorials on Next.js, React, Node.js, MongoDB, SaaS development, and developer tools.",
  },
  // other: {
  //   monetag: "4f8c3ff5fbf9312dc5f3ac62b2dd58d0",
  //   ...(adsensePublisherId
  //     ? {
  //         "google-adsense-account": adsensePublisherId,
  //       }
  //     : {}),
  // },
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
      {shouldLoadAdsense ? (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          async
        />
      ) : null}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="beforeInteractive"
      />
      <Script id="google-tag" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleTagId}');
        `}
      </Script>
      <body className="min-h-screen bg-background font-sans text-text antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
