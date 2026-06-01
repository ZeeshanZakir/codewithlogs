import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "About Zeeshan Zakir | Full-Stack MERN Developer",
  description:
    "Learn more about Zeeshan Zakir, a full-stack MERN developer with 6 years of experience building web apps, SaaS products, and developer-focused content.",
  openGraph: {
    title: "About Zeeshan Zakir | Full-Stack MERN Developer",
    description:
      "Background, skills, experience, and the story behind this developer blog.",
    url: `${siteUrl}/about`,
    type: "profile",
  },
};

const skillGroups = [
  {
    title: "Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "REST APIs", "Authentication", "Validation"],
  },
  {
    title: "Database",
    skills: ["MongoDB", "Mongoose", "Schema Design", "Query Optimization"],
  },
  {
    title: "DevOps",
    skills: ["Vercel", "Deployment", "Performance", "Environment Config"],
  },
  {
    title: "Tools",
    skills: ["Git", "Cursor", "VS Code", "Postman", "GitHub"],
  },
];

const milestones = [
  "2019 - Started learning web development",
  "2020 - First freelance client",
  "2021 - Specialized in MERN stack",
  "2023 - Started building SaaS products",
  "2025 - Launched this developer blog",
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
    label: "Twitter",
    href: "https://twitter.com/ZeeshanZakir",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M18.9 2H22l-6.77 7.73L23.2 22h-6.25l-4.9-7.43L5.55 22H2.43l7.24-8.27L2 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.46 3.9H5.6L17.8 20Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border border-black/6 bg-white text-3xl font-semibold text-primary">
            ZZ
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Zeeshan Zakir
          </h1>
          <p className="mt-3 text-lg text-text/70">Full-Stack MERN Developer</p>

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
              My Story
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              About Me
            </h2>
            <div className="space-y-5 text-base leading-8 text-text/75">
              <p>
                I have spent the last 6 years growing as a full-stack developer, starting with
                simple HTML and CSS projects and gradually building the confidence to work on
                real-world client websites. What began as curiosity quickly became a serious path
                once I realized how much I enjoyed turning ideas into working products on the web.
              </p>
              <p>
                The turning point for me was JavaScript. Once I understood how much interactivity,
                logic, and product thinking could live inside a web application, I leaned fully into
                modern frontend and backend development. Over time I specialized in the MERN stack,
                working with React, Node.js, Express, and MongoDB to deliver applications that are
                not only functional, but also maintainable and scalable.
              </p>
              <p>
                Today I focus on building SaaS products, content-driven platforms, and custom web
                tools for founders and businesses. I care deeply about clean code, performance, and
                developer education. This blog exists because I want to share practical lessons,
                better tools, and the kind of no-fluff guidance I wish I had when I was learning.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Based in Pakistan", "Available Worldwide", "English + Urdu"].map((fact) => (
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
              Skills
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              What I work with day to day
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
            {skillGroups.map((group) => (
              <div key={group.title} className="rounded-xl border border-black/6 bg-white p-5">
                <h3 className="text-lg font-semibold text-text">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface px-3 py-1.5 text-sm text-text/68"
                    >
                      {skill}
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
              Experience
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Timeline
            </h2>
          </div>

          <div className="space-y-4">
            {milestones.map((item) => (
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
              What I Write About
            </p>
            <p className="mt-4 text-base leading-8 text-text/75">
              On this blog, I share tutorials, tool reviews, and real-world lessons from 6 years
              of professional development. No fluff — only content I wish existed when I was
              learning.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-primary p-8 text-white">
          <h2 className="text-3xl font-bold tracking-tight">Want to work together?</h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-white/80">
            If you need a developer for a product build, client project, or performance-focused web
            app, I&apos;d love to hear more about it.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </div>
  );
}
