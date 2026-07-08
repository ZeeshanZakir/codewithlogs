import type { Metadata } from "next";

import { AdUnit } from "@/components/ads/AdUnit";
import { CssMinifierTool } from "@/components/tools/CssMinifierTool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Best CSS Minifier — Free Online CSS Minify & Beautify Tool | CodeWithLogs",
  description:
    "Minify and beautify CSS code instantly online. Remove whitespace, comments, and unnecessary characters. Free CSS compressor — no upload, works in browser.",
  alternates: {
    canonical: `${siteUrl}/tools/css-minifier`,
  },
  openGraph: {
    title: "Best CSS Minifier — Free Online CSS Minify & Beautify Tool | CodeWithLogs",
    description:
      "Minify and beautify CSS code instantly online. Remove whitespace, comments, and unnecessary characters. Free CSS compressor — no upload, works in browser.",
    url: `${siteUrl}/tools/css-minifier`,
    type: "website",
  },
};

export default function CssMinifierPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="css-minifier-top" format="horizontal" />
        </section>

        <CssMinifierTool />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="css-minifier-bottom" format="rectangle" />
        </section>
      </div>
    </div>
  );
}
