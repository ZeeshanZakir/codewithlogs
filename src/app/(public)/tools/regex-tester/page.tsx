import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";
import { RegexTesterSeoContent } from "@/components/tools/RegexTesterSeoContent";
import { Braces, Hash, Clock } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Regex Tester — Test & Debug Regular Expressions Online | CodeWithLogs",
  description: "Test regular expressions in real time with match highlighting, group capture, and plain-English explanations. Free browser-based regex tool.",
  alternates: {
    canonical: `${siteUrl}/tools/regex-tester`,
  },
  openGraph: {
    title: "Regex Tester — Test & Debug Regular Expressions Online | CodeWithLogs",
    description: "Test regular expressions in real time with match highlighting, group capture, and plain-English explanations. Free browser-based regex tool.",
    url: `${siteUrl}/tools/regex-tester`,
    type: "website",
  },
};

const RELATED_TOOLS = [
  {
    name: "JSON Formatter",
    description: "Format, validate, minify, and inspect JSON instantly in your browser with syntax highlighting.",
    href: "/tools/json-formatter",
    icon: Braces,
    badge: "Live",
  },
  {
    name: "Token Counter",
    description: "Count tokens for GPT, Claude & Gemini prompts with cost estimation.",
    href: "/tools/token-counter",
    icon: Hash,
    badge: "Live",
  },
  {
    name: "Cron Expression Builder",
    description: "Build and understand cron expressions with visual editor and next run times.",
    href: "/tools/cron-builder",
    icon: Clock,
    badge: "Live",
  },
];

export default function RegexTesterPage() {
  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
                { "@type": "ListItem", position: 3, name: "Regex Tester", item: `${siteUrl}/tools/regex-tester` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Regex Tester — Test & Debug Regular Expressions",
              description: "Test regular expressions in real time with match highlighting, group capture, and plain-English explanations.",
              applicationCategory: "DeveloperApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Which regex flavor does this use?",
                  acceptedAnswer: { "@type": "Answer", text: "JavaScript's native RegExp engine (ECMAScript), the same engine used in Node.js and browsers." },
                },
                {
                  "@type": "Question",
                  name: "Is my test text uploaded anywhere?",
                  acceptedAnswer: { "@type": "Answer", text: "No, everything runs locally in your browser using JavaScript's RegExp object." },
                },
                {
                  "@type": "Question",
                  name: "Why doesn't my pattern match anything?",
                  acceptedAnswer: { "@type": "Answer", text: "Check your flags (e.g. missing the g flag for global search) and escape special characters like . or ( if you mean them literally." },
                },
                {
                  "@type": "Question",
                  name: "Can I test multiline text?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes, enable the m flag so ^ and $ match the start/end of each line." },
                },
              ],
            },
          ]),
        }}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16 space-y-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-text/60">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/tools" className="hover:text-primary">Tools</Link></li>
            <li>/</li>
            <li className="text-text">Regex Tester</li>
          </ol>
        </nav>

        <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-text/60 hover:text-primary">
          ← Back to all tools
        </Link>

        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="regex-tester-top" format="horizontal" />
        </section>

        <RegexTesterTool />

        <RegexTesterSeoContent />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="regex-tester-bottom" format="rectangle" />
        </section>

        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold tracking-tight text-text">Related Tools</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {RELATED_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group rounded-[28px] border border-black/6 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/18 hover:shadow-[0_20px_60px_rgba(15,110,86,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {tool.badge}
                    </span>
                  </div>
                  <div className="mt-6 space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-text">{tool.name}</h3>
                    <p className="text-sm leading-7 text-text/60">{tool.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
