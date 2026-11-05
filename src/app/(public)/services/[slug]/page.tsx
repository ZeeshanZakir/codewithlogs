import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { getService, servicePath, services, type Service } from "@/lib/services";
import { getAllPosts } from "@/lib/mdx";
import { getInsightCategory } from "@/lib/insights";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema, faqSchema, organizationId, organizationSchema } from "@/lib/site-config";
import { Breadcrumbs, CtaBand, Eyebrow, FaqList, JsonLd, SectionHeader } from "@/components/agency/ui";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { TechLogo } from "@/components/agency/TechLogo";
import { StepIcon } from "@/components/agency/StepIcon";
import { serviceWhatsAppMessage } from "@/lib/whatsapp";

export const dynamicParams = false;
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  const url = `${siteUrl}${servicePath(service.slug)}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: { ...openGraphDefaults, title: `${service.metaTitle} | CodeWithLogs`, description: service.metaDescription, url, type: "website" },
    twitter: { card: "summary_large_image", title: `${service.metaTitle} | CodeWithLogs`, description: service.metaDescription },
  };
}

function Benefits({ service }: { service: Service }) {
  return (
    <section className="ag-section" aria-labelledby="benefits-title">
      <div className="ag-container">
        <SectionHeader id="benefits-title" eyebrow="Benefits" title={service.benefitsHeading} />
        <ul className="ag-svc-benefits">
          {service.benefits.map((benefit) => <li key={benefit.title} className="ag-reveal"><h3>{benefit.title}</h3><p>{benefit.text}</p></li>)}
        </ul>
      </div>
    </section>
  );
}

function CapabilitiesGrid({ service }: { service: Service }) {
  return (
    <section className="ag-section ag-svc-band" aria-labelledby="caps-title">
      <div className="ag-container">
        <SectionHeader id="caps-title" eyebrow="Capabilities" title={service.capabilitiesHeading} lead="Each engagement is scoped to what your business needs. Pick one capability or combine several." />
        <ul className="ag-svc-caps-grid">
          {service.capabilities.map((capability) => <li key={capability.title} className="ag-reveal"><h3>{capability.title}</h3><p>{capability.text}</p></li>)}
        </ul>
      </div>
    </section>
  );
}

function CapabilitiesSplit({ service }: { service: Service }) {
  return (
    <section className="ag-section" aria-labelledby="caps-title">
      <div className="ag-container ag-svc-split">
        <div className="ag-reveal">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 id="caps-title" className="ag-h2">{service.capabilitiesHeading}</h2>
          <p className="ag-lead">Everything below can be delivered on its own or as part of a wider project.</p>
          <div className="ag-actions" style={{ marginTop: 28 }}><Link href="/contact" className="ag-btn ag-btn-primary">Discuss your project <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </div>
        <ol className="ag-svc-caps-list">
          {service.capabilities.map((capability) => <li key={capability.title} className="ag-reveal"><h3>{capability.title}</h3><p>{capability.text}</p></li>)}
        </ol>
      </div>
    </section>
  );
}

function CapabilitiesDark({ service }: { service: Service }) {
  return (
    <section className="ag-section ag-dark" aria-labelledby="caps-title">
      <div className="ag-container">
        <SectionHeader light id="caps-title" eyebrow="Capabilities" title={service.capabilitiesHeading} lead={service.approach} />
        <ul className="ag-svc-dark-caps">
          {service.capabilities.map((capability) => <li key={capability.title} className="ag-reveal"><h3>{capability.title}</h3><p>{capability.text}</p></li>)}
        </ul>
      </div>
    </section>
  );
}

function Technologies({ service }: { service: Service }) {
  return (
    <div className="ag-container">
      <div className="ag-svc-tech ag-reveal">
        <h2>Technologies &amp; tools</h2>
        <ul className="ag-tech-logos">{service.technologies.map((technology) => <li key={technology}><TechLogo name={technology} /></li>)}</ul>
      </div>
    </div>
  );
}

function Process({ service, vertical = false }: { service: Service; vertical?: boolean }) {
  return (
    <ol className={`ag-steps${vertical ? " ag-steps-vertical" : ""}`}>
      {service.process.map((step, index) => (
        <li key={step.title} className="ag-reveal">
          <StepIcon title={step.title} />
          <span className="num">Step {String(index + 1).padStart(2, "0")}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

function Audience({ service }: { service: Service }) {
  return (
    <ul className="ag-audience">
      {service.audience.map((item) => <li key={item.title} className="ag-reveal"><strong>{item.title}</strong> {item.text}</li>)}
    </ul>
  );
}

function Quote({ service }: { service: Service }) {
  return (
    <section className="ag-section" aria-label="Our approach" style={{ paddingBlock: "clamp(48px, 6vw, 88px)" }}>
      <div className="ag-container"><blockquote className="ag-svc-quote ag-reveal"><p>{service.approach}</p></blockquote></div>
    </section>
  );
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const url = `${siteUrl}${servicePath(service.slug)}`;
  const related = service.related.map((slug) => getService(slug)).filter((item): item is Service => Boolean(item));
  let insights: { slug: string; title: string }[] = [];
  try {
    const posts = await getAllPosts();
    insights = posts.filter((post) => getInsightCategory(post) === service.insightCategory).slice(0, 3).map((post) => ({ slug: post.slug, title: post.title }));
  } catch {
    insights = [];
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        serviceType: service.name,
        description: service.metaDescription,
        url,
        provider: { "@id": organizationId },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: service.capabilitiesHeading,
          itemListElement: service.capabilities.map((capability) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: capability.title, description: capability.text } })),
        },
      },
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name, path: servicePath(service.slug) }]),
      faqSchema(service.faqs),
    ],
  };

  const hero = (
    <section className="ag-page-hero">
      <div className="ag-container">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.name }]} />
        <div className="ag-page-hero-grid">
          <div>
            <Eyebrow>{service.number} / {service.eyebrow}</Eyebrow>
            <h1 className="ag-page-title">{service.h1}</h1>
            <p className="ag-page-intro">{service.intro}</p>
          </div>
          <aside className="ag-svc-hero-aside" aria-label={`${service.name} at a glance`}>
            <p>At a glance</p>
            <ul>{service.capabilities.slice(0, 5).map((capability) => <li key={capability.title}>{capability.title}</li>)}</ul>
            <div className="ag-actions">
              <Link href="/contact" className="ag-btn ag-btn-primary">Start a Project <ArrowUpRight size={16} aria-hidden="true" /></Link>
              <a href="#faq-title" className="ag-btn ag-btn-outline">FAQs</a>
            </div>
            <p className="ag-hero-alt"><WhatsAppButton variant="link" label="Discuss Your Project on WhatsApp" message={serviceWhatsAppMessage(service.name)} /></p>
          </aside>
        </div>
      </div>
    </section>
  );

  const processSection = (vertical: boolean) => (
    <section className="ag-section" aria-labelledby="process-title">
      <div className="ag-container">
        {vertical ? (
          <div className="ag-svc-split">
            <div className="ag-reveal">
              <Eyebrow>Process</Eyebrow>
              <h2 id="process-title" className="ag-h2">{service.processHeading}</h2>
              <h3 className="ag-h3-label" style={{ marginTop: 40 }}>{service.audienceHeading}</h3>
              <Audience service={service} />
            </div>
            <Process service={service} vertical />
          </div>
        ) : (
          <>
            <SectionHeader id="process-title" eyebrow="Process" title={service.processHeading} />
            <Process service={service} />
          </>
        )}
      </div>
    </section>
  );

  const audienceSection = (
    <section className="ag-section ag-svc-band" aria-labelledby="audience-title">
      <div className="ag-container ag-svc-split">
        <div className="ag-reveal">
          <Eyebrow>Who it&apos;s for</Eyebrow>
          <h2 id="audience-title" className="ag-h2">{service.audienceHeading}</h2>
        </div>
        <Audience service={service} />
      </div>
    </section>
  );

  const faqSection = (
    <section className="ag-section" aria-labelledby="faq-title">
      <div className="ag-container ag-faq-grid">
        <div className="ag-reveal">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="ag-h2">{service.name}: common questions</h2>
          <p className="ag-lead">Have a question that isn&apos;t answered here? <Link href="/contact" className="ag-inline-link">Ask us directly.</Link></p>
        </div>
        <FaqList faqs={service.faqs} headingId="faq-title" />
      </div>
    </section>
  );

  const relatedSection = (
    <section className="ag-section ag-svc-band" aria-labelledby="related-title">
      <div className="ag-container">
        <SectionHeader id="related-title" eyebrow="Related services" title="Often Paired With" lead={insights.length ? <>From the blog: {insights.map((post, index) => <span key={post.slug}>{index > 0 ? ", " : ""}<Link href={`/blog/${post.slug}`} className="ag-inline-link">{post.title}</Link></span>)}.</> : <>Read practical articles in our <Link href="/blog" className="ag-inline-link">blog and insights</Link>.</>} />
        <div className="ag-related">
          {related.map((item) => (
            <Link key={item.slug} href={servicePath(item.slug)} className="ag-reveal">
              <span className="num">{item.number}</span>
              <h3>{item.name}</h3>
              <p>{item.summary}</p>
              <span className="ag-link">Learn more <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  const cta = <CtaBand eyebrow={service.eyebrow} title={<>Ready to Talk About <span className="ag-hl">{service.name}?</span></>} text="Share a few details about your goals and timeline. We'll come back with questions, ideas and a clear next step." secondary={{ href: "/services", label: "All services" }} />;

  let body;
  if (service.layout === "editorial") {
    body = <>{hero}<Quote service={service} /><Benefits service={service} /><CapabilitiesGrid service={service} /><div className="ag-section" style={{ paddingBlock: "clamp(48px, 6vw, 80px) 0" }}><Technologies service={service} /></div>{processSection(false)}{audienceSection}{faqSection}{relatedSection}</>;
  } else if (service.layout === "split") {
    body = <>{hero}<CapabilitiesSplit service={service} /><Benefits service={service} />{processSection(true)}<Technologies service={service} /><Quote service={service} />{faqSection}{relatedSection}</>;
  } else {
    body = <>{hero}<Benefits service={service} /><CapabilitiesDark service={service} />{processSection(false)}<Technologies service={service} />{audienceSection}{faqSection}{relatedSection}</>;
  }

  return (
    <div className="ag-page">
      <JsonLd data={structuredData} />
      {body}
      {cta}
    </div>
  );
}
