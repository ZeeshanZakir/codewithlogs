import Link from "next/link";
import type { ReactNode } from "react";

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageTemplateProps = {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPageTemplate({
  title,
  description,
  lastUpdated,
  sections,
}: LegalPageTemplateProps) {
  return (
    <div className="bg-background">
      <section className="mx-auto w-full max-w-[800px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Last updated: {lastUpdated}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
              {title}
            </h1>
            <p className="text-base leading-8 text-text/70">{description}</p>
          </div>

          <div className="rounded-xl border border-black/6 bg-surface p-6">
            <h2 className="text-lg font-semibold text-text">Table of Contents</h2>
            <nav className="mt-4 flex flex-col gap-3 text-sm text-text/70">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="transition-colors hover:text-primary"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-text">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-8 text-text/75">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="rounded-xl bg-primary p-6 text-white">
            <p className="text-lg font-semibold">Questions? Contact me</p>
            <p className="mt-2 text-sm leading-7 text-white/80">
              If you have any questions about these policies, please get in touch and I will do my
              best to respond clearly and promptly.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary"
            >
              Questions? Contact me →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
