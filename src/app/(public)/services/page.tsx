import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { services, servicePath } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema, organizationId, organizationSchema } from "@/lib/site-config";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd, SectionHeader } from "@/components/agency/ui";

const title = "Digital Agency Services: Web, Design, SEO & Marketing";
const description =
  "Explore CodeWithLogs services: web design and development, UI/UX, web and mobile apps, e-commerce, SEO, digital marketing, branding, AI automation and ongoing support.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/services` },
  openGraph: { ...openGraphDefaults, title: `${title} | CodeWithLogs`, description, url: `${siteUrl}/services`, type: "website" },
  twitter: { card: "summary_large_image", title: `${title} | CodeWithLogs`, description },
};

const groups = [
  { title: "Build", text: "Websites, web applications, mobile apps and online stores.", slugs: ["website-design-development", "web-application-development", "mobile-app-development", "ecommerce-development"] },
  { title: "Design", text: "Interfaces, identities and creative that people remember.", slugs: ["ui-ux-design", "branding-creative"] },
  { title: "Grow", text: "Visibility, traffic, leads and smarter operations.", slugs: ["seo-services", "digital-marketing", "ai-automation"] },
  { title: "Sustain", text: "Care and improvement after launch.", slugs: ["support-maintenance"] },
];

export default function ServicesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
      {
        "@type": "ItemList",
        name: "CodeWithLogs services",
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@type": "Service", name: service.name, url: `${siteUrl}${servicePath(service.slug)}`, provider: { "@id": organizationId } },
        })),
      },
    ],
  };

  return (
    <div className="ag-page">
      <JsonLd data={structuredData} />
      <section className="ag-page-hero">
        <div className="ag-container">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Services" }]} />
          <div className="ag-page-hero-grid">
            <div>
              <Eyebrow>Bold ideas. Beautiful design. Real business growth.</Eyebrow>
              <h1 className="ag-page-title">Digital Services to Design, Build and <span className="ag-hl">Grow Your Business.</span></h1>
            </div>
            <p className="ag-page-intro">As a full-service digital agency, we cover the whole journey: brand, website, product, search, marketing and the support that keeps it all running. Use one service or combine several; either way, you work with one team that understands the full picture.</p>
          </div>
        </div>
      </section>

      <section className="ag-section" aria-label="All services">
        <div className="ag-container">
          <ol className="ag-service-index">
            {services.map((service) => (
              <li key={service.slug} className="ag-service-row ag-reveal">
                <Link href={servicePath(service.slug)}>
                  <span className="num">{service.number}</span>
                  <h2>{service.name}</h2>
                  <p>{service.summary}</p>
                  <span className="arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ag-section ag-svc-band" aria-labelledby="combine-title">
        <div className="ag-container">
          <SectionHeader id="combine-title" eyebrow="How services connect" title="Better Together, by Design." lead="Most projects touch more than one discipline. Because design, engineering and marketing sit in one team, the hand-offs that usually slow projects down simply disappear." />
          <ul className="ag-svc-benefits">
            {groups.map((group) => (
              <li key={group.title} className="ag-reveal">
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <p>
                  {group.slugs.map((slug, index) => {
                    const service = services.find((item) => item.slug === slug)!;
                    return <span key={slug}>{index > 0 ? " · " : ""}<Link href={servicePath(slug)} className="ag-inline-link">{service.name}</Link></span>;
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={<>Not Sure Which Service You Need? <span className="ag-hl">Let&apos;s Talk It Through.</span></>}
        text="Tell us about your goals and we'll recommend the right mix of services, with a clear scope and timeline."
      />
    </div>
  );
}
