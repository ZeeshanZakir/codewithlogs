import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { services, servicePath } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema, organizationId, organizationSchema, siteConfig } from "@/lib/site-config";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd, SectionHeader } from "@/components/agency/ui";
import { SocialLinks } from "@/components/agency/SocialLinks";

const title = "About CodeWithLogs: A Creative and Technical Digital Agency";
const description =
  "Meet CodeWithLogs, a technology-driven creative agency founded by Zeeshan Zakir. Learn about our approach, values and how we work with startups, SMBs and growing brands.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: { ...openGraphDefaults, title, description, url: `${siteUrl}/about`, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const values = [
  { title: "Clarity over complexity", text: "We explain decisions in plain language and keep solutions as simple as the problem allows." },
  { title: "Craft in the details", text: "Spacing, speed, accessibility and copy all matter. Small details add up to trust." },
  { title: "Honesty first", text: "Realistic timelines, transparent pricing and no promises we cannot keep, including on rankings." },
  { title: "Built to last", text: "Readable code, documented systems and designs that can evolve without a rebuild." },
  { title: "Measured progress", text: "We define success early and use real data to decide what to improve next." },
  { title: "Partnership", text: "We care about what happens after launch as much as the launch itself." },
];

const workingSteps = [
  { title: "One point of contact", text: "You always know who to talk to, and that person understands your whole project." },
  { title: "Visible progress", text: "Regular check-ins, shared timelines and working previews instead of long silences." },
  { title: "Collaborative decisions", text: "We bring recommendations and reasoning; you make the final calls with full context." },
  { title: "Clean handover", text: "Documentation, access and training, so you are never locked in." },
];

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": "Person",
        "@id": `${siteUrl}/about#founder`,
        name: siteConfig.founder.name,
        jobTitle: "Founder",
        image: `${siteUrl}${siteConfig.founder.image}`,
        url: siteConfig.founder.url,
        worksFor: { "@id": organizationId },
        sameAs: siteConfig.social.map((link) => link.href),
      },
      { "@type": "AboutPage", "@id": `${siteUrl}/about#webpage`, url: `${siteUrl}/about`, name: title, about: { "@id": organizationId } },
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
    ],
  };

  return (
    <div className="ag-page">
      <JsonLd data={structuredData} />
      <section className="ag-page-hero">
        <div className="ag-container">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About" }]} />
          <div className="ag-about-hero-grid">
            <div>
              <Eyebrow>About CodeWithLogs</Eyebrow>
              <h1 className="ag-page-title">A Creative Mindset. A Technical Edge. <span className="ag-hl">A Partner in Your Growth.</span></h1>
              <p className="ag-page-intro">CodeWithLogs is a technology-driven creative agency. We help startups, small and medium businesses, e-commerce brands, SaaS companies and corporate teams design, build and grow their digital presence.</p>
            </div>
            <div className="ag-founder-card">
              <Image src={siteConfig.founder.image} alt="Portrait of Zeeshan Zakir, founder of CodeWithLogs" width={420} height={420} priority sizes="(max-width: 1023px) 420px, 30vw" />
              <h2>{siteConfig.founder.name}</h2>
              <p>Founder, CodeWithLogs</p>
              <SocialLinks owner={siteConfig.founder.name} />
            </div>
          </div>
        </div>
      </section>

      <section className="ag-section" aria-labelledby="who-title">
        <div className="ag-container ag-prose-cols">
          <div className="ag-reveal">
            <Eyebrow>Who we are</Eyebrow>
            <h2 id="who-title" className="ag-h2">Design and Engineering, in the Same Room.</h2>
          </div>
          <div className="ag-body ag-reveal">
            <p>CodeWithLogs began with a developer&apos;s habit: understand the problem fully before changing anything. That habit still shapes how we work. Before we design a page or write a line of code, we want to understand your business, your customers and what success looks like for you.</p>
            <p>Today we combine strategy, design, development and marketing in one team. That means your brand, website, product and growth work are planned together instead of being stitched together later by different suppliers.</p>
            <p>Alongside client work, we publish practical articles and free developer tools on this site. Writing about what we learn keeps our thinking sharp and gives something back to the community we build with.</p>
          </div>
        </div>
      </section>

      <section className="ag-section ag-svc-band" aria-labelledby="what-title">
        <div className="ag-container">
          <SectionHeader id="what-title" eyebrow="What we do" title="Everything Digital, One Partner." lead="Ten connected services, from first brand identity to ongoing support. Use one, or combine them as your business grows." />
          <ul className="ag-tags" style={{ listStyle: "none" }}>
            {services.map((service) => <li key={service.slug}><Link href={servicePath(service.slug)} className="ag-btn ag-btn-outline" style={{ minHeight: 42, fontWeight: 500 }}>{service.name}</Link></li>)}
          </ul>
        </div>
      </section>

      <section className="ag-section" aria-labelledby="mission-title">
        <div className="ag-container">
          <Eyebrow>Mission</Eyebrow>
          <h2 id="mission-title" className="sr-only">Our mission</h2>
          <p className="ag-mission ag-reveal" style={{ marginTop: 24 }}>Our mission is to give ambitious businesses the kind of digital presence that used to need several agencies: <em>thoughtfully designed, properly engineered and built to grow.</em></p>
        </div>
      </section>

      <section className="ag-section ag-dark" aria-labelledby="values-title">
        <div className="ag-container">
          <SectionHeader light id="values-title" eyebrow="Values" title="What We Hold Ourselves To." lead="These principles guide how we make decisions, especially the difficult ones." />
          <ul className="ag-values">
            {values.map((value) => <li key={value.title} className="ag-reveal"><h3>{value.title}</h3><p>{value.text}</p></li>)}
          </ul>
        </div>
      </section>

      <section className="ag-section" aria-labelledby="approach-title">
        <div className="ag-container ag-svc-split">
          <div className="ag-reveal">
            <Eyebrow>Our approach</Eyebrow>
            <h2 id="approach-title" className="ag-h2">How We Work With Clients.</h2>
            <p className="ag-lead">Every project follows the same path: discover, strategize, design, develop, launch and grow. What makes it work is how we communicate along the way.</p>
            <Link href="/services" className="ag-link" style={{ marginTop: 24 }}>See our services <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ol className="ag-steps ag-steps-vertical">
            {workingSteps.map((step, index) => <li key={step.title} className="ag-reveal"><span className="num">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="ag-section ag-svc-band" aria-labelledby="philosophy-title">
        <div className="ag-container ag-prose-cols">
          <div className="ag-reveal">
            <Eyebrow>Philosophy</Eyebrow>
            <h2 id="philosophy-title" className="ag-h2">Good Work Is Useful Work.</h2>
          </div>
          <div className="ag-body ag-reveal">
            <p>We believe the best digital work is the kind people barely notice: pages that load instantly, interfaces that make sense on first use, and marketing that feels relevant rather than loud.</p>
            <p>That takes curiosity, honest conversations and a willingness to sweat the details. It also means saying no to tactics that might look good in a report but hurt your business later.</p>
            <p>Want to know more about how we think? Read our <Link href="/blog" className="ag-inline-link">blog and insights</Link> or our <Link href="/editorial-policy" className="ag-inline-link">editorial policy</Link>.</p>
          </div>
        </div>
      </section>

      <CtaBand title={<>Let&apos;s Build Something <span className="ag-hl">Worth Talking About.</span></>} text="Tell us about your business and where you want to take it. We'd love to hear what you're working on." secondary={{ href: "/work", label: "See our work" }} />
    </div>
  );
}
