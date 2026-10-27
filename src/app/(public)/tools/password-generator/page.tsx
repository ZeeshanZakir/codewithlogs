import { FaqSection } from "@/components/FaqSection";
import { pageFaqs } from "@/lib/faq-content";
import type { Metadata } from "next";

import { AdUnit } from "@/components/ads/AdUnit";
import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Password Generator — Free Strong Password Tool",
  description:
    "Generate strong, secure passwords instantly. Customize length, uppercase, lowercase, numbers, and symbols. 100% browser-based — no passwords stored or sent anywhere.",
  alternates: {
    canonical: `${siteUrl}/tools/password-generator`,
  },
  openGraph: {
    title: "Password Generator — Free Strong Password Tool | CodeWithLogs",
    description:
      "Generate strong, secure passwords instantly. Customize length, uppercase, lowercase, numbers, and symbols. 100% browser-based — no passwords stored or sent anywhere.",
    url: `${siteUrl}/tools/password-generator`,
    type: "website",
  },
};

export default function PasswordGeneratorPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="password-generator-top" format="horizontal" />
        </section>

        <PasswordGeneratorTool />

        <FaqSection items={pageFaqs["/tools/password-generator"]} className="mt-10" />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="password-generator-bottom" format="rectangle" />
        </section>
      </div>
    </div>
  );
}
