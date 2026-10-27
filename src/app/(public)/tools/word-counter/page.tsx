import { FaqSection } from "@/components/FaqSection";
import { pageFaqs } from "@/lib/faq-content";
import type { Metadata } from "next";

import { AdUnit } from "@/components/ads/AdUnit";
import { WordCounterTool } from "@/components/tools/WordCounterTool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Best Word Counter — Free Online Word & Character Count Tool",
  description:
    "Count words, characters, sentences, and paragraphs instantly. Free online word counter for writers, bloggers, students, and developers. No signup needed.",
  alternates: {
    canonical: `${siteUrl}/tools/word-counter`,
  },
  openGraph: {
    title: "Best Word Counter — Free Online Word & Character Count Tool | CodeWithLogs",
    description:
      "Count words, characters, sentences, and paragraphs instantly. Free online word counter for writers, bloggers, students, and developers. No signup needed.",
    url: `${siteUrl}/tools/word-counter`,
    type: "website",
  },
};

export default function WordCounterPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="word-counter-top" format="horizontal" />
        </section>

        <WordCounterTool />

        <FaqSection items={pageFaqs["/tools/word-counter"]} className="mt-10" />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="word-counter-bottom" format="rectangle" />
        </section>
      </div>
    </div>
  );
}
