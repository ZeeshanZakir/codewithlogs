"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [{ href: "/blog", label: "Troubleshooting" }, { href: "/tools", label: "Tools" }, { href: "/editorial-policy", label: "Our standard" }, { href: "/contact", label: "Contact" }];
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="journal-header" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}><div className="journal-container header-inner">
    <Link href="/" className="journal-wordmark" aria-label="CodeWithLogs home" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true">/l</span>codewithlogs<span className="brand-period">.</span></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</Link>)}</nav>
    <Link href="/#newsletter" className="header-subscribe">Stay in the loop <ArrowUpRight size={15} /></Link>
    <button type="button" className="mobile-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={16} /></Link>)}<Link href="/#newsletter" onClick={() => setOpen(false)}>Article update signup</Link></nav>}
  </div></header>;
}
