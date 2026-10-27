import { FaqSection } from "@/components/FaqSection";
import { pageFaqs } from "@/lib/faq-content";
import type { Metadata } from "next";

import { AdUnit } from "@/components/ads/AdUnit";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "JWT Decoder — Free Online Tool",
  description:
    "Decode JSON Web Tokens instantly in your browser. Inspect headers, payloads, and signatures without sending any data to a server.",
  alternates: {
    canonical: `${siteUrl}/tools/jwt-decoder`,
  },
  openGraph: {
    title: "JWT Decoder — Free Online Tool | Code With Logs",
    description:
      "Decode JSON Web Tokens instantly in your browser. Inspect headers, payloads, and signatures without sending any data to a server.",
    url: `${siteUrl}/tools/jwt-decoder`,
    type: "website",
  },
};

export default function JwtDecoderPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="jwt-decoder-top" format="horizontal" />
        </section>

        <JwtDecoderTool />

        <FaqSection items={pageFaqs["/tools/jwt-decoder"]} className="mt-10" />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="jwt-decoder-bottom" format="rectangle" />
        </section>
      </div>
    </div>
  );
}
