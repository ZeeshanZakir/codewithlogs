import { openGraphDefaults } from "@/lib/open-graph";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const configuredPublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const adsensePublisherId = configuredPublisherId
  ? configuredPublisherId.startsWith("ca-") ? configuredPublisherId : `ca-${configuredPublisherId}`
  : undefined;
const googleTagId = "G-NMGJP556HE";

const defaultTitle = "CodeWithLogs | Digital Agency for Web, Design & Growth";
const defaultDescription =
  "CodeWithLogs is a digital agency for web design, website development, web applications, UI/UX, e-commerce, SEO, digital marketing, branding and AI automation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | CodeWithLogs",
  },
  description: defaultDescription,
  openGraph: {
    ...openGraphDefaults,
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "CodeWithLogs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
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
    <html lang="en" className={`${inter.variable} ${display.variable} ${serif.variable}`}>
      <head>
        {shouldLoadAdsense ? (
          <script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
            crossOrigin="anonymous"
            async
          />
        ) : null}
      </head>
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
