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
  isPlaceholder: boolean;
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
    title: "Case study placeholder: SaaS platform",
    client: "Placeholder client",
    industry: "SaaS",
    description:
      "This is a layout placeholder, not a real project. It shows how a web application case study will be presented once real project details are approved for publication.",
    services: ["ui-ux-design", "web-application-development"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    challenge:
      "Placeholder text. A real case study will describe the client's situation and the problem they needed to solve, in their own terms.",
    solution:
      "Placeholder text. A real case study will explain the approach, key decisions and what was designed and built.",
    outcomes: [],
  },
  {
    slug: "placeholder-ecommerce-store",
    isPlaceholder: true,
    title: "Case study placeholder: E-commerce store",
    client: "Placeholder client",
    industry: "E-commerce",
    description:
      "This is a layout placeholder, not a real project. It shows how an online store case study will be presented once real project details are approved for publication.",
    services: ["ecommerce-development", "branding-creative"],
    technologies: ["Shopify", "Liquid", "Klaviyo"],
    challenge:
      "Placeholder text. A real case study will describe the store's starting point and the commercial goals behind the project.",
    solution:
      "Placeholder text. A real case study will cover the store design, platform choices and integrations.",
    outcomes: [],
  },
  {
    slug: "placeholder-brand-website",
    isPlaceholder: true,
    title: "Case study placeholder: Brand & website",
    client: "Placeholder client",
    industry: "Professional services",
    description:
      "This is a layout placeholder, not a real project. It shows how a branding and website case study will be presented once real project details are approved for publication.",
    services: ["branding-creative", "website-design-development", "seo-services"],
    technologies: ["Figma", "Webflow"],
    challenge:
      "Placeholder text. A real case study will describe how the business was perceived and what needed to change.",
    solution:
      "Placeholder text. A real case study will show the identity, website structure and launch approach.",
    outcomes: [],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export const publishedCaseStudies = caseStudies.filter((study) => !study.isPlaceholder);
