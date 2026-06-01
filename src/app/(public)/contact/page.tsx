import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact/ContactForm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";

export const metadata: Metadata = {
  title: "Let's Work Together | Contact",
  description:
    "Get in touch for new projects, freelance work, collaborations, or development questions. I reply within 24 hours.",
  openGraph: {
    title: "Let's Work Together | Contact",
    description:
      "Contact Zeeshan Zakir for web development projects, freelance work, and collaborations.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

const infoCards = [
  {
    title: "Email",
    body: "contact@codewithlogs.com",
  },
  {
    title: "Response Time",
    body: "I reply within 24 hours",
  },
  {
    title: "Availability",
    body: "Available for new projects",
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/ZeeshanZakir/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zeeshan-zakir-profile/" },
];

export default function ContactPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-black/5 bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Contact
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
              Let&apos;s Work Together
            </h1>
            <p className="text-base leading-8 text-text/70 sm:text-lg">
              Tell me about your project, timeline, and budget. If it looks like a good fit,
              I&apos;ll reply with the next steps.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <ContactForm />

          <aside className="space-y-5">
            {infoCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-black/6 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  {card.title}
                </p>
                <p className="mt-3 text-base leading-8 text-text/75">{card.body}</p>
              </div>
            ))}

            <div className="rounded-xl border border-black/6 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Social
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/8 bg-surface px-4 py-2 text-sm font-medium text-text/70 transition-colors hover:border-primary/20 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
