import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { caseStudies, publishedCaseStudies } from "@/lib/work";
import { getService } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema } from "@/lib/site-config";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd, SectionHeader } from "@/components/agency/ui";

const title = "Work & Case Studies";
const description =
  "How CodeWithLogs presents its work: real case studies covering the challenge, the solution, the services and technology involved, and verified outcomes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/work` },
  openGraph: { ...openGraphDefaults, title: `${title} | CodeWithLogs`, description, url: `${siteUrl}/work`, type: "website" },
  twitter: { card: "summary_large_image", title: `${title} | CodeWithLogs`, description },
};

const caseStudyParts = [
  { title: "The challenge", text: "Where the business started and what needed to change, described in the client's own terms." },
  { title: "The solution", text: "The approach, the key decisions and what was designed and built." },
  { title: "Services & technology", text: "Exactly which disciplines and tools were involved, so you can compare it with your own needs." },
  { title: "Verified outcomes", text: "Results are included only when they are measured, sourced and approved by the client." },
];

export default function WorkPage() {
  const hasRealWork = publishedCaseStudies.length > 0;
  const list = hasRealWork ? publishedCaseStudies : caseStudies;
  return (
    <div className="ag-page">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])] }} />
      <section className="ag-page-hero">
        <div className="ag-container">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Work" }]} />
          <div className="ag-page-hero-grid">
            <div>
              <Eyebrow>Work</Eyebrow>
              <h1 className="ag-page-title">Work We&apos;re Proud to Put <span className="ag-hl">Our Name On.</span></h1>
            </div>
            <p className="ag-page-intro">Every case study here follows the same rule: real projects, real context and only verified results. We publish work once the client has approved it, so this page grows deliberately.</p>
          </div>
        </div>
      </section>

      <section className="ag-section" aria-labelledby="work-list-title">
        <div className="ag-container">
          <h2 id="work-list-title" className="sr-only">{hasRealWork ? "Case studies" : "Case study layout placeholders"}</h2>
          {!hasRealWork && (
            <p className="ag-notice" role="note" style={{ marginBottom: 32 }}>
              <Info size={18} aria-hidden="true" />
              <span>Our first case studies are being prepared for publication. The cards below are <strong>layout placeholders, not real projects</strong>. They show how each case study will be presented.</span>
            </p>
          )}
          <div className="ag-work-grid">
            {list.map((study, index) => (
              <Link key={study.slug} href={`/work/${study.slug}`} className={`ag-work-card ag-work-card-${index + 1} ag-reveal`}>
                <div className="ag-work-media">
                  {study.isPlaceholder ? <span className="ag-placeholder-tag">Placeholder</span> : null}
                  <span className="ag-work-media-art" aria-hidden="true" />
                </div>
                <div className="ag-work-body">
                  <p className="ag-work-meta">{study.industry} · {study.services.map((slug) => getService(slug)?.shortName).filter(Boolean).join(", ")}</p>
                  <h3>{study.title}</h3>
                  <span className="ag-link">{study.isPlaceholder ? "View layout" : "Read case study"} <ArrowUpRight size={15} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ag-section ag-svc-band" aria-labelledby="parts-title">
        <div className="ag-container">
          <SectionHeader id="parts-title" eyebrow="What every case study covers" title="The Full Story, Not Just the Screenshots." lead="Good case studies help you judge whether we are the right partner. That means showing the thinking, not only the finished visuals." />
          <ul className="ag-svc-benefits">
            {caseStudyParts.map((part) => <li key={part.title} className="ag-reveal"><h3>{part.title}</h3><p>{part.text}</p></li>)}
          </ul>
        </div>
      </section>

      <CtaBand title={<>Could Your Project Be <span className="ag-hl">Our Next Case Study?</span></>} text="We're taking on new projects. Tell us what you're working on and we'll explore how we can help." secondary={{ href: "/services", label: "Explore Our Services" }} />
    </div>
  );
}
