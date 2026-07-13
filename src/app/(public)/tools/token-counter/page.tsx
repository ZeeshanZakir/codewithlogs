import type { Metadata } from "next";
import Link from "next/link";
import { AdUnit } from "@/components/ads/AdUnit";
import { TokenCounterTool } from "@/components/tools/TokenCounterTool";
import { TokenCounterSeoContent } from "@/components/tools/TokenCounterSeoContent";
import { Braces, Clock, Key } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Token Counter for GPT, Claude & Gemini — Free AI Token Calculator | CodeWithLogs",
  description: "Count tokens for your prompts before sending them to GPT-4, Claude, or Gemini. Estimate API costs instantly. 100% free, runs in your browser.",
  alternates: {
    canonical: `${siteUrl}/tools/token-counter`,
  },
  openGraph: {
    title: "Token Counter for GPT, Claude & Gemini — Free AI Token Calculator | CodeWithLogs",
    description: "Count tokens for your prompts before sending them to GPT-4, Claude, or Gemini. Estimate API costs instantly. 100% free, runs in your browser.",
    url: `${siteUrl}/tools/token-counter`,
    type: "website",
  },
};

const RELATED_TOOLS = [
  {
    name: "JWT Decoder",
    description: "Decode JSON Web Tokens to inspect headers and payloads for your API projects.",
    href: "/tools/jwt-decoder",
    icon: Key,
    badge: "Live",
  },
  {
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 text, files, and images for your AI payloads.",
    href: "/tools/base64",
    icon: Braces,
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

export default function TokenCounterPage() {
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
                { "@type": "ListItem", position: 3, name: "Token Counter", item: `${siteUrl}/tools/token-counter` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Token Counter for GPT, Claude & Gemini",
              description: "Count tokens for your prompts before sending them to GPT-4, Claude, or Gemini. Estimate API costs instantly.",
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
                  name: "Is this an exact token count?",
                  acceptedAnswer: { "@type": "Answer", text: "For GPT models, yes, using the same tokenizer family as the OpenAI API. For Claude and Gemini, it's a close estimate since their exact tokenizers aren't public." },
                },
                {
                  "@type": "Question",
                  name: "Why do different models count differently for the same text?",
                  acceptedAnswer: { "@type": "Answer", text: "Each model family uses its own vocabulary and tokenization rules, so identical text can produce different token counts." },
                },
                {
                  "@type": "Question",
                  name: "Does this tool store my prompts?",
                  acceptedAnswer: { "@type": "Answer", text: "No, everything is processed locally in your browser. Nothing is uploaded or logged." },
                },
                {
                  "@type": "Question",
                  name: "How can I reduce token usage?",
                  acceptedAnswer: { "@type": "Answer", text: "Remove redundant instructions, use concise phrasing, and avoid repeating context the model doesn't need." },
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
            <li className="text-text">Token Counter</li>
          </ol>
        </nav>

        <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-text/60 hover:text-primary">
          ← Back to all tools
        </Link>

        <section className="mb-8 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="token-counter-top" format="horizontal" />
        </section>

        <TokenCounterTool />

        <TokenCounterSeoContent />

        <section className="mt-10 rounded-[24px] border border-black/6 bg-white p-4 shadow-sm">
          <AdUnit slot="token-counter-bottom" format="rectangle" />
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
