export type ServiceItem = { title: string; text: string };
export type ServiceFaq = { question: string; answer: string };

export type Service = {
  slug: string;
  number: string;
  name: string;
  shortName: string;
  /** Layout variant so each page reads differently. */
  layout: "editorial" | "split" | "ledger";
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** One-line summary used in the homepage explorer and the services index. */
  summary: string;
  /** A short statement of approach shown as a pull quote. */
  approach: string;
  benefitsHeading: string;
  benefits: ServiceItem[];
  capabilitiesHeading: string;
  capabilities: ServiceItem[];
  technologies: string[];
  processHeading: string;
  process: ServiceItem[];
  audienceHeading: string;
  audience: ServiceItem[];
  faqs: ServiceFaq[];
  related: string[];
  /** Insight categories that relate to this service, used for blog links. */
  insightCategory?: string;
};

export const services: Service[] = [
  {
    slug: "website-design-development",
    number: "01",
    name: "Website Design & Development",
    shortName: "Websites",
    layout: "editorial",
    metaTitle: "Website Design & Development Services",
    metaDescription:
      "Custom website design and development for businesses: corporate sites, landing pages, WordPress and Webflow builds, redesigns and performance work from CodeWithLogs.",
    eyebrow: "Website design & development",
    h1: "Websites Designed to Win Trust and Built to Perform.",
    intro:
      "Your website is often the first serious conversation a customer has with your business. We plan, design and develop websites that explain what you do clearly, load quickly on every device, and give visitors an obvious next step.",
    summary:
      "Custom business, corporate and landing-page websites, designed around your goals and developed for speed, accessibility and search.",
    approach:
      "A good website is not a brochure. It is a sales conversation that runs all day, so every page needs a job and every section needs a reason to exist.",
    benefitsHeading: "What a well-built website changes for your business",
    benefits: [
      { title: "A clearer first impression", text: "Visitors understand what you offer, who it is for and why it matters within the first few seconds." },
      { title: "More enquiries from the same traffic", text: "Page structure, calls to action and forms are planned around the actions you want people to take." },
      { title: "Fast on real devices", text: "Lean front-end code, optimised images and sensible hosting choices help pages load quickly on mobile networks." },
      { title: "Easy for your team to update", text: "Content is editable through a CMS that suits your team, so routine changes do not need a developer." },
    ],
    capabilitiesHeading: "Website services we offer",
    capabilities: [
      { title: "Custom website design", text: "Original layouts and visual direction built around your brand, audience and content, not a reskinned template." },
      { title: "Business & corporate websites", text: "Multi-page sites with clear service structures, team and company information, and room to grow." },
      { title: "Landing pages", text: "Focused campaign pages with a single goal, built for paid traffic, launches and lead generation." },
      { title: "Responsive design", text: "Layouts designed for phones, tablets and large screens individually, not simply shrunk to fit." },
      { title: "WordPress development", text: "Custom WordPress themes and block setups that are clean to edit and avoid unnecessary plugins." },
      { title: "Webflow development", text: "Webflow builds with a tidy class system and CMS collections your marketing team can manage." },
      { title: "Website redesign", text: "A structured redesign that keeps what already works, fixes what does not, and protects your existing search visibility." },
      { title: "Performance optimisation", text: "Audits and fixes for Core Web Vitals, image delivery, scripts and caching on existing sites." },
      { title: "Website maintenance", text: "Ongoing updates, content changes, backups and monitoring after launch." },
    ],
    technologies: ["Next.js", "React", "WordPress", "Webflow", "Tailwind CSS", "TypeScript", "Headless CMS", "Vercel", "Figma"],
    processHeading: "How a website project runs",
    process: [
      { title: "Goals and content", text: "We agree on the purpose of the site, the audiences it serves, and the pages and content it needs." },
      { title: "Structure and wireframes", text: "A sitemap and low-fidelity page layouts settle hierarchy and messaging before visual design starts." },
      { title: "Visual design", text: "Key pages are designed in Figma, reviewed with you, and extended into a consistent set of components." },
      { title: "Development and QA", text: "We build, connect the CMS, and test across browsers, devices, accessibility and performance." },
      { title: "Launch and handover", text: "Redirects, analytics and search settings are checked before go-live, and your team gets a walkthrough." },
    ],
    audienceHeading: "Who this is for",
    audience: [
      { title: "New businesses", text: "who need a credible, professional website that is ready to grow with them." },
      { title: "Established companies", text: "whose current site no longer reflects the quality of their work." },
      { title: "Marketing teams", text: "who need landing pages and a CMS they can actually use." },
    ],
    faqs: [
      { question: "How long does a website project usually take?", answer: "It depends on the number of pages, the content that is ready, and the features involved. A focused landing page is much quicker than a multi-section corporate site. We give you a timeline after the discovery conversation, once the scope is clear." },
      { question: "Should my website use WordPress, Webflow or a custom build?", answer: "Each has trade-offs. WordPress suits content-heavy sites with an existing ecosystem, Webflow suits marketing teams who want visual control, and a custom Next.js build suits sites that need application features or top-end performance. We recommend an option after understanding how your team will use the site." },
      { question: "Will a redesign affect my search rankings?", answer: "A redesign can affect rankings if URLs, content or metadata change without a plan. We map existing URLs, set up redirects and keep important content so the transition is as safe as possible. No one can promise rankings, but careful migration reduces avoidable losses." },
      { question: "Can I update the website myself after launch?", answer: "Yes. We set up a content management system suited to your team and walk you through it, so routine text, image and page updates do not require a developer." },
    ],
    related: ["ui-ux-design", "seo-services", "support-maintenance"],
    insightCategory: "web-development",
  },
  {
    slug: "ui-ux-design",
    number: "02",
    name: "UI/UX Design",
    shortName: "UI/UX",
    layout: "split",
    metaTitle: "UI/UX Design Services for Websites, Apps & SaaS",
    metaDescription:
      "UI/UX design services covering user research, user journeys, wireframes, prototypes, design systems and interfaces for websites, mobile apps and SaaS dashboards.",
    eyebrow: "UI/UX design",
    h1: "Interfaces People Understand the First Time They Use Them.",
    intro:
      "Good design removes friction people should never have to notice. We map how users think, structure the journey around their goals, and design interfaces that are clear, consistent and ready for developers to build.",
    summary:
      "Research-informed user journeys, wireframes, prototypes and design systems for websites, mobile apps and SaaS products.",
    approach:
      "We design the flow before the finish. When the structure is right, the visual layer becomes much easier to get right too.",
    benefitsHeading: "Why investing in UX pays off",
    benefits: [
      { title: "Fewer abandoned journeys", text: "Sign-ups, checkouts and onboarding flows are simplified so fewer people give up halfway." },
      { title: "Lower development rework", text: "Prototypes are tested before code is written, which is far cheaper than changing a shipped feature." },
      { title: "A consistent product", text: "A shared design system keeps screens, components and interactions coherent as the product grows." },
      { title: "Accessible by default", text: "Contrast, focus states, type sizes and keyboard use are considered from the first wireframe." },
    ],
    capabilitiesHeading: "UI/UX design capabilities",
    capabilities: [
      { title: "UX research & audits", text: "Stakeholder interviews, heuristic reviews and analytics review to find where users struggle." },
      { title: "User journeys & flows", text: "End-to-end maps of how different users reach their goals, including edge cases." },
      { title: "Wireframes", text: "Low-fidelity layouts that settle structure and content priority quickly." },
      { title: "Interactive prototypes", text: "Clickable Figma prototypes for stakeholder review and usability testing." },
      { title: "UI design", text: "High-fidelity interface design with a clear visual hierarchy and refined detail." },
      { title: "Website UI/UX", text: "Marketing site structures and page designs focused on clarity and conversion." },
      { title: "Mobile app UI/UX", text: "iOS and Android interfaces that respect platform conventions and thumb-friendly layouts." },
      { title: "SaaS dashboard design", text: "Data-dense screens, tables, filters and settings that stay usable as complexity grows." },
      { title: "Design systems", text: "Tokens, components and documentation that let designers and developers work from one source." },
    ],
    technologies: ["Figma", "FigJam", "Design tokens", "Storybook", "Maze", "Hotjar", "Google Analytics", "WCAG 2.2"],
    processHeading: "Our design process",
    process: [
      { title: "Understand", text: "We learn about your users, business goals, constraints and what is already working." },
      { title: "Map", text: "User journeys and information architecture define what each screen needs to achieve." },
      { title: "Sketch & test", text: "Wireframes and prototypes are reviewed early, when changes are still inexpensive." },
      { title: "Design & document", text: "Final UI, component states and specs are prepared and handed to developers in a format they can use." },
    ],
    audienceHeading: "Who we design for",
    audience: [
      { title: "SaaS founders", text: "shaping an MVP or untangling a product that has grown without a system." },
      { title: "Product teams", text: "who need extra design capacity or a design system to work from." },
      { title: "Businesses with complex sites", text: "where visitors struggle to find what they need." },
    ],
    faqs: [
      { question: "What is the difference between UI and UX design?", answer: "UX design is about how the product works: the structure, flows and decisions a user makes. UI design is about how it looks and feels: layout, typography, colour and components. We handle both, because a beautiful interface on a confusing flow still fails." },
      { question: "Do you hand designs over to our own developers?", answer: "Yes. We prepare organised Figma files with components, states, spacing and responsive behaviour documented. We can also join developer reviews to answer questions during the build." },
      { question: "Can you improve an existing product rather than redesign it?", answer: "Often that is the better choice. A UX audit identifies the changes with the most impact, and we can improve those areas incrementally without disrupting your users." },
      { question: "Do you run usability testing?", answer: "We can run lightweight usability sessions with prototypes and recommend tools for ongoing testing. The depth of research is agreed during scoping to match your budget and timeline." },
    ],
    related: ["web-application-development", "mobile-app-development", "branding-creative"],
    insightCategory: "ui-ux-design",
  },
  {
    slug: "web-application-development",
    number: "03",
    name: "Web Application Development",
    shortName: "Web apps",
    layout: "ledger",
    metaTitle: "Web Application Development: SaaS, React & Next.js",
    metaDescription:
      "Custom web application development with React and Next.js: SaaS products, admin dashboards, APIs, databases and business automation, planned for scale and security.",
    eyebrow: "Web application development",
    h1: "Custom Web Applications That Fit How Your Business Really Works.",
    intro:
      "Off-the-shelf software only goes so far. When your process, product or data needs something specific, we design and develop web applications with React, Next.js and modern back-end tools, built to be secure, maintainable and ready to scale.",
    summary:
      "SaaS products, internal tools, dashboards and APIs built with React, Next.js and modern back-end technology.",
    approach:
      "We treat your application as a long-term asset: readable code, sensible architecture and clear documentation, so it stays easy to change after launch.",
    benefitsHeading: "What a custom application gives you",
    benefits: [
      { title: "Software that matches your process", text: "Instead of bending your workflow around a generic tool, the tool is built around the way your team works." },
      { title: "Room to scale", text: "Architecture, data models and hosting are chosen with growth in mind, not just the first release." },
      { title: "Security from the start", text: "Authentication, authorisation, input validation and data access rules are designed in, not bolted on." },
      { title: "You own the product", text: "Code lives in your repository, with documentation that makes future development straightforward." },
    ],
    capabilitiesHeading: "Web application services",
    capabilities: [
      { title: "Custom web applications", text: "Bespoke applications for operations, customer portals, booking, inventory and more." },
      { title: "SaaS development", text: "Multi-tenant products with authentication, subscriptions, roles and onboarding." },
      { title: "React & Next.js development", text: "Fast, SEO-friendly front ends using server rendering and modern React patterns." },
      { title: "Front-end development", text: "Accessible, responsive interfaces built from your designs or ours." },
      { title: "Back-end development", text: "Business logic, background jobs and integrations with Node.js and serverless platforms." },
      { title: "API development & integration", text: "REST and GraphQL APIs, plus integrations with payment, CRM, email and third-party services." },
      { title: "Admin dashboards", text: "Internal panels for managing content, users, orders and data with the right permissions." },
      { title: "Business automation", text: "Replacing repetitive manual steps with scheduled jobs, webhooks and workflows." },
      { title: "Database design", text: "Data models in PostgreSQL, MongoDB or Supabase, designed for integrity and query performance." },
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Supabase", "Prisma", "Stripe", "Vercel", "AWS", "Docker"],
    processHeading: "From idea to production",
    process: [
      { title: "Scoping & architecture", text: "We define features, user roles, data and integrations, then choose an architecture that fits." },
      { title: "Prototype or MVP", text: "The smallest useful version is designed and built first, so real feedback shapes what follows." },
      { title: "Iterative development", text: "Work ships in short cycles with regular demos, so you always see progress and can steer." },
      { title: "Testing & hardening", text: "Automated tests, security checks and performance reviews before release." },
      { title: "Deploy & evolve", text: "Production deployment, monitoring and a roadmap for the next set of improvements." },
    ],
    audienceHeading: "A good fit if you are",
    audience: [
      { title: "A startup building a SaaS MVP", text: "and need a technical partner to get it to market." },
      { title: "A growing business", text: "outgrowing spreadsheets and disconnected tools." },
      { title: "A team with an existing app", text: "that needs new features, refactoring or a performance overhaul." },
    ],
    faqs: [
      { question: "Which technologies do you use for web applications?", answer: "Our main stack is React and Next.js with TypeScript on the front end, and Node.js with PostgreSQL, MongoDB or Supabase on the back end. We recommend tools based on your requirements and your team's ability to maintain them." },
      { question: "Can you take over an existing application?", answer: "Yes. We start with a code and architecture review so we understand the current state, then agree on what to fix, refactor or extend first." },
      { question: "Do we own the source code?", answer: "Yes. The code is stored in a repository you control, and ownership transfers to you as agreed in the project terms." },
      { question: "How do you handle security?", answer: "We follow established practices: secure authentication, role-based access, input validation, least-privilege data access and dependency updates. For regulated industries, we discuss specific compliance needs during scoping." },
    ],
    related: ["ui-ux-design", "ai-automation", "support-maintenance"],
    insightCategory: "web-development",
  },
  {
    slug: "mobile-app-development",
    number: "04",
    name: "Mobile App Development",
    shortName: "Mobile apps",
    layout: "editorial",
    metaTitle: "Mobile App Development: iOS, Android & Cross-Platform",
    metaDescription:
      "Mobile app development for iOS and Android using React Native and Flutter, including app UI/UX design, API integration, store release and ongoing maintenance.",
    eyebrow: "Mobile app development",
    h1: "Mobile Apps That Earn a Place on Your Customer's Home Screen.",
    intro:
      "People keep the apps that are fast, focused and genuinely useful. We design and develop iOS and Android apps, usually with a cross-platform approach that keeps one codebase while still feeling native on each device.",
    summary:
      "iOS, Android and cross-platform apps built with React Native or Flutter, from interface design to store release.",
    approach:
      "We start from the one job your app has to do brilliantly, then build outward. Focus is what makes an app worth keeping.",
    benefitsHeading: "Why build it the right way",
    benefits: [
      { title: "One codebase, two platforms", text: "Cross-platform frameworks reduce development and maintenance effort without sacrificing quality." },
      { title: "Native-feeling experience", text: "Navigation, gestures and components follow iOS and Android conventions people already know." },
      { title: "Built for real conditions", text: "Offline states, slow connections and battery use are considered from the start." },
      { title: "Ready for the stores", text: "Store listings, review guidelines and release builds are handled as part of the project." },
    ],
    capabilitiesHeading: "Mobile capabilities",
    capabilities: [
      { title: "iOS app development", text: "Apps for iPhone and iPad prepared for App Store review and distribution." },
      { title: "Android app development", text: "Apps for the wide range of Android devices, released through Google Play." },
      { title: "Cross-platform development", text: "Shared code across iOS and Android to move faster and maintain less." },
      { title: "React Native", text: "A strong choice when your team already works with React or shares logic with a web app." },
      { title: "Flutter", text: "A good fit for highly custom interfaces and consistent rendering across devices." },
      { title: "Mobile app UI/UX", text: "Screen flows and interface design shaped around touch, context and short sessions." },
      { title: "Backend & API integration", text: "Connecting the app to your data, authentication, payments and notifications." },
      { title: "App maintenance", text: "OS updates, dependency upgrades, crash fixes and new feature releases after launch." },
    ],
    technologies: ["React Native", "Expo", "Flutter", "Dart", "TypeScript", "Firebase", "Supabase", "Node.js", "App Store Connect", "Google Play Console"],
    processHeading: "How we take an app to launch",
    process: [
      { title: "Define the core", text: "We identify the primary use case, users and platforms, and decide what belongs in version one." },
      { title: "Design the flows", text: "Screens and interactions are designed and prototyped for both platforms." },
      { title: "Build & integrate", text: "The app is developed in sprints and connected to its backend and services." },
      { title: "Test on devices", text: "Testing across real devices and OS versions, including beta distribution to your team." },
      { title: "Release & support", text: "Store submission, launch, and a maintenance plan for updates." },
    ],
    audienceHeading: "Who it's for",
    audience: [
      { title: "Startups", text: "launching a mobile-first product or MVP." },
      { title: "Businesses with loyal customers", text: "who want bookings, ordering or accounts in their pocket." },
      { title: "Companies with a web app", text: "who need a companion mobile experience." },
    ],
    faqs: [
      { question: "Should I build a native or cross-platform app?", answer: "For most business apps, cross-platform with React Native or Flutter is efficient and delivers a high-quality experience. Fully native development makes sense when you need deep platform features or maximum performance. We explain the trade-offs for your specific case." },
      { question: "Do you publish the app to the App Store and Google Play?", answer: "Yes. We prepare release builds and store listings and handle submission. The app is published under your developer accounts so you retain ownership." },
      { question: "Can my mobile app share a backend with my website?", answer: "Usually, yes. A shared API or backend platform lets your website and app use the same data, accounts and business logic." },
      { question: "What happens after the app is live?", answer: "Apps need regular updates for new OS versions and store policies. We offer maintenance plans covering updates, monitoring, fixes and improvements." },
    ],
    related: ["ui-ux-design", "web-application-development", "support-maintenance"],
    insightCategory: "web-development",
  },
  {
    slug: "ecommerce-development",
    number: "05",
    name: "E-commerce Development",
    shortName: "E-commerce",
    layout: "split",
    metaTitle: "E-commerce Development: Shopify, WooCommerce & Custom Stores",
    metaDescription:
      "E-commerce development services for Shopify, WooCommerce and custom online stores: store design, payment gateways, checkout and cart optimisation, and ongoing store maintenance.",
    eyebrow: "E-commerce development",
    h1: "Online Stores Built to Turn Browsers Into Buyers.",
    intro:
      "Every extra click between a product and a payment costs you sales. We design and develop online stores on Shopify, WooCommerce or custom stacks, with fast product pages, a clear checkout and the integrations your operations depend on.",
    summary:
      "Shopify, WooCommerce and custom stores with clear product pages, smooth checkout and reliable payment integrations.",
    approach:
      "Commerce design is about confidence. Customers buy when they can find the product, trust the store and pay without friction.",
    benefitsHeading: "What a better store delivers",
    benefits: [
      { title: "Smoother checkout", text: "Fewer steps, clear costs and trusted payment options reduce abandoned carts." },
      { title: "Products that sell themselves", text: "Product pages with strong imagery, clear details and helpful filtering." },
      { title: "Operations that connect", text: "Inventory, shipping, accounting and marketing tools integrated with your store." },
      { title: "Built for search and speed", text: "Structured product data and fast pages help both search engines and shoppers." },
    ],
    capabilitiesHeading: "E-commerce capabilities",
    capabilities: [
      { title: "Shopify development", text: "Custom Shopify themes, sections and app integrations that are simple for your team to manage." },
      { title: "WooCommerce development", text: "WooCommerce stores on WordPress, kept lean and secure." },
      { title: "Custom online stores", text: "Headless or fully custom builds for unusual catalogues, pricing or checkout needs." },
      { title: "Store design", text: "Home, collection, product and cart pages designed around how your customers shop." },
      { title: "Payment gateway integration", text: "Stripe, PayPal and regional gateways set up securely, with clear error handling." },
      { title: "Cart & checkout optimisation", text: "Reviewing and improving the path to purchase based on analytics and best practice." },
      { title: "Store migration", text: "Moving products, customers and orders between platforms with redirects in place." },
      { title: "Store maintenance", text: "App and plugin updates, theme fixes, seasonal changes and performance checks." },
    ],
    technologies: ["Shopify", "Liquid", "Shopify Hydrogen", "WooCommerce", "WordPress", "Next.js", "Stripe", "PayPal", "Google Merchant Center", "Klaviyo"],
    processHeading: "Building your store",
    process: [
      { title: "Catalogue & operations review", text: "We look at your products, fulfilment, payments and the tools you already use." },
      { title: "Platform recommendation", text: "Shopify, WooCommerce or custom: chosen for your catalogue, budget and growth plans." },
      { title: "Design & build", text: "Store design, theme development, product setup and integrations." },
      { title: "Test every path", text: "Orders, payments, taxes, shipping rules and emails are tested end to end." },
      { title: "Launch & optimise", text: "Go-live, analytics and a list of improvements to test once real orders arrive." },
    ],
    audienceHeading: "Who we build stores for",
    audience: [
      { title: "Brands selling online for the first time", text: "who want a store that looks established from day one." },
      { title: "Growing retailers", text: "whose current store is slow, dated or hard to manage." },
      { title: "B2B sellers", text: "with custom pricing, bulk orders or account-based buying." },
    ],
    faqs: [
      { question: "Shopify or WooCommerce: which is better for my store?", answer: "Shopify is a hosted platform that is quick to launch and low-maintenance. WooCommerce runs on WordPress and offers more control but needs more upkeep. For very specific requirements a custom build can make sense. We recommend a platform after reviewing your catalogue and operations." },
      { question: "Can you move my store to a new platform?", answer: "Yes. We migrate products, customers and order history where the platforms allow, and set up redirects to protect existing search traffic." },
      { question: "Which payment gateways can you integrate?", answer: "Common options include Stripe, PayPal, Shopify Payments and regional providers. Availability depends on your platform and the countries you sell in." },
      { question: "Do you help with selling on Google Shopping?", answer: "We can set up product feeds and structured data for Google Merchant Center. Campaign management is part of our digital marketing service." },
    ],
    related: ["digital-marketing", "seo-services", "website-design-development"],
    insightCategory: "ecommerce",
  },
  {
    slug: "seo-services",
    number: "06",
    name: "SEO",
    shortName: "SEO",
    layout: "ledger",
    metaTitle: "SEO Services: Technical, On-Page & Content Strategy",
    metaDescription:
      "SEO services including technical SEO, on-page optimisation, SEO audits, keyword research, content strategy, local and e-commerce SEO, and site speed improvements.",
    eyebrow: "Search engine optimisation",
    h1: "SEO That Builds Visibility You Can Keep.",
    intro:
      "Sustainable search visibility comes from a technically sound site, content that answers real questions, and patience. We combine technical SEO, on-page work and content strategy to help the right people find you, without shortcuts that put your site at risk.",
    summary:
      "Technical and on-page SEO, audits, keyword research and content strategy for long-term organic visibility.",
    approach:
      "No one can guarantee rankings. What we can do is remove the technical barriers, match your content to search intent, and measure what changes.",
    benefitsHeading: "What good SEO work achieves",
    benefits: [
      { title: "A site search engines can read", text: "Crawling, indexing, structured data and internal linking are set up correctly." },
      { title: "Content aligned with demand", text: "Pages are planned around the questions and terms your customers actually search for." },
      { title: "Faster pages", text: "Core Web Vitals improvements help users and support search performance." },
      { title: "Clear reporting", text: "Regular reports on visibility, traffic and conversions, explained in plain language." },
    ],
    capabilitiesHeading: "SEO services",
    capabilities: [
      { title: "SEO audit", text: "A prioritised review of technical, on-page and content issues with a clear action list." },
      { title: "Technical SEO", text: "Crawlability, indexation, canonical tags, sitemaps, redirects, structured data and rendering." },
      { title: "On-page SEO", text: "Titles, headings, meta descriptions, internal links and content structure." },
      { title: "Keyword research", text: "Finding terms with real intent behind them and mapping them to the right pages." },
      { title: "Content optimisation", text: "Improving existing pages so they answer search intent more completely." },
      { title: "Content strategy", text: "A plan for new articles and pages that builds topical authority over time." },
      { title: "Local SEO", text: "Business profile optimisation and local signals for businesses that serve a specific area." },
      { title: "E-commerce SEO", text: "Category and product page optimisation, faceted navigation and product schema." },
      { title: "Site speed optimisation", text: "Image, script, font and caching improvements that lift Core Web Vitals." },
    ],
    technologies: ["Google Search Console", "Google Analytics 4", "PageSpeed Insights", "Lighthouse", "Ahrefs", "Screaming Frog", "Schema.org", "Bing Webmaster Tools"],
    processHeading: "How we approach SEO",
    process: [
      { title: "Audit & benchmark", text: "We record where you stand today so progress can be measured honestly." },
      { title: "Fix the foundations", text: "Technical issues are resolved first, because content cannot rank if it cannot be indexed." },
      { title: "Optimise & create", text: "Existing pages are improved and new content is planned around real search demand." },
      { title: "Measure & refine", text: "Monthly reviews of what moved and why, followed by the next round of priorities." },
    ],
    audienceHeading: "Who benefits most",
    audience: [
      { title: "Businesses relying on paid ads", text: "who want a channel that keeps working when spending stops." },
      { title: "Sites that recently lost traffic", text: "and need to understand what changed." },
      { title: "Content-led companies", text: "who want a structured plan rather than random posts." },
    ],
    faqs: [
      { question: "How long does SEO take to show results?", answer: "Technical fixes can have an effect within weeks, while content and authority usually take several months to build. Results depend on your site's history, competition and how consistently the work is carried out." },
      { question: "Can you guarantee first-page rankings?", answer: "No, and you should be cautious of anyone who does. Search engines control rankings. We focus on the factors within your control and report transparently on progress." },
      { question: "Do you write content as well?", answer: "We plan content strategy and can create or optimise content with your team. Subject-matter input from your business is important for accurate, trustworthy pages." },
      { question: "What is included in an SEO audit?", answer: "A typical audit covers crawling and indexing, site structure, metadata, internal links, structured data, page speed, content quality and keyword alignment, with prioritised recommendations." },
    ],
    related: ["digital-marketing", "website-design-development", "ecommerce-development"],
    insightCategory: "seo",
  },
  {
    slug: "digital-marketing",
    number: "07",
    name: "Digital Marketing",
    shortName: "Marketing",
    layout: "editorial",
    metaTitle: "Digital Marketing Services: Google Ads, Meta Ads & CRO",
    metaDescription:
      "Digital marketing services including Google Ads, Meta Ads, search engine marketing, social media, lead generation, conversion rate optimisation, email marketing and analytics.",
    eyebrow: "Digital marketing",
    h1: "Marketing That Reaches the Right People and Proves What Works.",
    intro:
      "Spending more is easy. Spending well takes clear goals, careful targeting and honest measurement. We plan and manage paid campaigns, social media and email marketing, then use analytics and conversion optimisation to improve results over time.",
    summary:
      "Google Ads, Meta Ads, social media, email and conversion optimisation, measured with proper analytics.",
    approach:
      "Every campaign starts with tracking you can trust. Without it, you are guessing, and guessing is expensive.",
    benefitsHeading: "What you get from a measured approach",
    benefits: [
      { title: "Budget aimed at intent", text: "Campaigns target people actively looking for what you offer, not just anyone." },
      { title: "Landing pages that convert", text: "Ads and pages are planned together, so the click leads somewhere persuasive." },
      { title: "Tracking you can rely on", text: "Conversions, events and attribution configured properly in GA4 and ad platforms." },
      { title: "Decisions based on data", text: "Regular reviews show what is working, what is not, and where to move budget." },
    ],
    capabilitiesHeading: "Digital marketing services",
    capabilities: [
      { title: "Google Ads", text: "Search, Performance Max, Shopping and display campaigns built around clear goals." },
      { title: "Meta Ads", text: "Facebook and Instagram campaigns with audience strategy and creative testing." },
      { title: "Search engine marketing", text: "Paid search strategy, keyword structure and bid management." },
      { title: "Social media marketing", text: "Content planning and channel management for consistent, on-brand presence." },
      { title: "Paid campaign management", text: "Ongoing optimisation of budgets, audiences, ads and landing pages." },
      { title: "Conversion rate optimisation", text: "Testing page changes, forms and offers to turn more visitors into leads or sales." },
      { title: "Lead generation", text: "Funnels, lead magnets and forms connected to your CRM." },
      { title: "Email marketing", text: "Newsletters, automated sequences and segmentation with your email platform." },
      { title: "Analytics & tracking", text: "GA4, Google Tag Manager, conversion APIs and dashboards set up correctly." },
    ],
    technologies: ["Google Ads", "Meta Ads Manager", "Google Analytics 4", "Google Tag Manager", "Looker Studio", "Mailchimp", "Klaviyo", "HubSpot", "Hotjar"],
    processHeading: "How we run campaigns",
    process: [
      { title: "Goals & tracking", text: "We define what success means and make sure it can be measured accurately." },
      { title: "Audience & message", text: "Research into who you are reaching and what will make them act." },
      { title: "Launch & learn", text: "Campaigns start with structured tests to learn quickly what resonates." },
      { title: "Optimise & report", text: "Budgets shift to what performs, and you receive clear, regular reports." },
    ],
    audienceHeading: "Who it's for",
    audience: [
      { title: "Service businesses", text: "that need a steady flow of qualified leads." },
      { title: "E-commerce brands", text: "looking for profitable, scalable sales channels." },
      { title: "Startups at launch", text: "who need early traction and real market feedback." },
    ],
    faqs: [
      { question: "How much should I spend on advertising?", answer: "It depends on your market, goals and margins. We usually recommend starting with a test budget large enough to learn from, then scaling what works. Ad spend is paid directly to the platforms and is separate from management fees." },
      { question: "Which platform is better: Google Ads or Meta Ads?", answer: "Google Ads captures people already searching for a solution, while Meta Ads is strong for discovery and visual products. Many businesses benefit from both, used for different stages of the customer journey." },
      { question: "Do you create the ad creatives?", answer: "Yes. Our branding and creative team can produce ad visuals and copy, or we can work with assets you already have." },
      { question: "How do you report on results?", answer: "You get regular reports and access to a live dashboard showing spend, leads or sales, and cost per result, with commentary on what we are changing and why." },
    ],
    related: ["seo-services", "branding-creative", "ecommerce-development"],
    insightCategory: "digital-marketing",
  },
  {
    slug: "branding-creative",
    number: "08",
    name: "Branding & Creative",
    shortName: "Branding",
    layout: "split",
    metaTitle: "Branding Agency Services: Identity, Logo & Creative Design",
    metaDescription:
      "Branding and creative services: brand identity, logo design, brand guidelines, visual systems, social media creatives, marketing graphics, presentations and print design.",
    eyebrow: "Branding & creative",
    h1: "A Brand Identity That Looks the Part and Sounds Like You.",
    intro:
      "People judge quality before they read a word. We create brand identities and creative assets that make your business recognisable, credible and consistent, from your logo and guidelines to the graphics your team uses every week.",
    summary:
      "Brand identity, logos, guidelines, visual systems and the everyday creative assets that keep a brand consistent.",
    approach:
      "A brand is a system, not a logo. We design the parts that make it work everywhere, so it holds together as your business grows.",
    benefitsHeading: "Why a strong brand matters",
    benefits: [
      { title: "Instant credibility", text: "A considered identity signals that your business takes quality seriously." },
      { title: "Recognition over time", text: "Consistent colour, type and imagery help people remember and recognise you." },
      { title: "Faster content creation", text: "Templates and guidelines let your team produce on-brand material without starting from scratch." },
      { title: "A clear position", text: "Your identity reflects what makes you different, not what everyone else is doing." },
    ],
    capabilitiesHeading: "Branding & creative services",
    capabilities: [
      { title: "Brand identity", text: "The visual foundations of your brand: logo, colour, typography, imagery and tone." },
      { title: "Logo design", text: "Distinctive marks designed to work at every size, from favicon to signage." },
      { title: "Brand guidelines", text: "A practical guide that shows your team and partners how to use the brand correctly." },
      { title: "Visual systems", text: "Layouts, icon styles, illustration and photography direction that extend the identity." },
      { title: "Social media creatives", text: "Post and story templates and campaign graphics for your channels." },
      { title: "Marketing graphics", text: "Ad creatives, email headers and website imagery aligned with your brand." },
      { title: "Banners", text: "Display ad sets, web banners and event graphics in the sizes you need." },
      { title: "Presentation design", text: "Pitch decks and sales presentations that make complex ideas easy to follow." },
      { title: "Print design", text: "Business cards, brochures, flyers and stationery prepared for production." },
    ],
    technologies: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Canva templates", "Google Slides", "Keynote"],
    processHeading: "Our branding process",
    process: [
      { title: "Discovery", text: "We learn about your business, audience, competitors and ambitions." },
      { title: "Direction", text: "Moodboards and creative routes show different ways the brand could look and feel." },
      { title: "Design", text: "The chosen direction is developed into a logo, palette, type system and key applications." },
      { title: "Roll-out", text: "Guidelines, templates and final files are prepared for every channel you use." },
    ],
    audienceHeading: "Who we work with",
    audience: [
      { title: "New businesses", text: "that want to launch with a professional identity." },
      { title: "Companies that have outgrown their look", text: "and need a refresh without losing recognition." },
      { title: "Marketing teams", text: "who need a steady supply of on-brand creative." },
    ],
    faqs: [
      { question: "What is included in a brand identity project?", answer: "Typically a logo suite, colour palette, typography, core visual elements and brand guidelines, plus a set of applications such as social templates or stationery. The exact deliverables are agreed at the start." },
      { question: "Can you refresh our existing brand instead of starting over?", answer: "Yes. A refresh keeps the recognisable parts of your brand while modernising and systemising the rest." },
      { question: "Will we own the logo and design files?", answer: "Yes. On completion you receive the final files in standard formats, with ownership as set out in the project agreement." },
      { question: "Do you also design ongoing marketing material?", answer: "Yes. Many clients use us for regular creative work such as social media graphics, ad creatives and presentations after the identity is complete." },
    ],
    related: ["ui-ux-design", "digital-marketing", "website-design-development"],
    insightCategory: "branding",
  },
  {
    slug: "ai-automation",
    number: "09",
    name: "AI & Automation",
    shortName: "AI & automation",
    layout: "ledger",
    metaTitle: "AI Automation Services: Chatbots, AI Apps & Workflows",
    metaDescription:
      "AI and automation services: AI-powered web apps, chatbots, workflow and business process automation, AI API integration, custom AI tools and intelligent dashboards.",
    eyebrow: "AI & automation",
    h1: "Practical AI and Automation That Saves Real Time.",
    intro:
      "AI is most valuable when it solves a specific, repeated problem. We help you identify where AI and automation make sense, then design and build tools, chatbots and workflows that fit into the systems you already use, with sensible safeguards.",
    summary:
      "AI-powered apps, chatbots, workflow automation and API integrations focused on measurable time savings.",
    approach:
      "We start with the workflow, not the model. If a simple automation solves the problem, that is what we recommend.",
    benefitsHeading: "What automation can free up",
    benefits: [
      { title: "Hours back every week", text: "Repetitive tasks such as data entry, routing and reporting run automatically." },
      { title: "Faster responses", text: "Customers get instant, accurate answers to common questions at any time of day." },
      { title: "Fewer manual errors", text: "Data moves between systems consistently, without copy-and-paste mistakes." },
      { title: "Guardrails included", text: "Human review, logging and data-handling rules are designed into AI features." },
    ],
    capabilitiesHeading: "AI & automation capabilities",
    capabilities: [
      { title: "AI-powered web apps", text: "Applications that use language models to draft, summarise, classify or search." },
      { title: "AI chatbots", text: "Assistants grounded in your own content, with escalation to a human when needed." },
      { title: "Workflow automation", text: "Connecting your tools so leads, orders and requests move automatically." },
      { title: "Business process automation", text: "Mapping a manual process and rebuilding it with automation and clear checkpoints." },
      { title: "AI API integration", text: "Adding OpenAI, Anthropic or Google AI capabilities into your existing product." },
      { title: "Custom AI tools", text: "Internal tools for your team, such as document processing or content assistants." },
      { title: "AI customer support", text: "Support assistants that answer routine questions and route complex ones." },
      { title: "Intelligent dashboards", text: "Dashboards that surface trends, anomalies and plain-language summaries of your data." },
    ],
    technologies: ["OpenAI API", "Anthropic Claude API", "Google Gemini", "n8n", "Zapier", "Make", "LangChain", "pgvector", "Supabase", "Next.js", "Python"],
    processHeading: "How we introduce AI responsibly",
    process: [
      { title: "Find the opportunity", text: "We review your workflows to find the tasks where automation would save the most effort." },
      { title: "Prove it small", text: "A focused proof of concept tests accuracy and usefulness with real examples." },
      { title: "Build into your stack", text: "The solution is integrated with your tools, with logging, permissions and fallbacks." },
      { title: "Monitor & improve", text: "Quality, costs and usage are reviewed, and the system is refined over time." },
    ],
    audienceHeading: "Who it suits",
    audience: [
      { title: "Teams buried in repetitive admin", text: "who want time back for higher-value work." },
      { title: "Support-heavy businesses", text: "that answer the same questions every day." },
      { title: "Product companies", text: "adding AI features to an existing application." },
    ],
    faqs: [
      { question: "Is AI right for my business?", answer: "Not always. AI works best for tasks involving language, classification or search. For simpler rule-based tasks, traditional automation is cheaper and more reliable. We help you choose the right approach." },
      { question: "How do you handle data privacy with AI tools?", answer: "We review what data the system needs, choose providers and settings that match your privacy requirements, minimise sensitive data sent to models, and document how information is handled." },
      { question: "Will an AI chatbot give wrong answers?", answer: "Language models can make mistakes. We reduce the risk by grounding answers in your own approved content, limiting scope, adding human escalation and monitoring conversations." },
      { question: "Can you connect automation to the tools we already use?", answer: "In most cases, yes. Tools such as CRMs, spreadsheets, email platforms and e-commerce systems usually offer APIs or integrations we can work with." },
    ],
    related: ["web-application-development", "support-maintenance", "digital-marketing"],
    insightCategory: "ai-automation",
  },
  {
    slug: "support-maintenance",
    number: "10",
    name: "Support & Maintenance",
    shortName: "Support",
    layout: "split",
    metaTitle: "Website Support & Maintenance Services",
    metaDescription:
      "Website and application support and maintenance: updates, security, bug fixing, monitoring, backups, migrations, hosting help and ongoing technical support.",
    eyebrow: "Support & maintenance",
    h1: "Keep Your Website and Apps Secure, Fast and Running Smoothly.",
    intro:
      "Launch is the beginning, not the end. Software needs updates, monitoring and the occasional fix. We look after websites and web applications so problems are caught early and your team can focus on the business.",
    summary:
      "Updates, security, monitoring, backups, bug fixes and migrations for websites and web applications.",
    approach:
      "Prevention is cheaper than repair. Regular care keeps small issues from turning into urgent ones.",
    benefitsHeading: "What ongoing care protects",
    benefits: [
      { title: "Fewer surprises", text: "Monitoring and regular updates catch issues before your customers do." },
      { title: "Better security", text: "Software, plugins and dependencies are kept current to close known vulnerabilities." },
      { title: "Reliable backups", text: "Regular, tested backups mean you can recover if something goes wrong." },
      { title: "A team on call", text: "You have someone who knows your system and can respond when you need help." },
    ],
    capabilitiesHeading: "Support & maintenance services",
    capabilities: [
      { title: "Website updates", text: "Core, theme, plugin and content updates handled safely." },
      { title: "Security maintenance", text: "Dependency updates, hardening, SSL and access reviews." },
      { title: "Bug fixing", text: "Investigating and fixing errors in websites and web applications." },
      { title: "Performance monitoring", text: "Uptime, speed and error tracking with alerts when something changes." },
      { title: "Website migration", text: "Moving sites between hosts or platforms with minimal disruption." },
      { title: "Hosting support", text: "Help choosing, configuring and managing hosting, domains and DNS." },
      { title: "Backups", text: "Scheduled backups with restore procedures that are actually tested." },
      { title: "Ongoing technical support", text: "A monthly allocation of time for improvements, questions and small features." },
    ],
    technologies: ["Vercel", "Netlify", "AWS", "Cloudflare", "WordPress", "Shopify", "Sentry", "UptimeRobot", "GitHub", "Node.js"],
    processHeading: "How support works",
    process: [
      { title: "Onboarding audit", text: "We review your site or app, hosting, access and current risks." },
      { title: "Stabilise", text: "Urgent issues and outdated components are addressed first." },
      { title: "Routine care", text: "Scheduled updates, backups and monitoring run each month." },
      { title: "Report & improve", text: "Regular summaries of what was done, plus recommendations." },
    ],
    audienceHeading: "Who needs this",
    audience: [
      { title: "Businesses without in-house developers", text: "who need dependable technical help." },
      { title: "Teams that inherited a site", text: "from a previous agency or freelancer." },
      { title: "Companies with critical web apps", text: "where downtime has a direct cost." },
    ],
    faqs: [
      { question: "Can you support a website you did not build?", answer: "Yes. We start with an onboarding audit to understand the codebase, hosting and any existing issues before taking on regular maintenance." },
      { question: "What platforms do you support?", answer: "We support WordPress, Webflow, Shopify, WooCommerce and custom applications built with React, Next.js and Node.js, among others. Ask us about your specific setup." },
      { question: "How quickly do you respond to urgent issues?", answer: "Response times are agreed as part of your support plan, based on the level of cover your business needs." },
      { question: "Do you help with moving to a new host?", answer: "Yes. We plan and carry out migrations, including DNS, SSL, email considerations and post-move testing." },
    ],
    related: ["website-design-development", "web-application-development", "ecommerce-development"],
    insightCategory: "development-troubleshooting",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function servicePath(slug: string) {
  return `/services/${slug}`;
}
