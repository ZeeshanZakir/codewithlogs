import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteUrl } from "@/lib/site-url";

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

const configuredPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const adsensePublisherId = configuredPublisherId
  ? configuredPublisherId.startsWith("ca-") ? configuredPublisherId : `ca-${configuredPublisherId}`
  : undefined;
const googleTagId = "G-NMGJP556HE";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CodeWithLogs",
    template: "%s | CodeWithLogs",
  },
  description:
    "Modern JavaScript developer troubleshooting and tools for Next.js, Node.js/npm and Supabase. Fix Your Development Errors. Step by Step.",
  openGraph: {
    title: "CodeWithLogs",
    description:
      "CodeWithLogs: Modern JavaScript developer troubleshooting and tools. Fix Your Development Errors. Step by Step.",
    url: siteUrl,
    siteName: "CodeWithLogs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeWithLogs",
    description:
      "Modern JavaScript developer troubleshooting and tools for Next.js, Node.js/npm and Supabase. Fix Your Development Errors. Step by Step.",
  },
  other: adsensePublisherId ? { "google-adsense-account": adsensePublisherId } : {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldLoadAdsense =
    process.env.NODE_ENV === "production" &&
    Boolean(adsensePublisherId);

  return (
    <html lang="en" className={inter.variable}>
      {shouldLoadAdsense ? (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          crossOrigin="anonymous"
          async
        />
      ) : null}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
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
