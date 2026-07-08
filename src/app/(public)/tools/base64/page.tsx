import type { Metadata } from "next";

import { AdUnit } from "@/components/ads/AdUnit";
import { Base64Tool } from "@/components/tools/Base64Tool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder — Free Online Tool | Code With Logs",
  description:
    "Encode and decode Base64 strings instantly online. Also encode/decode images and files to Base64. Free browser-based tool — no data sent to any server.",
  alternates: {
    canonical: `${siteUrl}/tools/base64`,
  },
  openGraph: {
    title: "Base64 Encoder/Decoder — Free Online Tool | Code With Logs",
    description:
      "Encode and decode Base64 strings instantly online. Also encode/decode images and files to Base64. Free browser-based tool — no data sent to any server.",
    url: `${siteUrl}/tools/base64`,
    type: "website",
  },
};

export default function Base64Page() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="base64-top" format="horizontal" />
        </section>

        <Base64Tool />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="base64-bottom" format="rectangle" />
        </section>
      </div>
    </div>
  );
}
