import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, FileSearch, Gauge, Globe, ImageIcon, Layers, ListChecks, Repeat, Search, Video, Workflow } from "lucide-react";
import { siGooglecloud, siGooglegemini, siGoogle, siYoutube, type SimpleIcon } from "simple-icons";
import { openGraphDefaults } from "@/lib/open-graph";
import { siteUrl } from "@/lib/site-url";
import { breadcrumbSchema, organizationId } from "@/lib/site-config";
import { reportedRunTime, workflowStages } from "@/lib/ai-publishing";
import { Breadcrumbs, CtaBand, Eyebrow, JsonLd } from "@/components/agency/ui";
import { WorkflowDiagram } from "@/components/work/WorkflowDiagram";
import { ExampleListing } from "@/components/work/ExampleListing";
import "./workflow.css";

const slug = "ai-product-publishing-automation";
const url = `${siteUrl}/work/${slug}`;
const title = "AI Product Publishing Automation: Case Study";
const description =
  "How we built an AI pipeline that turns one product image into a complete, SEO-ready listing using Gemini, Google Search and YouTube, then publishes it to the website automatically.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...openGraphDefaults, title: `${title} | CodeWithLogs`, description, url, type: "article" },
  twitter: { card: "summary_large_image", title: `${title} | CodeWithLogs`, description },
};

const manualTasks = [
  { icon: FileSearch, title: "Identifying the product", text: "Working out the exact brand and model from a photo before anything else can start." },
  { icon: Search, title: "Researching specifications", text: "Checking several sources to find accurate, consistent product details." },
  { icon: ClipboardList, title: "Writing SEO copy", text: "Drafting titles, descriptions, feature lists and meta tags for every product." },
  { icon: ImageIcon, title: "Finding media", text: "Hunting for suitable product images and a relevant video." },
  { icon: Repeat, title: "Publishing, again and again", text: "Copying it all into the website by hand, one product at a time." },
];

const principles = [
  { title: "One input", text: "A product image is the only thing a person has to provide." },
  { title: "Each stage feeds the next", text: "Structured output from one step becomes the input of the next, so nothing is retyped." },
  { title: "Publish-ready output", text: "The final package matches the website's product format and is submitted automatically." },
];

const stack: { name: string; role: string; icon?: SimpleIcon }[] = [
  { name: "Google Cloud", role: "Hosts and orchestrates the pipeline", icon: siGooglecloud },
  { name: "Gemini AI", role: "Image analysis and content generation", icon: siGooglegemini },
  { name: "Google Search", role: "Product research and keyword intent", icon: siGoogle },
  { name: "YouTube", role: "Video discovery and embedded segments", icon: siYoutube },
  { name: "Website integration", role: "Submits the finished listing" },
];

const impact = [
  { icon: Repeat, title: "Less manual data entry", text: "The repetitive research, copying and pasting behind each listing is handled by the pipeline." },
  { icon: Gauge, title: "Faster listing preparation", text: "A complete listing is assembled in one automated run instead of a manual session per product." },
  { icon: ListChecks, title: "Consistent structure", text: "Every product follows the same fields, order and format, which keeps the catalogue tidy." },
  { icon: Search, title: "SEO-oriented by default", text: "Titles, descriptions, keywords and meta tags are written with search intent in mind." },
  { icon: Layers, title: "Built to scale", text: "The same workflow runs for one product or a whole catalogue without extra effort per item." },
];

function BrandMark({ icon }: { icon?: SimpleIcon }) {
  if (!icon) return <Globe size={26} strokeWidth={1.6} aria-hidden="true" />;
  return <svg viewBox="0 0 24 24" width={26} height={26} aria-hidden="true"><path d={icon.path} fill={`#${icon.hex}`} /></svg>;
}

export default function AiPublishingCaseStudy() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: "AI-Powered Product Publishing Automation", path: `/work/${slug}` }]),
      { "@type": "CreativeWork", "@id": `${url}#work`, name: "AI-Powered Product Publishing Automation", description, url, creator: { "@id": organizationId }, keywords: "AI automation, Gemini AI, Google Cloud, SEO automation, product listing automation" },
    ],
  };

  return (
    <div className="ag-page aip">
      <JsonLd data={structuredData} />

      {/* 1. Hero */}
      <section className="aip-hero" aria-labelledby="aip-title">
        <div className="ag-container">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Work", path: "/work" }, { name: "AI Product Publishing Automation" }]} />
          <div className="aip-hero-grid">
            <div>
              <Eyebrow>AI automation · Workflow engineering · SEO automation</Eyebrow>
              <h1 id="aip-title" className="aip-title">One Image. Complete Product Listing. <span className="ag-hl">Fully Automated.</span></h1>
              <p className="aip-tagline">From product image to published listing, powered by AI.</p>
              <p className="aip-lead">An AI-powered automation pipeline that transforms product images into complete, SEO-ready website listings through intelligent research, content creation, video discovery, and automated publishing.</p>
              <div className="ag-actions" style={{ marginTop: 30 }}>
                <a href="#workflow" className="ag-btn ag-btn-primary ag-btn-lg">See the workflow <ArrowUpRight size={17} aria-hidden="true" /></a>
                <Link href="/services/ai-automation" className="ag-btn ag-btn-outline ag-btn-lg">AI &amp; automation services</Link>
              </div>
            </div>
            <div className="aip-hero-art" aria-hidden="true">
              <div className="aip-art-card aip-art-in"><span className="aip-art-photo" /><small>product.jpg</small></div>
              <div className="aip-art-core"><span /><span /><span /><Workflow size={30} strokeWidth={1.5} /></div>
              <div className="aip-art-card aip-art-out"><i /><i /><i /><i className="short" /><b>Published</b></div>
              <svg className="aip-art-flow" viewBox="0 0 400 200" preserveAspectRatio="none"><path d="M70 100 C 130 100, 140 100, 200 100 S 270 100, 330 100" /></svg>
            </div>
          </div>
          <dl className="aip-metrics">
            <div><dt>Reported end-to-end run</dt><dd>{reportedRunTime}</dd><p>Owner-reported benchmark; real runs vary with network and API response times.</p></div>
            <div><dt>Connected workflow stages</dt><dd>{workflowStages.length}</dd><p>From image input to a live product page.</p></div>
            <div><dt>Publishing</dt><dd>Automated</dd><p>The finished listing is submitted without manual copy and paste.</p></div>
          </dl>
        </div>
      </section>

      {/* 2. Challenge */}
      <section className="ag-section" aria-labelledby="aip-challenge">
        <div className="ag-container aip-split">
          <div>
            <Eyebrow>The challenge</Eyebrow>
            <h2 id="aip-challenge" className="ag-h2">Every Listing Was a Small Research Project.</h2>
            <p className="ag-lead" style={{ marginTop: 20 }}>Publishing a single product properly meant identifying it, researching it, writing for search, finding media and entering it all into the website. Multiply that by a catalogue and the work becomes slow, repetitive and inconsistent.</p>
          </div>
          <ol className="aip-tasks">
            {manualTasks.map((task) => (
              <li key={task.title}><span className="aip-ico" aria-hidden="true"><task.icon size={20} strokeWidth={1.7} /></span><div><h3>{task.title}</h3><p>{task.text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. Solution */}
      <section className="ag-section ag-svc-band" aria-labelledby="aip-solution">
        <div className="ag-container">
          <div className="aip-split">
            <div>
              <Eyebrow>The solution</Eyebrow>
              <h2 id="aip-solution" className="ag-h2">One Pipeline That Does the Whole Job.</h2>
            </div>
            <p className="ag-lead">We engineered a single automated workflow on Google Cloud. Gemini identifies the product from its image, Google Search supplies verified details and keyword intent, Gemini writes the SEO-ready listing, YouTube provides a relevant video segment, and the website integration publishes the result.</p>
          </div>
          <ul className="aip-principles">
            {principles.map((principle, index) => <li key={principle.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{principle.title}</h3><p>{principle.text}</p></li>)}
          </ul>
        </div>
      </section>

      {/* 4. Interactive workflow */}
      <section className="aip-flow" id="workflow" aria-labelledby="aip-workflow">
        <div className="ag-container">
          <div className="aip-flow-head">
            <div>
              <Eyebrow light>Interactive workflow</Eyebrow>
              <h2 id="aip-workflow" className="ag-h2">Watch One Image Become a <span className="ag-hl">Published Listing.</span></h2>
            </div>
            <p>Play the simulation, step through each stage, or select any stage to see what it does and what it hands to the next. This is a visual explanation of the system, not a live run.</p>
          </div>
          <WorkflowDiagram />
        </div>
      </section>

      {/* 5. Technology */}
      <section className="ag-section" aria-labelledby="aip-stack">
        <div className="ag-container">
          <div className="aip-split" style={{ marginBottom: 40 }}>
            <div>
              <Eyebrow>Technology stack</Eyebrow>
              <h2 id="aip-stack" className="ag-h2">Built on Google&apos;s AI and Search Ecosystem.</h2>
            </div>
            <p className="ag-lead">Each service does the job it is best at, connected through one orchestrated pipeline.</p>
          </div>
          <ul className="aip-stack">
            {stack.map((item) => <li key={item.name}><span className="aip-stack-mark"><BrandMark icon={item.icon} /></span><h3>{item.name}</h3><p>{item.role}</p></li>)}
          </ul>
        </div>
      </section>

      {/* 6. Example output */}
      <section className="ag-section ag-svc-band" aria-labelledby="aip-example">
        <div className="ag-container">
          <div className="aip-split" style={{ marginBottom: 40 }}>
            <div>
              <Eyebrow>Example output</Eyebrow>
              <h2 id="aip-example" className="ag-h2">What the Pipeline Produces.</h2>
            </div>
            <p className="ag-lead">A demonstration of the listing package the automation assembles: copy, specifications, SEO fields, images and video. The product and data below are samples.</p>
          </div>
          <ExampleListing />
        </div>
      </section>

      {/* 7. Results */}
      <section className="ag-section" aria-labelledby="aip-results">
        <div className="ag-container">
          <div className="aip-split" style={{ marginBottom: 40 }}>
            <div>
              <Eyebrow>Results &amp; impact</Eyebrow>
              <h2 id="aip-results" className="ag-h2">Less Busywork. More Consistent Listings.</h2>
            </div>
            <div className="aip-bench">
              <p className="aip-bench-value">{reportedRunTime}</p>
              <p>Reported end-to-end time for one image to a published listing. It is a benchmark from the project owner, not a guaranteed speed; it depends on image quality, API response times and network conditions.</p>
            </div>
          </div>
          <ul className="aip-impact">
            {impact.map((item) => <li key={item.title}><span className="aip-ico" aria-hidden="true"><item.icon size={20} strokeWidth={1.7} /></span><h3>{item.title}</h3><p>{item.text}</p></li>)}
          </ul>
          <p className="aip-footnote"><Video size={15} aria-hidden="true" /> Videos are shown through YouTube&apos;s embedded player, and collected images should be cleared for use on the store. Licensing and usage rights stay with their owners.</p>
        </div>
      </section>

      <CtaBand
        eyebrow="AI & automation"
        title={<>Want Product Publishing <span className="ag-hl">on Autopilot?</span></>}
        text="Tell us how you add products today. We'll map the workflow and show where automation can save the most time."
        secondary={{ href: "/services/ai-automation", label: "AI & automation services" }}
      />
    </div>
  );
}
