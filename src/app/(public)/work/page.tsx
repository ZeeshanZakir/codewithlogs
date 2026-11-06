import type { Metadata } from "next";
import { Info } from "lucide-react";
import { ProjectCard } from "@/components/agency/ProjectCard";
import { openGraphDefaults } from "@/lib/open-graph";
import { caseStudies, publishedCaseStudies } from "@/lib/work";
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
  const conceptStudies = caseStudies.filter((study) => study.isPlaceholder);
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
          <h2 id="work-list-title" className="ag-h2" style={{ marginTop: 0, marginBottom: 40 }}>Client work</h2>
          <div className="pc-grid">
            {publishedCaseStudies.map((study) => <ProjectCard key={study.slug} study={study} size="large" />)}
          </div>
          {conceptStudies.length > 0 && (
            <>
              <h2 className="ag-h2" style={{ marginTop: "clamp(72px, 9vw, 120px)", marginBottom: 24 }}>Concept studies</h2>
              <p className="ag-notice" role="note" style={{ marginBottom: 40 }}>
                <Info size={18} aria-hidden="true" />
                <span>These are <strong>concept studies, not client work</strong>. They show our design approach while more client case studies are prepared for publication.</span>
              </p>
              <div className="pc-grid pc-grid-concepts">
                {conceptStudies.map((study) => <ProjectCard key={study.slug} study={study} size="medium" />)}
              </div>
            </>
          )}
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
