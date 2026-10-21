import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact/ContactForm";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact & Article Corrections",
  description:
    "Ask a development question, report an issue in a tutorial, or contact Zeeshan Zakir about CodeWithLogs.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Contact & Article Corrections",
    description:
      "Contact CodeWithLogs with tutorial questions, corrections, collaborations, or project enquiries.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

const infoCards = [
  {
    title: "Email",
    body: "info@codewithlogs.com",
  },
  {
    title: "Article corrections",
    body: "Include an article URL and your software versions for tutorial questions.",
  },
  {
    title: "Signup preferences",
    body: "Use this form to request changes to an article-update signup or ask for its removal.",
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/ZeeshanZakir/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/code-with-logs" },
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
              Questions, corrections, or a hello.
            </h1>
            <p className="text-base leading-8 text-text/70 sm:text-lg">
              Found an issue in a tutorial? Include the article link, your framework version, and steps to reproduce it. For project enquiries, share your timeline and budget.
              You can also email me directly below.
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
                <p className="mt-3 text-base leading-8 text-text/75">{card.title === "Email" ? <a href={`mailto:${card.body}`} className="underline underline-offset-4">{card.body}</a> : card.body}</p>
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
