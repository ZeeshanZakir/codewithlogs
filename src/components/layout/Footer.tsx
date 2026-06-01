import Link from "next/link";

import { Logo } from "@/components/branding/Logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/terms", label: "Terms of Service" },
];

const socialLinks = [
  { href: "https://github.com/ZeeshanZakir/", label: "GitHub" },
  { href: "https://www.linkedin.com/in/zeeshan-zakir-profile/", label: "LinkedIn" },
  { href: "https://twitter.com/ZeeshanZakir", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <Logo className="block w-[220px] sm:w-[260px]" />
          <p className="max-w-md text-sm leading-7 text-text/70">
            I help startups and solo founders ship high-performance products with a clean full-stack architecture.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text/60">
            Quick Links
          </h2>
          <div className="flex flex-col gap-3 text-sm text-text/75">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text/60">
            Legal & Social
          </h2>
          <div className="flex flex-col gap-3 text-sm text-text/75">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {socialLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-text/60 transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-text/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 CodeWithLogs. Built for founders who value speed, clarity, and clean execution.</p>
          <p>Affiliate disclosure: Some tool links may earn a commission at no extra cost to you.</p>
        </div>
      </div>
    </footer>
  );
}
