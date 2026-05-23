import type { Metadata } from "next";

import { LegalPageTemplate } from "@/components/legal/LegalPageTemplate";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://codewithlogs.com";
const lastUpdated = "May 23, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for codewithlogs.com, covering data collection, cookies, analytics, Google AdSense, affiliate links, and privacy rights.",
  openGraph: {
    title: "Privacy Policy",
    description:
      "How data is collected, used, and protected on codewithlogs.com, including AdSense and analytics disclosures.",
    url: `${siteUrl}/privacy-policy`,
    type: "website",
  },
};

const sections = [
  {
    id: "owner-and-scope",
    title: "Owner Identification and Scope",
    content: (
      <>
        <p>
          This Privacy Policy explains how information is collected, used, stored, and protected
          when you visit and interact with <strong>codewithlogs.com</strong>, a website owned and
          operated by <strong>Zeeshan Zakir</strong>. Throughout this policy, references to
          &quot;I,&quot; &quot;me,&quot; or &quot;my&quot; mean Zeeshan Zakir as the owner and publisher of this website.
          References to &quot;you&quot; mean any visitor, reader, subscriber, advertiser, or person who
          submits information through the site.
        </p>
        <p>
          This Privacy Policy applies to information collected through pages, forms, analytics
          tools, advertising technologies, and outbound links published on this website. It is
          intended to give you a practical and transparent explanation of what information may be
          collected, why that information is collected, how it may be used, and what choices you
          have. By using this website, you acknowledge that you have read and understood this
          Privacy Policy and that your continued use of the site is subject to it.
        </p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "What Information Is Collected",
    content: (
      <>
        <p>
          This website collects limited information in a few different ways. The first category is
          information that you choose to provide directly, such as when you submit a contact form.
          In that situation, the site may collect your name, email address, subject, message, and
          any other details you include in your inquiry. This information is collected so that I
          can review the inquiry, reply to you, and maintain a reasonable business record of the
          communication.
        </p>
        <p>
          The second category is technical and usage information collected automatically through
          browser technologies. This may include IP address, browser type, device information,
          referring pages, approximate location data, pages viewed, time on page, and interactions
          with content. This type of data is generally collected through analytics services,
          cookies, advertising technology, and similar measurement tools. In many cases, this data
          does not directly identify you by name, but it may still be considered personal data
          under some privacy laws when combined with other identifiers.
        </p>
        <p>
          The third category includes data related to cookies and advertising behavior, such as
          ad-serving preferences, site visits, frequency of visits, or interactions that help
          determine which ads are shown. This is particularly relevant when third-party advertising
          systems, including Google AdSense, are used on the site.
        </p>
      </>
    ),
  },
  {
    id: "cookies-and-adsense",
    title: "Cookies, Google AdSense, and Personalized Advertising",
    content: (
      <>
        <p>
          This website may use cookies and similar technologies to improve functionality, remember
          preferences, measure performance, and display advertising. Cookies are small text files
          placed on your device by a website or third-party service. Some cookies are necessary for
          site functionality, while others are used for analytics, ad delivery, and interest-based
          advertising.
        </p>
        <p>
          This site uses <strong>Google AdSense</strong> to display advertising. Google may use
          cookies, including the <strong>DoubleClick cookie</strong>, to serve ads based on a
          user&apos;s prior visits to this website and other websites on the internet. That means the
          ads you see may be influenced by browsing behavior, prior interactions, and inferred
          interests. Google and its partners may use this information to provide personalized
          advertising where permitted by law and device settings.
        </p>
        <p>
          You can learn more about how Google uses information from sites and apps, including how
          advertising cookies work, by visiting{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            Google&apos;s advertising privacy policy
          </a>
          . If you prefer to reduce or manage personalized advertising, you can review ad settings
          and opt-out options by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            https://www.google.com/settings/ads
          </a>
          . Please note that disabling personalized ads does not necessarily remove all ads. You
          may still see non-personalized advertising.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Google Analytics and Site Measurement",
    content: (
      <>
        <p>
          This website may use <strong>Google Analytics</strong> or comparable analytics tools to
          understand how visitors use the site. Analytics cookies help measure performance metrics
          such as page views, session duration, referring pages, content popularity, device types,
          and general traffic patterns. This helps me improve articles, identify technical issues,
          understand which resources are helpful, and make the site more useful overall.
        </p>
        <p>
          Analytics tools typically use cookies or similar identifiers to generate reports about
          website activity. These reports are usually aggregated and are used to understand trends
          rather than to identify individual readers personally. However, your browser or device may
          still be associated with an identifier that allows usage patterns to be measured over
          time. If you do not want analytics cookies to operate in your browser, you may be able to
          block cookies through your browser settings or use privacy controls and extensions that
          limit tracking technologies.
        </p>
      </>
    ),
  },
  {
    id: "affiliate-links-and-third-parties",
    title: "Third-Party Services and Affiliate Links",
    content: (
      <>
        <p>
          Some pages on this website include affiliate links to third-party services, software
          providers, hosting companies, educational platforms, and related products. If you click an
          affiliate link and later make a purchase or sign up through that referral link, I may earn
          a commission at no extra cost to you. These links help support the website and the work
          required to publish free educational content.
        </p>
        <p>
          When you click a third-party or affiliate link, you leave this website and become subject
          to the privacy policy, cookie practices, and terms of the external service you visit. I do
          not control those websites, their tracking technologies, or how they use your information
          after you leave this site. For that reason, I encourage you to review the privacy policies
          of any third-party service before providing information, making a purchase, or relying on
          its advertising or promotional claims.
        </p>
      </>
    ),
  },
  {
    id: "how-data-is-used",
    title: "How Information Is Used, Shared, and Retained",
    content: (
      <>
        <p>
          Information collected through this website may be used for several legitimate purposes,
          including responding to contact inquiries, providing requested information, improving site
          functionality, understanding audience behavior, securing the site, complying with legal
          obligations, and displaying advertisements or affiliate recommendations. Contact form
          submissions may also be stored in a database so that business inquiries can be tracked and
          answered consistently.
        </p>
        <p>
          I do not sell your personal information in the ordinary sense of directly exchanging your
          contact details for money. However, some third-party technologies used on the site, such
          as analytics or ad-serving systems, may process identifiers or behavioral data in ways
          that fall within broad legal definitions of data sharing or targeted advertising under
          certain laws. Information may also be shared with service providers that support hosting,
          email delivery, analytics, advertising, security, or site infrastructure, but only to the
          extent reasonably necessary to operate the website.
        </p>
        <p>
          Information is retained only as long as reasonably necessary for the purpose for which it
          was collected, to maintain site operations, to respond to inquiries, to resolve disputes,
          or to comply with legal and accounting obligations. While reasonable steps are taken to
          protect stored information, no website or internet-based system can guarantee absolute
          security.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Your Choices, Privacy Controls, and Rights",
    content: (
      <>
        <p>
          You have choices regarding how information is collected and used. You can limit cookies
          through your browser settings, clear existing cookies, use privacy-focused browser
          extensions, or adjust ad personalization preferences through Google&apos;s tools. You can
          also decide not to submit contact forms or other voluntary information through the site.
        </p>
        <p>
          Depending on where you live, you may have privacy rights that include the right to request
          access to certain personal information, request correction or deletion of information, or
          object to certain types of processing. If you wish to make a privacy-related request, you
          may contact me using the details provided below. Any such request will be reviewed in good
          faith and handled reasonably, subject to technical feasibility, legal obligations, and the
          need to maintain security and records.
        </p>
      </>
    ),
  },
  {
    id: "contact-and-updates",
    title: "Contact Information and Policy Updates",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests related to this Privacy Policy or the way
          your information is handled on this website, you may contact the site owner,{" "}
          <strong>Zeeshan Zakir</strong>, through the contact page available on this site. Privacy
          inquiries should clearly describe the issue so that they can be reviewed and answered more
          efficiently.
        </p>
        <p>
          This Privacy Policy may be updated from time to time to reflect changes in site
          functionality, advertising practices, legal requirements, or third-party tools. When
          meaningful updates are made, the &quot;Last updated&quot; date at the top of this page will be
          revised. You should review this page periodically if you want to stay informed about how
          your information is handled.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageTemplate
      title="Privacy Policy"
      description="This Privacy Policy explains how codewithlogs.com collects, uses, and protects information when you visit this website, submit a message, click advertisements, or interact with affiliate links and analytics tools."
      lastUpdated={lastUpdated}
      sections={sections}
    />
  );
}
