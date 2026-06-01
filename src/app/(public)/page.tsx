import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Code2,
  Globe,
  Rocket,
  Server,
  Wrench,
} from "lucide-react";

import { AdUnit } from "@/components/ads/AdUnit";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { getFeaturedPosts } from "@/lib/mdx";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com/";

export const metadata: Metadata = {
  title: "Full-Stack MERN Developer for SaaS and Fast Web Apps",
  description:
    "Hire a full-stack MERN developer to build fast web apps and SaaS products, or explore practical articles on Next.js, React, Node.js, and MongoDB.",
  openGraph: {
    title: "I Build Fast Web Apps & SaaS Products",
    description:
      "Full-stack MERN developer helping founders launch high-performance products with Next.js, React, Node.js, and MongoDB.",
    url: siteUrl,
    type: "website",
  },
};

const stack = ["Next.js", "React", "Node.js", "MongoDB", "TypeScript", "Tailwind"];

const services = [
  {
    title: "Full-Stack Web Apps",
    description:
      "Production-ready web applications with fast UI, clean architecture, and reliable backend workflows.",
    price: "From $500",
    icon: Code2,
  },
  {
    title: "SaaS Development",
    description:
      "MVPs and growth-stage SaaS products built for launch speed, usability, and ongoing iteration.",
    price: "From $800",
    icon: Rocket,
  },
  {
    title: "REST API & Backend",
    description:
      "Secure API layers, admin workflows, and scalable backend services for modern applications.",
    price: "From $300",
    icon: Server,
  },
];

const toolRecommendations = [
  {
    name: "Hostinger",
    description: "Affordable hosting and domains for landing pages, staging, and side projects.",
  },
  {
    name: "Vercel",
    description: "The fastest deployment workflow for Next.js sites and product experiments.",
  },
  {
    name: "MongoDB Atlas",
    description: "Managed MongoDB that keeps shipping velocity high and ops overhead low.",
  },
  {
    name: "Cursor",
    description: "A strong AI-assisted editor for building features, refactors, and prototypes.",
  },
];

function truncate(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function DeveloperIllustration() {
  return (
    <div className="animate-float-slow relative mx-auto flex w-full max-w-md items-center justify-center">
      <div className="absolute inset-8 rounded-full bg-primary/8 blur-3xl" />
      <div className="relative w-full rounded-[24px] border border-black/6 bg-white p-4 shadow-[0_30px_80px_rgba(15,110,86,0.12)]">
        <div className="mb-4 flex items-center gap-2 border-b border-black/6 pb-3">
          <span className="h-3 w-3 rounded-full bg-red-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          <span className="ml-2 text-xs font-medium tracking-[0.18em] text-text/40 uppercase">
            shipping.fast.tsx
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3 rounded-[18px] bg-surface p-4">
            <div className="h-3 w-24 rounded-full bg-primary/20" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-black/6" />
              <div className="h-3 w-4/5 rounded-full bg-black/6" />
              <div className="h-3 w-2/3 rounded-full bg-black/6" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-[14px] border border-primary/12 bg-white p-3">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Code2 className="h-4 w-4" />
                  <span className="text-xs font-semibold">Frontend</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-primary/14" />
                  <div className="h-2.5 w-3/4 rounded-full bg-primary/14" />
                </div>
              </div>
              <div className="rounded-[14px] border border-accent/12 bg-white p-3">
                <div className="mb-2 flex items-center gap-2 text-accent">
                  <Server className="h-4 w-4" />
                  <span className="text-xs font-semibold">Backend</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-accent/14" />
                  <div className="h-2.5 w-2/3 rounded-full bg-accent/14" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[18px] bg-primary p-5 text-white">
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
                  Velocity
                </span>
                <Rocket className="h-5 w-5" />
              </div>
              <div className="space-y-3">
                <div className="h-2.5 w-full rounded-full bg-white/20" />
                <div className="h-2.5 w-4/5 rounded-full bg-white/20" />
                <div className="h-16 rounded-[14px] bg-white/12" />
              </div>
            </div>

            <svg
              viewBox="0 0 320 160"
              className="w-full rounded-[18px] border border-black/6 bg-white p-3"
              aria-hidden="true"
            >
              <rect x="18" y="20" width="90" height="44" rx="14" fill="#D8F3EC" />
              <rect x="124" y="20" width="178" height="22" rx="11" fill="#E5E7EB" />
              <rect x="124" y="52" width="140" height="12" rx="6" fill="#E5E7EB" />
              <path
                d="M34 118C60 82 97 74 132 95C166 116 186 120 208 102C228 86 252 83 286 108"
                fill="none"
                stroke="#185FA5"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <circle cx="98" cy="92" r="11" fill="#0F6E56" />
              <circle cx="208" cy="102" r="11" fill="#185FA5" />
              <circle cx="280" cy="108" r="11" fill="#0F6E56" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts(3);

  return (
    <div className="bg-background">
      <section className="min-h-[90vh]">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Available for freelance work
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-7xl">
                I Build Fast Web Apps &amp; SaaS Products
              </h1>
              <p className="max-w-2xl text-base leading-8 text-text/70 sm:text-lg">
                Full-stack MERN developer with 6 years of experience. I turn your ideas into
                high-performance web applications using Next.js, React, Node.js, and MongoDB.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-primary/92"
              >
                Hire Me <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-text transition-colors hover:border-primary/25 hover:text-primary"
              >
                Read My Blog
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/8 bg-surface px-4 py-2 text-sm font-medium text-text/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <DeveloperIllustration />
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            "6+ Years Experience",
            "50+ Projects Delivered",
            "MERN Stack Expert",
            "Available Worldwide",
          ].map((item) => (
            <div key={item} className="rounded-[12px] bg-white px-4 py-5 text-sm font-semibold text-text shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Services
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">What I Build</h2>
          <p className="text-base leading-8 text-text/70">
            Service packages designed to turn readers and founders into shipped products quickly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description, price }) => (
            <article
              key={title}
              className="group rounded-[12px] border border-black/6 bg-white p-7 transition-colors hover:border-primary/25"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[12px] bg-surface text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-text">{title}</h3>
                <p className="text-sm leading-7 text-text/70">{description}</p>
                <div className="text-sm font-semibold text-primary">{price}</div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-text transition-colors group-hover:text-primary"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[12px] border-y border-black/6 py-8">
          <AdUnit slot="homepage-mid" format="horizontal" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Content
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Latest From The Blog
            </h2>
            <p className="text-base leading-8 text-text/70">
              Practical tutorials and lessons from building products with the modern MERN stack.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            View all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-[12px] border border-black/6 bg-white"
            >
              <div className="relative h-48 overflow-hidden bg-surface">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text/70">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-5 p-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold leading-8 text-text">{post.title}</h3>
                  <p className="text-sm leading-7 text-text/70">{truncate(post.excerpt, 120)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text/60">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {format(new Date(post.date), "MMM d, yyyy")}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Read more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Affiliate Picks
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Tools I Recommend
            </h2>
            <p className="text-base leading-8 text-text/70">
              Platforms and tools I actually recommend for hosting, shipping, and maintaining modern apps.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {toolRecommendations.map((tool, index) => (
              <a
                key={tool.name}
                href="#"
                className="rounded-[12px] border border-black/6 bg-white p-5 transition-colors hover:border-primary/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-surface text-primary">
                  {index === 0 ? <Globe className="h-5 w-5" /> : null}
                  {index === 1 ? <Rocket className="h-5 w-5" /> : null}
                  {index === 2 ? <BriefcaseBusiness className="h-5 w-5" /> : null}
                  {index === 3 ? <Wrench className="h-5 w-5" /> : null}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text">{tool.name}</h3>
                <p className="text-sm leading-7 text-text/70">{tool.description}</p>
              </a>
            ))}
          </div>

          <p className="mt-5 text-sm text-text/60">
            * Affiliate links — I earn a commission at no extra cost to you
          </p>
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div className="space-y-3 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Newsletter
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get weekly web dev tips, tutorials, and tools.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-white/78">
              Short, practical insights on building faster products, shipping cleaner code, and choosing better tools.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
