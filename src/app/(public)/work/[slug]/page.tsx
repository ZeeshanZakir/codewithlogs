import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { caseStudies, getCaseStudy } from "@/lib/work";
import { getService, servicePath } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema, organizationId } from "@/lib/site-config";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd } from "@/components/agency/ui";
import { ServiceVisual } from "@/components/agency/ServiceVisual";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const url = `${siteUrl}/work/${study.slug}`;
  return {
    title: study.isPlaceholder ? `Concept study: ${study.title}` : study.title,
    description: study.description,
    alternates: { canonical: url },
    // Placeholder layouts must never be indexed.
    robots: study.isPlaceholder ? { index: false, follow: true } : undefined,
    openGraph: { ...openGraphDefaults, title: `${study.title} | CodeWithLogs`, description: study.description, url, type: "article" },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const services = study.services.map((slug) => getService(slug)).filter((service) => service !== undefined);

  return (
    <div className="ag-page">
      {!study.isPlaceholder && <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: study.title, path: `/work/${study.slug}` }]), { "@type": "CreativeWork", "@id": `${siteUrl}/work/${study.slug}#work`, name: study.title, description: study.description, url: `${siteUrl}/work/${study.slug}`, ...(study.coverImage ? { image: `${siteUrl}${study.coverImage.src}` } : {}), creator: { "@id": organizationId }, ...(study.year ? { dateCreated: study.year } : {}), keywords: study.technologies.join(", ") }] }} />}
      <section className="ag-page-hero">
        <div className="ag-container">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: study.title }]} />
          {study.isPlaceholder && (
            <p className="ag-notice" role="note" style={{ marginTop: 28 }}>
              <Info size={18} aria-hidden="true" />
              <span><strong>This is a concept study, not client work.</strong> No client, results or project shown here are real. It demonstrates our design approach and how case studies will be structured.</span>
            </p>
          )}
          <Eyebrow>{study.industry}{study.year ? ` · ${study.year}` : ""}</Eyebrow>
          <h1 className="ag-page-title">{study.title}</h1>
          <p className="ag-page-intro">{study.description}</p>
        </div>
      </section>

      <section className="ag-section" style={{ paddingTop: 0 }} aria-label="Project details">
        <div className="ag-container">
          <dl className="ag-case-meta">
            <div><dt>Client</dt><dd>{study.client}</dd></div>
            <div><dt>Industry</dt><dd>{study.industry}</dd></div>
            <div><dt>Services</dt><dd>{services.map((service, index) => <span key={service.slug}>{index > 0 ? ", " : ""}<Link href={servicePath(service.slug)} className="ag-inline-link">{service.name}</Link></span>)}</dd></div>
            <div><dt>Technologies</dt><dd>{study.technologies.join(", ")}</dd></div>
            {study.credits?.map((credit) => <div key={credit.role + credit.name}><dt>{credit.role}</dt><dd>{credit.url ? <a href={credit.url} target="_blank" rel="noopener noreferrer" className="ag-inline-link">{credit.name}</a> : credit.name}</dd></div>)}
          </dl>

          {study.coverImage ? (
            <figure className="ag-case-shot"><Image src={study.coverImage.src} alt={study.coverImage.alt} width={study.coverImage.width} height={study.coverImage.height} sizes="(max-width: 1240px) 100vw, 1240px" priority /></figure>
          ) : study.visual ? (
            <div className="ag-case-cover ag-case-cover-visual"><ServiceVisual kind={study.visual} /></div>
          ) : null}

          <div className="ag-case-body">
            <h2>The challenge</h2>
            <p>{study.challenge}</p>
            <h2>The solution</h2>
            <p>{study.solution}</p>
            <h2>Outcomes</h2>
            {study.outcomes.length ? (
              <ul>{study.outcomes.map((outcome) => <li key={outcome.label}><p>{outcome.label} <small>({outcome.source})</small></p></li>)}</ul>
            ) : (
              <p>Outcomes are published only when they are measured and approved by the client. None are listed for this entry.</p>
            )}
          </div>

          {study.gallery?.length ? (
            <div className="ag-case-gallery">
              {study.gallery.map((image) => <figure key={image.src} className={`ag-case-shot${image.width >= 1200 ? " ag-case-shot-wide" : ""}`}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 768px) 100vw, 1240px" /></figure>)}
            </div>
          ) : null}
          {study.liveUrl ? <p style={{ marginTop: 32 }}><a href={study.liveUrl} className="ag-link" target="_blank" rel="noopener noreferrer">Visit the live project</a></p> : null}
        </div>
      </section>

      <CtaBand title={<>Have a Project <span className="ag-hl">Like This in Mind?</span></>} text="Tell us about your goals. We'll help you plan the right approach." secondary={{ href: "/work", label: "Back to Work" }} />
    </div>
  );
}
