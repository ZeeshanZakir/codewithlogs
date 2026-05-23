import type { Metadata } from "next";
import Link from "next/link";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Web Development Services That Ship Fast",
  description:
    "Hire a full-stack developer for web apps, SaaS products, backend APIs, and performance optimization. Fast delivery, clean code, and launch-ready builds.",
  openGraph: {
    title: "Web Development Services That Ship Fast",
    description:
      "Client-focused web development services for startups and businesses using Next.js, MERN, and SaaS-focused product engineering.",
    url: `${siteUrl}/services`,
    type: "website",
  },
};

const services = [
  {
    title: "Full-Stack Web Application",
    icon: Code2,
    price: "$500",
    timeline: "1-3 weeks",
    features: [
      "Custom dashboard or product UI built with Next.js and React",
      "Secure backend logic, forms, and database integration",
      "Mobile-friendly responsive layouts with Tailwind CSS",
      "Clean project structure ready for scaling and handoff",
    ],
  },
  {
    title: "SaaS Product Development",
    icon: Rocket,
    price: "$800",
    timeline: "2-6 weeks",
    features: [
      "MVP architecture focused on launch speed and conversion",
      "Authentication, billing-ready flows, and admin tooling",
      "Feature planning for onboarding, retention, and growth",
      "Launch support for Vercel deployments and product iterations",
    ],
  },
  {
    title: "REST API & Backend Development",
    icon: Server,
    price: "$300",
    timeline: "3-7 days",
    features: [
      "REST API design with clear validation and error handling",
      "Node.js and Express backend services with MongoDB integration",
      "Admin endpoints, automation workflows, and third-party integrations",
      "Performance-minded architecture with maintainable code boundaries",
    ],
  },
  {
    title: "Website Speed & Performance Optimization",
    icon: Wrench,
    price: "$150",
    timeline: "2-3 days",
    features: [
      "Page speed audits for Core Web Vitals bottlenecks",
      "Image, bundle, and rendering optimization for faster UX",
      "Next.js performance fixes for slow routes and layouts",
      "Actionable implementation notes and post-fix verification",
    ],
  },
];

const techStack = [
  { label: "Next.js", icon: Code2 },
  { label: "React", icon: Code2 },
  { label: "Node.js", icon: Server },
  { label: "Express", icon: Server },
  { label: "MongoDB", icon: BriefcaseBusiness },
  { label: "TypeScript", icon: Code2 },
  { label: "Tailwind CSS", icon: Wrench },
  { label: "REST APIs", icon: Server },
  { label: "Vercel", icon: Globe },
  { label: "AWS", icon: Globe },
];

const processSteps = [
  {
    title: "Discovery Call",
    description: "We clarify scope, business goals, and the fastest path to a useful outcome.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Proposal & Timeline",
    description: "You get a clear breakdown of deliverables, pricing, and milestones before work starts.",
    icon: CalendarDays,
  },
  {
    title: "Development",
    description: "I build in focused iterations with regular updates so the project keeps moving quickly.",
    icon: Code2,
  },
  {
    title: "Delivery & Support",
    description: "You receive the finished product, launch help, and follow-up support for polish and fixes.",
    icon: Rocket,
  },
];

const reasons = [
  {
    title: "6+ Years Experience",
    description: "Hands-on delivery across content sites, dashboards, SaaS builds, and backend systems.",
  },
  {
    title: "Clean, Documented Code",
    description: "Readable code structure, sensible naming, and practical implementation decisions that scale.",
  },
  {
    title: "Post-Launch Support",
    description: "I stay available for launch fixes, optimizations, and the next phase of the product roadmap.",
  },
];

const testimonials = [
  {
    quote:
      "Zeesh moved our product from vague concept to working MVP much faster than expected. Communication was clear, the code was organized, and the launch went smoothly.",
    name: "Adeel Rahman",
    company: "FinFlow Labs",
  },
  {
    quote:
      "We hired him to improve app performance and ended up continuing for backend work too. He understands both product speed and engineering quality.",
    name: "Mariam Yusuf",
    company: "Northlane Digital",
  },
  {
    quote:
      "The best part was reliability. Timelines were realistic, updates were consistent, and the final build was ready to hand off to our internal team.",
    name: "Daniel Shah",
    company: "SprintStack",
  },
];

const faqs = [
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes. If your project requires confidentiality before sharing product details, designs, or business plans, I am comfortable signing a mutual NDA before kickoff.",
  },
  {
    question: "Do you offer revisions?",
    answer:
      "Yes. Every project includes a revision window so we can refine details after review. The exact number depends on scope, but I always aim for a collaborative and practical handoff process.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "I typically work with bank transfer or other standard remote payment methods. For larger projects, I prefer milestone-based payments tied to clear deliverables.",
  },
  {
    question: "Can you work with my existing codebase?",
    answer:
      "Yes. I can join an existing project, audit the current architecture, fix issues, extend features, and help stabilize or improve maintainability without forcing a full rewrite unless it is truly needed.",
  },
  {
    question: "Do you offer maintenance after delivery?",
    answer:
      "Yes. I offer post-launch support for bug fixes, performance improvements, and ongoing feature work so your product stays healthy after the initial release.",
  },
];

function StarRating() {
  return (
    <div className="flex items-center gap-1 text-primary" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="text-base">
          ★
        </span>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Services
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Web Development Services That Ship Fast
            </h1>
            <p className="max-w-3xl text-base leading-8 text-text/70 sm:text-lg">
              I build clean, scalable web applications for startups and businesses. MERN stack,
              Next.js, and SaaS development — delivered on time.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-primary/92"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-text transition-colors hover:border-primary/25 hover:text-primary"
            >
              See My Blog
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            What I Offer
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Services built to move your project forward
          </h2>
          <p className="text-base leading-8 text-text/70">
            Every offer is structured to remove friction, ship quickly, and make it easy for you
            to move from idea to working product.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {services.map(({ title, icon: Icon, price, timeline, features }) => (
            <article
              key={title}
              className="rounded-xl border border-black/6 bg-white p-7 shadow-sm transition-colors hover:border-primary/20"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-surface text-primary">
                <Icon className="h-6 w-6" />
              </div>

              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-text">{title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text/62">
                    <span className="inline-flex items-center gap-2 font-semibold text-primary">
                      <BriefcaseBusiness className="h-4 w-4" />
                      Starting at {price}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      {timeline}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm leading-7 text-text/72">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/92"
                >
                  Get Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
          <div className="mb-10 max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Tech Stack
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Technologies I Work With
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {techStack.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-black/6 bg-white px-4 py-4 text-sm font-medium text-text/75"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Process
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            A simple process that keeps your project moving
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {processSteps.map(({ title, description, icon: Icon }, index) => (
            <div key={title} className="relative rounded-xl border border-black/6 bg-white p-6">
              {index < processSteps.length - 1 ? (
                <span className="absolute right-[-12px] top-10 hidden h-px w-6 bg-black/10 lg:block" />
              ) : null}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Step {index + 1}
                </p>
                <h3 className="text-xl font-semibold text-text">{title}</h3>
                <p className="text-sm leading-7 text-text/70">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
          <div className="mb-10 max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Why Hire Me
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Reliable delivery with product-minded engineering
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {reasons.map(({ title, description }) => (
              <div key={title} className="rounded-xl border border-black/6 bg-white p-7">
                <h3 className="text-xl font-semibold text-text">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            What clients appreciate most
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map(({ quote, name, company }) => (
            <article key={name} className="rounded-xl border border-black/6 bg-white p-7">
              <StarRating />
              <p className="mt-5 text-base leading-8 text-text/76">&ldquo;{quote}&rdquo;</p>
              <div className="mt-6 border-t border-black/6 pt-5">
                <p className="font-semibold text-text">{name}</p>
                <p className="text-sm text-text/60">{company}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
          <div className="mb-10 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              FAQ
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Questions clients usually ask before hiring
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-xl border border-black/6 bg-white p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-text">
                  <span>{question}</span>
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 pr-6 text-sm leading-7 text-text/70">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="space-y-3 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Ready to start?
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to start your project? Let&apos;s talk.
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-primary transition-transform hover:-translate-y-0.5"
          >
            Contact Me Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
