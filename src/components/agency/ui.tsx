import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { jsonLd } from "@/lib/site-config";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`ag-eyebrow${light ? " ag-eyebrow-light" : ""}`}>{children}</p>;
}

export function SectionHeader({ eyebrow, title, lead, id, align = "split", light = false }: { eyebrow: string; title: ReactNode; lead?: ReactNode; id?: string; align?: "split" | "stack"; light?: boolean }) {
  return (
    <div className={`ag-section-header ag-section-header-${align} ag-reveal`}>
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 id={id} className="ag-h2">{title}</h2>
      </div>
      {lead ? <p className="ag-lead">{lead}</p> : null}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="ag-breadcrumbs">
      <ol>
        {items.map((item, index) => (
          <li key={item.name}>
            {item.path && index < items.length - 1 ? <Link href={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ faqs, headingId }: { faqs: readonly { question: string; answer: string }[]; headingId?: string }) {
  return (
    <div className="ag-faq-list" aria-labelledby={headingId}>
      {faqs.map((faq) => (
        <details key={faq.question} className="ag-faq-item">
          <summary><h3>{faq.question}</h3><span className="ag-faq-icon" aria-hidden="true"><Plus size={18} /></span></summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ eyebrow = "Start a project", title, text, primary = { href: "/contact", label: "Let's Build Something Great" }, secondary, whatsapp }: { eyebrow?: string; title: ReactNode; text: ReactNode; primary?: { href: string; label: string }; secondary?: { href: string; label: string }; whatsapp?: { message: string; label: string } }) {
  return (
    <section className="ag-cta-band" aria-label="Start a project">
      <div className="ag-container ag-cta-inner ag-reveal">
        <div>
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h2 className="ag-h2">{title}</h2>
        </div>
        <div className="ag-cta-side">
          <p>{text}</p>
          <div className="ag-actions">
            <Link href={primary.href} className="ag-btn ag-btn-light">{primary.label} <ArrowUpRight size={16} aria-hidden="true" /></Link>
            {secondary ? <Link href={secondary.href} className="ag-btn ag-btn-ghost-light">{secondary.label}</Link> : null}
            {whatsapp ? <WhatsAppButton message={whatsapp.message} label={whatsapp.label} variant="ghost-light" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
