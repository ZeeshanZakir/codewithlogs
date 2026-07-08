import type { Metadata } from "next";

import { AdUnit } from "@/components/ads/AdUnit";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Best JSON Formatter & Validator Online — Free Tool | Code With Logs",
  description:
    "Free online JSON formatter, validator and beautifier. Paste your JSON to instantly format, validate, and fix errors. Works in your browser — no data sent to any server.",
  alternates: {
    canonical: `${siteUrl}/tools/json-formatter`,
  },
  openGraph: {
    title: "Best JSON Formatter & Validator Online — Free Tool | Code With Logs",
    description:
      "Free online JSON formatter, validator and beautifier. Paste your JSON to instantly format, validate, and fix errors. Works in your browser — no data sent to any server.",
    url: `${siteUrl}/tools/json-formatter`,
    type: "website",
  },
};

export default function JsonFormatterPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="json-tool-top" format="horizontal" />
        </section>

        <JsonFormatterTool />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="json-tool-bottom" format="rectangle" />
        </section>
      </div>
    </div>
  );
}
