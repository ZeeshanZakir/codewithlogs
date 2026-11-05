import { siteUrl } from "@/lib/site-url";

/**
 * Public business details. Only facts that already exist on the live site are
 * listed here. Add a phone number, address or founding date only once the
 * owner confirms them.
 */
export const siteConfig = {
  name: "CodeWithLogs",
  url: siteUrl,
  tagline: "Strategy. Design. Development. Growth.",
  description:
    "CodeWithLogs is a digital agency for web design, website development, web applications, UI/UX, e-commerce, SEO, digital marketing, branding and AI automation.",
  shortDescription:
    "A technology-driven creative agency helping ambitious businesses design, build and grow their digital presence.",
  // Already published on the existing contact page. Confirm the mailbox is monitored.
  contactEmail: "info@codewithlogs.com",
  founder: {
    name: "Zeeshan Zakir",
    role: "Founder",
    image: "/images/zeeshan-zakir.webp",
    url: "https://www.zeeshanzakir.com/",
  },
  // Real profiles taken from the existing About page.
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/zeeshan-zakir-profile/" },
    { label: "X (Twitter)", href: "https://x.com/ZeshanM04610735" },
    { label: "GitHub", href: "https://github.com/ZeeshanZakir/" },
    { label: "Website", href: "https://www.zeeshanzakir.com/" },
  ],
  // Company page linked from the previous footer and contact page.
  companyLinkedIn: "https://www.linkedin.com/company/code-with-logs",
} as const;

/**
 * Business figures for the homepage numbers band. Leave empty until each
 * figure is real and verifiable; the band then falls back to figures the site
 * can prove (services, articles, tools, technologies). Example:
 *   { value: 25, suffix: "+", label: "Clients served", note: "Since 2022", icon: "users" }
 */
// Figures supplied by the business owner (5 Nov 2026). Keep them current.
export const businessStats: { value: number; suffix?: string; label: string; note?: string; icon: "users" | "globe" | "layers" | "calendar" | "briefcase" | "star" }[] = [
  { value: 50, suffix: "+", label: "Clients served", note: "Startups to established brands", icon: "users" },
  { value: 100, suffix: "+", label: "Projects delivered", note: "Websites, apps and campaigns", icon: "briefcase" },
  { value: 6, suffix: "+", label: "Years of experience", note: "Design and development", icon: "calendar" },
  { value: 20, suffix: "+", label: "Projects in pipeline", note: "Currently in progress", icon: "layers" },
];

/**
 * Trustpilot. Only list reviews written by real clients, quoted exactly, with
 * their consent where needed. Never include reviews by the owner or staff.
 */
export const trustpilot = {
  profileUrl: "https://www.trustpilot.com/review/codewithlogs.com",
  reviewUrl: "https://www.trustpilot.com/evaluate/codewithlogs.com",
  reviews: [] as { title: string; text: string; author: string; rating: number; date: string; url: string }[],
};

export const mainNavigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export const organizationId = `${siteUrl}/#organization`;

export function organizationSchema() {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": organizationId,
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/images/codewithlogs-logo.png`,
    image: `${siteUrl}/images/codewithlogs-logo.png`,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    founder: { "@type": "Person", "@id": `${siteUrl}/about#founder`, name: siteConfig.founder.name, url: siteConfig.founder.url },
    sameAs: [siteConfig.companyLinkedIn],
    knowsAbout: ["Web design", "Website development", "Web application development", "UI/UX design", "E-commerce development", "Search engine optimization", "Digital marketing", "Branding", "AI automation"],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? siteUrl : `${siteUrl}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
