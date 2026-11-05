import type { ServiceVisualKind } from "@/components/agency/ServiceVisual";

/**
 * Portfolio and case-study data.
 *
 * IMPORTANT: Only add a project with `isPlaceholder: false` when it is a real
 * project the business is allowed to publish. List outcomes only when they are
 * verified (with a source) and approved by the client. Placeholder entries are
 * never added to the sitemap and their detail pages are marked noindex.
 */
export type CaseStudyOutcome = {
  label: string;
  /** Where the figure comes from, e.g. "GA4, Jan–Mar 2027". Required for real outcomes. */
  source: string;
};

export type CaseStudy = {
  slug: string;
  /** true for concept studies / layout samples that are not client work. */
  isPlaceholder: boolean;
  /** Art-directed visual used when no real project imagery exists. */
  visual?: ServiceVisualKind;
  title: string;
  client: string;
  industry: string;
  year?: string;
  description: string;
  services: string[]; // service slugs from src/lib/services.ts
  technologies: string[];
  coverImage?: { src: string; alt: string; width: number; height: number };
  gallery?: { src: string; alt: string; width: number; height: number }[];
  challenge: string;
  solution: string;
  /** Leave empty unless outcomes are verified. */
  outcomes: CaseStudyOutcome[];
  liveUrl?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "placeholder-saas-platform",
    isPlaceholder: true,
    visual: "web-application-development",
    title: "SaaS analytics platform",
    client: "Concept study (not client work)",
    industry: "SaaS",
    description:
      "A concept study, not a client project. It shows how we would present a web application case study once real work is approved for publication.",
    services: ["ui-ux-design", "web-application-development"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    challenge:
      "Concept text. A real case study will describe the client's situation and the problem they needed to solve, in their own terms.",
    solution:
      "Concept text. A real case study will explain the approach, key decisions and what was designed and built.",
    outcomes: [],
  },
  {
    slug: "placeholder-ecommerce-store",
    isPlaceholder: true,
    visual: "ecommerce-development",
    title: "Direct-to-consumer storefront",
    client: "Concept study (not client work)",
    industry: "E-commerce",
    description:
      "A concept study, not a client project. It shows how we would present an online store case study once real work is approved for publication.",
    services: ["ecommerce-development", "branding-creative"],
    technologies: ["Shopify", "Liquid", "Klaviyo"],
    challenge:
      "Concept text. A real case study will describe the store's starting point and the commercial goals behind the project.",
    solution:
      "Concept text. A real case study will cover the store design, platform choices and integrations.",
    outcomes: [],
  },
  {
    slug: "placeholder-brand-website",
    isPlaceholder: true,
    visual: "branding-creative",
    title: "Brand identity & website",
    client: "Concept study (not client work)",
    industry: "Professional services",
    description:
      "A concept study, not a client project. It shows how we would present a branding and website case study once real work is approved for publication.",
    services: ["branding-creative", "website-design-development", "seo-services"],
    technologies: ["Figma", "Webflow"],
    challenge:
      "Concept text. A real case study will describe how the business was perceived and what needed to change.",
    solution:
      "Concept text. A real case study will show the identity, website structure and launch approach.",
    outcomes: [],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export const publishedCaseStudies = caseStudies.filter((study) => !study.isPlaceholder);
