import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { getAllPosts } from "@/lib/mdx";
import { getArticleSummary } from "@/lib/troubleshooting";
import { getInsightCategory, getInsightCategoryTitle } from "@/lib/insights";
import { services } from "@/lib/services";
import { caseStudies } from "@/lib/work";
import { siteUrl } from "@/lib/site-url";
import { faqSchema, organizationId, organizationSchema, siteConfig } from "@/lib/site-config";
import { HeroVisual } from "@/components/agency/HeroVisual";
import { ServiceExplorer } from "@/components/agency/ServiceExplorer";
import { CtaBand, Eyebrow, FaqList, JsonLd, SectionHeader } from "@/components/agency/ui";

export const dynamic = "force-static";
export const revalidate = 60;

const title = "CodeWithLogs | Digital Agency for Web Design, Development & Growth";
const description =
  "CodeWithLogs is a digital agency offering web design, website development, web applications, UI/UX, e-commerce, SEO, digital marketing, branding and AI automation for ambitious businesses.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: siteUrl },
  openGraph: { ...openGraphDefaults, title, description, url: siteUrl, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const pillars = [
  { title: "Strategy", text: "We start with your goals, customers and market, so every decision has a reason behind it." },
  { title: "Design", text: "Clear, distinctive design that builds trust and makes the next step obvious." },
  { title: "Development", text: "Fast, accessible and secure builds on modern technology that is easy to maintain." },
  { title: "Growth", text: "SEO, marketing and ongoing improvement that keep your digital presence working harder." },
];

const reasons = [
  { title: "Business-First Thinking", text: "We ask what success looks like for your business before we talk about pages, features or tools." },
  { title: "Design Meets Technology", text: "Designers and developers work as one team, so what gets approved is what gets built." },
  { title: "Performance-Focused Development", text: "Speed, accessibility and search visibility are built in from the start, not patched in at the end." },
  { title: "Clear Communication", text: "Plain-language updates, honest timelines and one point of contact. You always know where things stand." },
  { title: "Scalable Solutions", text: "Clean architecture and documented systems that can grow with your business instead of holding it back." },
  { title: "Long-Term Partnership", text: "Launch is a milestone, not the finish line. We stay on to support, measure and improve." },
];

const process = [
  { title: "Discover", text: "We learn about your business, audience, goals and constraints." },
  { title: "Strategize", text: "We define scope, priorities, structure and the right technology." },
  { title: "Design", text: "We shape the experience, from wireframes to polished interfaces." },
  { title: "Develop", text: "We build in focused cycles with regular reviews and testing." },
  { title: "Launch", text: "We check everything carefully, then go live with confidence." },
  { title: "Grow", text: "We measure, support and keep improving after launch." },
];

const technologies = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { group: "Backend & data", items: ["Node.js", "PostgreSQL", "MongoDB", "Supabase"] },
  { group: "Mobile", items: ["React Native", "Flutter", "Expo"] },
  { group: "CMS & commerce", items: ["WordPress", "Webflow", "Shopify", "WooCommerce"] },
  { group: "Design", items: ["Figma", "Adobe Creative Cloud", "Design systems"] },
  { group: "Cloud & delivery", items: ["Vercel", "AWS", "Cloudflare", "GitHub"] },
  { group: "Growth & analytics", items: ["Google Analytics 4", "Search Console", "Google Ads", "Meta Ads"] },
  { group: "AI & automation", items: ["OpenAI", "Anthropic", "n8n", "Zapier"] },
];

const industries = [
  { title: "Startups", text: "MVPs, launch websites and brand foundations that help you move quickly without cutting corners." },
  { title: "Small & medium businesses", text: "Professional websites, local visibility and marketing that brings in steady enquiries." },
  { title: "E-commerce brands", text: "Online stores, product pages and checkout flows designed to convert and scale." },
  { title: "SaaS companies", text: "Product design, dashboards, marketing sites and growth support for software businesses." },
  { title: "Corporate teams", text: "Structured websites, internal tools and design systems built to organisational standards." },
  { title: "International clients", text: "Remote-first collaboration with clear communication across time zones." },
];

const faqs = [
  { question: "What services does CodeWithLogs offer?", answer: "We offer website design and development, UI/UX design, web application development, mobile app development, e-commerce development, SEO, digital marketing, branding and creative, AI and automation, and ongoing support and maintenance." },
  { question: "How do projects start?", answer: "Send us a short message through the contact form about what you want to build or improve. We'll arrange a conversation to understand your goals, then share a recommended approach, scope and timeline." },
  { question: "How much does a project cost?", answer: "Cost depends on scope, complexity and timeline. After the discovery conversation, we provide a clear proposal so you know what is included before any work begins." },
  { question: "Do you work with businesses outside your own country?", answer: "Yes. We work remotely and collaborate with clients through video calls, shared project boards and regular written updates." },
  { question: "Can you improve an existing website or app instead of starting over?", answer: "Yes. Many projects start with an audit of what you already have. Sometimes targeted improvements deliver more value than a full rebuild, and we will tell you which makes sense." },
  { question: "Do you provide support after launch?", answer: "Yes. We offer support and maintenance covering updates, security, monitoring, backups and ongoing improvements." },
];

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 3);
  const explorerServices = services.map((service) => ({
    slug: service.slug,
    number: service.number,
    name: service.name,
    summary: service.summary,
    capabilities: service.capabilities.slice(0, 6).map((capability) => capability.title),
    technologies: service.technologies.slice(0, 5),
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteConfig.name, url: siteUrl, publisher: { "@id": organizationId } },
      { "@type": "WebPage", "@id": `${siteUrl}/#webpage`, url: siteUrl, name: title, description, isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": organizationId } },
      faqSchema(faqs),
    ],
  };

  return (
    <div className="ag-page">
      <JsonLd data={structuredData} />

      {/* Hero */}
      <section className="ag-hero" aria-labelledby="hero-title">
        <div className="ag-container ag-hero-grid">
          <div className="ag-hero-copy">
            <Eyebrow><span className="ag-pulse" aria-hidden="true" />Your digital growth partner</Eyebrow>
            <h1 id="hero-title" className="ag-display">
              Your Business Deserves More Than Just a Website. <span className="ag-hl">It Deserves to Grow.</span>
            </h1>
            <p className="ag-hero-text">
              From high-performing websites and powerful web applications to branding, SEO, and digital marketing, we create digital experiences that help ambitious businesses stand out, attract customers, and grow.
            </p>
            <div className="ag-actions">
              <Link href="/contact" className="ag-btn ag-btn-primary ag-btn-lg">Let&apos;s Build Something Great <ArrowUpRight size={18} aria-hidden="true" /></Link>
              <Link href="/services" className="ag-btn ag-btn-outline ag-btn-lg">Explore Our Services</Link>
            </div>
            <p className="ag-hero-tagline">Strategy. Design. Development. Growth.</p>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Value proposition */}
      <section className="ag-section ag-value" aria-labelledby="value-title">
        <div className="ag-container">
          <div className="ag-value-grid ag-reveal">
            <div>
              <Eyebrow>Why CodeWithLogs</Eyebrow>
              <h2 id="value-title" className="ag-h2 ag-h2-xl">We Turn Ambitious Ideas Into <span className="ag-hl">Powerful Digital Experiences.</span></h2>
            </div>
            <p className="ag-lead">
              Most businesses end up juggling a designer, a developer, an SEO consultant and a marketing freelancer, each working in isolation. We bring strategy, creativity and engineering together under one roof, so your brand, website and marketing pull in the same direction.
            </p>
          </div>
          <ol className="ag-pillars">
            {pillars.map((pillar, index) => (
              <li key={pillar.title} className="ag-reveal">
                <span className="ag-pillar-num">0{index + 1}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Services */}
      <section className="ag-section ag-services-home" id="services" aria-labelledby="services-title">
        <div className="ag-container">
          <SectionHeader id="services-title" eyebrow="Services" title="Everything Your Business Needs to Win Online." lead="One creative and technical partner for everything digital—from your first brand identity to your next major product launch." />
          <ServiceExplorer services={explorerServices} />
          <p className="ag-more-link"><Link href="/services" className="ag-link">View all services <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="ag-section ag-why" aria-labelledby="why-title">
        <div className="ag-container ag-why-grid">
          <div className="ag-why-intro ag-reveal">
            <Eyebrow>Why choose us</Eyebrow>
            <h2 id="why-title" className="ag-h2">Great Digital Experiences Don&apos;t Happen by Accident.</h2>
            <p className="ag-lead">They come from asking the right questions, making careful decisions and sweating the details. Here is what you can expect when you work with us.</p>
            <Link href="/about" className="ag-link">How we work <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ol className="ag-why-list">
            {reasons.map((reason, index) => (
              <li key={reason.title} className="ag-reveal">
                <span className="ag-why-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process */}
      <section className="ag-section ag-process ag-dark" aria-labelledby="process-title">
        <div className="ag-container">
          <SectionHeader light id="process-title" eyebrow="Our process" title="From First Conversation to Final Launch." lead="A clear, collaborative process keeps projects on track and gives you visibility at every stage." />
          <ol className="ag-timeline">
            {process.map((step, index) => (
              <li key={step.title} className="ag-reveal">
                <span className="ag-timeline-node" aria-hidden="true" />
                <span className="ag-timeline-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured work */}
      <section className="ag-section ag-work-home" aria-labelledby="work-title">
        <div className="ag-container">
          <SectionHeader id="work-title" eyebrow="Featured work" title="Selected Work, Told Honestly." lead="Our case studies show the challenge, the approach and verified results, published only with client approval. The first studies are being prepared; the cards below are clearly marked layout placeholders." />
          <div className="ag-work-rail">
            {caseStudies.slice(0, 3).map((study, index) => (
              <Link key={study.slug} href={`/work/${study.slug}`} className={`ag-work-card ag-work-card-${index + 1} ag-reveal`}>
                <div className="ag-work-media">
                  <span className="ag-placeholder-tag">Placeholder</span>
                  <span className="ag-work-media-art" aria-hidden="true" />
                </div>
                <div className="ag-work-body">
                  <p className="ag-work-meta">{study.industry} · Sample layout</p>
                  <h3>{study.title}</h3>
                  <span className="ag-link">View layout <ArrowUpRight size={15} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
          <p className="ag-more-link"><Link href="/work" className="ag-link">See the work page <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>

      {/* Technologies */}
      <section className="ag-section ag-tech" aria-labelledby="tech-title">
        <div className="ag-container ag-tech-grid">
          <div className="ag-reveal">
            <Eyebrow>Technologies</Eyebrow>
            <h2 id="tech-title" className="ag-h2">Modern Tools, Chosen for the Job.</h2>
            <p className="ag-lead">We pick technology for reliability, performance and how easily your team can work with it later, not because it is fashionable.</p>
          </div>
          <dl className="ag-tech-list">
            {technologies.map((row) => (
              <div key={row.group} className="ag-reveal">
                <dt>{row.group}</dt>
                <dd>{row.items.map((item) => <span key={item}>{item}</span>)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Industries */}
      <section className="ag-section ag-industries" aria-labelledby="industries-title">
        <div className="ag-container">
          <SectionHeader id="industries-title" eyebrow="Who we work with" title="Built for Businesses With Big Plans." lead="Different stages need different things. We adapt our approach to where you are and where you want to go." />
          <ul className="ag-industry-list">
            {industries.map((industry, index) => (
              <li key={industry.title} className="ag-reveal">
                <span className="ag-industry-num">{String(index + 1).padStart(2, "0")}</span>
                <h3>{industry.title}</h3>
                <p>{industry.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Insights */}
      {posts.length > 0 && (
        <section className="ag-section ag-insights-home" aria-labelledby="insights-title">
          <div className="ag-container">
            <SectionHeader id="insights-title" eyebrow="Blog & insights" title="Ideas, Guides and Lessons From the Work." lead="Practical articles on web development, design, search and growth, plus our development troubleshooting archive." />
            <div className="ag-insights-grid">
              {posts.map((post, index) => (
                <article key={post.slug} className={`ag-insight-card ${index === 0 ? "ag-insight-lead" : ""} ag-reveal`}>
                  <Link href={`/blog/${post.slug}`} className="ag-insight-media" tabIndex={-1} aria-hidden="true">
                    <Image src={post.coverImage} alt="" fill sizes={index === 0 ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 30vw"} className="object-cover" />
                  </Link>
                  <div className="ag-insight-body">
                    <p className="ag-insight-meta"><span>{getInsightCategoryTitle(getInsightCategory(post))}</span><time dateTime={post.date}>{format(new Date(post.date), "MMM d, yyyy")}</time></p>
                    <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                    {index === 0 ? <p className="ag-insight-excerpt">{getArticleSummary(post)}</p> : null}
                  </div>
                </article>
              ))}
            </div>
            <p className="ag-more-link"><Link href="/blog" className="ag-link">Read the blog <ArrowRight size={16} aria-hidden="true" /></Link></p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="ag-section ag-faq" aria-labelledby="faq-title">
        <div className="ag-container ag-faq-grid">
          <div className="ag-reveal">
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="ag-h2">Questions We Hear Often.</h2>
            <p className="ag-lead">Can&apos;t find what you are looking for? <Link href="/contact" className="ag-inline-link">Send us a message</Link> and we&apos;ll get back to you.</p>
          </div>
          <FaqList faqs={faqs} headingId="faq-title" />
        </div>
      </section>

      <CtaBand
        eyebrow="Your next move"
        title={<>Your Next Big Move Starts With a <span className="ag-hl">Better Digital Experience.</span></>}
        text="Tell us where you want your business to go. We'll help you plan the route and build what gets you there."
        secondary={{ href: "/services", label: "Explore Our Services" }}
      />
    </div>
  );
}
