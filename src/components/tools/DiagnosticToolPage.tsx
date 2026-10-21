import Link from "next/link";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site-url";
import styles from "./DiagnosticTools.module.css";

export function DiagnosticToolPage({ slug, title, description, children }: { slug: string; title: string; description: string; children: ReactNode }) {
  const url = `${siteUrl}/tools/${slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebApplication", "@id": `${url}#app`, name: title, url, description, applicationCategory: "DeveloperApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript for local analysis", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Developer tools", item: `${siteUrl}/tools` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ] },
    ],
  };
  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/tools">Developer tools</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
    <header className={styles.hero}><span className={styles.eyebrow}>CodeWithLogs / Diagnostic workbench</span><h1>{title}</h1><p>{description}</p></header>
    <div className={styles.privacy}><span>Client-side analysis</span><span>No account required</span><span>No AI service</span><span>No script execution</span></div>
    {children}
  </div>;
}
