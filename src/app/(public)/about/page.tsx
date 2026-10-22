import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About CodeWithLogs & Zeeshan Zakir",
  description:
    "Meet Zeeshan Zakir, the author behind CodeWithLogs, and learn about the focus on modern JavaScript developer troubleshooting and tools.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About CodeWithLogs & Zeeshan Zakir",
    description:
      "The publication, topics and evidence standard behind CodeWithLogs.",
    url: `${siteUrl}/about`,
    type: "profile",
  },
};

const topicGroups = [
  { title: "Next.js", topics: ["App Router", "Debugging", "Rendering", "Deployment"] },
  { title: "Node.js & npm", topics: ["Dependency errors", "Package scripts", "Runtime configuration"] },
  { title: "Supabase", topics: ["Authentication", "Row Level Security", "Database troubleshooting"] },
  { title: "Development setup", topics: ["Windows", "VS Code", "Git", "Vercel"] },
  { title: "Free tools", topics: ["Error decoder", "package.json inspector", "JSON utilities"] },
];

const editorialSteps = [
  "Identify the error and affected environment.",
  "Explain the likely cause and the scope of the example.",
  "Provide diagnostic steps, code and official references.",
  "Distinguish expected results from actual test evidence.",
  "Review corrections and document remaining limitations.",
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/ZeeshanZakir/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.74 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/zeeshan-zakir-profile/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56c0-1.07-.8-1.94-1.91-1.94-1.12 0-1.91.87-1.91 1.94 0 1.06.78 1.93 1.88 1.93h.02c1.14 0 1.92-.87 1.92-1.93ZM20 13.05c0-3.36-1.79-4.92-4.18-4.92-1.93 0-2.8 1.08-3.28 1.84V8.5H9.16c.05.98 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.68.88-1.39 1.9-1.39 1.34 0 1.88 1.05 1.88 2.58V20H20v-6.95Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/ZeshanM04610735",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M18.9 2H22l-6.77 7.73L23.2 22h-6.25l-4.9-7.43L5.55 22H2.43l7.24-8.27L2 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.46 3.9H5.6L17.8 20Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "Website",
    href: "https://www.zeeshanzakir.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="journal-container about-publication"><p className="eyebrow">About CodeWithLogs</p><h2>Fix Your Development Errors. Step by Step.</h2><p>CodeWithLogs focuses on Next.js debugging, Node.js/npm errors, Supabase troubleshooting, and practical developer tools. Windows, VS Code, Git and deployment guides support that work. The archive contains guides and explanations with their evidence status shown on each article.</p><p>A published date is not a technical test record. See the <Link href="/editorial-policy">editorial and verification policy</Link> for how guide status is assessed.</p></section>
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <Image
            src="/images/zeeshan-zakir.webp"
            alt="Zeeshan Zakir"
            width={140}
            height={140}
            loading="eager"
            className="h-[140px] w-[140px] rounded-full border-4 border-white object-cover shadow-sm"
          />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Zeeshan Zakir
          </h1>
          <p className="mt-3 text-lg text-text/70">Author of CodeWithLogs</p>

          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-text/70 transition-colors hover:border-primary/20 hover:text-primary"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              The publication
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              What you will find here
            </h2>
            <div className="space-y-5 text-base leading-8 text-text/75">
              <p>
                CodeWithLogs is an independent developer resource focused on practical troubleshooting
                guides, modern JavaScript development, and free tools. Our content covers Next.js,
                Node.js, npm, Supabase, Vercel, and everyday development problems.
              </p>
              <p>
                Zeeshan Zakir is the author identified by this website. Articles aim to connect an
                error message with diagnostic steps, an explanation and a way to check the result.
                The tools provide focused browser-based utilities without requiring an account.
              </p>
              <p>
                A published article is not automatically a tested solution. Each guide shows its
                evidence status, and examples may need adjustment for your software versions and
                environment. Report unclear steps or incorrect results through the contact page.
              </p>
              <p>
                Author links are available above, including <a href="https://zeeshanzakir.com" target="_blank" rel="noopener">zeeshanzakir.com</a>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Independent developer resource", "Troubleshooting guides", "Free developer tools"].map((fact) => (
              <span
                key={fact}
                className="rounded-full border border-black/8 bg-surface px-4 py-2 text-sm font-medium text-text/70"
              >
                {fact}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Topics
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              What the guides cover
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
            {topicGroups.map((group) => (
              <div key={group.title} className="rounded-xl border border-black/6 bg-white p-5">
                <h3 className="text-lg font-semibold text-text">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-surface px-3 py-1.5 text-sm text-text/68"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Editorial approach
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              How a guide is reviewed
            </h2>
          </div>

          <div className="space-y-4">
            {editorialSteps.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl border border-black/6 bg-white px-5 py-4"
              >
                <span className="h-3 w-3 rounded-full bg-primary" />
                <p className="text-base text-text/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-black/6 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Useful explanations with clear limits
            </p>
            <p className="mt-4 text-base leading-8 text-text/75">
              The focus is on understanding a problem before changing code or configuration.
              Read the official references and evidence notes, and test security-sensitive
              changes in a disposable environment before using them in production.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-primary p-8 text-white">
          <h2 className="text-3xl font-bold tracking-tight">Found an issue in a guide?</h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-white/80">
            Send the article URL, your software versions and the steps that produced a different
            result. Leave passwords, tokens and private customer data out of your message.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary"
          >
            Contact &amp; corrections
          </Link>
        </div>
      </section>
    </div>
  );
}
