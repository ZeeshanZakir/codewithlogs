import type { Metadata } from "next";
import Link from "next/link";
import { openGraphDefaults } from "@/lib/open-graph";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema, organizationId, siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs, Eyebrow, JsonLd } from "@/components/agency/ui";

const title = "Contact CodeWithLogs: Start Your Project";
const description =
  "Tell CodeWithLogs about your website, app, branding, SEO or marketing project. Share your goals and we'll explore how we can help.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: { ...openGraphDefaults, title, description, url: `${siteUrl}/contact`, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const nextSteps = [
  "We read your message and reply by email, usually with a few questions.",
  "We arrange a short call to understand your goals, timeline and constraints.",
  "You receive a recommended approach with a clear scope and estimate.",
];

export default function ContactPage() {
  return (
    <div className="ag-page">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "ContactPage", "@id": `${siteUrl}/contact#webpage`, url: `${siteUrl}/contact`, name: title, about: { "@id": organizationId } }, breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])] }} />
      <section className="ag-page-hero">
        <div className="ag-container">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact" }]} />
          <Eyebrow>Contact</Eyebrow>
          <h1 className="ag-page-title">Have a Project in Mind? <span className="ag-hl">Let&apos;s Make It Happen.</span></h1>
          <p className="ag-page-intro">Tell us what you&apos;re building, what challenges you&apos;re facing, or where you want to grow. We&apos;d love to explore how we can help.</p>
        </div>
      </section>

      <section className="ag-section" style={{ paddingTop: "clamp(40px, 5vw, 72px)" }} aria-label="Contact form and details">
        <div className="ag-container ag-contact-grid">
          <ContactForm />
          <aside className="ag-contact-aside">
            <section>
              <h2>Email us</h2>
              <p><a href={`mailto:${siteConfig.contactEmail}`} className="ag-contact-email">{siteConfig.contactEmail}</a></p>
            </section>
            <section>
              <h2>What happens next</h2>
              <ol>{nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>
            </section>
            <section>
              <h2>Questions about an article?</h2>
              <p>Choose &ldquo;Article question or correction&rdquo; and include the article link, your software versions and the steps that produced a different result. Please leave passwords, tokens and private customer data out of your message.</p>
            </section>
            <section>
              <h2>Elsewhere</h2>
              <p>
                <a href={siteConfig.companyLinkedIn} target="_blank" rel="noopener noreferrer" className="ag-inline-link">LinkedIn</a>
                {" · "}
                <a href="https://github.com/ZeeshanZakir/" target="_blank" rel="noopener noreferrer" className="ag-inline-link">GitHub</a>
                {" · "}
                <Link href="/about" className="ag-inline-link">About us</Link>
              </p>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
