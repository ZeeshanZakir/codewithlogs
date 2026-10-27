import Link from "next/link";
import type { FaqItem } from "@/lib/faq-content";

type FaqSectionProps = {
  items: readonly FaqItem[];
  className?: string;
  editorial?: boolean;
};

// Expanded semantic content: readable in the initial HTML without client state.
export function FaqSection({ items, className = "", editorial = false }: FaqSectionProps) {
  const headingId = `${items[0].id}-heading`;
  return (
    <section aria-labelledby={headingId} className={`min-w-0 space-y-6 ${className}`}>
      <h2 id={headingId} className={editorial ? "text-[28px] font-[550] leading-tight tracking-tight text-text sm:text-[34px]" : "text-3xl font-bold tracking-tight text-text"}>
        Frequently asked questions
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className={editorial ? "border-b border-black/10 pb-6" : "rounded-[24px] border border-black/6 bg-white p-6"}>
            <h3 className="text-lg font-semibold text-text [overflow-wrap:anywhere]">{item.question}</h3>
            <p className="mt-2 max-w-4xl text-base leading-8 text-text/70 [overflow-wrap:anywhere]">{item.answer}</p>
            {item.links.length > 0 && (
              <ul className="mt-3 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
