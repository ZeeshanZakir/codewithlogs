import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, servicePath } from "@/lib/services";
import { siteConfig, trustpilot } from "@/lib/site-config";
import { Wordmark } from "@/components/layout/Navbar";

const company = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "All services" },
  { href: "/contact", label: "Contact" },
];
const resources = [
  { href: "/blog", label: "Blog & insights" },
  { href: "/blog?category=development-troubleshooting", label: "Development troubleshooting" },
  { href: "/tools", label: "Free developer tools" },
  { href: "/gallery", label: "Gallery" },
  { href: "/editorial-policy", label: "Editorial policy" },
];

export function Footer() {
  return (
    <footer className="ag-footer">
      <div className="ag-container">
        <div className="ag-footer-cta">
          <p className="ag-eyebrow ag-eyebrow-light">Ready when you are</p>
          <h2>Let&apos;s Build What&apos;s Next.</h2>
          <Link href="/contact" className="ag-btn ag-btn-light">Start a Project <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="ag-footer-grid">
          <div className="ag-footer-brand">
            <Link href="/" className="ag-wordmark" aria-label="CodeWithLogs home"><Wordmark /></Link>
            <p>{siteConfig.shortDescription}</p>
            <a href={`mailto:${siteConfig.contactEmail}`} className="ag-footer-email">{siteConfig.contactEmail}</a>
          </div>
          <nav aria-label="Services">
            <h2>Services</h2>
            <ul>{services.map((service) => <li key={service.slug}><Link href={servicePath(service.slug)}>{service.name}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Company">
            <h2>Company</h2>
            <ul>{company.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Resources">
            <h2>Resources</h2>
            <ul>{resources.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Social">
            <h2>Follow</h2>
            <ul>
              {siteConfig.social.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight size={13} aria-hidden="true" /></a></li>)}
              <li><a href={trustpilot.profileUrl} target="_blank" rel="noopener noreferrer">Trustpilot <ArrowUpRight size={13} aria-hidden="true" /></a></li>
            </ul>
          </nav>
        </div>
        <div className="ag-footer-bottom">
          <p>© {new Date().getFullYear()} CodeWithLogs. All rights reserved.</p>
          <nav aria-label="Legal"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></nav>
        </div>
      </div>
    </footer>
  );
}
