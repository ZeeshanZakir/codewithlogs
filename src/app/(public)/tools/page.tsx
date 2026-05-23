import type { Metadata } from "next";
import { Globe, Server, BookOpen, Bot, ShieldCheck, Rocket } from "lucide-react";

import { AdUnit } from "@/components/ads/AdUnit";
import { AffiliateCard } from "@/components/affiliate/AffiliateCard";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Best developer tools for web developers 2026 — tools I personally use and recommend",
  description:
    "A curated list of the best developer tools for web developers in 2026, including hosting, databases, AI coding tools, domains, and learning resources I personally use and recommend.",
  openGraph: {
    title: "Best developer tools for web developers 2026 — tools I personally use and recommend",
    description:
      "Hosting, databases, AI coding tools, domains, and learning resources I actually use as a full-stack developer.",
    url: `${siteUrl}/tools`,
    type: "website",
  },
};

const categories = [
  {
    title: "Hosting & Deployment",
    icon: Rocket,
    tools: [
      {
        name: "Hostinger",
        review:
          "Best budget hosting. I use it for client projects and quick landing pages when cost matters. Starts at $2.99/mo and is hard to beat for value.",
        badge: "81% Off Deal",
        ctaLabel: "Get Hostinger",
        href: "#",
      },
      {
        name: "Vercel",
        review:
          "Where I deploy all Next.js apps. The free tier is generous, the workflow is clean, and preview deployments make client feedback much easier.",
        ctaLabel: "Try Vercel Free",
        href: "#",
      },
      {
        name: "DigitalOcean",
        review:
          "Best for VPS and managed databases when you need a bit more control. The $200 free credit is great for testing and early-stage product builds.",
        ctaLabel: "Claim $200 Credit",
        href: "#",
      },
    ],
  },
  {
    title: "Databases & Backend",
    icon: Server,
    tools: [
      {
        name: "MongoDB Atlas",
        review:
          "My go-to cloud database for MERN projects. The free tier is enough to start, and scaling up later is straightforward.",
        badge: "Free Tier",
        ctaLabel: "Start Free",
        href: "#",
      },
      {
        name: "Supabase",
        review:
          "The best Firebase alternative I recommend when teams want an open-source stack with auth, storage, and database features in one place.",
        ctaLabel: "Try Supabase",
        href: "#",
      },
      {
        name: "PlanetScale",
        review:
          "A strong option for serverless MySQL and branching workflows. I like it for products that need clean schema changes without slowing down delivery.",
        ctaLabel: "Get Started",
        href: "#",
      },
    ],
  },
  {
    title: "AI Coding Tools",
    icon: Bot,
    tools: [
      {
        name: "Cursor",
        review:
          "The best AI code editor in my workflow right now. It genuinely makes development faster for planning, refactors, and shipping features.",
        badge: "My #1 Pick",
        ctaLabel: "Try Cursor Free",
        href: "#",
      },
      {
        name: "GitHub Copilot",
        review:
          "A strong AI pair programmer for repetitive code, boilerplate, and day-to-day implementation inside familiar editor workflows.",
        ctaLabel: "Start Free Trial",
        href: "#",
      },
    ],
  },
  {
    title: "Domain & SSL",
    icon: ShieldCheck,
    tools: [
      {
        name: "Namecheap",
        review:
          "Where I buy all my domains. Great prices, simple management, and a reliable place to secure names for client and product work.",
        badge: "Best Value",
        ctaLabel: "Buy a Domain",
        href: "#",
      },
    ],
  },
  {
    title: "Learning Resources",
    icon: BookOpen,
    tools: [
      {
        name: "Udemy",
        review:
          "Still one of the best places to find practical online courses. I always tell people to wait for the $9.99 sales before buying.",
        ctaLabel: "Browse Courses",
        href: "#",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            <span className="font-semibold">
              ⚠ Affiliate Disclosure:
            </span>{" "}
            This page contains affiliate links. If you purchase through these links, I may earn a
            commission. This helps support the blog.
          </div>

          <div className="max-w-4xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Tools & Resources
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Developer Tools I Actually Use
            </h1>
            <p className="max-w-3xl text-base leading-8 text-text/70 sm:text-lg">
              After 6 years of full-stack development, these are the tools I rely on every day.
              Some links below are affiliate links — I earn a small commission at no extra cost to
              you.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="space-y-12">
          {categories.map(({ title, icon: Icon, tools }) => (
            <section key={title} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-text">{title}</h2>
                  <p className="text-sm text-text/60">
                    Personally recommended tools with affiliate links and practical use cases.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {tools.map((tool) => (
                  <AffiliateCard
                    key={tool.name}
                    name={tool.name}
                    review={tool.review}
                    badge={tool.badge}
                    ctaLabel={tool.ctaLabel}
                    href={tool.href}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-t border-black/5 bg-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-8 text-sm text-text/60 sm:px-6 lg:px-8">
          <Globe className="h-4 w-4 text-primary" />
          <p>
            I only recommend tools I would be comfortable using on my own projects or client work.
            If a tool stops being useful, it does not stay on this page.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-xl border border-black/6 bg-white p-4">
          <AdUnit slot="tools-bottom" format="rectangle" />
        </div>
      </section>
    </div>
  );
}
