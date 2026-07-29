import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { CronBuilderTool } from "@/components/tools/CronBuilderTool";
import { CronBuilderSeoContent } from "@/components/tools/CronBuilderSeoContent";
import { Braces, Code2, Key } from "lucide-react";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Cron Expression Builder & Parser — Free Cron Job Generator | CodeWithLogs",
  description: "Build and understand cron expressions with a visual editor. Get human-readable explanations and see the next run times instantly. 100% free, no signup.",
  alternates: {
    canonical: `${siteUrl}/tools/cron-builder`,
  },
  openGraph: {
    title: "Cron Expression Builder & Parser — Free Cron Job Generator | CodeWithLogs",
    description: "Build and understand cron expressions with a visual editor. Get human-readable explanations and see the next run times instantly. 100% free, no signup.",
    url: `${siteUrl}/tools/cron-builder`,
    type: "website",
  },
};

const RELATED_TOOLS = [
  {
    name: "JSON Formatter",
    description: "Format, validate, minify, and inspect JSON instantly in your browser",
    href: "/tools/json-formatter",
    icon: Braces,
    badge: "Live",
  },
  {
    name: "JWT Decoder",
    description: "Decode JSON Web Tokens to inspect headers and payloads",
    href: "/tools/jwt-decoder",
    icon: Key,
    badge: "Live",
  },
  {
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 text, files, and images",
    href: "/tools/base64",
    icon: Code2,
    badge: "Live",
  },
];

export default function CronBuilderPage() {
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
                { "@type": "ListItem", position: 3, name: "Cron Expression Builder", item: `${siteUrl}/tools/cron-builder` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Cron Expression Builder & Parser",
              description: "Build and understand cron expressions with a visual editor. Get human-readable explanations and see next run times.",
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
                  name: "Does this tool run my cron job?",
                  acceptedAnswer: { "@type": "Answer", text: "No, this only builds and explains the expression. Use it in your crontab, CI/CD config, or scheduler (AWS EventBridge, GitHub Actions, etc.)" },
                },
                {
                  "@type": "Question",
                  name: "What timezone are the 'next run times' based on?",
                  acceptedAnswer: { "@type": "Answer", text: "Your browser's local timezone. Actual server cron jobs typically run in the server's configured timezone (often UTC)." },
                },
                {
                  "@type": "Question",
                  name: "Can I schedule 'every 15 minutes'?",
                  acceptedAnswer: { "@type": "Answer", text: "Yes, use the step syntax: */15 * * * *" },
                },
                {
                  "@type": "Question",
                  name: "Is data sent anywhere?",
                  acceptedAnswer: { "@type": "Answer", text: "No, all parsing and calculation happens locally in your browser." },
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
            <li className="text-text">Cron Expression Builder</li>
          </ol>
        </nav>

        <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-text/60 hover:text-primary">
          ← Back to all tools
        </Link>

        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="cron-builder-top" format="horizontal" />
        </section>

        <CronBuilderTool />

        <CronBuilderSeoContent />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="cron-builder-bottom" format="rectangle" />
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
