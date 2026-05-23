import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";
const lastUpdated = "May 23, 2026";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for codewithlogs.com covering educational content, affiliate disclosures, earnings statements, third-party links, and limitations related to errors and omissions.",
  openGraph: {
    title: "Disclaimer",
    description:
      "Important disclaimers related to content, affiliate relationships, earnings references, and external links on codewithlogs.com.",
    url: `${siteUrl}/disclaimer`,
    type: "website",
  },
};

const sections = [
  {
    id: "general-content-disclaimer",
    title: "General Content Disclaimer",
    content: (
      <>
        <p>
          All content published on this website is provided for informational and educational
          purposes only. Articles, tutorials, opinions, code examples, tool reviews, and business
          insights reflect personal experience, research, and general professional judgment at the
          time of writing. They are not intended to serve as legal, financial, tax, compliance, or
          any other type of regulated professional advice. You should not rely on content from this
          website as a substitute for advice tailored to your specific situation.
        </p>
        <p>
          The technology industry changes quickly, and best practices, pricing, software features,
          platform policies, and advertising rules may evolve after a post is published. For that
          reason, the existence of information on this website does not guarantee that it remains
          complete, current, or suitable for your use at all times. You are responsible for using
          independent judgment before acting on any information found here.
        </p>
      </>
    ),
  },
  {
    id: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    content: (
      <>
        <p>
          This site participates in affiliate programs. When you click affiliate links and make
          purchases, I earn a commission at no extra cost to you. That means some recommendations on
          this site may generate compensation if you choose to buy a product, sign up for a
          service, or take another qualifying action through a referral link.
        </p>
        <p>
          Any affiliate relationship does not change my intent to recommend tools and services that
          are genuinely useful for developers, founders, or clients. However, you should assume that
          some links on resource pages, tutorials, tool roundups, and related content may be
          affiliate links unless otherwise stated. You should always perform your own due diligence
          before purchasing any product or service based on a recommendation from this site.
        </p>
      </>
    ),
  },
  {
    id: "earnings-disclaimer",
    title: "Earnings and Results Disclaimer",
    content: (
      <>
        <p>
          Any examples of business results, product growth, project outcomes, client wins, revenue
          improvements, freelance success, or efficiency gains mentioned on this blog are shared for
          illustration only. Results mentioned on this blog are not typical. I make no income
          guarantees. Your success depends on many factors outside my control, including your
          experience, execution, market conditions, budget, offer quality, and operational
          decisions.
        </p>
        <p>
          If a post refers to faster delivery, improved conversion rates, stronger SEO performance,
          or improved development productivity, that should be understood as contextual information
          rather than a promise. Past results do not guarantee future outcomes. You accept full
          responsibility for evaluating whether any product, strategy, or recommendation is
          appropriate for your own project or business goals.
        </p>
      </>
    ),
  },
  {
    id: "external-links",
    title: "External Links and Third-Party Websites",
    content: (
      <>
        <p>
          This website may link to external websites, software providers, merchants, educational
          platforms, advertising networks, or third-party tools. Those links are provided for
          convenience, reference, or recommendation purposes. I do not control the content, terms,
          privacy practices, availability, or business conduct of third-party websites after you
          leave this site.
        </p>
        <p>
          A link to an external website does not mean I guarantee the accuracy of its claims,
          endorse every statement it makes, or accept responsibility for its products, security, or
          customer support. You should review the terms, privacy policy, and refund or billing
          policies of any third-party service before using it or providing personal or financial
          information.
        </p>
      </>
    ),
  },
  {
    id: "errors-and-omissions",
    title: "Errors and Omissions Disclaimer",
    content: (
      <>
        <p>
          While I aim to publish accurate, careful, and practical content, this site may sometimes
          include typographical mistakes, outdated references, incomplete explanations, pricing that
          has changed, or technical examples that do not fit every environment. Software behaves
          differently across versions, frameworks, hosting platforms, and deployment targets, which
          means a code sample or recommendation may require adjustment before it works in your
          project.
        </p>
        <p>
          I do not warrant that every article, tutorial, or recommendation is free from errors or
          omissions. You accept responsibility for testing, reviewing, and validating anything you
          implement from this site. If you notice a factual issue or outdated information, you are
          welcome to contact me so it can be reviewed and corrected where appropriate.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of Responsibility",
    content: (
      <>
        <p>
          By using this website, you agree that you do so at your own risk. I am not responsible for
          losses, damages, business interruptions, missed opportunities, data loss, or any other
          consequences that may result from your reliance on information, code snippets, affiliate
          recommendations, or external services referenced on this website.
        </p>
        <p>
          If you need clarification about any statement on this site, or if a business decision,
          technical implementation, or purchase would have meaningful consequences for you, you
          should seek appropriate advice and verify the relevant information before acting on it.
        </p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPageTemplate
      title="Disclaimer"
      description="This Disclaimer explains the limits of the information published on codewithlogs.com, including affiliate relationships, earnings references, external links, and general content use."
      lastUpdated={lastUpdated}
      sections={sections}
    />
  );
}
