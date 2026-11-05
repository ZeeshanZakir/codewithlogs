"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { mainNavigation, siteConfig } from "@/lib/site-config";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Wordmark() {
  return <><span className="ag-mark" aria-hidden="true"><span>/</span>l</span><span className="ag-wordmark-text">codewithlogs<span className="ag-dot">.</span></span></>;
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("ag-menu-open", open);
    if (open) panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.documentElement.classList.remove("ag-menu-open");
  }, [open]);

  function close(returnFocus = false) {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }

  return (
    <header className="ag-header" data-open={open || undefined} onKeyDown={(event) => { if (event.key === "Escape" && open) close(true); }}>
      <div className="ag-container ag-header-inner">
        <Link href="/" className="ag-wordmark" aria-label="CodeWithLogs home" onClick={() => close()}><Wordmark /></Link>
        <nav className="ag-nav" aria-label="Main navigation">
          {mainNavigation.map(({ href, label }) => <Link key={href} href={href} aria-current={isCurrent(pathname, href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <Link href="/contact" className="ag-btn ag-btn-primary ag-header-cta">Start a Project <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <button ref={toggleRef} type="button" className="ag-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </div>
      <div ref={panelRef} id="mobile-menu" className="ag-mobile-menu" hidden={!open}>
        <nav aria-label="Mobile navigation" className="ag-container">
          <ol>
            {mainNavigation.map(({ href, label }, index) => <li key={href}><Link href={href} aria-current={isCurrent(pathname, href) ? "page" : undefined} onClick={() => close()}><span className="ag-mobile-index">0{index + 1}</span>{label}<ArrowUpRight size={20} aria-hidden="true" /></Link></li>)}
          </ol>
          <div className="ag-mobile-footer">
            <Link href="/contact" className="ag-btn ag-btn-primary" onClick={() => close()}>Start a Project <ArrowUpRight size={16} aria-hidden="true" /></Link>
            <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
