import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Braces, Code2, KeyRound, Regex, Type, Wand2 } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Developer Tools — Free Online Utilities | CodeWithLogs",
  description:
    "Explore free online developer tools from CodeWithLogs, including a JSON Formatter & Validator with more utilities coming soon.",
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
  openGraph: {
    title: "Developer Tools — Free Online Utilities | CodeWithLogs",
    description:
      "Explore free online developer tools from CodeWithLogs, including a JSON Formatter & Validator with more utilities coming soon.",
    url: `${siteUrl}/tools`,
    type: "website",
  },
};

const availableTools = [
  {
    name: "JSON Formatter",
    description:
      "Format, validate, minify, and inspect JSON instantly in your browser with syntax highlighting and line numbers.",
    href: "/tools/json-formatter",
    icon: Braces,
    badge: "Live",
  },
];

const comingSoonTools = [
  { name: "CSS Minifier", icon: Wand2 },
  { name: "Password Generator", icon: KeyRound },
  { name: "Word Counter", icon: Type },
  { name: "Base64 Encoder/Decoder", icon: Code2 },
  { name: "Regex Tester", icon: Regex },
];

export default function ToolsPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              CodeWithLogs Tools
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Free developer tools built for speed and clarity
            </h1>
            <p className="max-w-3xl text-base leading-8 text-text/70 sm:text-lg">
              Use lightweight browser-based tools to format data, validate payloads, and speed up
              day-to-day development work. Everything is designed to be fast, simple, and useful in
              real projects.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-12">
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-text">Available now</h2>
              <p className="text-base leading-8 text-text/65">
                Production-ready utilities you can use immediately without any signup.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availableTools.map((tool) => {
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
                    <div className="mt-8 space-y-3">
                      <h3 className="text-2xl font-bold tracking-tight text-text">{tool.name}</h3>
                      <p className="text-sm leading-7 text-text/65">{tool.description}</p>
                    </div>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Open tool
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-text">Coming soon</h2>
              <p className="text-base leading-8 text-text/65">
                More compact developer tools are on the roadmap for content, frontend, and API
                workflows.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {comingSoonTools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <div
                    key={tool.name}
                    className="rounded-[24px] border border-dashed border-black/10 bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-text/70">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text/45">
                        Coming Soon
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-text">{tool.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-text/60">
                      This tool is planned for a future release in the CodeWithLogs tools library.
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
