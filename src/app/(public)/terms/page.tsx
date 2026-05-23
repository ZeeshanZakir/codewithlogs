import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";
const lastUpdated = "May 23, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for codewithlogs.com covering website use, intellectual property, user conduct, limitations of liability, and governing law.",
  openGraph: {
    title: "Terms of Service",
    description:
      "Terms governing your use of codewithlogs.com, including intellectual property, permitted use, and liability limitations.",
    url: `${siteUrl}/terms`,
    type: "website",
  },
};

const sections = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of These Terms",
    content: (
      <>
        <p>
          These Terms of Service govern your access to and use of <strong>codewithlogs.com</strong>,
          which is owned and operated by <strong>Zeeshan Zakir</strong>. By accessing or using this
          website, you agree to be bound by these Terms of Service and any applicable laws and
          regulations. If you do not agree with these terms, you should not use the website.
        </p>
        <p>
          These terms apply to all users of the site, including readers, clients, advertisers,
          affiliates, and anyone who views, shares, or interacts with the content. The website may
          evolve over time, and the services, tools, articles, and resources made available here may
          be changed, updated, restricted, or removed at any time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "permitted-use",
    title: "Permitted Use of the Website",
    content: (
      <>
        <p>
          You may use this website for lawful personal, educational, and informational purposes. You
          may read articles, browse resources, submit inquiries through the contact form, and share
          links to published content in a manner that does not misrepresent ownership or authorship.
          You agree not to use the website in any way that could damage, disable, overburden, or
          impair the site or interfere with the access of other users.
        </p>
        <p>
          You must not attempt to gain unauthorized access to restricted systems, scrape the site in
          a harmful or abusive manner, distribute malicious code, misuse the contact form, or use the
          content for unlawful, fraudulent, defamatory, or deceptive purposes. If you interact with
          the website in a way that creates a security risk or disrupts normal operations, access may
          be restricted or terminated without notice.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property Rights",
    content: (
      <>
        <p>
          Unless otherwise stated, the content on this website, including articles, written copy,
          tutorials, layouts, logos, branding, graphics, and original code examples, is the
          intellectual property of Zeeshan Zakir and is protected by applicable copyright and other
          intellectual property laws. Your use of the website does not transfer any ownership rights
          to you.
        </p>
        <p>
          You may reference or quote limited portions of the content for commentary, education, or
          discussion as long as you provide clear attribution and do not reproduce substantial
          portions of the site in a way that substitutes for the original work. You may not copy,
          republish, sell, re-license, or commercially exploit the website content without prior
          written permission, except where a separate license or explicit permission is provided.
        </p>
      </>
    ),
  },
  {
    id: "user-conduct",
    title: "User Conduct and Submitted Information",
    content: (
      <>
        <p>
          If you contact me through forms, email, or other communication channels referenced on the
          site, you agree to provide accurate information and to avoid sending unlawful, abusive,
          threatening, misleading, or spam-related content. You remain responsible for the content of
          any message you submit. I reserve the right to ignore, filter, or delete submissions that
          appear abusive, irrelevant, automated, or harmful.
        </p>
        <p>
          You should not submit confidential, proprietary, or highly sensitive information through
          the website unless an appropriate working relationship and confidentiality expectations have
          already been established. While reasonable care may be taken with business inquiries, the
          website should not be treated as a secure legal archive or guaranteed confidential channel
          unless specifically agreed in writing.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services, Ads, and External Links",
    content: (
      <>
        <p>
          This website may contain links to third-party websites, software tools, affiliate offers,
          advertisements, and services operated by other parties. These links are provided for
          convenience, recommendation, or monetization purposes. I do not control third-party
          websites and I am not responsible for their content, uptime, pricing, privacy practices,
          billing policies, or business conduct.
        </p>
        <p>
          Your interactions with third-party services are solely between you and the relevant
          provider. Any purchase, sign-up, subscription, or reliance on an external service is made
          at your own risk. You should review the applicable policies and terms of any external
          service before using it.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers-and-liability",
    title: "Disclaimers and Limitation of Liability",
    content: (
      <>
        <p>
          This website is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of
          any kind, whether express or implied, including warranties of accuracy, merchantability,
          fitness for a particular purpose, or non-infringement. I do not guarantee that the website
          will always be available, uninterrupted, secure, or free from errors, viruses, or harmful
          components.
        </p>
        <p>
          To the fullest extent permitted by law, Zeeshan Zakir shall not be liable for any direct,
          indirect, incidental, consequential, special, or exemplary damages arising from or related
          to your use of, or inability to use, the website, its content, linked services, contact
          forms, advertising systems, or affiliate links. This includes, without limitation, loss of
          profits, business interruption, data loss, loss of goodwill, or reliance-based damages.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law and Contact",
    content: (
      <>
        <p>
          These Terms of Service shall be governed by and interpreted in accordance with the laws
          applicable to the website owner&apos;s place of operation, without regard to conflict of law
          principles. If any provision of these terms is found to be invalid or unenforceable, the
          remaining provisions will remain in full force and effect.
        </p>
        <p>
          I reserve the right to update these Terms of Service at any time by posting a revised
          version on this page. Your continued use of the website after changes are posted
          constitutes acceptance of the updated terms. If you have any questions about these terms,
          you may contact me through the contact page on this website.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageTemplate
      title="Terms of Service"
      description="These Terms of Service govern access to and use of codewithlogs.com, including content ownership, acceptable conduct, third-party tools, and limitations of liability."
      lastUpdated={lastUpdated}
      sections={sections}
    />
  );
}
