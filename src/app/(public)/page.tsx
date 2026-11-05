import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { AppWindow, ArrowRight, ArrowUpRight, Bot, Boxes, Building2, Code2, Compass, Gauge, Globe, Handshake, Layers, LayoutDashboard, LifeBuoy, Megaphone, MessagesSquare, Monitor, Palette, PenTool, Rocket, Route, Search, ShoppingBag, ShoppingCart, Smartphone, Sprout, Store, Target, TrendingUp } from "lucide-react";
import { openGraphDefaults } from "@/lib/open-graph";
import { getAllPosts } from "@/lib/mdx";
import { getArticleSummary } from "@/lib/troubleshooting";
import { getInsightCategory, getInsightCategoryTitle } from "@/lib/insights";
import { services } from "@/lib/services";
import { caseStudies } from "@/lib/work";
import { siteUrl } from "@/lib/site-url";
import { businessStats, faqSchema, organizationId, organizationSchema, siteConfig } from "@/lib/site-config";
import { toolSlugs } from "@/lib/tools";
import { HeroStage } from "@/components/agency/HeroStage";
import { ServiceShowcase } from "@/components/agency/ServiceShowcase";
import { ServiceVisual, type ServiceVisualKind } from "@/components/agency/ServiceVisual";
import { ProjectCard } from "@/components/agency/ProjectCard";
import { TechLogo } from "@/components/agency/TechLogo";
import { StatsBand, type Stat } from "@/components/agency/StatsBand";
import { TrustpilotSection } from "@/components/agency/TrustpilotSection";
import { Eyebrow, FaqList, JsonLd, SectionHeader } from "@/components/agency/ui";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { whatsappHref, whatsappMessages } from "@/lib/whatsapp";
import "./home.css";

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
  { icon: Compass, title: "Strategy", text: "We start with your goals, customers and market, so every decision has a reason behind it." },
  { icon: PenTool, title: "Design", text: "Clear, distinctive design that builds trust and makes the next step obvious." },
  { icon: Code2, title: "Development", text: "Fast, accessible and secure builds on modern technology that is easy to maintain." },
  { icon: TrendingUp, title: "Growth", text: "SEO, marketing and ongoing improvement that keep your digital presence working harder." },
];

const reasons = [
  { icon: Target, title: "Business-First Thinking", text: "We ask what success looks like for your business before we talk about pages, features or tools." },
  { icon: Layers, title: "Design Meets Technology", text: "Designers and developers work as one team, so what gets approved is what gets built." },
  { icon: Gauge, title: "Performance-Focused Development", text: "Speed, accessibility and search visibility are built in from the start, not patched in at the end." },
  { icon: MessagesSquare, title: "Clear Communication", text: "Plain-language updates, honest timelines and one point of contact. You always know where things stand." },
  { icon: Boxes, title: "Scalable Solutions", text: "Clean architecture and documented systems that can grow with your business instead of holding it back." },
  { icon: Handshake, title: "Long-Term Partnership", text: "Launch is a milestone, not the finish line. We stay on to support, measure and improve." },
];

const process = [
  { icon: Search, title: "Discover", text: "We learn about your business, audience, goals and constraints." },
  { icon: Route, title: "Strategize", text: "We define scope, priorities, structure and the right technology." },
  { icon: Palette, title: "Design", text: "We shape the experience, from wireframes to polished interfaces." },
  { icon: Code2, title: "Develop", text: "We build in focused cycles with regular reviews and testing." },
  { icon: Rocket, title: "Launch", text: "We check everything carefully, then go live with confidence." },
  { icon: Sprout, title: "Grow", text: "We measure, support and keep improving after launch." },
];

const technologies = [
  { group: "Frontend", text: "Fast, accessible interfaces.", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { group: "Backend & data", text: "Reliable APIs and data models.", items: ["Node.js", "PostgreSQL", "MongoDB", "Supabase"] },
  { group: "Mobile", text: "One codebase, two platforms.", items: ["React Native", "Flutter", "Expo"] },
  { group: "CMS & commerce", text: "Content and stores your team can run.", items: ["WordPress", "Webflow", "Shopify", "WooCommerce"] },
  { group: "Design", text: "Systems, not one-off screens.", items: ["Figma", "Adobe Creative Cloud", "Design systems"] },
  { group: "Cloud & delivery", text: "Shipped, monitored, recoverable.", items: ["Vercel", "AWS", "Cloudflare", "GitHub"] },
  { group: "Growth & analytics", text: "Measured, then improved.", items: ["Google Analytics 4", "Search Console", "Google Ads", "Meta Ads"] },
  { group: "AI & automation", text: "Practical time savers.", items: ["OpenAI", "Anthropic", "n8n", "Zapier"] },
];

const industries = [
  { icon: Rocket, title: "Startups", text: "MVPs, launch websites and brand foundations that help you move quickly without cutting corners." },
  { icon: Store, title: "Small & medium businesses", text: "Professional websites, local visibility and marketing that brings in steady enquiries." },
  { icon: ShoppingBag, title: "E-commerce brands", text: "Online stores, product pages and checkout flows designed to convert and scale." },
  { icon: LayoutDashboard, title: "SaaS companies", text: "Product design, dashboards, marketing sites and growth support for software businesses." },
  { icon: Building2, title: "Corporate teams", text: "Structured websites, internal tools and design systems built to organisational standards." },
  { icon: Globe, title: "International clients", text: "Remote-first collaboration with clear communication across time zones." },
];

const faqs = [
  { question: "What services does CodeWithLogs offer?", answer: "We offer website design and development, UI/UX design, web application development, mobile app development, e-commerce development, SEO, digital marketing, branding and creative, AI and automation, and ongoing support and maintenance." },
  { question: "How do projects start?", answer: "Send us a short message through the contact form about what you want to build or improve. We'll arrange a conversation to understand your goals, then share a recommended approach, scope and timeline." },
  { question: "How much does a project cost?", answer: "Cost depends on scope, complexity and timeline. After the discovery conversation, we provide a clear proposal so you know what is included before any work begins." },
  { question: "Do you work with businesses outside your own country?", answer: "Yes. We work remotely and collaborate with clients through video calls, shared project boards and regular written updates." },
  { question: "Can you improve an existing website or app instead of starting over?", answer: "Yes. Many projects start with an audit of what you already have. Sometimes targeted improvements deliver more value than a full rebuild, and we will tell you which makes sense." },
  { question: "Do you provide support after launch?", answer: "Yes. We offer support and maintenance covering updates, security, monitoring, backups and ongoing improvements." },
];

const serviceIcons: Record<string, typeof Monitor> = {
  "website-design-development": Monitor,
  "ui-ux-design": PenTool,
  "web-application-development": AppWindow,
  "mobile-app-development": Smartphone,
  "ecommerce-development": ShoppingCart,
  "seo-services": Search,
  "digital-marketing": Megaphone,
  "branding-creative": Palette,
  "ai-automation": Bot,
  "support-maintenance": LifeBuoy,
};

function CtaArrow() {
  return <span className="hp-cta-icon" aria-hidden="true"><ArrowUpRight size={20} /><ArrowUpRight size={20} /></span>;
}

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const posts = allPosts.slice(0, 3);
  const technologyCount = new Set(technologies.flatMap((row) => row.items)).size;
  // Real client figures from site-config replace these once supplied; every
  // fallback figure below is counted from the site itself.
  const stats: Stat[] = businessStats.length ? businessStats : [
    { value: services.length, label: "Core services", note: "Design, build and growth", icon: "layers" },
    { value: allPosts.length, label: "Published articles", note: "Guides and insights", icon: "book" },
    { value: toolSlugs.length, label: "Free developer tools", note: "No sign-up needed", icon: "wrench" },
    { value: technologyCount, label: "Technologies we use", note: "Chosen for the job", icon: "cpu" },
  ];
  const showcaseServices = services.map((service) => ({
    slug: service.slug,
    number: service.number,
    name: service.name,
    summary: service.summary,
    capabilities: service.capabilities.slice(0, 4).map((capability) => capability.title),
    icon: (() => { const Icon = serviceIcons[service.slug] ?? Monitor; return <Icon size={20} strokeWidth={1.7} aria-hidden="true" />; })(),
  }));
  const showcaseVisuals = services.map((service) => <ServiceVisual key={service.slug} kind={service.slug as ServiceVisualKind} />);
  const hasWhatsApp = Boolean(whatsappHref(""));
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
    <div className="ag-page hp">
      <JsonLd data={structuredData} />

      {/* Hero */}
      <section className="hp-hero" aria-labelledby="hero-title">
        <div className="ag-container">
          <Eyebrow><span className="ag-pulse" aria-hidden="true" />Your digital growth partner</Eyebrow>
          <h1 id="hero-title" className="hp-title">
            <span className="hp-line"><span>Your Business Deserves</span></span>{" "}
            <span className="hp-line"><span>More Than Just a Website.</span></span>{" "}
            <span className="hp-line hp-line-hl"><span>It Deserves to Grow.</span></span>
          </h1>
          <div className="hp-hero-grid">
            <div className="hp-hero-copy">
              <p className="hp-hero-text">From high-performing websites and powerful web applications to branding, SEO, and digital marketing, we create digital experiences that help ambitious businesses stand out, attract customers, and grow.</p>
              <div className="ag-actions">
                <Link href="/contact" className="hp-cta"><span>Let&apos;s Build Something Great</span><CtaArrow /></Link>
                <Link href="/services" className="ag-btn ag-btn-outline ag-btn-lg">Explore Our Services</Link>
              </div>
              {hasWhatsApp ? <p className="ag-hero-alt">Prefer a quick conversation? <WhatsAppButton variant="link" label="Chat on WhatsApp" message={whatsappMessages.general} /></p> : null}
              <p className="ag-hero-tagline">Strategy. Design. Development. Growth.</p>
            </div>
            <HeroStage />
          </div>
        </div>
      </section>

      <StatsBand stats={stats} label="CodeWithLogs in numbers" />

      {/* Agency introduction */}
      <section className="hp-intro" aria-labelledby="value-title">
        <div className="ag-container">
          <Eyebrow>Why CodeWithLogs</Eyebrow>
          <h2 id="value-title" className="hp-statement ag-reveal">We Turn Ambitious Ideas Into <span className="ag-hl">Powerful Digital Experiences.</span></h2>
          <div className="hp-intro-grid">
            <p className="hp-intro-lead ag-reveal">Most businesses end up juggling a designer, a developer, an SEO consultant and a marketing freelancer, each working in isolation. We bring strategy, creativity and engineering together under one roof, so your brand, website and marketing pull in the same direction.</p>
            <ol className="hp-pillars">
              {pillars.map((pillar, index) => (
                <li key={pillar.title} className="ag-reveal">
                  <span className="hp-icon" aria-hidden="true"><pillar.icon size={24} strokeWidth={1.6} /></span>
                  <span className="hp-step-label">0{index + 1}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="hp-services" id="services" aria-labelledby="services-title">
        <div className="ag-container">
          <div className="hp-split-head ag-reveal">
            <div>
              <Eyebrow light>Services</Eyebrow>
              <h2 id="services-title" className="hp-h2 hp-h2-light">Everything Your Business Needs to <span className="ag-hl">Win Online.</span></h2>
            </div>
            <p>One creative and technical partner for everything digital—from your first brand identity to your next major product launch.</p>
          </div>
          <ServiceShowcase services={showcaseServices} visuals={showcaseVisuals} />
          <p className="hp-more"><Link href="/services" className="hp-more-light">View all services <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="hp-why" aria-labelledby="why-title">
        <div className="ag-container">
          <div className="hp-split-head ag-reveal">
            <div>
              <Eyebrow>Why choose us</Eyebrow>
              <h2 id="why-title" className="hp-h2">Great Digital Experiences Don&apos;t Happen <span className="ag-hl">by Accident.</span></h2>
            </div>
            <p>They come from asking the right questions, making careful decisions and sweating the details. Here is what you can expect when you work with us.</p>
          </div>
          <ol className="hp-why-grid">
            {reasons.map((reason, index) => (
              <li key={reason.title} className={`hp-why-item hp-why-${index + 1} ag-reveal`}>
                <span className="hp-why-icon" aria-hidden="true"><reason.icon size={26} strokeWidth={1.6} /></span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ol>
          <p className="hp-more"><Link href="/about" className="ag-link">How we work <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>

      {/* Process */}
      <section className="hp-process" aria-labelledby="process-title">
        <div className="ag-container hp-process-grid">
          <div className="hp-process-head">
            <Eyebrow light>Our process</Eyebrow>
            <h2 id="process-title" className="hp-h2 hp-h2-light">From First Conversation to <span className="ag-hl">Final Launch.</span></h2>
            <p>A clear, collaborative process keeps projects on track and gives you visibility at every stage.</p>
          </div>
          <div className="hp-steps-wrap">
            <span className="hp-steps-track" aria-hidden="true"><span className="hp-steps-fill" /></span>
            <ol className="hp-steps">
              {process.map((step, index) => (
                <li key={step.title} className="hp-step">
                  <span className="hp-step-icon" aria-hidden="true"><step.icon size={28} strokeWidth={1.5} /></span>
                  <div>
                    <span className="hp-step-label">Step {String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="hp-work" aria-labelledby="work-title">
        <div className="ag-container">
          <SectionHeader id="work-title" eyebrow="Featured work" title={<>Selected Work, <span className="ag-hl">Told Honestly.</span></>} lead="Our case studies show the challenge, the approach and verified results, published only with client approval. While client case studies are being prepared for publication, these concept studies show how we design, and they are labelled as such." />
          <div className="pc-grid pc-grid-home">
            {caseStudies.slice(0, 3).map((study, index) => <ProjectCard key={study.slug} study={study} size={index === 0 ? "large" : "medium"} />)}
          </div>
          <p className="hp-more"><Link href="/work" className="ag-link">See the work page <ArrowRight size={16} aria-hidden="true" /></Link></p>
        </div>
      </section>

      <TrustpilotSection />

      {/* Technologies */}
      <section className="hp-tech" aria-labelledby="tech-title">
        <div className="ag-container">
          <div className="hp-split-head ag-reveal">
            <div>
              <Eyebrow>Technologies</Eyebrow>
              <h2 id="tech-title" className="hp-h2">Modern Tools, <span className="ag-hl">Chosen for the Job.</span></h2>
            </div>
            <p>We pick technology for reliability, performance and how easily your team can work with it later, not because it is fashionable.</p>
          </div>
          <ul className="hp-tech-grid">
            {technologies.map((row, index) => (
              <li key={row.group} className="hp-tech-cell ag-reveal">
                <span className="hp-tech-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{row.group}</h3>
                <p className="hp-tech-note">{row.text}</p>
                <ul className="hp-tech-items">{row.items.map((item) => <li key={item}><TechLogo name={item} /></li>)}</ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries */}
      <section className="hp-industries" aria-labelledby="industries-title">
        <div className="ag-container">
          <div className="hp-split-head ag-reveal">
            <div>
              <Eyebrow light>Who we work with</Eyebrow>
              <h2 id="industries-title" className="hp-h2 hp-h2-light">Built for Businesses With <span className="ag-hl">Big Plans.</span></h2>
            </div>
            <p>Different stages need different things. We adapt our approach to where you are and where you want to go.</p>
          </div>
          <ul className="hp-industry-list">
            {industries.map((industry) => (
              <li key={industry.title} className="ag-reveal">
                <span className="hp-industry-icon" aria-hidden="true"><industry.icon size={26} strokeWidth={1.5} /></span>
                <h3>{industry.title}</h3>
                <p>{industry.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Insights */}
      {posts.length > 0 && (
        <section className="hp-insights" aria-labelledby="insights-title">
          <div className="ag-container">
            <SectionHeader id="insights-title" eyebrow="Blog & insights" title={<>Ideas, Guides and Lessons <span className="ag-hl">From the Work.</span></>} lead="Practical articles on web development, design, search and growth, plus our development troubleshooting archive." />
            <div className="hp-insights-grid">
              {posts.map((post, index) => (
                <article key={post.slug} className={`hp-post${index === 0 ? " hp-post-lead" : ""} ag-reveal`}>
                  <Link href={`/blog/${post.slug}`} className="hp-post-media" tabIndex={-1} aria-hidden="true">
                    <Image src={post.coverImage} alt="" fill sizes={index === 0 ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 900px) 100vw, 34vw"} className="object-cover" />
                  </Link>
                  <div className="hp-post-body">
                    <p className="hp-post-meta"><span className="hp-post-cat">{getInsightCategoryTitle(getInsightCategory(post))}</span><time dateTime={post.date}>{format(new Date(post.date), "MMM d, yyyy")}</time><span>{post.readTime}</span></p>
                    <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                    {index === 0 ? <p className="hp-post-excerpt">{getArticleSummary(post)}</p> : null}
                  </div>
                </article>
              ))}
            </div>
            <p className="hp-more"><Link href="/blog" className="ag-link">Read the blog <ArrowRight size={16} aria-hidden="true" /></Link></p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="hp-faq" aria-labelledby="faq-title">
        <div className="ag-container ag-faq-grid">
          <div className="hp-faq-head ag-reveal">
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="hp-h2">Questions We <span className="ag-hl">Hear Often.</span></h2>
            <p className="ag-lead">Can&apos;t find what you are looking for? <Link href="/contact" className="ag-inline-link">Send us a message</Link> and we&apos;ll get back to you.</p>
          </div>
          <FaqList faqs={faqs} headingId="faq-title" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="hp-final" aria-labelledby="final-title">
        <div className="hp-final-art" aria-hidden="true"><span /><span /><span /></div>
        <div className="ag-container hp-final-inner">
          <Eyebrow light>Your next move</Eyebrow>
          <h2 id="final-title" className="hp-final-title ag-reveal">Your Next Big Move Starts With a <span className="ag-hl">Better Digital Experience.</span></h2>
          <div className="hp-final-row ag-reveal">
            <p>Tell us where you want your business to go. We&apos;ll help you plan the route and build what gets you there.</p>
            <div className="ag-actions">
              <Link href="/contact" className="hp-cta hp-cta-light"><span>Start a Project</span><CtaArrow /></Link>
              {hasWhatsApp
                ? <WhatsAppButton variant="ghost-light" label="Get a Free Consultation" message={whatsappMessages.consultation} className="ag-btn-lg" />
                : <Link href="/services" className="ag-btn ag-btn-ghost-light ag-btn-lg">Explore Our Services</Link>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
