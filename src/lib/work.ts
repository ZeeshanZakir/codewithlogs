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
  /** People credited on the project, e.g. who led strategy. */
  credits?: { role: string; name: string; url?: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "dustline-ecommerce-operations-dashboard",
    isPlaceholder: false,
    title: "Dustline: e-commerce operations dashboard & CRM",
    client: "Dustline",
    industry: "E-commerce",
    year: "2026",
    description:
      "A custom admin dashboard and CRM for the Dustline online store, bringing orders, cash-on-delivery payments, shipments, inventory, marketing and traffic analytics into one real-time workspace.",
    services: ["web-application-development", "ui-ux-design", "ecommerce-development"],
    technologies: ["Next.js", "Node.js", "Supabase", "React"],
    coverImage: { src: "/images/work/dustline/dustline-dashboard.webp", alt: "Dustline admin dashboard showing order status cards, the order pipeline, payments, stock health and recent orders", width: 1920, height: 1886 },
    gallery: [
      { src: "/images/work/dustline/dustline-traffic.webp", alt: "Dustline traffic analytics overview with visitors, sessions, engagement and conversion funnel metrics compared with the previous period", width: 1900, height: 873 },
      { src: "/images/work/dustline/dustline-geography.webp", alt: "Dustline analytics breakdown of visitors by country, city, region, device, browser, operating system and traffic source", width: 741, height: 774 },
    ],
    challenge:
      "Running an online store that sells largely on cash on delivery means tracking much more than sales. Dustline needed one place to see where every order stands, how much cash is collected or still due at the door, which product variants are running low, and where visitors come from, without stitching together spreadsheets, courier portals and separate analytics tools.",
    solution:
      "We designed and built a full admin workspace with Next.js and Node.js on a Supabase database that updates in real time. It covers an order pipeline from pending to delivered or returned, a payments view that separates collected value from outstanding COD, shipments, inventory with per-variant stock thresholds, coupons, reviews, sales reporting, subscribers and settings. A built-in traffic analytics module shows visitors, sessions, engagement, the add-to-cart and checkout funnel, geography, devices and traffic sources, each compared with the previous period. Customer names and contact details are blurred in the screenshots on this page.",
    outcomes: [],
  },
  {
    slug: "luna-brand-identity-shopify-store",
    isPlaceholder: false,
    title: "Luna: brand identity, Shopify store & social media",
    client: "Luna",
    industry: "Fashion & apparel",
    description:
      "Brand identity, a Shopify online store and ongoing social media marketing for Luna, a Pakistani everyday-wear label built around premium fabrics without luxury markup.",
    services: ["branding-creative", "website-design-development", "ecommerce-development", "digital-marketing"],
    technologies: ["Shopify"],
    coverImage: { src: "/images/work/luna/luna-home.webp", alt: "Luna online store homepage with the LUNA logo, navigation and an 11.11 sale campaign banner", width: 1440, height: 716 },
    gallery: [
      { src: "/images/work/luna/luna-collection.webp", alt: "Luna Fall/Winter collection grid showing product photos, prices, colour swatches and size options", width: 1440, height: 700 },
      { src: "/images/work/luna/luna-campaign.webp", alt: "Luna campaign banner reading 'Perfectly paired, better styled. Enter the Luna Orbit'", width: 1440, height: 495 },
      { src: "/images/work/luna/luna-brand.webp", alt: "Luna brand banner with the logo mark on textured fabric and the line 'Premium everyday wear without luxury markup'", width: 1440, height: 575 },
    ],
    challenge:
      "Luna had the product side in place: the client sourced fabrics and handled production themselves. What the brand needed was a digital presence to match, with an identity people would recognise, an online store that makes everyday wear easy to browse and buy, and a steady social media presence to bring shoppers to it.",
    solution:
      "We created the Luna brand identity, including the logo mark and wordmark, and applied it across the store and campaigns. We designed and built the Shopify store with collection-led navigation for men, women, Fall/Winter and basics, product cards with colour swatches and size selection, sale and campaign banners, a blog and a newsletter sign-up, plus trust messaging for cash on delivery, nationwide shipping and exchanges. We also run Luna's social media marketing to grow reach and drive traffic to the store. Product sourcing and manufacturing were handled by the client.",
    outcomes: [],
    liveUrl: "https://luna-outlet.com/",
  },
  {
    slug: "khazanaycorner-ecommerce-marketplace",
    isPlaceholder: false,
    title: "KhazanayCorner: e-commerce marketplace",
    client: "KhazanayCorner",
    industry: "E-commerce marketplace",
    description:
      "A multi-category online marketplace for gadgets, accessories, beauty and home essentials across Pakistan, with flash deals, curated collections, cash-on-delivery checkout and order tracking.",
    services: ["ecommerce-development", "web-application-development", "ui-ux-design"],
    technologies: ["Next.js", "Supabase", "Vercel"],
    coverImage: { src: "/images/work/khazanaycorner/khazanaycorner-home.webp", alt: "KhazanayCorner homepage with search, category navigation, a promotional slider, delivery and support highlights, and shop-by-category tiles", width: 1440, height: 920 },
    gallery: [
      { src: "/images/work/khazanaycorner/khazanaycorner-flash-deals.webp", alt: "KhazanayCorner flash deals row with a countdown timer, discount badges, prices and add-to-cart buttons", width: 1440, height: 575 },
      { src: "/images/work/khazanaycorner/khazanaycorner-best-sellers.webp", alt: "KhazanayCorner best sellers row with product cards, brand names, ratings, sale prices and add-to-cart buttons", width: 1440, height: 530 },
    ],
    challenge:
      "A marketplace that sells everything from earbuds to massagers has to make a large, mixed catalogue easy to browse, keep prices and stock accurate, and earn trust from shoppers who often prefer to pay on delivery. It also needed a clear commercial plan: which categories to lead with, how to run deals, and how to keep checkout short.",
    solution:
      "The commercial and customer strategy was planned by Zeeshan Zakir, drawing on his experience in e-commerce and his understanding of how Pakistani shoppers decide what to buy. We then designed and built the marketplace with Next.js and Supabase on Vercel: search across products, brands and categories, category navigation, flash deals with a countdown, best sellers, new arrivals, trending and curated collections, ratings and discount pricing, a short checkout with cash on delivery and bank transfer, a searchable city list with province selection, order tracking, WhatsApp support and a newsletter sign-up.",
    outcomes: [],
    liveUrl: "https://www.khazanaycorner.com/",
    credits: [{ role: "Strategy", name: "Zeeshan Zakir", url: "https://zeeshanzakir.com/" }],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export const publishedCaseStudies = caseStudies.filter((study) => !study.isPlaceholder);
